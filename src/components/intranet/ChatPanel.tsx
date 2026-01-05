import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageCircle, Send, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: { full_name: string };
}

interface UserWithPresence {
  user_id: string;
  full_name: string;
  role: string;
  is_online?: boolean;
  last_seen?: string;
}

export const ChatPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithPresence[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPresence | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadUsers();
      updatePresence(true);
      
      // Update presence every 30 seconds
      const interval = setInterval(() => {
        updatePresence(true);
      }, 30000);

      // Subscribe to presence changes
      const presenceChannel = supabase
        .channel('user_presence_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_presence',
          },
          () => {
            loadUsers();
          }
        )
        .subscribe();

      // Set offline on unmount
      return () => {
        updatePresence(false);
        clearInterval(interval);
        supabase.removeChannel(presenceChannel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.user_id);
      
      // Subscribe to new messages
      const messagesChannel = supabase
        .channel('chat_messages_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `sender_id=eq.${selectedUser.user_id},recipient_id=eq.${user?.id}`,
          },
          () => {
            loadMessages(selectedUser.user_id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updatePresence = async (isOnline: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        is_online: isOnline,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (error) {
      // Silently ignore duplicate key errors as they're expected during concurrent updates
      if (error.code !== '23505') {
        console.error('Error updating presence:', error);
      }
    }
  };

  const loadUsers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name, role')
      .neq('user_id', user?.id);

    if (profilesError) {
      console.error('Error loading users:', profilesError);
      return;
    }

    const { data: presence, error: presenceError } = await supabase
      .from('user_presence')
      .select('*');

    if (presenceError) {
      console.error('Error loading presence:', presenceError);
      return;
    }

    const usersWithPresence = profiles.map((profile) => {
      const userPresence = presence.find((p) => p.user_id === profile.user_id);
      return {
        ...profile,
        is_online: userPresence?.is_online || false,
        last_seen: userPresence?.last_seen,
      };
    });

    // Sort: online users first
    usersWithPresence.sort((a, b) => {
      if (a.is_online && !b.is_online) return -1;
      if (!a.is_online && b.is_online) return 1;
      return a.full_name.localeCompare(b.full_name);
    });

    setUsers(usersWithPresence);
  };

  const loadMessages = async (otherUserId: string) => {
    const { data: messagesData, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user?.id})`)
      .order('created_at', { ascending: true });

    if (!error && messagesData) {
      // Fetch sender profiles separately
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', senderIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      const enrichedMessages = messagesData.map(msg => ({
        ...msg,
        sender: profilesMap.get(msg.sender_id)
      }));
      
      setMessages(enrichedMessages as any);
      
      // Mark messages as read
      const unreadIds = messagesData
        .filter((msg) => msg.recipient_id === user?.id && !msg.is_read)
        .map((msg) => msg.id);
      
      if (unreadIds.length > 0) {
        await supabase
          .from('chat_messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const { error } = await supabase.from('chat_messages').insert({
      sender_id: user?.id,
      recipient_id: selectedUser.user_id,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } else {
      setNewMessage('');
      loadMessages(selectedUser.user_id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="flex h-full">
          {/* User list */}
          <div className="w-48 border-r">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-sm">Users</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-2 space-y-1">
                {users.map((u) => (
                  <Button
                    key={u.user_id}
                    variant={selectedUser?.user_id === u.user_id ? 'default' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Circle
                        className={`h-2 w-2 ${
                          u.is_online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.role}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`h-2 w-2 ${
                        selectedUser.is_online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{selectedUser.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedUser.is_online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {format(new Date(msg.created_at), 'hh:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
