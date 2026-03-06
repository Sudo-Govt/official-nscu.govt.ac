import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Video, FileText, Play, ExternalLink, AlertCircle, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoursewareFile {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description: string | null;
  created_at: string;
}

const StudyMaterialsTab = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<CoursewareFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError('Please log in to view study materials.');
        return;
      }

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/fetch-courseware?action=list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to load materials');
      }

      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Error fetching study materials:', err);
      setError(err.message || 'Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const getStreamUrl = (filePath: string) => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    return `https://${projectId}.supabase.co/functions/v1/fetch-courseware?file=${encodeURIComponent(filePath)}`;
  };

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || '';
  };

  const handleOpenDocument = async (file: CoursewareFile) => {
    const token = await getAuthHeaders();
    const url = getStreamUrl(file.file_path) + `&token_header=${token}`;
    // Open in new tab — the edge function handles auth via query for docs
    // For better security, we use a fetch + blob approach
    try {
      const res = await fetch(getStreamUrl(file.file_path), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch document');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to open document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePlayVideo = async (file: CoursewareFile) => {
    setActiveVideo(file.file_path);
  };

  const videos = files.filter((f) => f.file_type === 'video');
  const documents = files.filter((f) => f.file_type !== 'video');

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Unable to Load Materials</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchFiles} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No Study Materials Yet</h3>
          <p className="text-muted-foreground">
            Your study materials will appear here once they are assigned to you by an administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Study Materials</h2>
        <p className="text-muted-foreground">
          Access your course videos, PDFs, and documents
        </p>
      </div>

      <Tabs defaultValue={videos.length > 0 ? 'videos' : 'documents'}>
        <TabsList>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-4 space-y-4">
          {activeVideo && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <VideoPlayer filePath={activeVideo} />
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((file) => (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeVideo === file.file_path ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handlePlayVideo(file)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.file_name}</h4>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {file.description}
                        </p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        Video
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {videos.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-8">
                No video materials assigned yet.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/50">
                      <FileText className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.file_name}</h4>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {file.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline">
                          {file.file_type.toUpperCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDocument(file)}
                          className="ml-auto"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {documents.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-8">
                No documents assigned yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Authenticated video player component
const VideoPlayer = ({ filePath }: { filePath: string }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (!token) return;

        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/fetch-courseware?file=${encodeURIComponent(filePath)}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load video');
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoUrl(blobUrl);
      } catch (err) {
        console.error('Video load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [filePath]);

  if (loading) {
    return (
      <div className="aspect-video flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="aspect-video flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Failed to load video</p>
      </div>
    );
  }

  return (
    <video
      controls
      className="w-full aspect-video"
      src={videoUrl}
      autoPlay={false}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default StudyMaterialsTab;
