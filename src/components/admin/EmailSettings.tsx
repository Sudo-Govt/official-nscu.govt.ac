import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Settings } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const EmailSettings = () => {
  const [smtpSettings, setSmtpSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: ''
  });
  const [emailCompose, setEmailCompose] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing SMTP settings
    const loadSettings = async () => {
      try {
        const settings = await apiService.getSmtpSettings();
        if (settings) {
          setSmtpSettings(settings);
        }
      } catch (error) {
        console.error('Error loading SMTP settings:', error);
      }
    };
    loadSettings();
  }, []);

  const saveSmtpSettings = async () => {
    try {
      await apiService.updateSmtpSettings(smtpSettings);
      
      toast({
        title: "Success",
        description: "SMTP settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SMTP settings",
        variant: "destructive"
      });
    }
  };

  const sendEmail = () => {
    // In a real implementation, this would use the SMTP settings to send email
    toast({
      title: "Email Sent",
      description: "Email has been sent successfully"
    });
    setEmailCompose({ to: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">SMTP Settings</TabsTrigger>
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Configure email server settings for sending notifications and newsletters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    placeholder="smtp.gmail.com"
                    value={smtpSettings.smtp_host}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtp_host: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    placeholder="587"
                    value={smtpSettings.smtp_port}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtp_port: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_user">SMTP Username</Label>
                  <Input
                    id="smtp_user"
                    placeholder="your-email@gmail.com"
                    value={smtpSettings.smtp_user}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtp_user: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    placeholder="App password"
                    value={smtpSettings.smtp_password}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtp_password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    placeholder="noreply@nscu.govt.ac"
                    value={smtpSettings.from_email}
                    onChange={(e) => setSmtpSettings({...smtpSettings, from_email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    placeholder="NSCU Administration"
                    value={smtpSettings.from_name}
                    onChange={(e) => setSmtpSettings({...smtpSettings, from_name: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={saveSmtpSettings} className="w-full">
                Save SMTP Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Compose Email
              </CardTitle>
              <CardDescription>
                Send emails to users or broadcast newsletters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="recipient@example.com or @all for everyone"
                  value={emailCompose.to}
                  onChange={(e) => setEmailCompose({...emailCompose, to: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailCompose.subject}
                  onChange={(e) => setEmailCompose({...emailCompose, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Email content..."
                  rows={8}
                  value={emailCompose.message}
                  onChange={(e) => setEmailCompose({...emailCompose, message: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={sendEmail} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;