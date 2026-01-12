import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EmailSidebar from './EmailSidebar';
import EmailListView from './EmailListView';
import EmailThreadViewModern from './EmailThreadViewModern';
import EmailComposerModern from './EmailComposerModern';
import { Loader2 } from 'lucide-react';

export interface Email {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string;
  body: string | null;
  html_body: string | null;
  cc: string | null;
  bcc: string | null;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  email_type: string | null;
  priority: string | null;
  labels: any;
  thread_id: string | null;
  sent_at: string | null;
  received_at: string | null;
  created_at: string | null;
  attachments: any;
  has_attachments: boolean | null;
}

export interface EmailFolder {
  id: string;
  name: string;
  type: string;
  unread_count: number;
  color: string;
}

interface EmailAppModernProps {
  adminUserId?: string; // If provided, admin is accessing this user's email
}

const EmailAppModern = ({ adminUserId }: EmailAppModernProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [replyTo, setReplyTo] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailAccount, setEmailAccount] = useState<any>(null);
  
  // Use adminUserId if provided (admin accessing user's email), otherwise use current user
  const targetUserId = adminUserId || user?.id;

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', type: 'inbox', unread_count: 0, color: '#3b82f6' },
    { id: 'starred', name: 'Starred', type: 'starred', unread_count: 0, color: '#eab308' },
    { id: 'sent', name: 'Sent', type: 'sent', unread_count: 0, color: '#22c55e' },
    { id: 'drafts', name: 'Drafts', type: 'drafts', unread_count: 0, color: '#f97316' },
    { id: 'trash', name: 'Trash', type: 'trash', unread_count: 0, color: '#ef4444' },
    { id: 'spam', name: 'Spam', type: 'spam', unread_count: 0, color: '#6b7280' },
  ];

  useEffect(() => {
    if (targetUserId) {
      loadEmailAccount();
      loadEmails();
      setupRealtimeSubscription();
    }
  }, [targetUserId, selectedFolder]);

  const loadEmailAccount = async () => {
    if (!targetUserId) return;
    const { data } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_active', true)
      .single();
    
    setEmailAccount(data);
  };

  const setupRealtimeSubscription = () => {
    if (!targetUserId) return;
    const channel = supabase
      .channel('emails-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
          filter: `user_id=eq.${targetUserId}`,
        },
        () => {
          loadEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadEmails = async () => {
    if (!targetUserId) return;
    setLoading(true);

    let query = supabase
      .from('emails')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_deleted', selectedFolder === 'trash')
      .order('created_at', { ascending: false });

    if (selectedFolder === 'inbox') {
      query = query.eq('email_type', 'received').eq('is_archived', false);
    } else if (selectedFolder === 'sent') {
      query = query.eq('email_type', 'sent');
    } else if (selectedFolder === 'drafts') {
      query = query.eq('status', 'draft');
    } else if (selectedFolder === 'starred') {
      query = query.eq('is_starred', true);
    } else if (selectedFolder === 'spam') {
      query = query.eq('folder', 'spam');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading emails:', error);
    } else {
      setEmails(data || []);
    }
    setLoading(false);
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    
    if (!email.is_read) {
      await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', email.id);
    }
  };

  const handleToggleStar = async (emailId: string, currentStatus: boolean) => {
    await supabase
      .from('emails')
      .update({ is_starred: !currentStatus })
      .eq('id', emailId);
    
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, is_starred: !currentStatus } : e
    ));
  };

  const handleDeleteEmail = async (emailId: string) => {
    await supabase
      .from('emails')
      .update({ is_deleted: true })
      .eq('id', emailId);
    
    setSelectedEmail(null);
    loadEmails();
    toast({ title: 'Email moved to trash' });
  };

  const handleArchiveEmail = async (emailId: string) => {
    await supabase
      .from('emails')
      .update({ is_archived: true })
      .eq('id', emailId);
    
    setSelectedEmail(null);
    loadEmails();
    toast({ title: 'Email archived' });
  };

  const handleReply = (email: Email) => {
    setReplyTo(email);
    setShowComposer(true);
  };

  const handleComposerClose = () => {
    setShowComposer(false);
    setReplyTo(null);
  };

  const handleEmailSent = () => {
    setShowComposer(false);
    setReplyTo(null);
    loadEmails();
  };

  const currentFolder = folders.find(f => f.id === selectedFolder) || folders[0];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please log in to access email</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden">
      {/* Sidebar */}
      <EmailSidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={(folder) => {
          setSelectedFolder(folder);
          setSelectedEmail(null);
        }}
        onCompose={() => setShowComposer(true)}
        emailAccount={emailAccount}
      />

      {/* Email List */}
      <div className="flex-1 flex flex-col border-r min-w-0">
        {/* Folder header with color bar */}
        <div className="relative">
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: currentFolder.color }}
          />
          <div className="p-4 border-b bg-card">
            <h2 className="text-lg font-semibold">{currentFolder.name}</h2>
            <p className="text-sm text-muted-foreground">
              {emails.length} {emails.length === 1 ? 'email' : 'emails'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <EmailListView
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
            onToggleStar={handleToggleStar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>

      {/* Email Preview / Thread View */}
      <div className="w-2/5 min-w-[400px] hidden lg:flex flex-col">
        {selectedEmail ? (
          <EmailThreadViewModern
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onReply={() => handleReply(selectedEmail)}
            onDelete={() => handleDeleteEmail(selectedEmail.id)}
            onArchive={() => handleArchiveEmail(selectedEmail.id)}
            onToggleStar={() => handleToggleStar(selectedEmail.id, selectedEmail.is_starred)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <EmailComposerModern
          onClose={handleComposerClose}
          onSent={handleEmailSent}
          replyTo={replyTo}
          fromEmail={emailAccount?.email_address}
          fromName={emailAccount?.display_name}
        />
      )}
    </div>
  );
};

export default EmailAppModern;
