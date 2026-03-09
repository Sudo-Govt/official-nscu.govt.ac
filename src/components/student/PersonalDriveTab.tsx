import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Upload, Download, Trash2, Loader2, RefreshCw, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BUCKET = 'personal-drives';
const QUOTA_BYTES = 100 * 1024 * 1024; // 100MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface DriveFile {
  name: string;
  size: number;
  created_at: string;
  id: string;
}

const PersonalDriveTab = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [usedBytes, setUsedBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list(userId, {
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      const fileList = (data || []).filter(f => f.name !== '.emptyFolderPlaceholder');
      setFiles(fileList.map(f => ({
        name: f.name,
        size: f.metadata?.size || 0,
        created_at: f.created_at || '',
        id: f.id || f.name,
      })));
      const totalUsed = fileList.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
      setUsedBytes(totalUsed);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchFiles();
  }, [userId, fetchFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !userId) return;
    setUploading(true);
    setUploadProgress(0);

    const total = fileList.length;
    let done = 0;

    for (let i = 0; i < total; i++) {
      const file = fileList[i];

      if (file.size > MAX_FILE_SIZE) {
        toast({ title: 'File too large', description: `${file.name} exceeds 50MB limit.`, variant: 'destructive' });
        continue;
      }

      if (usedBytes + file.size > QUOTA_BYTES) {
        toast({ title: 'Quota exceeded', description: `Not enough space for ${file.name}.`, variant: 'destructive' });
        break;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId}/${Date.now()}_${safeName}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) {
        toast({ title: 'Upload Error', description: error.message, variant: 'destructive' });
      } else {
        done++;
        setUsedBytes(prev => prev + file.size);
      }
      setUploadProgress(Math.round(((i + 1) / total) * 100));
    }

    setUploading(false);
    if (done > 0) toast({ title: 'Upload Complete', description: `${done}/${total} files uploaded.` });
    fetchFiles();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (name: string) => {
    if (!userId || !confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([`${userId}/${name}`]);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete file.', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted' });
      fetchFiles();
    }
  };

  const handleDownload = async (name: string) => {
    if (!userId) return;
    const { data, error } = await supabase.storage.from(BUCKET).download(`${userId}/${name}`);
    if (error || !data) {
      toast({ title: 'Error', description: 'Failed to download file.', variant: 'destructive' });
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    // Strip the timestamp prefix for display name
    const displayName = name.replace(/^\d+_/, '');
    a.download = displayName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const quotaPercent = Math.min(100, Math.round((usedBytes / QUOTA_BYTES) * 100));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quota Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5" />
            My Drive Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={quotaPercent} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatSize(usedBytes)} used</span>
            <span>{formatSize(Math.max(0, QUOTA_BYTES - usedBytes))} remaining of {formatSize(QUOTA_BYTES)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upload Files</CardTitle>
          <CardDescription>Max 50MB per file • 100MB total quota</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            className="cursor-pointer"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
          />
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">My Files</CardTitle>
            <CardDescription>{files.length} files</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchFiles}>
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No files yet. Upload your first document!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name.replace(/^\d+_/, '')}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(file.name)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.name)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDriveTab;
