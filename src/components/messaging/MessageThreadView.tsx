import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Reply, Forward, Star, Archive, Trash2, 
  MoreVertical, Paperclip, Download, FileText, AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { InternalMessage } from './InternalMessagingApp';
import DOMPurify from 'dompurify';

interface MessageThreadViewProps {
  message: InternalMessage;
  onBack: () => void;
  onReply: (message: InternalMessage) => void;
  onArchive: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
  currentUserId: string;
}

export const MessageThreadView: React.FC<MessageThreadViewProps> = ({
  message,
  onBack,
  onReply,
  onArchive,
  onDelete,
  onToggleStar,
  currentUserId,
}) => {
  const [threadMessages, setThreadMessages] = useState<InternalMessage[]>([message]);
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (message.thread_id) {
      loadThread();
    } else {
      setThreadMessages([message]);
    }
    loadAttachments();
  }, [message.id]);

  const loadThread = async () => {
    const { data } = await supabase
      .from('internal_messages')
      .select('*')
      .eq('thread_id', message.thread_id)
      .order('created_at', { ascending: true });

    if (data) {
      // Enrich with sender info
      const userIds = [...new Set(data.map(m => m.sender_id))];
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

      const enriched = data.map(msg => ({
        ...msg,
        labels: msg.labels || [],
        cc: msg.cc || [],
        bcc: msg.bcc || [],
        document_references: msg.document_references || [],
        sender: {
          full_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown',
          internal_id: identitiesMap.get(msg.sender_id)?.internal_id,
        },
      }));

      setThreadMessages(enriched as InternalMessage[]);
    }
  };

  const loadAttachments = async () => {
    const { data } = await supabase
      .from('internal_message_attachments')
      .select('*')
      .eq('message_id', message.id);

    if (data) {
      setAttachments(data);
    }
  };

  const downloadAttachment = async (attachment: any) => {
    const { data } = await supabase.storage
      .from('internal-attachments')
      .download(attachment.file_path);

    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              {message.subject || '(No subject)'}
              {message.priority === 'high' && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  High Priority
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {threadMessages.length > 1 ? `${threadMessages.length} messages in thread` : 'Single message'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleStar}>
            <Star className={`h-5 w-5 ${message.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {threadMessages.map((msg, index) => (
            <Card key={msg.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(msg.sender?.full_name || 'U')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{msg.sender?.full_name}</span>
                      {msg.sender?.internal_id && (
                        <span className="text-sm text-muted-foreground ml-2">
                          &lt;{msg.sender.internal_id}&gt;
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    To: {msg.recipient?.full_name}
                    {msg.cc?.length > 0 && `, CC: ${msg.cc.join(', ')}`}
                  </p>

                  <Separator className="my-4" />

                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(msg.body.replace(/\n/g, '<br/>')) 
                    }}
                  />

                  {/* Document References */}
                  {msg.document_references?.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Referenced Documents
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.document_references.map((doc: any, i: number) => (
                          <Badge key={i} variant="outline" className="gap-1 cursor-pointer hover:bg-accent">
                            <FileText className="h-3 w-3" />
                            {doc.title || doc.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {index === 0 && attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        Attachments ({attachments.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((att) => (
                          <Button
                            key={att.id}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAttachment(att)}
                            className="gap-2"
                          >
                            <Download className="h-3 w-3" />
                            {att.file_name}
                            {att.file_size && (
                              <span className="text-xs text-muted-foreground">
                                ({(att.file_size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Reply Actions */}
      <div className="p-4 border-t">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Button onClick={() => onReply(message)} className="gap-2">
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" className="gap-2">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};
