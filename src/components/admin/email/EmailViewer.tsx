import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Reply, Trash2, Star } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';

interface Email {
  id: string;
  from_email: string;
  from_name: string;
  to_email: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  is_starred: boolean;
  sent_at: string;
  received_at: string;
  created_at: string;
}

interface EmailViewerProps {
  email: Email;
  onBack: () => void;
  onReply: () => void;
}

const EmailViewer = ({ email, onBack, onReply }: EmailViewerProps) => {
  const { toast } = useToast();

  const toggleStar = async () => {
    await supabase
      .from('emails')
      .update({ is_starred: !email.is_starred })
      .eq('id', email.id);
  };

  const deleteEmail = async () => {
    try {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', email.id);

      if (error) throw error;

      toast({ title: "Success", description: "Email deleted" });
      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={toggleStar}>
          <Star
            className={`h-4 w-4 ${email.is_starred ? 'fill-yellow-500 text-yellow-500' : ''}`}
          />
        </Button>
        <Button variant="ghost" size="icon" onClick={onReply}>
          <Reply className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={deleteEmail}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{email.subject}</h2>
          <div className="flex items-start justify-between mt-4">
            <div>
              <p className="font-medium">{email.from_name || email.from_email}</p>
              <p className="text-sm text-muted-foreground">
                to: {email.to_email}
              </p>
              {email.cc && (
                <p className="text-sm text-muted-foreground">cc: {email.cc}</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {format(
                new Date(email.sent_at || email.received_at || email.created_at),
                'PPpp'
              )}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.body || '') }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailViewer;
