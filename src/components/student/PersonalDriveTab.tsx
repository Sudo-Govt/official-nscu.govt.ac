import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Upload, Download, Trash2, Loader2, RefreshCw, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriveFile {
  name: string;
  path: string;
  size: number;
  type: string;
  modified: string;
}

interface QuotaInfo {
  quota_bytes: number;
  quota_used: number;
  quota_remaining: number;
  quota_percent: number;
}

const PersonalDriveTab = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  const getAuthHeaders = async () => {
    const session = (await supabase.auth.getSession()).data.session;
    return { Authorization: `Bearer ${session?.access_token}` };
  };

  const callDriveAPI = async (params: Record<string, string>, options?: RequestInit) => {
    const query = new URLSearchParams(params).toString();
    const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
    const headers = await getAuthHeaders();
    const resp = await fetch(url, { ...options, headers: { ...headers, ...options?.headers } });
    return resp.json();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listData, quotaData] = await Promise.all([
        callDriveAPI({ action: 'list', scope: 'user' }),
        callDriveAPI({ action: 'quota', scope: 'user' }),
      ]);
      setFiles(listData.files || []);
      setQuota(quotaData);
    } catch (err) {
      console.error('Error fetching drive data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const total = fileList.length;
    let done = 0;

    for (let i = 0; i < total; i++) {
      const formData = new FormData();
      formData.append('file', fileList[i]);
      const query = new URLSearchParams({ action: 'upload', scope: 'user' }).toString();
      const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
      const headers = await getAuthHeaders();

      try {
        const resp = await fetch(url, { method: 'POST', body: formData, headers });
        const data = await resp.json();
        if (data.errors?.length) {
          toast({ title: 'Upload Error', description: data.errors[0].error, variant: 'destructive' });
        }
        done++;
        setUploadProgress(Math.round((done / total) * 100));
      } catch (err) {
        console.error(`Upload error: ${fileList[i].name}`, err);
      }
    }

    setUploading(false);
    toast({ title: 'Upload Complete', description: `${done}/${total} files uploaded.` });
    fetchData();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Delete "${path}"?`)) return;
    try {
      await callDriveAPI({ action: 'delete', scope: 'user', path });
      toast({ title: 'Deleted' });
      fetchData();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete file.', variant: 'destructive' });
    }
  };

  const handleDownload = async (path: string, name: string) => {
    const query = new URLSearchParams({ action: 'download', scope: 'user', path }).toString();
    const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
    const headers = await getAuthHeaders();
    const resp = await fetch(url, { headers });
    const blob = await resp.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
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
      {quota && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HardDrive className="h-5 w-5" />
              My Drive Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={quota.quota_percent} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatSize(quota.quota_used)} used</span>
              <span>{formatSize(quota.quota_remaining)} remaining of {formatSize(quota.quota_bytes)}</span>
            </div>
          </CardContent>
        </Card>
      )}

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
          <Button variant="outline" size="sm" onClick={fetchData}>
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
                <div key={file.path} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)} • {file.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(file.path, file.name)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.path)}>
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
