import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Upload, Loader2, FolderPlus, Trash2, Download, RefreshCw, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BUCKET = 'library-files';

interface LibraryFile {
  name: string;
  size: number;
  created_at: string;
  id: string;
}

const DriveLibraryManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkBucket();
  }, []);

  const checkBucket = async () => {
    try {
      // Try listing root of the bucket to verify access
      const { error } = await supabase.storage.from(BUCKET).list('', { limit: 1 });
      if (!error) {
        setReady(true);
        fetchCategories();
      } else {
        toast({ title: 'Storage Error', description: error.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Could not access library storage.', variant: 'destructive' });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error) throw error;
      // Folders appear as items with metadata = null or id = null in some cases
      // We'll treat any item without a size as a folder, plus known category prefixes
      const folders = (data || [])
        .filter(item => !item.metadata?.size && item.name !== '.emptyFolderPlaceholder')
        .map(item => item.name);
      setCategories(folders);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    const folderName = newCategory.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    try {
      // Create folder by uploading a placeholder
      const { error } = await supabase.storage.from(BUCKET).upload(
        `${folderName}/.emptyFolderPlaceholder`,
        new Blob([''], { type: 'text/plain' })
      );
      if (error && !error.message.includes('already exists')) throw error;
      toast({ title: 'Category Created', description: `"${folderName}" folder created.` });
      setNewCategory('');
      fetchCategories();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create category.', variant: 'destructive' });
    }
  };

  const fetchFiles = async (category?: string) => {
    setLoading(true);
    try {
      const path = category || '';
      const { data, error } = await supabase.storage.from(BUCKET).list(path, {
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      const fileList = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder' && f.metadata?.size);
      setFiles(fileList.map(f => ({
        name: f.name,
        size: f.metadata?.size || 0,
        created_at: f.created_at || '',
        id: f.id || f.name,
      })));
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
      const file = fileList[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const folder = selectedCategory || '';
      const path = folder ? `${folder}/${Date.now()}_${safeName}` : `${Date.now()}_${safeName}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) {
        console.error(`Error uploading ${file.name}:`, error.message);
      } else {
        completed++;
      }
      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    setUploading(false);
    toast({ title: 'Upload Complete', description: `${completed}/${totalFiles} files uploaded.` });
    fetchFiles(selectedCategory || undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const path = selectedCategory ? `${selectedCategory}/${name}` : name;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete file.', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'File removed.' });
      fetchFiles(selectedCategory || undefined);
    }
  };

  const handleDownload = async (name: string) => {
    const path = selectedCategory ? `${selectedCategory}/${name}` : name;
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (error || !data) {
      toast({ title: 'Error', description: 'Failed to download.', variant: 'destructive' });
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = name.replace(/^\d+_/, '');
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
            <BookOpen className="h-6 w-6" />
            Library Manager
          </h2>
          <p className="text-muted-foreground">Upload and manage library books & documents</p>
        </div>
        {ready && (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" /> Storage Connected
          </Badge>
        )}
      </div>

      {ready && (
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
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => { setSelectedCategory(cat); fetchFiles(cat); }}
                    >
                      {cat}
                    </Badge>
                  ))}
                  <Badge
                    variant={!selectedCategory ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => { setSelectedCategory(''); fetchFiles(); }}
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
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
        </>
      )}
    </div>
  );
};

export default DriveLibraryManager;
