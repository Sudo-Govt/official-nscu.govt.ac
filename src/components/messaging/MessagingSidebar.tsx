import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Inbox, Send, FileEdit, Star, Archive, Trash2, 
  PenSquare, User 
} from 'lucide-react';
import { UserIdentity } from './InternalMessagingApp';

interface MessagingSidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  unreadCounts: Record<string, number>;
  userIdentity: UserIdentity | null;
}

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, color: 'text-blue-500' },
  { id: 'starred', label: 'Starred', icon: Star, color: 'text-yellow-500' },
  { id: 'sent', label: 'Sent', icon: Send, color: 'text-green-500' },
  { id: 'drafts', label: 'Drafts', icon: FileEdit, color: 'text-orange-500' },
  { id: 'archive', label: 'Archive', icon: Archive, color: 'text-purple-500' },
  { id: 'trash', label: 'Trash', icon: Trash2, color: 'text-red-500' },
];

export const MessagingSidebar: React.FC<MessagingSidebarProps> = ({
  activeFolder,
  onFolderChange,
  onCompose,
  unreadCounts,
  userIdentity,
}) => {
  return (
    <div className="w-56 border-r bg-muted/30 flex flex-col">
      {/* Compose Button */}
      <div className="p-4">
        <Button onClick={onCompose} className="w-full gap-2">
          <PenSquare className="h-4 w-4" />
          Compose
        </Button>
      </div>

      {/* Folders */}
      <ScrollArea className="flex-1">
        <div className="px-2 space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const count = unreadCounts[folder.id] || 0;
            const isActive = activeFolder === folder.id;
            
            return (
              <Button
                key={folder.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${isActive ? 'bg-accent' : ''}`}
                onClick={() => onFolderChange(folder.id)}
              >
                <Icon className={`h-4 w-4 ${folder.color}`} />
                <span className="flex-1 text-left">{folder.label}</span>
                {count > 0 && (
                  <Badge variant="default" className="h-5 px-1.5 text-xs">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Identity */}
      {userIdentity && (
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {userIdentity.display_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userIdentity.display_name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userIdentity.internal_id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
