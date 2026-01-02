import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DOMPurify from 'dompurify';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  target_audience: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  created_by?: string;
}

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAnnouncements();
    
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed));
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .eq('target_audience', 'all')
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5" />;
      case 'normal':
        return <Info className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getPriorityVariant = (priority: string): "default" | "destructive" => {
    return priority === 'high' ? 'destructive' : 'default';
  };

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 mb-8">
      {visibleAnnouncements.map((announcement) => (
        <Alert
          key={announcement.id}
          variant={getPriorityVariant(announcement.priority)}
          className="relative"
        >
          <div className="flex items-start gap-3">
            {getPriorityIcon(announcement.priority)}
            <div className="flex-1">
              <AlertTitle className="text-lg font-semibold mb-2">
                {announcement.title}
              </AlertTitle>
              <AlertDescription>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content || '') }}
                />
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </span>
                  {announcement.expires_at && (
                    <span>
                      Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </AlertDescription>
            </div>
            <button
              onClick={() => handleDismiss(announcement.id)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-background/80 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default AnnouncementBanner;
