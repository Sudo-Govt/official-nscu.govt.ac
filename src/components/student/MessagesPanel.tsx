import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Download, User, Calendar, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface AgentMessage {
  id: string;
  message: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
  is_read: boolean;
  application: {
    application_number: string;
    agent: {
      user: {
        full_name: string;
      };
    };
  };
}

const MessagesPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      // Find applications where the student's email matches the user's email
      const { data: applications, error: appError } = await supabase
        .from('student_applications')
        .select('id')
        .eq('email', user.email);

      if (appError) throw appError;

      if (!applications || applications.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      const applicationIds = applications.map(app => app.id);

      const { data, error } = await supabase
        .from('agent_messages')
        .select(`
          *,
          application:student_applications(
            application_number,
            agent:agent_profiles(
              user:profiles(full_name)
            )
          )
        `)
        .in('application_id', applicationIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('agent_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const downloadAttachment = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download attachment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Agent Messages
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Messages from your admission agent
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {messages.filter(m => !m.is_read).length} unread
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  !message.is_read 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-border/50'
                }`}
                onClick={() => !message.is_read && markAsRead(message.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {message.application?.agent?.user?.full_name || 'Agent'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Application: {message.application?.application_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.is_read && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
                
                <div className="pl-10">
                  <p className="text-foreground whitespace-pre-wrap mb-3">
                    {message.message}
                  </p>
                  
                  {message.attachment_url && message.attachment_name && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {message.attachment_name}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAttachment(message.attachment_url!, message.attachment_name!)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesPanel;