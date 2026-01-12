import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Star, Paperclip, AlertCircle } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { InternalMessage } from './InternalMessagingApp';

interface MessageListViewProps {
  messages: InternalMessage[];
  loading: boolean;
  selectedId?: string;
  onSelect: (message: InternalMessage) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  folder: string;
}

export const MessageListView: React.FC<MessageListViewProps> = ({
  messages,
  loading,
  selectedId,
  onSelect,
  onToggleStar,
  searchQuery,
  onSearchChange,
  folder,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'low':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col border-r">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p>No messages</p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => {
              const isSelected = selectedId === message.id;
              const displayName = folder === 'sent' 
                ? message.recipient?.full_name 
                : message.sender?.full_name;
              const displayId = folder === 'sent'
                ? message.recipient?.internal_id
                : message.sender?.internal_id;

              return (
                <div
                  key={message.id}
                  onClick={() => onSelect(message)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
                    isSelected ? 'bg-accent' : ''
                  } ${!message.is_read && folder === 'inbox' ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 mt-0.5">
                      <AvatarFallback className="bg-muted text-sm">
                        {getInitials(displayName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`truncate ${!message.is_read && folder === 'inbox' ? 'font-semibold' : 'font-medium'}`}>
                            {displayName}
                          </span>
                          {displayId && (
                            <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                              {displayId}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-sm truncate ${!message.is_read && folder === 'inbox' ? 'font-medium' : ''}`}>
                          {message.subject || '(No subject)'}
                        </span>
                        {message.priority === 'high' && (
                          <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {message.body}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(message.id, message.is_starred);
                          }}
                        >
                          <Star 
                            className={`h-3.5 w-3.5 ${
                              message.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                        
                        {message.document_references?.length > 0 && (
                          <Badge variant="outline" className="h-5 text-xs gap-1">
                            <Paperclip className="h-3 w-3" />
                            {message.document_references.length}
                          </Badge>
                        )}
                        
                        {message.labels?.map((label, i) => (
                          <Badge key={i} variant="secondary" className="h-5 text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
