import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Printer,
  Download,
  Paperclip,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Email } from './EmailAppModern';
import { format, parseISO } from 'date-fns';
import DOMPurify from 'dompurify';

interface EmailThreadViewModernProps {
  email: Email;
  onBack: () => void;
  onReply: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onToggleStar: () => void;
}

const EmailThreadViewModern = ({
  email,
  onBack,
  onReply,
  onDelete,
  onArchive,
  onToggleStar,
}: EmailThreadViewModernProps) => {
  const formatFullDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
    } catch {
      return '';
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority || priority === 'normal') return null;
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return (
      <Badge className={colors[priority] || ''}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStar}
          >
            <Star
              className={`h-4 w-4 ${
                email.is_starred ? 'fill-yellow-500 text-yellow-500' : ''
              }`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Move to spam</DropdownMenuItem>
              <DropdownMenuItem>Block sender</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Email Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Subject */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-xl font-semibold leading-tight">
              {email.subject || '(no subject)'}
            </h1>
            {getPriorityBadge(email.priority)}
          </div>

          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-medium text-lg flex-shrink-0">
              {(email.from_name || email.from_email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">
                  {email.from_name || email.from_email}
                </span>
                <span className="text-sm text-muted-foreground">
                  &lt;{email.from_email}&gt;
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                to {email.to_email}
                {email.cc && <span>, cc: {email.cc}</span>}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatFullDate(email.sent_at || email.received_at || email.created_at)}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Email Body */}
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(email.html_body || email.body || '') 
            }}
          />

          {/* Attachments */}
          {email.has_attachments && email.attachments && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Array.isArray(email.attachments) && email.attachments.map((attachment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.filename || attachment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Download'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply Actions */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <Button onClick={onReply} className="flex-1" variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="icon">
            <ReplyAll className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Forward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailThreadViewModern;
