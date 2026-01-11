import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  Paperclip, 
  Archive, 
  Trash2,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Email } from './EmailAppModern';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

interface EmailListViewProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  onToggleStar: (emailId: string, currentStatus: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const EmailListView = ({
  emails,
  selectedEmail,
  onSelectEmail,
  onToggleStar,
  searchQuery,
  onSearchChange,
}: EmailListViewProps) => {
  const [selectedEmails, setSelectedEmails] = React.useState<string[]>([]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return format(date, 'h:mm a');
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'MMM d');
    } catch {
      return '';
    }
  };

  const getDisplayName = (email: Email) => {
    if (email.email_type === 'sent') {
      return `To: ${email.to_email}`;
    }
    return email.from_name || email.from_email;
  };

  const filteredEmails = emails.filter(email => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.subject?.toLowerCase().includes(query) ||
      email.from_email?.toLowerCase().includes(query) ||
      email.from_name?.toLowerCase().includes(query) ||
      email.body?.toLowerCase().includes(query)
    );
  });

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="p-3 border-b flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        {selectedEmails.length > 0 && (
          <>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Email List */}
      <ScrollArea className="flex-1">
        {filteredEmails.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No emails found
          </div>
        ) : (
          <div className="divide-y">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedEmail?.id === email.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                } ${!email.is_read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                onClick={() => onSelectEmail(email)}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => toggleEmailSelection(email.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity data-[state=checked]:opacity-100"
                />

                {/* Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id, email.is_starred);
                  }}
                  className="text-muted-foreground hover:text-yellow-500 transition-colors"
                >
                  <Star
                    className={`h-4 w-4 ${
                      email.is_starred ? 'fill-yellow-500 text-yellow-500' : ''
                    }`}
                  />
                </button>

                {/* Priority indicator */}
                {email.priority && ['high', 'urgent'].includes(email.priority) && (
                  <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(email.priority)}`} />
                )}

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xs font-medium flex-shrink-0">
                  {(email.from_name || email.from_email || 'U')[0].toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${!email.is_read ? 'font-semibold' : ''}`}>
                      {getDisplayName(email)}
                    </span>
                    {email.labels && Array.isArray(email.labels) && email.labels.length > 0 && (
                      <div className="flex gap-1">
                        {email.labels.slice(0, 2).map((label: any, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm truncate ${!email.is_read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {email.subject || '(no subject)'}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {email.body && ` - ${email.body.replace(/<[^>]*>/g, '').slice(0, 60)}...`}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {email.has_attachments && (
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(email.sent_at || email.received_at || email.created_at)}
                  </span>
                </div>

                {/* Hover actions */}
                <div className="hidden group-hover:flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EmailListView;
