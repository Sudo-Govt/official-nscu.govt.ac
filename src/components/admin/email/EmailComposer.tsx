import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailComposerProps {
  onClose?: () => void;
  replyTo?: {
    id: string;
    subject: string;
    from_email: string;
  };
}

const EmailComposer = ({ onClose, replyTo }: EmailComposerProps) => {
  const [to, setTo] = useState(replyTo?.from_email || '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const saveDraft = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: smtpSettings } = await supabase
        .from('smtp_settings')
        .select('from_email, from_name')
        .single();

      const { error } = await supabase.from('emails').insert({
        user_id: user.id,
        from_email: smtpSettings?.from_email || user.email || '',
        from_name: smtpSettings?.from_name || '',
        to_email: to,
        cc: cc || null,
        bcc: bcc || null,
        subject,
        body,
        status: 'draft',
        email_type: 'draft',
        in_reply_to: replyTo?.id || null,
      });

      if (error) throw error;

      toast({ title: "Success", description: "Draft saved" });
      if (onClose) onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendEmail = async () => {
    if (!to || !subject || !body) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: smtpSettings } = await supabase
        .from('smtp_settings')
        .select('from_email, from_name')
        .single();

      // Create email record
      const { data: email, error: insertError } = await supabase
        .from('emails')
        .insert({
          user_id: user.id,
          from_email: smtpSettings?.from_email || user.email || '',
          from_name: smtpSettings?.from_name || '',
          to_email: to,
          cc: cc || null,
          bcc: bcc || null,
          subject,
          body,
          status: 'draft',
          email_type: 'sent',
          in_reply_to: replyTo?.id || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send via edge function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { emailId: email.id },
      });

      if (error) throw error;

      toast({ title: "Success", description: "Email sent successfully" });
      if (onClose) onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Compose Email</CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="to">To *</Label>
          <Input
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
          />
        </div>
        <div>
          <Label htmlFor="cc">CC</Label>
          <Input
            id="cc"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="cc@example.com"
          />
        </div>
        <div>
          <Label htmlFor="bcc">BCC</Label>
          <Input
            id="bcc"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            placeholder="bcc@example.com"
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
        </div>
        <div>
          <Label htmlFor="body">Message *</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email content..."
            rows={10}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={sendEmail} disabled={sending} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send'}
          </Button>
          <Button onClick={saveDraft} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailComposer;
