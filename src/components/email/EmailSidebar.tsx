import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  Trash2, 
  AlertOctagon,
  Settings,
  Tag
} from 'lucide-react';
import { EmailFolder } from './EmailAppModern';

interface EmailSidebarProps {
  folders: EmailFolder[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  onCompose: () => void;
  emailAccount: any;
}

const EmailSidebar = ({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  onCompose,
  emailAccount 
}: EmailSidebarProps) => {
  const getFolderIcon = (type: string) => {
    switch (type) {
      case 'inbox': return Inbox;
      case 'starred': return Star;
      case 'sent': return Send;
      case 'drafts': return FileText;
      case 'trash': return Trash2;
      case 'spam': return AlertOctagon;
      default: return Inbox;
    }
  };

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      {/* Compose Button */}
      <div className="p-4">
        <Button 
          onClick={onCompose}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          size="lg"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Folders */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-1">
          {folders.map((folder) => {
            const Icon = getFolderIcon(folder.type);
            const isSelected = selectedFolder === folder.id;
            
            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isSelected 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div 
                  className="p-1.5 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: isSelected ? `${folder.color}20` : 'transparent',
                  }}
                >
                  <Icon 
                    className="h-4 w-4 transition-colors"
                    style={{ color: isSelected ? folder.color : undefined }}
                  />
                </div>
                <span className="flex-1 text-left">{folder.name}</span>
                {folder.unread_count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2"
                    style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                  >
                    {folder.unread_count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Labels Section */}
        <div className="px-4 py-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Labels
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Tag className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-md cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Important</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-md cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Work</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-md cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Personal</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Account Info */}
      {emailAccount && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {emailAccount.display_name?.[0]?.toUpperCase() || emailAccount.email_address[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {emailAccount.display_name || 'My Account'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {emailAccount.email_address}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSidebar;
