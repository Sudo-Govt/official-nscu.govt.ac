import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Award, GraduationCap, Calendar, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface SharedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  title: string;
  description: string | null;
  created_at: string;
  expires_at: string | null;
}

const FILE_CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  certificate: Award,
  transcript: GraduationCap,
  document: FileText,
  letter: FileText,
  report: FileText,
  other: FileText,
};

const MySharedFiles: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchMyFiles();
    }
  }, [user?.id]);

  const fetchMyFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_shared_files')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out expired files
      const now = new Date();
      const activeFiles = (data || []).filter((file: SharedFile) => {
        if (!file.expires_at) return true;
        return new Date(file.expires_at) > now;
      });

      setFiles(activeFiles as SharedFile[]);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: SharedFile) => {
    setDownloading(file.id);
    try {
      const { data, error } = await supabase.storage
        .from('user-shared-files')
        .download(file.file_path);

      if (error) throw error;

      // Update download count
      await supabase
        .from('user_shared_files')
        .update({ 
          download_count: (files.find(f => f.id === file.id) as any)?.download_count + 1 || 1,
          last_downloaded_at: new Date().toISOString()
        })
        .eq('id', file.id);

      // Trigger browser download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Downloaded',
        description: `${file.title} downloaded successfully`,
      });
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive',
      });
    } finally {
      setDownloading(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      certificate: 'Certificate',
      transcript: 'Transcript',
      document: 'Document',
      letter: 'Letter',
      report: 'Report',
      other: 'Other',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          My Shared Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No files have been shared with you yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {files.map((file) => {
                const IconComponent = FILE_CATEGORY_ICONS[file.category] || FileText;
                return (
                  <Card key={file.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-md bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{file.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{file.file_name}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary">{getCategoryLabel(file.category)}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.file_size)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(file.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          {file.description && (
                            <p className="text-sm text-muted-foreground mt-2">{file.description}</p>
                          )}
                          {file.expires_at && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Expires: {format(new Date(file.expires_at), 'MMM d, yyyy')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(file)}
                        disabled={downloading === file.id}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading === file.id ? 'Downloading...' : 'Download'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MySharedFiles;
