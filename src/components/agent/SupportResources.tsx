import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, FileText, Download, BookOpen, Video, MessageCircle, Send, Loader2 } from 'lucide-react';

interface AgentResource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  content: string | null;
  is_active: boolean;
  created_at: string;
}

const SupportResources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<AgentResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_resources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Ticket Created",
      description: "Our team will respond within 24 hours"
    });
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('agent-resources')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter resources by category
  const faqs = resources.filter(r => r.category === 'faq');
  const trainingMaterials = resources.filter(r => r.category === 'training' || r.category === 'guide');
  const videos = resources.filter(r => r.category === 'video');
  const otherResources = resources.filter(r => r.category === 'other' || !['faq', 'training', 'guide', 'video'].includes(r.category));

  const filteredFaqs = faqs.filter(faq => 
    faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allDownloadableResources = [...trainingMaterials, ...otherResources].filter(r => r.file_path);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support & Resources</h2>
        <p className="text-muted-foreground">Help center, training materials, and support tickets</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="training">
            <Video className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
          <TabsTrigger value="support">
            <MessageCircle className="h-4 w-4 mr-2" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.title}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.content || faq.description || 'No content available.'}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {!loading && filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {faqs.length === 0 ? 'No FAQs available yet. Check back later.' : 'No FAQs match your search'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Resources</CardTitle>
              <CardDescription>Essential documents and marketing materials</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : allDownloadableResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allDownloadableResources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription className="text-sm">{resource.description}</CardDescription>
                          </div>
                          <Badge variant="secondary">
                            {resource.file_type?.split('/').pop()?.toUpperCase() || 'FILE'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(resource.file_size)}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadFile(resource.file_path!, resource.file_name!)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No downloadable resources available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Videos & Materials</CardTitle>
              <CardDescription>Step-by-step tutorials and guides</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : videos.length > 0 ? (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{video.title}</div>
                          <div className="text-sm text-muted-foreground">{video.description}</div>
                        </div>
                      </div>
                      {video.file_path ? (
                        <Button 
                          variant="outline"
                          onClick={() => downloadFile(video.file_path!, video.file_name!)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      ) : video.content ? (
                        <Button variant="outline" onClick={() => window.open(video.content!, '_blank')}>
                          Watch
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No training videos available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Guidelines</CardTitle>
              <CardDescription>Important policies and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Data Protection & GDPR</div>
                  <p className="text-sm text-muted-foreground">
                    Learn about handling student data securely and compliance requirements
                  </p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Ethical Recruitment</div>
                  <p className="text-sm text-muted-foreground">
                    Guidelines for ethical student recruitment practices
                  </p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Document Verification Standards</div>
                  <p className="text-sm text-muted-foreground">
                    Standards for authenticating and verifying student documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  support@nscu.edu
                </p>
                <p className="text-xs text-muted-foreground">
                  Response time: Within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  +1 (555) 123-4567
                </p>
                <p className="text-xs text-muted-foreground">
                  Mon-Fri: 9:00 AM - 6:00 PM EST
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Available during business hours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Raise an issue with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="application">Application Support</SelectItem>
                      <SelectItem value="payment">Payment Query</SelectItem>
                      <SelectItem value="documents">Document Verification</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Brief description of the issue" />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Provide detailed information about your issue..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportResources;