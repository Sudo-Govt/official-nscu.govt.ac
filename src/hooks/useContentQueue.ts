import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

interface QueueItem {
  id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  course_slug: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  priority: number;
  retries: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  created_by: string | null;
}

interface QueueNotification {
  id: string;
  course_code: string;
  course_name: string;
  status: 'completed' | 'failed' | 'paused';
  message: string | null;
  is_read: boolean;
  created_at: string;
}

interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

interface QueueSettings {
  status: 'idle' | 'running' | 'paused';
  pausedAt: string | null;
  pauseReason: string | null;
}

export function useContentQueue() {
  const { toast } = useToast();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [notifications, setNotifications] = useState<QueueNotification[]>([]);
  const [stats, setStats] = useState<QueueStats>({ pending: 0, processing: 0, completed: 0, failed: 0 });
  const [queueStatus, setQueueStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingInterval = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch queue data
  const fetchQueue = useCallback(async () => {
    const [queueRes, notifRes, settingsRes] = await Promise.all([
      supabase
        .from('content_generation_queue')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true }),
      supabase
        .from('content_generation_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('content_generation_settings')
        .select('value')
        .eq('key', 'queue_status')
        .single(),
    ]);

    if (queueRes.data) {
      setQueueItems(queueRes.data as QueueItem[]);
      
      // Calculate stats
      const newStats = {
        pending: queueRes.data.filter(i => i.status === 'pending').length,
        processing: queueRes.data.filter(i => i.status === 'processing').length,
        completed: queueRes.data.filter(i => i.status === 'completed').length,
        failed: queueRes.data.filter(i => i.status === 'failed').length,
      };
      setStats(newStats);
    }

    if (notifRes.data) {
      setNotifications(notifRes.data as QueueNotification[]);
    }

    if (settingsRes.data?.value) {
      const settings = settingsRes.data.value as unknown as QueueSettings;
      if (settings?.status) {
        setQueueStatus(settings.status);
      }
    }

    setIsLoading(false);
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    fetchQueue();

    // Subscribe to queue changes
    channelRef.current = supabase
      .channel('content-queue-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_generation_queue' },
        (payload) => {
          fetchQueue();
          
          // Show toast for completed/failed items
          if (payload.eventType === 'UPDATE' && payload.new) {
            const item = payload.new as QueueItem;
            if (item.status === 'completed') {
              toast({
                title: `✓ Generated: ${item.course_code}`,
                description: item.course_name,
              });
            } else if (item.status === 'failed') {
              toast({
                title: `✗ Failed: ${item.course_code}`,
                description: item.error_message || 'Generation failed',
                variant: 'destructive',
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'content_generation_notifications' },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchQueue, toast]);

  // Process next item in queue
  const processNext = useCallback(async () => {
    if (isProcessing || queueStatus === 'paused') return;

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-content-queue');
      
      if (error) {
        console.error('Queue processing error:', error);
      }

      if (data?.paused) {
        setQueueStatus('paused');
        toast({
          title: 'Queue Paused',
          description: data.reason === 'credits_exhausted' 
            ? 'Credits exhausted. Please add funds to continue.' 
            : data.reason,
          variant: 'destructive',
        });
        stopProcessing();
      }

      if (data?.idle) {
        // No more items
        stopProcessing();
        setQueueStatus('idle');
      }

    } catch (err) {
      console.error('Process next error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, queueStatus, toast]);

  // Start queue processing with 30-second intervals
  const startProcessing = useCallback(async () => {
    if (processingInterval.current) return;

    setQueueStatus('running');
    
    // Update settings - await to ensure it persists
    const { error } = await supabase
      .from('content_generation_settings')
      .update({
        value: { status: 'running', pausedAt: null, pauseReason: null },
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'queue_status');

    if (error) {
      console.error('Failed to update queue status:', error);
    }

    // Process immediately
    processNext();

    // Then every 30 seconds
    processingInterval.current = setInterval(() => {
      processNext();
    }, 30000);

    toast({
      title: 'Queue Started',
      description: 'Processing courses with 30-second intervals',
    });
  }, [processNext, toast]);

  // Stop queue processing
  const stopProcessing = useCallback(() => {
    if (processingInterval.current) {
      clearInterval(processingInterval.current);
      processingInterval.current = null;
    }
  }, []);

  // Pause queue
  const pauseQueue = useCallback(async () => {
    stopProcessing();
    setQueueStatus('paused');

    await supabase
      .from('content_generation_settings')
      .update({
        value: { status: 'paused', pausedAt: new Date().toISOString(), pauseReason: 'manual' },
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'queue_status');

    toast({
      title: 'Queue Paused',
      description: 'Processing has been paused',
    });
  }, [stopProcessing, toast]);

  // Resume queue
  const resumeQueue = useCallback(() => {
    startProcessing();
  }, [startProcessing]);

  // Add courses to queue
  const addToQueue = useCallback(async (courses: Array<{ id: string; course_code: string; name: string; slug?: string | null }>, userId: string) => {
    const items = courses.map(course => ({
      course_id: course.id,
      course_code: course.course_code,
      course_name: course.name,
      course_slug: course.slug || null,
      status: 'pending' as const,
      created_by: userId,
    }));

    const { error } = await supabase
      .from('content_generation_queue')
      .upsert(items, { onConflict: 'course_id' });

    if (error) {
      toast({
        title: 'Failed to add courses',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Courses Added',
      description: `${courses.length} courses added to queue`,
    });

    fetchQueue();
    return true;
  }, [fetchQueue, toast]);

  // Remove from queue
  const removeFromQueue = useCallback(async (itemId: string) => {
    await supabase
      .from('content_generation_queue')
      .delete()
      .eq('id', itemId);

    fetchQueue();
  }, [fetchQueue]);

  // Clear completed/failed
  const clearCompleted = useCallback(async () => {
    await supabase
      .from('content_generation_queue')
      .delete()
      .in('status', ['completed', 'failed']);

    fetchQueue();
    toast({
      title: 'Queue Cleared',
      description: 'Completed and failed items removed',
    });
  }, [fetchQueue, toast]);

  // Retry failed items
  const retryFailed = useCallback(async () => {
    await supabase
      .from('content_generation_queue')
      .update({ status: 'pending', retries: 0, error_message: null })
      .eq('status', 'failed');

    fetchQueue();
    toast({
      title: 'Retrying Failed',
      description: 'Failed items will be reprocessed',
    });
  }, [fetchQueue, toast]);

  // Mark notifications as read
  const markNotificationsRead = useCallback(async () => {
    await supabase
      .from('content_generation_notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    fetchQueue();
  }, [fetchQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProcessing();
    };
  }, [stopProcessing]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const estimatedTimeMinutes = Math.ceil((stats.pending * 45) / 60); // ~45 seconds per course

  return {
    queueItems,
    notifications,
    stats,
    queueStatus,
    isLoading,
    isProcessing,
    unreadCount,
    estimatedTimeMinutes,
    startProcessing,
    pauseQueue,
    resumeQueue,
    addToQueue,
    removeFromQueue,
    clearCompleted,
    retryFailed,
    markNotificationsRead,
    refresh: fetchQueue,
  };
}
