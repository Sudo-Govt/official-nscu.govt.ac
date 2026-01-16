import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Edit, Trash2, Save, X, MessageSquare, Users, 
  Settings, Eye, Circle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CTAButton {
  id: string;
  title: string;
  icon: string;
  description: string | null;
  action_type: string;
  action_value: string;
  sort_order: number;
  is_active: boolean;
}

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
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
}

const ICON_OPTIONS = [
  'Network', 'Heart', 'Briefcase', 'FileText', 'MessageCircle',
  'Users', 'Calendar', 'Globe', 'Award', 'Coffee', 'BookOpen',
  'Mail', 'User', 'DollarSign', 'Settings', 'GraduationCap'
];

const AlumniManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('cta');
  
  // CTA State
  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([]);
  const [editingCTA, setEditingCTA] = useState<CTAButton | null>(null);
  const [isAddingCTA, setIsAddingCTA] = useState(false);
  const [newCTA, setNewCTA] = useState<Partial<CTAButton>>({
    title: '',
    icon: 'Network',
    description: '',
    action_type: 'tab',
    action_value: '',
    sort_order: 0,
    is_active: true
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  useEffect(() => {
    fetchCTAButtons();
  }, []);

  useEffect(() => {
    if (activeTab === 'chatroom') {
      fetchChatData();
    }
  }, [activeTab]);

  const fetchCTAButtons = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_cta_buttons')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCtaButtons(data || []);
    } catch (error) {
      console.error('Error fetching CTA buttons:', error);
    }
  };

  const fetchChatData = async () => {
    setIsLoadingChat(true);
    try {
      // Fetch all chat messages (including deleted for admin)
      const { data: msgs, error: msgsError } = await supabase
        .from('alumni_chat_room')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (msgsError) throw msgsError;

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

      setChatMessages(msgs?.map(m => ({ ...m, user_name: names[m.user_id] || 'Alumni' })) || []);

      // Fetch online users
      const { data: presence } = await supabase
        .from('alumni_chat_presence')
        .select('*');

      const presenceUserIds = presence?.map(p => p.user_id) || [];
      const { data: presenceProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', presenceUserIds);

      const presenceNames: Record<string, string> = {};
      presenceProfiles?.forEach(p => {
        presenceNames[p.user_id] = p.full_name || 'Alumni';
      });

      setOnlineUsers(presence?.map(p => ({
        user_id: p.user_id,
        user_name: presenceNames[p.user_id] || 'Alumni',
        is_online: p.is_online,
        last_seen: p.last_seen
      })) || []);

      // Fetch private messages
      const { data: pms } = await supabase
        .from('alumni_private_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const pmUserIds = [...new Set([...(pms?.map(p => p.sender_id) || []), ...(pms?.map(p => p.recipient_id) || [])])];
      const { data: pmProfiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', pmUserIds);

      const pmNames: Record<string, string> = {};
      pmProfiles?.forEach(p => {
        pmNames[p.user_id] = p.full_name || 'Alumni';
      });

      setPrivateMessages(pms?.map(p => ({
        ...p,
        sender_name: pmNames[p.sender_id] || 'Alumni',
        recipient_name: pmNames[p.recipient_id] || 'Alumni'
      })) || []);

    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const saveCTA = async () => {
    if (!newCTA.title || !newCTA.action_value) {
      toast({
        title: "Error",
        description: "Title and action value are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('alumni_cta_buttons')
        .insert({
          title: newCTA.title,
          icon: newCTA.icon || 'Network',
          description: newCTA.description || null,
          action_type: newCTA.action_type || 'tab',
          action_value: newCTA.action_value,
          sort_order: newCTA.sort_order || ctaButtons.length,
          is_active: newCTA.is_active ?? true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "CTA button added successfully"
      });
      
      setIsAddingCTA(false);
      setNewCTA({
        title: '',
        icon: 'Network',
        description: '',
        action_type: 'tab',
        action_value: '',
        sort_order: 0,
        is_active: true
      });
      fetchCTAButtons();
    } catch (error) {
      console.error('Error saving CTA:', error);
      toast({
        title: "Error",
        description: "Failed to save CTA button",
        variant: "destructive"
      });
    }
  };

  const updateCTA = async () => {
    if (!editingCTA) return;

    try {
      const { error } = await supabase
        .from('alumni_cta_buttons')
        .update({
          title: editingCTA.title,
          icon: editingCTA.icon,
          description: editingCTA.description,
          action_type: editingCTA.action_type,
          action_value: editingCTA.action_value,
          sort_order: editingCTA.sort_order,
          is_active: editingCTA.is_active
        })
        .eq('id', editingCTA.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "CTA button updated successfully"
      });
      
      setEditingCTA(null);
      fetchCTAButtons();
    } catch (error) {
      console.error('Error updating CTA:', error);
      toast({
        title: "Error",
        description: "Failed to update CTA button",
        variant: "destructive"
      });
    }
  };

  const deleteCTA = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alumni_cta_buttons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "CTA button deleted successfully"
      });
      
      fetchCTAButtons();
    } catch (error) {
      console.error('Error deleting CTA:', error);
      toast({
        title: "Error",
        description: "Failed to delete CTA button",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alumni_chat_room')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully"
      });
      
      fetchChatData();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const removeUserFromChat = async (userId: string) => {
    try {
      // Mark all messages as deleted
      await supabase
        .from('alumni_chat_room')
        .update({ is_deleted: true })
        .eq('user_id', userId);

      // Remove presence
      await supabase
        .from('alumni_chat_presence')
        .delete()
        .eq('user_id', userId);

      toast({
        title: "Success",
        description: "User removed from chat and all their messages deleted"
      });
      
      fetchChatData();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive"
      });
    }
  };

  const deletePrivateMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alumni_private_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Private message deleted"
      });
      
      fetchChatData();
    } catch (error) {
      console.error('Error deleting PM:', error);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alumni Management</h2>
          <p className="text-muted-foreground">Manage alumni dashboard CTAs and chat room</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cta" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            CTA Buttons
          </TabsTrigger>
          <TabsTrigger value="chatroom" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Room Admin
          </TabsTrigger>
        </TabsList>

        {/* CTA Management Tab */}
        <TabsContent value="cta" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quick Action Buttons</CardTitle>
                <CardDescription>Manage the CTA buttons shown on Alumni Dashboard</CardDescription>
              </div>
              <Button onClick={() => setIsAddingCTA(true)} disabled={isAddingCTA}>
                <Plus className="h-4 w-4 mr-2" />
                Add CTA
              </Button>
            </CardHeader>
            <CardContent>
              {/* Add New CTA Form */}
              {isAddingCTA && (
                <Card className="mb-4 border-dashed">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newCTA.title}
                          onChange={(e) => setNewCTA({ ...newCTA, title: e.target.value })}
                          placeholder="Button title"
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={newCTA.icon}
                          onValueChange={(value) => setNewCTA({ ...newCTA, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map(icon => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Action Type</Label>
                        <Select
                          value={newCTA.action_type}
                          onValueChange={(value) => setNewCTA({ ...newCTA, action_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tab">Switch Tab</SelectItem>
                            <SelectItem value="link">External Link</SelectItem>
                            <SelectItem value="toast">Show Toast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Action Value</Label>
                        <Input
                          value={newCTA.action_value}
                          onChange={(e) => setNewCTA({ ...newCTA, action_value: e.target.value })}
                          placeholder="Tab name or URL"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={newCTA.description || ''}
                          onChange={(e) => setNewCTA({ ...newCTA, description: e.target.value })}
                          placeholder="Button description"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          type="number"
                          value={newCTA.sort_order}
                          onChange={(e) => setNewCTA({ ...newCTA, sort_order: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={newCTA.is_active}
                          onCheckedChange={(checked) => setNewCTA({ ...newCTA, is_active: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={saveCTA}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingCTA(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ctaButtons.map((cta) => (
                    <TableRow key={cta.id}>
                      {editingCTA?.id === cta.id ? (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              value={editingCTA.sort_order}
                              onChange={(e) => setEditingCTA({ ...editingCTA, sort_order: parseInt(e.target.value) })}
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editingCTA.title}
                              onChange={(e) => setEditingCTA({ ...editingCTA, title: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editingCTA.icon}
                              onValueChange={(value) => setEditingCTA({ ...editingCTA, icon: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ICON_OPTIONS.map(icon => (
                                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select
                                value={editingCTA.action_type}
                                onValueChange={(value) => setEditingCTA({ ...editingCTA, action_type: value })}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tab">Tab</SelectItem>
                                  <SelectItem value="link">Link</SelectItem>
                                  <SelectItem value="toast">Toast</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={editingCTA.action_value}
                                onChange={(e) => setEditingCTA({ ...editingCTA, action_value: e.target.value })}
                                className="w-32"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={editingCTA.is_active}
                              onCheckedChange={(checked) => setEditingCTA({ ...editingCTA, is_active: checked })}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={updateCTA}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCTA(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{cta.sort_order}</TableCell>
                          <TableCell className="font-medium">{cta.title}</TableCell>
                          <TableCell>{cta.icon}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{cta.action_type}</Badge>
                            <span className="ml-2 text-sm text-muted-foreground">{cta.action_value}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={cta.is_active ? "default" : "secondary"}>
                              {cta.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingCTA(cta)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete CTA Button?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the "{cta.title}" button.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteCTA(cta.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Room Admin Tab */}
        <TabsContent value="chatroom" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={fetchChatData} disabled={isLoadingChat}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingChat ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {onlineUsers.map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Circle className={`h-3 w-3 ${user.is_online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                          <span className="text-sm">{user.user_name}</span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove User from Chat?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {user.user_name} from the chat and delete all their messages.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeUserFromChat(user.user_id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Messages ({chatMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex items-start justify-between p-2 border rounded ${msg.is_deleted ? 'bg-destructive/10 border-destructive/30' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{msg.user_name}</span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(msg.created_at)}</span>
                            {msg.is_deleted && <Badge variant="destructive" className="text-xs">Deleted</Badge>}
                          </div>
                          <p className="text-sm mt-1">{msg.message}</p>
                        </div>
                        {!msg.is_deleted && (
                          <Button size="sm" variant="ghost" onClick={() => deleteMessage(msg.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Private Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Private Messages ({privateMessages.length})
              </CardTitle>
              <CardDescription>All private messages between alumni (admin view)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {privateMessages.map((pm) => (
                      <TableRow key={pm.id}>
                        <TableCell className="font-medium">{pm.sender_name}</TableCell>
                        <TableCell>{pm.recipient_name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{pm.message}</TableCell>
                        <TableCell className="text-xs">{formatDateTime(pm.created_at)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => deletePrivateMessage(pm.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlumniManagement;