import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Users, Circle, MessageSquare, X } from 'lucide-react';
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

const AlumniChatRoom = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [selectedDMUser, setSelectedDMUser] = useState<OnlineUser | null>(null);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [dmMessage, setDmMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dmEndRef = useRef<HTMLDivElement>(null);

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
          setPrivateMessages(prev => [...prev, newDM]);
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
    dmEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [privateMessages]);

  useEffect(() => {
    if (selectedDMUser) {
      fetchPrivateMessages(selectedDMUser.user_id);
    }
  }, [selectedDMUser]);

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

      setPrivateMessages(data || []);
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

  const sendPrivateMessage = async () => {
    if (!dmMessage.trim() || !user?.id || !selectedDMUser) return;
    try {
      const { error } = await supabase
        .from('alumni_private_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedDMUser.user_id,
          message: dmMessage.trim()
        });

      if (error) throw error;
      setDmMessage('');
    } catch (error) {
      console.error('Error sending private message:', error);
      toast({
        title: "Error",
        description: "Failed to send private message",
        variant: "destructive"
      });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading chat room...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
      {/* Main Chat Room - Yahoo Messenger 2000 Style */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-300 dark:border-blue-700">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <MessageSquare className="h-5 w-5" />
              🎓 Alumni Chat Room
              <Badge variant="secondary" className="ml-auto bg-yellow-400 text-black">
                {onlineUsers.length} online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.user_id === user?.id;
                  const showDate = idx === 0 || formatDate(msg.created_at) !== formatDate(messages[idx - 1].created_at);
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="text-center text-xs text-muted-foreground py-2">
                          --- {formatDate(msg.created_at)} ---
                        </div>
                      )}
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded ${
                          isOwnMessage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-bold ${isOwnMessage ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}`}>
                              {msg.user_name}
                            </span>
                            <span className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-muted-foreground'}`}>
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{msg.message}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800 border-t-2 border-blue-300 dark:border-blue-700">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-2 border-blue-300 dark:border-blue-600"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users Sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col bg-gradient-to-b from-yellow-100 to-yellow-50 dark:from-yellow-950 dark:to-yellow-900 border-2 border-yellow-400 dark:border-yellow-700">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Users className="h-4 w-4" />
              Who's Online
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-2 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {onlineUsers.map((onlineUser) => (
                  <div
                    key={onlineUser.user_id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors ${
                      onlineUser.user_id === user?.id ? 'bg-yellow-200 dark:bg-yellow-800' : ''
                    }`}
                    onClick={() => {
                      if (onlineUser.user_id !== user?.id) {
                        setSelectedDMUser(onlineUser);
                      }
                    }}
                  >
                    <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                    <span className="text-sm font-medium truncate">
                      {onlineUser.user_name}
                      {onlineUser.user_id === user?.id && ' (You)'}
                    </span>
                  </div>
                ))}
                {onlineUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No one else is online
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Private Message Dialog */}
      {selectedDMUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md h-[500px] flex flex-col bg-gradient-to-b from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-400 dark:border-purple-700">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-t-lg flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                💬 DM with {selectedDMUser.user_name}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedDMUser(null)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {privateMessages.map((dm) => {
                    const isSent = dm.sender_id === user?.id;
                    return (
                      <div key={dm.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded ${
                          isSent 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}>
                          <p className="text-sm break-words">{dm.message}</p>
                          <span className={`text-xs ${isSent ? 'text-purple-200' : 'text-muted-foreground'}`}>
                            {formatTime(dm.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={dmEndRef} />
                </div>
              </ScrollArea>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 border-t-2 border-purple-300 dark:border-purple-700">
                <div className="flex gap-2">
                  <Input
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    placeholder="Type a private message..."
                    className="flex-1 border-2 border-purple-300 dark:border-purple-600"
                    onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage()}
                  />
                  <Button 
                    onClick={sendPrivateMessage}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AlumniChatRoom;