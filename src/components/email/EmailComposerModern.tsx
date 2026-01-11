import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Email } from './EmailAppModern';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Paperclip,
  Image,
  Link2,
  Smile,
  Clock,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmailComposerModernProps {
  onClose: () => void;
  onSent: () => void;
  replyTo?: Email | null;
  fromEmail?: string;
  fromName?: string;
}

const EmailComposerModern = ({
  onClose,
  onSent,
  replyTo,
  fromEmail = 'noreply@nscu.edu.bz',
  fromName = 'NSCU University',
}: EmailComposerModernProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [to, setTo] = useState(replyTo ? replyTo.from_email : '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.size <= 25 * 1024 * 1024);
      if (newFiles.length !== files.length) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 25MB',
          variant: 'destructive',
        });
      }
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const saveDraft = async () => {
    if (!user) return;

    const body = editorRef.current?.innerHTML || '';
    
    await supabase.from('emails').insert({
      user_id: user.id,
      from_email: fromEmail,
      from_name: fromName,
      to_email: to,
      subject,
      body,
      html_body: body,
      cc: cc || null,
      bcc: bcc || null,
      email_type: 'sent',
      status: 'draft',
      is_read: true,
      is_starred: false,
      is_deleted: false,
      is_archived: false,
    });

    toast({ title: 'Draft saved' });
  };

  const sendEmail = async () => {
    if (!to) {
      toast({
        title: 'Missing recipient',
        description: 'Please enter at least one recipient',
        variant: 'destructive',
      });
      return;
    }

    if (!subject) {
      toast({
        title: 'Missing subject',
        description: 'Please enter a subject',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      const body = editorRef.current?.innerHTML || '';
      const plainText = editorRef.current?.innerText || '';

      // Prepare attachments as base64
      const attachmentData = await Promise.all(
        attachments.map(async (file) => {
          return new Promise<{ filename: string; content: string; type: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve({
                filename: file.name,
                content: base64,
                type: file.type,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const { data, error } = await supabase.functions.invoke('send-email-resend', {
        body: {
          to,
          subject,
          body: plainText,
          html_body: body,
          cc: cc || undefined,
          bcc: bcc || undefined,
          from_name: fromName,
          from_email: fromEmail,
          attachments: attachmentData.length > 0 ? attachmentData : undefined,
          save_to_db: true,
          user_id: user?.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Email sent!',
        description: 'Your message has been sent successfully',
      });

      onSent();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: 'Failed to send email',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-0 right-4 w-72 bg-card border rounded-t-lg shadow-xl cursor-pointer z-50"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded-t-lg">
          <span className="font-medium truncate">
            {subject || 'New Message'}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMaximized ? 'inset-4' : 'bottom-0 right-4 w-[550px]'} bg-card border rounded-t-lg shadow-2xl z-50 flex flex-col transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground rounded-t-lg">
        <span className="font-medium">New Message</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20" onClick={() => setIsMinimized(true)}>
            <Minus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20" onClick={() => setIsMaximized(!isMaximized)}>
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Recipients */}
      <div className="px-4 py-2 border-b space-y-2">
        <div className="flex items-center gap-2">
          <Label className="w-12 text-sm text-muted-foreground">To</Label>
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Recipients"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {!showCc && (
              <button onClick={() => setShowCc(true)} className="hover:text-foreground">Cc</button>
            )}
            {!showBcc && (
              <button onClick={() => setShowBcc(true)} className="hover:text-foreground">Bcc</button>
            )}
          </div>
        </div>

        {showCc && (
          <div className="flex items-center gap-2">
            <Label className="w-12 text-sm text-muted-foreground">Cc</Label>
            <Input
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Cc recipients"
              className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
            />
          </div>
        )}

        {showBcc && (
          <div className="flex items-center gap-2">
            <Label className="w-12 text-sm text-muted-foreground">Bcc</Label>
            <Input
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="Bcc recipients"
              className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Label className="w-12 text-sm text-muted-foreground">Subject</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-2 py-1 border-b flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-5 mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-5 mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) execCommand('createLink', url);
        }}>
          <Link2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 min-h-[200px] max-h-[400px] overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-full outline-none prose prose-sm dark:prose-invert max-w-none empty:before:content-['Compose_your_email...'] empty:before:text-muted-foreground"
          suppressContentEditableWarning
        />
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm"
              >
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button onClick={() => removeAttachment(index)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-1">
          <Button onClick={sendEmail} disabled={sending}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {}}>
                <Clock className="h-4 w-4 mr-2" />
                Schedule send
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Button variant="ghost" size="icon" onClick={saveDraft}>
            <Clock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposerModern;
