import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Users, Circle, MessageSquare, X, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_deleted: boolean;
  created_at: string;
  user_name?: string;
}

interface OnlineUser {
  user_id: string;
  user_name: string;
  is_online: boolean;
  last_seen: string;
}

interface PrivateMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
}

interface ActiveDM {
  user: OnlineUser;
  minimized: boolean;
}

const AlumniChatRoom = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [activeDMs, setActiveDMs] = useState<ActiveDM[]>([]);
  const [dmMessages, setDmMessages] = useState<Record<string, PrivateMessage[]>>({});
  const [dmInputs, setDmInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dmEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchMessages();
    fetchOnlineUsers();
    updatePresence();
    
    // Set up realtime subscriptions
    const chatChannel = supabase
      .channel('alumni-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alumni_chat_room'
      }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages(prev => [...prev, { ...newMsg, user_name: userNames[newMsg.user_id] || 'Alumni' }]);
      })
      .subscribe();

    const presenceChannel = supabase
      .channel('alumni-presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alumni_chat_presence'
      }, () => {
        fetchOnlineUsers();
      })
      .subscribe();

    const dmChannel = supabase
      .channel('alumni-dm')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alumni_private_messages'
      }, (payload) => {
        const newDM = payload.new as PrivateMessage;
        if (newDM.recipient_id === user?.id || newDM.sender_id === user?.id) {
          const otherUserId = newDM.sender_id === user?.id ? newDM.recipient_id : newDM.sender_id;
          setDmMessages(prev => ({
            ...prev,
            [otherUserId]: [...(prev[otherUserId] || []), newDM]
          }));
        }
      })
      .subscribe();

    // Update presence every 30 seconds
    const presenceInterval = setInterval(updatePresence, 30000);

    return () => {
      chatChannel.unsubscribe();
      presenceChannel.unsubscribe();
      dmChannel.unsubscribe();
      clearInterval(presenceInterval);
      // Mark as offline when leaving
      if (user?.id) {
        supabase
          .from('alumni_chat_presence')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('user_id', user.id);
      }
    };
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Scroll DM windows when new messages arrive
    Object.keys(dmMessages).forEach(userId => {
      dmEndRefs.current[userId]?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [dmMessages]);

  const fetchMessages = async () => {
    try {
      const { data: msgs, error } = await supabase
        .from('alumni_chat_room')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      // Fetch user names
      const userIds = [...new Set(msgs?.map(m => m.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const names: Record<string, string> = {};
      profiles?.forEach(p => {
        names[p.user_id] = p.full_name || 'Alumni';
      });
      setUserNames(names);

      setMessages(msgs?.map(m => ({ ...m, user_name: names[m.user_id] || 'Alumni' })) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const { data: presence, error } = await supabase
        .from('alumni_chat_presence')
        .select('*')
        .eq('is_online', true);

      if (error) throw error;

      const userIds = presence?.map(p => p.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const names: Record<string, string> = {};
      profiles?.forEach(p => {
        names[p.user_id] = p.full_name || 'Alumni';
      });

      setOnlineUsers(presence?.map(p => ({
        user_id: p.user_id,
        user_name: names[p.user_id] || 'Alumni',
        is_online: p.is_online,
        last_seen: p.last_seen
      })) || []);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const updatePresence = async () => {
    if (!user?.id) return;
    try {
      await supabase
        .from('alumni_chat_presence')
        .upsert({
          user_id: user.id,
          is_online: true,
          last_seen: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  const fetchPrivateMessages = async (otherUserId: string) => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('alumni_private_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark messages as read
      await supabase
        .from('alumni_private_messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', otherUserId);

      setDmMessages(prev => ({ ...prev, [otherUserId]: data || [] }));
    } catch (error) {
      console.error('Error fetching private messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    try {
      const { error } = await supabase
        .from('alumni_chat_room')
        .insert({
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const sendPrivateMessage = async (recipientId: string) => {
    const message = dmInputs[recipientId];
    if (!message?.trim() || !user?.id) return;
    try {
      const { error } = await supabase
        .from('alumni_private_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim()
        });

      if (error) throw error;
      setDmInputs(prev => ({ ...prev, [recipientId]: '' }));
    } catch (error) {
      console.error('Error sending private message:', error);
      toast({
        title: "Error",
        description: "Failed to send private message",
        variant: "destructive"
      });
    }
  };

  const openDM = (targetUser: OnlineUser) => {
    if (targetUser.user_id === user?.id) return;
    if (!activeDMs.find(dm => dm.user.user_id === targetUser.user_id)) {
      setActiveDMs([...activeDMs, { user: targetUser, minimized: false }]);
      fetchPrivateMessages(targetUser.user_id);
    }
  };

  const closeDM = (userId: string) => {
    setActiveDMs(activeDMs.filter(dm => dm.user.user_id !== userId));
  };

  const toggleMinimizeDM = (userId: string) => {
    setActiveDMs(activeDMs.map(dm =>
      dm.user.user_id === userId ? { ...dm, minimized: !dm.minimized } : dm
    ));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-background border rounded-lg">
        <div className="text-foreground text-lg font-medium animate-pulse">Loading Chat...</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] flex flex-col bg-background rounded-lg overflow-hidden border">
      {/* Header */}
      <div className="bg-foreground text-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Alumni Chat</h1>
        </div>
        <div className="text-sm opacity-80">
          {userNames[user?.id || ''] || 'Alumni'}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Room Header */}
          <div className="bg-muted p-2 font-medium border-b text-foreground flex items-center justify-between text-sm">
            <span>🎓 Alumni Lobby</span>
            <span className="text-xs text-muted-foreground">
              {messages.length} messages
            </span>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-1">
              {messages.map((msg) => {
                const isOwnMessage = msg.user_id === user?.id;
                return (
                  <div key={msg.id} className="text-sm">
                    <span 
                      className={`font-semibold cursor-pointer hover:underline ${
                        isOwnMessage ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                      onClick={() => {
                        const targetUser = onlineUsers.find(u => u.user_id === msg.user_id);
                        if (targetUser) openDM(targetUser);
                      }}
                    >
                      {msg.user_name}
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">{formatTime(msg.created_at)}</span>
                    <div className="ml-2 text-foreground">{msg.message}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-2 flex gap-2 bg-muted">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendMessage)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={sendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Users Sidebar */}
        <div className="w-40 bg-muted border-l flex flex-col">
          <div className="bg-foreground text-background p-2 font-medium text-xs flex items-center gap-2">
            <Users className="h-3 w-3" /> Online ({onlineUsers.length})
          </div>
          <ScrollArea className="flex-1">
            <div className="p-1">
              {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.user_id}
                  onClick={() => openDM(onlineUser)}
                  className={`p-1.5 text-xs border-b cursor-pointer hover:bg-background flex items-center gap-1.5 ${
                    onlineUser.user_id === user?.id ? 'font-semibold' : ''
                  }`}
                >
                  <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500" />
                  <span className="truncate text-foreground">
                    {onlineUser.user_id === user?.id ? `${onlineUser.user_name} (You)` : onlineUser.user_name}
                  </span>
                </div>
              ))}
              {onlineUsers.length === 0 && (
                <div className="p-3 text-xs text-muted-foreground text-center">
                  No users online
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Floating DM Windows */}
      <div className="fixed bottom-0 right-4 flex gap-2 z-50">
        {activeDMs.map(dm => (
          <div
            key={dm.user.user_id}
            className="bg-background border rounded-t-lg shadow-lg flex flex-col"
            style={{ 
              width: '260px',
              height: dm.minimized ? '32px' : '280px',
              transition: 'height 0.2s ease-in-out'
            }}
          >
            {/* DM Header */}
            <div 
              className="bg-foreground text-background p-1.5 flex items-center justify-between cursor-pointer rounded-t"
              onClick={() => toggleMinimizeDM(dm.user.user_id)}
            >
              <span className="font-medium text-xs flex items-center gap-1">
                💬 {dm.user.user_name}
              </span>
              <div className="flex gap-0.5">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMinimizeDM(dm.user.user_id); }}
                  className="hover:bg-background/20 p-0.5 rounded"
                >
                  <Minimize2 className="h-3 w-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); closeDM(dm.user.user_id); }}
                  className="hover:bg-background/20 p-0.5 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* DM Content */}
            {!dm.minimized && (
              <>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1">
                    {(dmMessages[dm.user.user_id] || []).map(msg => (
                      <div key={msg.id} className="text-xs">
                        <span className={`font-semibold ${msg.sender_id === user?.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {msg.sender_id === user?.id ? 'You' : dm.user.user_name}
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">{formatTime(msg.created_at)}</span>
                        <div className="ml-2 text-foreground">{msg.message}</div>
                      </div>
                    ))}
                    <div ref={el => dmEndRefs.current[dm.user.user_id] = el} />
                  </div>
                </ScrollArea>
                <div className="border-t p-1.5 flex gap-1 bg-muted">
                  <Input
                    type="text"
                    value={dmInputs[dm.user.user_id] || ''}
                    onChange={(e) => setDmInputs({ ...dmInputs, [dm.user.user_id]: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, () => sendPrivateMessage(dm.user.user_id))}
                    placeholder="Message..."
                    className="flex-1 text-xs h-7"
                  />
                  <Button
                    onClick={() => sendPrivateMessage(dm.user.user_id)}
                    size="sm"
                    className="h-7 px-2"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniChatRoom;
