import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, FileText, Download, BookOpen, Video, Search, GraduationCap, Loader2 } from 'lucide-react';

interface StudentResource {
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

const StudentResourcesView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<StudentResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('student_resources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources((data || []) as StudentResource[]);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('student-resources')
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
    faq.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allDownloadableResources = resources.filter(r => r.file_path);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Student Resources
          </h2>
          <p className="text-muted-foreground">Access guides, FAQs, and learning materials</p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Training</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none">
                          {faq.content || faq.description || 'No content available.'}
                        </div>
                        {faq.file_path && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => downloadFile(faq.file_path!, faq.file_name!)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Attachment
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No FAQs match your search.' : 'No FAQs available yet.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Downloadable Resources
              </CardTitle>
              <CardDescription>
                Access guides, documents, and study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allDownloadableResources.length > 0 ? (
                <div className="space-y-3">
                  {allDownloadableResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.description || 'No description'}
                          </p>
                          {resource.file_size && (
                            <Badge variant="outline" className="mt-1">
                              {formatFileSize(resource.file_size)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(resource.file_path!, resource.file_name!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No downloadable resources available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training Materials
              </CardTitle>
              <CardDescription>
                Access learning guides and training content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainingMaterials.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {trainingMaterials.map((material) => (
                    <Card key={material.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{material.title}</CardTitle>
                        {material.description && (
                          <CardDescription className="line-clamp-2">
                            {material.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {material.content && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            {material.content}
                          </p>
                        )}
                        {material.file_path && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(material.file_path!, material.file_name!)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No training materials available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch training videos and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video) => (
                    <Card key={video.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-base">{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {video.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {video.description}
                          </p>
                        )}
                        {video.file_path && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(video.file_path!, video.file_name!)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No video tutorials available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentResourcesView;
