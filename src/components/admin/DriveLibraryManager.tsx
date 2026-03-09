import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Upload, CheckCircle, XCircle, Loader2, FolderPlus, Trash2, Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriveFile {
  name: string;
  path: string;
  size: number;
  type: string;
  modified: string;
}

interface Category {
  name: string;
  file_count: number;
  total_size: number;
}

const DriveLibraryManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle');
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  const callDriveAPI = async (params: Record<string, string>, options?: RequestInit) => {
    const query = new URLSearchParams(params).toString();
    const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
    
    const session = (await supabase.auth.getSession()).data.session;
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    const resp = await fetch(url, { ...options, headers: { ...headers, ...options?.headers } });
    return resp.json();
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const query = new URLSearchParams({ action: 'ping' }).toString();
      const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
      const resp = await fetch(url);
      const data = await resp.json();
      
      if (data.status === 'ok') {
        setConnectionStatus('connected');
        setConnectionInfo(data);
        toast({ title: 'Connected!', description: 'Drive API is online and accessible.' });
        fetchCategories();
      } else {
        setConnectionStatus('failed');
        toast({ title: 'Connection Failed', description: data.error || 'Unknown error', variant: 'destructive' });
      }
    } catch (err) {
      setConnectionStatus('failed');
      toast({ title: 'Connection Failed', description: 'Could not reach Drive API server.', variant: 'destructive' });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await callDriveAPI({ action: 'library_categories', scope: 'library' });
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await callDriveAPI({ action: 'create_category', scope: 'library', category: newCategory.trim() });
      toast({ title: 'Category Created', description: `"${newCategory}" folder created on server.` });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create category.', variant: 'destructive' });
    }
  };

  const fetchFiles = async (category?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { action: 'list', scope: 'library' };
      if (category) params.folder = category;
      const data = await callDriveAPI(params);
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);

    const totalFiles = fileList.length;
    let completed = 0;

    for (let i = 0; i < totalFiles; i++) {
      const formData = new FormData();
      formData.append('file', fileList[i]);

      const params: Record<string, string> = { action: 'upload', scope: 'library' };
      if (selectedCategory) params.folder = selectedCategory;
      const query = new URLSearchParams(params).toString();
      const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;

      const session = (await supabase.auth.getSession()).data.session;

      try {
        await fetch(url, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      } catch (err) {
        console.error(`Error uploading ${fileList[i].name}:`, err);
      }
    }

    setUploading(false);
    toast({ title: 'Upload Complete', description: `${completed}/${totalFiles} files uploaded.` });
    fetchFiles(selectedCategory || undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Delete "${path}"?`)) return;
    try {
      await callDriveAPI({ action: 'delete', scope: 'library', path });
      toast({ title: 'Deleted', description: 'File removed from server.' });
      fetchFiles(selectedCategory || undefined);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete file.', variant: 'destructive' });
    }
  };

  const handleDownload = async (path: string, name: string) => {
    const params: Record<string, string> = { action: 'download', scope: 'library', path };
    const query = new URLSearchParams(params).toString();
    const url = `https://${projectId}.supabase.co/functions/v1/drive-api?${query}`;
    const session = (await supabase.auth.getSession()).data.session;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            Drive Library Manager
          </h2>
          <p className="text-muted-foreground">Upload and manage library books & documents on your server</p>
        </div>
      </div>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {connectionStatus === 'connected' ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5" />}
            API Connection
          </CardTitle>
          <CardDescription>Test connectivity to your Namecheap drive server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
              {connectionStatus === 'testing' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Testing...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" />Test Connection</>
              )}
            </Button>
            <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'failed' ? 'destructive' : 'secondary'}>
              {connectionStatus === 'idle' && 'Not tested'}
              {connectionStatus === 'testing' && 'Testing...'}
              {connectionStatus === 'connected' && <><CheckCircle className="h-3 w-3 mr-1" />Connected</>}
              {connectionStatus === 'failed' && <><XCircle className="h-3 w-3 mr-1" />Failed</>}
            </Badge>
          </div>
          {connectionInfo && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <p>Version: {connectionInfo.version} | Writable: {connectionInfo.storage?.writable ? 'Yes' : 'No'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {connectionStatus === 'connected' && (
        <>
          {/* Category Management */}
          <Card>
            <CardHeader>
              <CardTitle>Library Categories</CardTitle>
              <CardDescription>Organize books and documents into categories/folders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New category name (e.g., Science, Engineering)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={createCategory} disabled={!newCategory.trim()}>
                  <FolderPlus className="h-4 w-4 mr-2" />Create
                </Button>
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat.name}
                      variant={selectedCategory === cat.name ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        fetchFiles(cat.name);
                      }}
                    >
                      {cat.name} ({cat.file_count} files, {formatSize(cat.total_size)})
                    </Badge>
                  ))}
                  <Badge
                    variant={!selectedCategory ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => {
                      setSelectedCategory('');
                      fetchFiles();
                    }}
                  >
                    All / Root
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload to Library</CardTitle>
              <CardDescription>
                Single or bulk upload files. Target: {selectedCategory || 'Root folder'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Category</Label>
                <Select value={selectedCategory || 'root'} onValueChange={(v) => setSelectedCategory(v === 'root' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Root (No Category)</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Select Files (supports bulk upload)</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="mt-2 cursor-pointer"
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mp3,.wav,.epub,.txt,.csv,.zip,.rar"
                />
              </div>
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Uploading... {uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Browser */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Library Files {selectedCategory && `/ ${selectedCategory}`}</CardTitle>
                <CardDescription>{files.length} files</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchFiles(selectedCategory || undefined)}>
                <RefreshCw className="h-4 w-4 mr-2" />Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : files.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No files found. Upload some!</p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.path} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(file.size)} • {file.type}
                        </p>
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
        </>
      )}
    </div>
  );
};

export default DriveLibraryManager;
