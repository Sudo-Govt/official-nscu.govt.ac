import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Send, X, Paperclip, Minimize2 } from 'lucide-react';

interface EmailComposeProps {
  onClose: () => void;
  replyTo?: {
    id: string;
    subject: string;
    from_email: string;
  };
  fromEmail: string;
  fromName: string;
}

const EmailCompose = ({ onClose, replyTo, fromEmail, fromName }: EmailComposeProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [to, setTo] = useState(replyTo?.from_email || '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(
    replyTo ? `Re: ${replyTo.subject}` : ''
  );
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const saveDraft = async () => {
    try {
      const { error } = await supabase
        .from('emails')
        .insert({
          user_id: user?.id,
          from_email: fromEmail,
          from_name: fromName,
          to_email: to,
          cc: cc || null,
          bcc: bcc || null,
          subject: subject || '(No subject)',
          body: body,
          status: 'draft',
          email_type: 'drafts',
          in_reply_to: replyTo?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your email has been saved as a draft"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    }
  };

  const sendEmail = async () => {
    if (!to || !subject) {
      toast({
        title: "Error",
        description: "Please fill in the recipient and subject",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      // First, create the email record
      const { data: emailData, error: insertError } = await supabase
        .from('emails')
        .insert({
          user_id: user?.id,
          from_email: fromEmail,
          from_name: fromName,
          to_email: to,
          cc: cc || null,
          bcc: bcc || null,
          subject: subject,
          body: body,
          status: 'draft',
          email_type: 'sent',
          in_reply_to: replyTo?.id || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Then send it via edge function
      const { error: sendError } = await supabase.functions.invoke('send-user-email', {
        body: { email_id: emailData.id }
      });

      if (sendError) throw sendError;

      toast({
        title: "Email sent",
        description: "Your email has been sent successfully"
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 bg-background/80">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle>New Message</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="w-16 text-sm">From:</Label>
              <div className="text-sm text-muted-foreground">
                {fromName} &lt;{fromEmail}&gt;
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-16 text-sm">To:</Label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCc(!showCc)}
              >
                Cc
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBcc(!showBcc)}
              >
                Bcc
              </Button>
            </div>

            {showCc && (
              <div className="flex items-center gap-2">
                <Label className="w-16 text-sm">Cc:</Label>
                <Input
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Carbon copy"
                  className="flex-1"
                />
              </div>
            )}

            {showBcc && (
              <div className="flex items-center gap-2">
                <Label className="w-16 text-sm">Bcc:</Label>
                <Input
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="Blind carbon copy"
                  className="flex-1"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Label className="w-16 text-sm">Subject:</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="flex-1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              className="min-h-[300px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveDraft}>
                Save Draft
              </Button>
              <Button onClick={sendEmail} disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCompose;