import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Inbox, Send, Star, Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface InternalMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  is_deleted_by_sender: boolean;
  is_deleted_by_recipient: boolean;
  created_at: string;
  read_at: string | null;
  sender?: { full_name: string };
  recipient?: { full_name: string };
}

export const InternalMailSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  
  // Compose form
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (user) {
      loadMessages();
      loadUsers();
    }
  }, [user, view]);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, role')
      .neq('user_id', user?.id);

    if (!error && data) {
      setUsers(data);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    let query = supabase
      .from('internal_messages')
      .select('*');

    if (view === 'inbox') {
      query = query
        .eq('recipient_id', user?.id)
        .eq('is_deleted_by_recipient', false);
    } else if (view === 'sent') {
      query = query
        .eq('sender_id', user?.id)
        .eq('is_deleted_by_sender', false);
    }

    const { data: messagesData, error } = await query.order('created_at', { ascending: false });

    if (!error && messagesData) {
      // Fetch sender and recipient profiles separately
      const userIds = [...new Set([
        ...messagesData.map(m => m.sender_id),
        ...messagesData.map(m => m.recipient_id)
      ])];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      const enrichedMessages = messagesData.map(msg => ({
        ...msg,
        sender: profilesMap.get(msg.sender_id),
        recipient: profilesMap.get(msg.recipient_id)
      }));
      
      setMessages(enrichedMessages as any);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!recipientId || !subject || !body) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('internal_messages').insert({
      sender_id: user?.id,
      recipient_id: recipientId,
      subject,
      body,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
      setRecipientId('');
      setSubject('');
      setBody('');
      setView('sent');
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('internal_messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', messageId);
    loadMessages();
  };

  const toggleStar = async (messageId: string, currentStarred: boolean) => {
    await supabase
      .from('internal_messages')
      .update({ is_starred: !currentStarred })
      .eq('id', messageId);
    loadMessages();
  };

  const deleteMessage = async (messageId: string) => {
    const updateField = view === 'inbox' ? 'is_deleted_by_recipient' : 'is_deleted_by_sender';
    await supabase
      .from('internal_messages')
      .update({ [updateField]: true })
      .eq('id', messageId);
    
    toast({
      title: 'Success',
      description: 'Message deleted',
    });
    setSelectedMessage(null);
    loadMessages();
  };

  return (
    <div className="flex h-[600px] gap-4">
      {/* Sidebar */}
      <div className="w-48 space-y-2">
        <Button
          onClick={() => setView('compose')}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          Compose
        </Button>
        <Button
          variant={view === 'inbox' ? 'default' : 'ghost'}
          onClick={() => setView('inbox')}
          className="w-full justify-start"
        >
          <Inbox className="mr-2 h-4 w-4" />
          Inbox
        </Button>
        <Button
          variant={view === 'sent' ? 'default' : 'ghost'}
          onClick={() => setView('sent')}
          className="w-full justify-start"
        >
          <Mail className="mr-2 h-4 w-4" />
          Sent
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {view === 'compose' ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Compose Message</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">To</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                >
                  <option value="">Select recipient...</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.full_name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="mt-1 min-h-[300px]"
                />
              </div>
              <Button onClick={sendMessage}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex gap-4 h-full">
            {/* Message list */}
            <Card className="w-1/3 p-4 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">
                {view === 'inbox' ? 'Inbox' : 'Sent'}
              </h2>
              {loading ? (
                <p>Loading...</p>
              ) : messages.length === 0 ? (
                <p className="text-muted-foreground">No messages</p>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.is_read && view === 'inbox') {
                          markAsRead(msg.id);
                        }
                      }}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedMessage?.id === msg.id
                          ? 'bg-primary text-primary-foreground'
                          : !msg.is_read && view === 'inbox'
                          ? 'bg-accent hover:bg-accent/80'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">
                          {view === 'inbox' 
                            ? msg.sender?.full_name 
                            : msg.recipient?.full_name}
                        </span>
                        {msg.is_starred && <Star className="h-4 w-4 fill-current" />}
                      </div>
                      <p className="text-sm font-medium truncate">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(msg.created_at), 'MMM dd, hh:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Message detail */}
            <Card className="flex-1 p-6 overflow-auto">
              {selectedMessage ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">{selectedMessage.subject}</h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStar(selectedMessage.id, selectedMessage.is_starred)}
                      >
                        <Star className={`h-4 w-4 ${selectedMessage.is_starred ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm">
                      <span className="font-medium">From:</span>{' '}
                      {selectedMessage.sender?.full_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">To:</span>{' '}
                      {selectedMessage.recipient?.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedMessage.created_at), 'MMMM dd, yyyy at hh:mm a')}
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a message to view
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
