import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    id: string;
    application_number: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  onMessageSent: () => void;
}

const MessageDialog = ({ open, onOpenChange, application, onMessageSent }: MessageDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      setAttachment(file);
    }
  };

  const uploadAttachment = async (file: File): Promise<{ url: string; name: string } | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('student-documents')
        .upload(`messages/${fileName}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('student-documents')
        .getPublicUrl(data.path);

      return { url: publicUrl, name: file.name };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setLoading(true);
    try {
      let attachmentUrl = null;
      let attachmentName = null;

      if (attachment) {
        const uploadResult = await uploadAttachment(attachment);
        if (uploadResult) {
          attachmentUrl = uploadResult.url;
          attachmentName = uploadResult.name;
        } else {
          toast({
            title: "Upload failed",
            description: "Failed to upload attachment. Message will be sent without attachment.",
            variant: "destructive"
          });
        }
      }

      const { error } = await supabase
        .from('agent_messages')
        .insert({
          application_id: application.id,
          sender_id: user.user_id,
          message: message.trim(),
          attachment_url: attachmentUrl,
          attachment_name: attachmentName
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent to the student"
      });

      setMessage('');
      setAttachment(null);
      onMessageSent();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Message to Student</DialogTitle>
          <DialogDescription>
            Send a message to {application.first_name} {application.last_name} ({application.application_number})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachment')?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="h-4 w-4" />
                {attachment ? 'Change File' : 'Attach File'}
              </Button>
              {attachment && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAttachment(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;