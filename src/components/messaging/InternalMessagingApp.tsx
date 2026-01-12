import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MessagingSidebar } from './MessagingSidebar';
import { MessageListView } from './MessageListView';
import { MessageThreadView } from './MessageThreadView';
import { ComposeMessage } from './ComposeMessage';
import { useToast } from '@/hooks/use-toast';

export interface InternalMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  thread_id: string | null;
  priority: string;
  is_draft: boolean;
  folder: string;
  labels: string[];
  cc: string[];
  bcc: string[];
  reply_to_id: string | null;
  document_references: any[];
  created_at: string;
  sender?: { full_name: string; internal_id?: string };
  recipient?: { full_name: string; internal_id?: string };
}

export interface UserIdentity {
  user_id: string;
  internal_id: string;
  display_name: string;
  department: string;
  full_name?: string;
  role?: string;
}

interface InternalMessagingAppProps {
  adminUserId?: string; // For admin access to other users' messages
}

export const InternalMessagingApp: React.FC<InternalMessagingAppProps> = ({ adminUserId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<InternalMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const effectiveUserId = adminUserId || user?.id;

  // Load user identity
  useEffect(() => {
    if (effectiveUserId) {
      loadUserIdentity();
      loadMessages();
      loadUnreadCounts();
    }
  }, [effectiveUserId, activeFolder]);

  // Realtime subscription
  useEffect(() => {
    if (!effectiveUserId) return;

    const channel = supabase
      .channel('internal_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'internal_messages',
        },
        () => {
          loadMessages();
          loadUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveUserId]);

  const loadUserIdentity = async () => {
    // First check if identity exists
    const { data: existing } = await supabase
      .from('user_identities')
      .select('*')
      .eq('user_id', effectiveUserId)
      .maybeSingle();

    if (existing) {
      // Fetch full_name from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', effectiveUserId)
        .maybeSingle();
      
      setUserIdentity({
        ...existing,
        full_name: profile?.full_name,
        role: profile?.role,
      } as UserIdentity);
    } else {
      // Get profile info to create identity
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', effectiveUserId)
        .maybeSingle();

      if (profile) {
        const firstName = profile.full_name?.split(' ')[0]?.toLowerCase() || 'user';
        const dept = getDepartment(profile.role);
        const internalId = `${firstName}@${dept}`;
        
        const { data: newIdentity, error } = await supabase
          .from('user_identities')
          .insert({
            user_id: effectiveUserId,
            internal_id: internalId,
            display_name: profile.full_name,
            department: dept,
          })
          .select()
          .single();

        if (!error && newIdentity) {
          setUserIdentity({
            ...newIdentity,
            full_name: profile.full_name,
            role: profile.role,
          } as UserIdentity);
        }
      }
    }
  };

  const getDepartment = (role: string | null): string => {
    switch (role) {
      case 'superadmin':
      case 'admin':
      case 'platform_admin':
        return 'admin';
      case 'student':
        return 'students';
      case 'faculty':
        return 'faculty';
      case 'alumni':
        return 'alumni';
      case 'admission_admin':
      case 'admission_staff':
      case 'admission_agent':
        return 'admissions';
      case 'finance':
        return 'finance';
      case 'hr_admin':
        return 'hr';
      default:
        return 'staff';
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      let query = supabase.from('internal_messages').select('*');

      switch (activeFolder) {
        case 'inbox':
          query = query.eq('recipient_id', effectiveUserId).eq('is_archived', false).eq('is_draft', false);
          break;
        case 'sent':
          query = query.eq('sender_id', effectiveUserId).eq('is_draft', false);
          break;
        case 'drafts':
          query = query.eq('sender_id', effectiveUserId).eq('is_draft', true);
          break;
        case 'starred':
          query = query.or(`sender_id.eq.${effectiveUserId},recipient_id.eq.${effectiveUserId}`).eq('is_starred', true);
          break;
        case 'archive':
          query = query.eq('recipient_id', effectiveUserId).eq('is_archived', true);
          break;
        case 'trash':
          query = query.or(`and(sender_id.eq.${effectiveUserId},is_deleted_by_sender.eq.true),and(recipient_id.eq.${effectiveUserId},is_deleted_by_recipient.eq.true)`);
          break;
        default:
          query = query.eq('recipient_id', effectiveUserId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Enrich with sender/recipient info
        const userIds = [...new Set([
          ...data.map(m => m.sender_id),
          ...data.map(m => m.recipient_id)
        ])];

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        const { data: identities } = await supabase
          .from('user_identities')
          .select('user_id, internal_id')
          .in('user_id', userIds);

        const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        const identitiesMap = new Map(identities?.map(i => [i.user_id, i]) || []);

        const enrichedMessages = data.map(msg => ({
          ...msg,
          labels: msg.labels || [],
          cc: msg.cc || [],
          bcc: msg.bcc || [],
          document_references: msg.document_references || [],
          sender: {
            full_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown',
            internal_id: identitiesMap.get(msg.sender_id)?.internal_id,
          },
          recipient: {
            full_name: profilesMap.get(msg.recipient_id)?.full_name || 'Unknown',
            internal_id: identitiesMap.get(msg.recipient_id)?.internal_id,
          },
        }));

        setMessages(enrichedMessages as InternalMessage[]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      const { count: inboxCount } = await supabase
        .from('internal_messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', effectiveUserId)
        .eq('is_read', false)
        .eq('is_archived', false);

      setUnreadCounts({ inbox: inboxCount || 0 });
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  };

  const handleSelectMessage = async (message: InternalMessage) => {
    setSelectedMessage(message);
    setIsComposing(false);

    if (!message.is_read && message.recipient_id === effectiveUserId) {
      await supabase
        .from('internal_messages')
        .update({ is_read: true })
        .eq('id', message.id);
      loadUnreadCounts();
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedMessage(null);
    setReplyToMessage(null);
  };

  const handleReply = (message: InternalMessage) => {
    setReplyToMessage(message);
    setIsComposing(true);
    setSelectedMessage(null);
  };

  const handleToggleStar = async (messageId: string, currentStarred: boolean) => {
    await supabase
      .from('internal_messages')
      .update({ is_starred: !currentStarred })
      .eq('id', messageId);
    loadMessages();
  };

  const handleArchive = async (messageId: string) => {
    await supabase
      .from('internal_messages')
      .update({ is_archived: true })
      .eq('id', messageId);
    toast({ title: 'Message archived' });
    setSelectedMessage(null);
    loadMessages();
  };

  const handleDelete = async (messageId: string) => {
    const updateField = activeFolder === 'sent' ? 'is_deleted_by_sender' : 'is_deleted_by_recipient';
    await supabase
      .from('internal_messages')
      .update({ [updateField]: true })
      .eq('id', messageId);
    toast({ title: 'Message moved to trash' });
    setSelectedMessage(null);
    loadMessages();
  };

  const handleMessageSent = () => {
    setIsComposing(false);
    setReplyToMessage(null);
    loadMessages();
    toast({ title: 'Message sent' });
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(query) ||
      msg.body.toLowerCase().includes(query) ||
      msg.sender?.full_name.toLowerCase().includes(query) ||
      msg.recipient?.full_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-background border rounded-lg overflow-hidden">
      <MessagingSidebar
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        onCompose={handleCompose}
        unreadCounts={unreadCounts}
        userIdentity={userIdentity}
      />

      <div className="flex-1 flex">
        {isComposing ? (
          <ComposeMessage
            onClose={() => setIsComposing(false)}
            onSent={handleMessageSent}
            replyTo={replyToMessage}
            currentUserId={effectiveUserId!}
          />
        ) : selectedMessage ? (
          <MessageThreadView
            message={selectedMessage}
            onBack={() => setSelectedMessage(null)}
            onReply={handleReply}
            onArchive={() => handleArchive(selectedMessage.id)}
            onDelete={() => handleDelete(selectedMessage.id)}
            onToggleStar={() => handleToggleStar(selectedMessage.id, selectedMessage.is_starred)}
            currentUserId={effectiveUserId!}
          />
        ) : (
          <MessageListView
            messages={filteredMessages}
            loading={loading}
            selectedId={selectedMessage?.id}
            onSelect={handleSelectMessage}
            onToggleStar={handleToggleStar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            folder={activeFolder}
          />
        )}
      </div>
    </div>
  );
};

export default InternalMessagingApp;
