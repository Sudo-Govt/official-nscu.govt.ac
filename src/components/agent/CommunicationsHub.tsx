import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Mail, Phone, Send, Bell, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Communication {
  id: string;
  subject: string;
  message: string;
  message_type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  sender_type: string;
  application: {
    application_number: string;
    first_name: string;
    last_name: string;
  };
}

const emailTemplates = [
  { id: 'offer_letter', name: 'Offer Letter Notification', subject: 'Your NSCU Offer Letter' },
  { id: 'admission_confirm', name: 'Admission Confirmation', subject: 'Admission Confirmed - Welcome to NSCU' },
  { id: 'payment_reminder', name: 'Payment Reminder', subject: 'Fee Payment Reminder' },
  { id: 'document_request', name: 'Document Request', subject: 'Additional Documents Required' },
  { id: 'interview_schedule', name: 'Interview Schedule', subject: 'Interview Invitation' }
];

const CommunicationsHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    fetchCommunications();
  }, [user]);

  const fetchCommunications = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const { data, error } = await supabase
        .from('agent_communications')
        .select(`
          *,
          application:student_applications(
            application_number,
            first_name,
            last_name
          )
        `)
        .eq('agent_id', agentProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge variant="outline" className="border-orange-500 text-orange-500">High</Badge>;
      case 'normal': return <Badge variant="secondary">Normal</Badge>;
      default: return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <Phone className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>Loading communications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communications Hub</h2>
          <p className="text-muted-foreground">Messages, announcements, and notifications</p>
        </div>
        <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            <ComposeMessageForm onSuccess={() => setShowNewMessage(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c => !c.is_read).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {communications.filter(c => c.priority === 'urgent').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c => {
                const date = new Date(c.created_at);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Messages</CardTitle>
              <CardDescription>Communication history with students and administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div 
                    key={comm.id} 
                    className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${!comm.is_read ? 'bg-muted/20 border-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMessageTypeIcon(comm.message_type)}
                        <div>
                          <div className="font-medium">{comm.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {comm.application ? 
                              `${comm.application.first_name} ${comm.application.last_name} - ${comm.application.application_number}` :
                              'NSCU Administration'
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(comm.priority)}
                        {!comm.is_read && <Badge>New</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{comm.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(comm.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))}

                {communications.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>University Announcements</CardTitle>
              <CardDescription>Important updates and notifications from NSCU</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">New Intake Dates Announced</div>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Spring 2025 intake applications are now open. Deadline: March 15, 2025
                  </p>
                  <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Document Verification Updates</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    New AI-powered document verification system now active for faster processing
                  </p>
                  <p className="text-xs text-muted-foreground">Posted 1 day ago</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Commission Structure Update</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Updated commission rates effective from next month. Check your profile for details.
                  </p>
                  <p className="text-xs text-muted-foreground">Posted 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Pre-configured templates for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Send via WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ComposeMessageForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();
      
      if (agentProfile) {
        const { data } = await supabase
          .from('student_applications')
          .select('id, first_name, last_name, application_number')
          .eq('agent_id', agentProfile.id)
          .order('created_at', { ascending: false });
        
        setApplications(data || []);
      }
    };
    fetchApplications();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user?.user_id)
        .single();

      const { error } = await supabase
        .from('agent_communications')
        .insert({
          agent_id: agentProfile?.id,
          application_id: selectedApplication || null,
          subject,
          message,
          message_type: messageType,
          sender_type: 'agent',
          priority: 'normal',
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been delivered successfully"
      });
      onSuccess();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Message Type</Label>
        <Select value={messageType} onValueChange={setMessageType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="notification">Internal Notification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>To (Student Application)</Label>
        <Select value={selectedApplication} onValueChange={setSelectedApplication}>
          <SelectTrigger>
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Students</SelectItem>
            {applications.map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.first_name} {app.last_name} ({app.application_number})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Subject</Label>
        <Input 
          placeholder="Message subject" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <Label>Message</Label>
        <Textarea 
          placeholder="Type your message here..." 
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default CommunicationsHub;
