import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, Reply, ReplyAll, Forward, Trash2, Archive,
  Star, MoreVertical, Paperclip, Printer
} from 'lucide-react';

interface EmailThreadViewProps {
  email: any;
  onBack: () => void;
  onReply: () => void;
}

const EmailThreadView = ({ email, onBack, onReply }: EmailThreadViewProps) => {
  const [thread, setThread] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThread();
    loadAttachments();
  }, [email.id]);

  const loadThread = async () => {
    try {
      // Get all emails in the thread
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .or(`id.eq.${email.id},thread_id.eq.${email.thread_id || email.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setThread(data || [email]);
    } catch (error) {
      console.error('Error loading thread:', error);
      setThread([email]);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = async () => {
    try {
      const { data, error } = await supabase
        .from('email_attachments')
        .select('*')
        .eq('email_id', email.id);

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  };

  const toggleStar = async () => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !email.is_starred })
        .eq('id', email.id);

      if (error) throw error;
      onBack();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const deleteEmail = async () => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_deleted: true })
        .eq('id', email.id);

      if (error) throw error;
      onBack();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const archiveEmail = async () => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_archived: true })
        .eq('id', email.id);

      if (error) throw error;
      onBack();
    } catch (error) {
      console.error('Error archiving email:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{email.subject || '(No subject)'}</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleStar}>
            <Star 
              className={`h-4 w-4 ${
                email.is_starred ? 'fill-yellow-400 text-yellow-400' : ''
              }`} 
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={archiveEmail}>
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={deleteEmail}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Email Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {thread.map((message, index) => (
          <Card key={message.id} className={index === thread.length - 1 ? 'border-primary' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {(message.from_name || message.from_email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {message.from_name || message.from_email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {message.from_email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-12">
                    to {message.to_email}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.body_html || message.body || '') }}
              />

              {attachments.length > 0 && index === thread.length - 1 && (
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    {attachments.length} Attachment{attachments.length > 1 ? 's' : ''}
                  </div>
                  <div className="space-y-2">
                    {attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 cursor-pointer">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{att.file_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(att.file_size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {index === thread.length - 1 && (
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={onReply}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <ReplyAll className="h-4 w-4 mr-2" />
                    Reply All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailThreadView;