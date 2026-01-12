import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Send, Paperclip, FileText, ChevronDown, ChevronUp,
  Bold, Italic, Underline, List, ListOrdered, AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InternalMessage } from './InternalMessagingApp';

interface ComposeMessageProps {
  onClose: () => void;
  onSent: () => void;
  replyTo: InternalMessage | null;
  currentUserId: string;
}

interface Recipient {
  user_id: string;
  full_name: string;
  internal_id: string;
  department: string;
  role: string;
}

interface SystemDocument {
  id: string;
  title: string;
  document_type: string;
  file_path: string;
}

export const ComposeMessage: React.FC<ComposeMessageProps> = ({
  onClose,
  onSent,
  replyTo,
  currentUserId,
}) => {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('normal');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [documentRefs, setDocumentRefs] = useState<SystemDocument[]>([]);
  const [systemDocuments, setSystemDocuments] = useState<SystemDocument[]>([]);
  const [sending, setSending] = useState(false);
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [docRefOpen, setDocRefOpen] = useState(false);

  useEffect(() => {
    loadRecipients();
    loadSystemDocuments();
    
    if (replyTo) {
      setSelectedRecipient({
        user_id: replyTo.sender_id,
        full_name: replyTo.sender?.full_name || '',
        internal_id: replyTo.sender?.internal_id || '',
        department: '',
        role: '',
      });
      setSubject(`Re: ${replyTo.subject}`);
      setBody(`\n\n---\nOn ${new Date(replyTo.created_at).toLocaleString()}, ${replyTo.sender?.full_name} wrote:\n${replyTo.body}`);
    }
  }, [replyTo]);

  const loadRecipients = async () => {
    // Get all users with their identities
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, role')
      .neq('user_id', currentUserId);

    const { data: identities } = await supabase
      .from('user_identities')
      .select('user_id, internal_id, department');

    if (profiles) {
      const identitiesMap = new Map(identities?.map(i => [i.user_id, i]) || []);
      
      const recipientList = profiles.map(p => ({
        user_id: p.user_id,
        full_name: p.full_name,
        internal_id: identitiesMap.get(p.user_id)?.internal_id || '',
        department: identitiesMap.get(p.user_id)?.department || '',
        role: p.role || '',
      }));

      setRecipients(recipientList);
    }
  };

  const loadSystemDocuments = async () => {
    // Load documents that can be referenced
    const { data } = await supabase
      .from('documents_generated')
      .select('id, document_type, file_path')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setSystemDocuments(data.map(d => ({
        id: d.id,
        title: d.document_type,
        document_type: d.document_type,
        file_path: d.file_path,
      })));
    }
  };

  const handleSend = async () => {
    if (!selectedRecipient) {
      toast({ title: 'Please select a recipient', variant: 'destructive' });
      return;
    }

    if (!subject.trim()) {
      toast({ title: 'Please enter a subject', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      // Create thread_id if replying
      const threadId = replyTo?.thread_id || (replyTo ? crypto.randomUUID() : null);

      // Insert message
      const { data: newMessage, error } = await supabase
        .from('internal_messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: selectedRecipient.user_id,
          subject,
          body,
          priority,
          thread_id: threadId,
          reply_to_id: replyTo?.id || null,
          cc,
          bcc,
          document_references: documentRefs.map(d => ({ id: d.id, title: d.title, type: d.document_type })),
        })
        .select()
        .single();

      if (error) throw error;

      // Upload attachments
      for (const file of attachments) {
        const filePath = `${currentUserId}/${Date.now()}_${file.name}`;
        await supabase.storage.from('internal-attachments').upload(filePath, file);
        
        await supabase.from('internal_message_attachments').insert({
          message_id: newMessage.id,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        });
      }

      // Update original message thread_id if this is first reply
      if (replyTo && !replyTo.thread_id) {
        await supabase
          .from('internal_messages')
          .update({ thread_id: threadId })
          .eq('id', replyTo.id);
      }

      onSent();
    } catch (error: any) {
      toast({ title: 'Failed to send message', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedRecipient) {
      toast({ title: 'Please select a recipient', variant: 'destructive' });
      return;
    }

    try {
      await supabase.from('internal_messages').insert({
        sender_id: currentUserId,
        recipient_id: selectedRecipient.user_id,
        subject,
        body,
        priority,
        is_draft: true,
        document_references: documentRefs.map(d => ({ id: d.id, title: d.title })),
      });

      toast({ title: 'Draft saved' });
      onClose();
    } catch (error: any) {
      toast({ title: 'Failed to save draft', description: error.message, variant: 'destructive' });
    }
  };

  const addDocumentRef = (doc: SystemDocument) => {
    if (!documentRefs.find(d => d.id === doc.id)) {
      setDocumentRefs([...documentRefs, doc]);
    }
    setDocRefOpen(false);
  };

  const removeDocumentRef = (docId: string) => {
    setDocumentRefs(documentRefs.filter(d => d.id !== docId));
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">
          {replyTo ? 'Reply' : 'New Message'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* To */}
          <div className="flex items-center gap-4">
            <Label className="w-16">To:</Label>
            <Popover open={recipientOpen} onOpenChange={setRecipientOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start font-normal">
                  {selectedRecipient ? (
                    <span>
                      {selectedRecipient.full_name} 
                      <span className="text-muted-foreground ml-2">
                        &lt;{selectedRecipient.internal_id}&gt;
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select recipient...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {recipients.map((r) => (
                        <CommandItem
                          key={r.user_id}
                          onSelect={() => {
                            setSelectedRecipient(r);
                            setRecipientOpen(false);
                          }}
                        >
                          <div>
                            <p className="font-medium">{r.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.internal_id} • {r.role}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCcBcc(!showCcBcc)}
            >
              Cc/Bcc
              {showCcBcc ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          </div>

          {/* Cc/Bcc */}
          {showCcBcc && (
            <>
              <div className="flex items-center gap-4">
                <Label className="w-16">Cc:</Label>
                <Input
                  placeholder="Add Cc recipients..."
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-16">Bcc:</Label>
                <Input
                  placeholder="Add Bcc recipients..."
                  className="flex-1"
                />
              </div>
            </>
          )}

          {/* Subject */}
          <div className="flex items-center gap-4">
            <Label className="w-16">Subject:</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="flex-1"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
            <Label className="w-16">Priority:</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    High
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[300px]"
          />

          {/* Document References */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document References
              </Label>
              <Popover open={docRefOpen} onOpenChange={setDocRefOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add Document
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search documents..." />
                    <CommandList>
                      <CommandEmpty>No documents found.</CommandEmpty>
                      <CommandGroup>
                        {systemDocuments.map((doc) => (
                          <CommandItem
                            key={doc.id}
                            onSelect={() => addDocumentRef(doc)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {doc.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {documentRefs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {documentRefs.map((doc) => (
                  <Badge key={doc.id} variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    {doc.title}
                    <button onClick={() => removeDocumentRef(doc.id)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </Label>
              <label>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachments([...attachments, ...Array.from(e.target.files)]);
                    }
                  }}
                />
                <Button variant="outline" size="sm" asChild>
                  <span>Add File</span>
                </Button>
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    <Paperclip className="h-3 w-3" />
                    {file.name}
                    <button onClick={() => setAttachments(attachments.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t flex items-center justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button onClick={handleSend} disabled={sending} className="gap-2">
          <Send className="h-4 w-4" />
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};
