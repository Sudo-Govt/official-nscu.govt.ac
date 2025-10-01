import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Mail, MailOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Email {
  id: string;
  from_email: string;
  from_name: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  email_type: string;
  is_read: boolean;
  is_starred: boolean;
  sent_at: string;
  received_at: string;
  created_at: string;
}

interface EmailListProps {
  type: 'inbox' | 'sent' | 'drafts';
  onSelectEmail: (email: Email) => void;
}

const EmailList = ({ type, onSelectEmail }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmails();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('email-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        () => {
          loadEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type]);

  const loadEmails = async () => {
    try {
      let query = supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (type === 'inbox') {
        query = query.eq('email_type', 'received');
      } else if (type === 'sent') {
        query = query.eq('email_type', 'sent').eq('status', 'sent');
      } else if (type === 'drafts') {
        query = query.eq('email_type', 'draft');
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async (emailId: string, currentStatus: boolean) => {
    await supabase
      .from('emails')
      .update({ is_starred: !currentStatus })
      .eq('id', emailId);
  };

  const markAsRead = async (emailId: string) => {
    await supabase
      .from('emails')
      .update({ is_read: true })
      .eq('id', emailId);
  };

  if (loading) {
    return <div className="p-4">Loading emails...</div>;
  }

  if (emails.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No emails found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {emails.map((email) => (
        <Card
          key={email.id}
          className={`cursor-pointer hover:bg-accent transition-colors ${
            !email.is_read && type === 'inbox' ? 'border-l-4 border-l-primary' : ''
          }`}
          onClick={() => {
            markAsRead(email.id);
            onSelectEmail(email);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {email.is_read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <span className={`font-medium truncate ${!email.is_read ? 'font-bold' : ''}`}>
                    {type === 'sent' ? email.to_email : email.from_name || email.from_email}
                  </span>
                  {email.status === 'failed' && (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
                <h3 className={`text-sm mb-1 truncate ${!email.is_read ? 'font-semibold' : ''}`}>
                  {email.subject}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {email.body.replace(/<[^>]*>/g, '')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(email.id, email.is_starred);
                  }}
                  className="text-muted-foreground hover:text-yellow-500"
                >
                  <Star
                    className={`h-4 w-4 ${email.is_starred ? 'fill-yellow-500 text-yellow-500' : ''}`}
                  />
                </button>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(
                    new Date(email.sent_at || email.received_at || email.created_at),
                    'MMM d, HH:mm'
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmailList;
