import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Users, 
  Search,
  Filter,
  Reply,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Application {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
  courses?: {
    course_name: string;
  };
}

interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  message: string;
  attachment_url?: string;
  attachment_name?: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessagingSystem = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [messagingDialogOpen, setMessagingDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedApplication) {
      fetchMessages(selectedApplication.id);
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select(`
          id,
          application_number,
          first_name,
          last_name,
          email,
          status,
          created_at,
          courses (course_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async (applicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedApplication || (!newMessage.trim() && !attachment)) {
      toast({
        title: "Error",
        description: "Please enter a message or attach a file",
        variant: "destructive"
      });
      return;
    }

    setSending(true);

    try {
      let attachmentUrl = null;
      let attachmentName = null;

      // Upload attachment if present
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `admin-messages/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('student-documents')
          .upload(filePath, attachment);

        if (uploadError) throw uploadError;

        attachmentUrl = filePath;
        attachmentName = attachment.name;
      }

      // Send message
      const { error: messageError } = await supabase
        .from('agent_messages')
        .insert({
          application_id: selectedApplication.id,
          sender_id: user?.id,
          message: newMessage.trim() || `Sent attachment: ${attachmentName}`,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName
        });

      if (messageError) throw messageError;

      // Clear form
      setNewMessage('');
      setAttachment(null);

      // Refresh messages
      await fetchMessages(selectedApplication.id);

      toast({
        title: "Success",
        description: "Message sent successfully"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleOpenMessaging = (application: Application) => {
    setSelectedApplication(application);
    setMessagingDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Under Review</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Admin Messaging System</CardTitle>
                <CardDescription>Communicate with students about their applications</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="pending">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {application.first_name} {application.last_name}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <p><strong>Application #:</strong> {application.application_number}</p>
                        <p><strong>Email:</strong> {application.email}</p>
                      </div>
                      <div>
                        <p><strong>Course:</strong> {application.courses?.course_name || 'N/A'}</p>
                        <p><strong>Submitted:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleOpenMessaging(application)}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message Student
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No applications found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={messagingDialogOpen} onOpenChange={setMessagingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Messaging - {selectedApplication?.first_name} {selectedApplication?.last_name}
            </DialogTitle>
            <DialogDescription>
              Application #{selectedApplication?.application_number} • {selectedApplication?.courses?.course_name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-[60vh]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted/20">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender_id === user?.id ? 'You' : 'Student'}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        {message.attachment_url && (
                          <div className="mt-2 p-2 rounded bg-muted/20 border">
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{message.attachment_name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="space-y-3 border-t pt-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to the student..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="attachment"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Label htmlFor="attachment" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach File
                        </span>
                      </Button>
                    </Label>
                  </div>
                  {attachment && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      <span>{attachment.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttachment(null)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>

                <Button onClick={handleSendMessage} disabled={sending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessagingSystem;