import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  Mail, Inbox, Send, FileText, Star, Trash2, Archive,
  Plus, Search, RefreshCw, Settings, Pencil, Tag
} from 'lucide-react';
import EmailCompose from './EmailCompose';
import EmailThreadView from './EmailThreadView';

interface EmailAccount {
  id: string;
  email_address: string;
  display_name: string;
  is_active: boolean;
}

interface EmailFolder {
  id: string;
  name: string;
  type: string;
  unread_count: number;
  icon?: string;
}

interface Email {
  id: string;
  subject: string;
  from_email: string;
  from_name?: string;
  snippet?: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  created_at: string;
}

const EmailApp = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailAccount, setEmailAccount] = useState<EmailAccount | null>(null);
  const [folders, setFolders] = useState<EmailFolder[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadEmailAccount();
    loadFolders();
  }, [user]);

  useEffect(() => {
    if (selectedFolder) {
      loadEmails(selectedFolder);
    }
  }, [selectedFolder]);

  const loadEmailAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No email account found');
          return;
        }
        throw error;
      }

      setEmailAccount(data);
    } catch (error) {
      console.error('Error loading email account:', error);
    }
  };

  const loadFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('email_folders')
        .select('*')
        .eq('user_id', user?.id)
        .order('sort_order');

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmails = async (folderType: string) => {
    try {
      setLoading(true);
      
      const folder = folders.find(f => f.type === folderType);
      if (!folder) return;

      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user?.id)
        .eq('folder_id', folder.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error loading emails:', error);
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncEmails = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('fetch-emails');
      
      if (error) throw error;
      
      await loadEmails(selectedFolder);
      toast({
        title: "Success",
        description: "Emails synced successfully"
      });
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast({
        title: "Error",
        description: "Failed to sync emails",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const toggleStar = async (emailId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !currentStatus })
        .eq('id', emailId);

      if (error) throw error;
      
      await loadEmails(selectedFolder);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', emailId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getFolderIcon = (type: string) => {
    const icons: Record<string, any> = {
      inbox: Inbox,
      sent: Send,
      drafts: FileText,
      starred: Star,
      trash: Trash2,
      spam: Archive,
    };
    return icons[type] || Mail;
  };

  if (!emailAccount) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Email Account</h2>
          <p className="text-muted-foreground mb-4">
            You don't have an email account yet. Contact your administrator to create one.
          </p>
        </Card>
      </div>
    );
  }

  if (showCompose) {
    return (
      <EmailCompose
        onClose={() => {
          setShowCompose(false);
          loadEmails(selectedFolder);
        }}
        fromEmail={emailAccount.email_address}
        fromName={emailAccount.display_name}
      />
    );
  }

  if (selectedEmail) {
    return (
      <EmailThreadView
        email={selectedEmail}
        onBack={() => {
          setSelectedEmail(null);
          loadEmails(selectedFolder);
        }}
        onReply={() => {
          setShowCompose(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 space-y-4">
        <div className="space-y-2">
          <Button onClick={() => setShowCompose(true)} className="w-full gap-2">
            <Pencil className="h-4 w-4" />
            Compose
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              size="icon" 
              variant="outline"
              onClick={syncEmails}
              disabled={syncing}
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground px-2 mb-2">
            FOLDERS
          </div>
          {folders.map((folder) => {
            const Icon = getFolderIcon(folder.type);
            return (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.type ? "secondary" : "ghost"}
                className="w-full justify-between"
                onClick={() => setSelectedFolder(folder.type)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{folder.name}</span>
                </div>
                {folder.unread_count > 0 && (
                  <Badge variant="secondary">{folder.unread_count}</Badge>
                )}
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground px-2">
            {emailAccount.email_address}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <h2 className="text-2xl font-bold capitalize">{selectedFolder}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Mail className="h-16 w-16 mb-4" />
              <p>No emails in this folder</p>
            </div>
          ) : (
            <div className="divide-y">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition ${
                    !email.is_read ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => {
                    markAsRead(email.id);
                    setSelectedEmail(email);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id, email.is_starred);
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          email.is_starred ? 'fill-yellow-400 text-yellow-400' : ''
                        }`}
                      />
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${!email.is_read ? 'font-bold' : ''}`}>
                          {email.from_name || email.from_email}
                        </span>
                        {email.has_attachments && (
                          <Tag className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className={`text-sm ${!email.is_read ? 'font-semibold' : ''}`}>
                        {email.subject || '(No subject)'}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {email.snippet}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(email.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailApp;