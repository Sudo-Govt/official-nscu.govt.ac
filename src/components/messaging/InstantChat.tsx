import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, Send, Circle, Hash, Users, Plus, 
  Search, Settings, AtSign, Smile
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ChatMessage {
  id: string;
  channel_id?: string;
  sender_id: string;
  recipient_id?: string;
  message: string;
  reactions: Record<string, string[]>;
  created_at: string;
  sender?: { full_name: string; internal_id?: string };
}

interface Channel {
  id: string;
  name: string;
  description: string;
  channel_type: 'public' | 'private' | 'direct';
  members: string[];
  created_by: string;
  is_archived: boolean;
}

interface UserPresence {
  user_id: string;
  full_name: string;
  internal_id?: string;
  role: string;
  is_online: boolean;
  last_seen?: string;
}

export const InstantChat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('channels');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedDM, setSelectedDM] = useState<UserPresence | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChannels();
      loadUsers();
      updatePresence(true);

      const presenceInterval = setInterval(() => updatePresence(true), 30000);

      return () => {
        updatePresence(false);
        clearInterval(presenceInterval);
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedChannel) {
      loadChannelMessages(selectedChannel.id);
      
      const channel = supabase
        .channel(`channel_messages_${selectedChannel.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'channel_messages',
            filter: `channel_id=eq.${selectedChannel.id}`,
          },
          () => loadChannelMessages(selectedChannel.id)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (selectedDM) {
      loadDMMessages(selectedDM.user_id);

      const channel = supabase
        .channel(`dm_${selectedDM.user_id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
          },
          () => loadDMMessages(selectedDM.user_id)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedDM]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updatePresence = async (isOnline: boolean) => {
    if (!user) return;
    await supabase.from('user_presence').upsert({
      user_id: user.id,
      is_online: isOnline,
      last_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  };

  const loadChannels = async () => {
    const { data } = await supabase
      .from('chat_channels')
      .select('*')
      .eq('is_archived', false)
      .order('name');

    if (data) setChannels(data as Channel[]);
  };

  const loadUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, role')
      .neq('user_id', user?.id);

    const { data: presence } = await supabase
      .from('user_presence')
      .select('*');

    const { data: identities } = await supabase
      .from('user_identities')
      .select('user_id, internal_id');

    if (profiles) {
      const presenceMap = new Map(presence?.map(p => [p.user_id, p]) || []);
      const identitiesMap = new Map(identities?.map(i => [i.user_id, i]) || []);

      const usersWithPresence = profiles.map(p => ({
        ...p,
        internal_id: identitiesMap.get(p.user_id)?.internal_id,
        is_online: presenceMap.get(p.user_id)?.is_online || false,
        last_seen: presenceMap.get(p.user_id)?.last_seen,
      }));

      usersWithPresence.sort((a, b) => {
        if (a.is_online && !b.is_online) return -1;
        if (!a.is_online && b.is_online) return 1;
        return a.full_name.localeCompare(b.full_name);
      });

      setUsers(usersWithPresence);
    }
  };

  const loadChannelMessages = async (channelId: string) => {
    const { data } = await supabase
      .from('channel_messages')
      .select('*')
      .eq('channel_id', channelId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', senderIds);

      const { data: identities } = await supabase
        .from('user_identities')
        .select('user_id, internal_id')
        .in('user_id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const identitiesMap = new Map(identities?.map(i => [i.user_id, i]) || []);

      const enriched = data.map(msg => ({
        ...msg,
        reactions: (typeof msg.reactions === 'object' && msg.reactions !== null ? msg.reactions : {}) as Record<string, string[]>,
        sender: {
          full_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown',
          internal_id: identitiesMap.get(msg.sender_id)?.internal_id,
        },
      }));

      setMessages(enriched);
    }
  };

  const loadDMMessages = async (otherUserId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user?.id})`)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const enriched = data.map(msg => ({
        ...msg,
        reactions: {},
        sender: {
          full_name: profilesMap.get(msg.sender_id)?.full_name || 'Unknown',
        },
      }));

      setMessages(enriched);

      // Mark as read
      const unreadIds = data
        .filter(m => m.recipient_id === user?.id && !m.is_read)
        .map(m => m.id);
      
      if (unreadIds.length > 0) {
        await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (selectedChannel) {
        await supabase.from('channel_messages').insert({
          channel_id: selectedChannel.id,
          sender_id: user?.id,
          message: newMessage.trim(),
        });
      } else if (selectedDM) {
        await supabase.from('chat_messages').insert({
          sender_id: user?.id,
          recipient_id: selectedDM.user_id,
          message: newMessage.trim(),
        });
      }
      setNewMessage('');
    } catch (error: any) {
      toast({ title: 'Failed to send message', variant: 'destructive' });
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim()) return;

    try {
      await supabase.from('chat_channels').insert({
        name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: '',
        channel_type: 'public',
        created_by: user?.id,
        members: [user?.id],
      });
      setNewChannelName('');
      setShowCreateChannel(false);
      loadChannels();
      toast({ title: 'Channel created' });
    } catch (error: any) {
      toast({ title: 'Failed to create channel', variant: 'destructive' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.internal_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-background border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col">
        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-3 mt-2">
            <TabsTrigger value="channels" className="text-xs">
              <Hash className="h-3 w-3 mr-1" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="direct" className="text-xs">
              <AtSign className="h-3 w-3 mr-1" />
              Direct
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      Create Channel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Channel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Channel name..."
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                      />
                      <Button onClick={createChannel} className="w-full">
                        Create
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {filteredChannels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={selectedChannel?.id === channel.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSelectedChannel(channel);
                      setSelectedDM(null);
                    }}
                  >
                    <Hash className="h-4 w-4" />
                    {channel.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="direct" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {filteredUsers.map((u) => (
                  <Button
                    key={u.user_id}
                    variant={selectedDM?.user_id === u.user_id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSelectedDM(u);
                      setSelectedChannel(null);
                    }}
                  >
                    <Circle
                      className={`h-2 w-2 ${
                        u.is_online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                    <span className="truncate">{u.full_name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel || selectedDM ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedChannel ? (
                  <>
                    <Hash className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{selectedChannel.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedChannel.description || 'No description'}
                      </p>
                    </div>
                  </>
                ) : selectedDM ? (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(selectedDM.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedDM.full_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Circle
                          className={`h-2 w-2 ${
                            selectedDM.is_online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                          }`}
                        />
                        {selectedDM.is_online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarFallback className="text-xs">
                          {getInitials(msg.sender?.full_name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${isOwn ? 'order-2' : ''}`}>
                            {msg.sender?.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.created_at), 'h:mm a')}
                          </span>
                        </div>
                        <div
                          className={`inline-block rounded-lg px-3 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedChannel ? '#' + selectedChannel.name : selectedDM?.full_name}`}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a channel or user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantChat;
