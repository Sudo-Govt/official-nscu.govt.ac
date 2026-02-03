import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Trash2, Download, Share2, Calendar, Award, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SharedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  title: string;
  description: string | null;
  shared_by: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  download_count: number | null;
}

interface UserFileSharingProps {
  userId: string;
  userName: string;
  userRole: string;
}

const FILE_CATEGORIES = [
  { value: 'certificate', label: 'Certificate', icon: Award },
  { value: 'transcript', label: 'Transcript', icon: GraduationCap },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'letter', label: 'Letter', icon: FileText },
  { value: 'report', label: 'Report', icon: FileText },
  { value: 'other', label: 'Other', icon: FileText },
];

const UserFileSharing: React.FC<UserFileSharingProps> = ({ userId, userName, userRole }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('document');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    fetchSharedFiles();
  }, [userId]);

  const fetchSharedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_shared_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles((data as SharedFile[]) || []);
    } catch (error) {
      console.error('Error fetching shared files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast({
        title: 'Error',
        description: 'Please select a file and provide a title',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload to storage - organize by target user ID
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${uploadFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-shared-files')
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('user_shared_files')
        .insert({
          user_id: userId,
          file_name: uploadFile.name,
          file_path: fileName,
          file_type: uploadFile.type || fileExt,
          file_size: uploadFile.size,
          category: uploadCategory,
          title: uploadTitle,
          description: uploadDescription || null,
          shared_by: user.id,
          expires_at: expiresAt || null,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: `File shared with ${userName}`,
      });

      // Reset form and refresh
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadCategory('document');
      setExpiresAt('');
      setIsUploadDialogOpen(false);
      await fetchSharedFiles();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (file: SharedFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-shared-files')
        .remove([file.file_path]);

      if (storageError) {
        console.warn('Storage delete warning:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_shared_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast({
        title: 'Deleted',
        description: 'File removed successfully',
      });

      await fetchSharedFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = FILE_CATEGORIES.find(c => c.value === category);
    const Icon = cat?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    return FILE_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Shared Files</h3>
            <p className="text-sm text-muted-foreground">
              Files shared exclusively with {userName}
            </p>
          </div>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Share File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share File with {userName}</DialogTitle>
              <DialogDescription>
                Upload a file that only this user can access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>File *</Label>
                <Input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Graduation Certificate 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Additional details..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expires On (Optional)
                </Label>
                <Input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Share File'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {files.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No files shared with this user yet</p>
          <p className="text-sm">Click "Share File" to upload a document</p>
        </div>
      ) : (
        <ScrollArea className="h-[350px]">
          <div className="space-y-3 pr-4">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-md bg-muted">
                      {getCategoryIcon(file.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{file.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{file.file_name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(file.category)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.file_size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(file.created_at), 'MMM d, yyyy')}
                        </span>
                        {file.expires_at && (
                          <Badge variant="outline" className="text-xs">
                            Expires: {format(new Date(file.expires_at), 'MMM d, yyyy')}
                          </Badge>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{file.title}" from {userName}'s shared files?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteFile(file)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default UserFileSharing;
