import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Trash2, Plus, Download, BookOpen, HelpCircle, Video, FileQuestion } from 'lucide-react';
import { format } from 'date-fns';

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

const CATEGORIES = [
  { value: 'training', label: 'Training Material', icon: BookOpen },
  { value: 'faq', label: 'FAQ', icon: HelpCircle },
  { value: 'video', label: 'Video Tutorial', icon: Video },
  { value: 'guide', label: 'Agent Guide', icon: FileText },
  { value: 'other', label: 'Other', icon: FileQuestion },
];

const AgentResourcesManager = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<AgentResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'training',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load agent resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let filePath = null;
      let fileName = null;
      let fileSize = null;
      let fileType = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('agent-resources')
          .upload(uniqueName, selectedFile);

        if (uploadError) throw uploadError;

        filePath = uploadData.path;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      }

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('agent_resources')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          content: formData.content || null,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          created_by: userData.user?.id,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully"
      });

      setFormData({ title: '', description: '', category: 'training', content: '' });
      setSelectedFile(null);
      setIsDialogOpen(false);
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('agent_resources')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setResources(resources.map(r => 
        r.id === id ? { ...r, is_active: !currentStatus } : r
      ));

      toast({
        title: "Success",
        description: `Resource ${!currentStatus ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive"
      });
    }
  };

  const deleteResource = async (id: string, filePath: string | null) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      // Delete file from storage if exists
      if (filePath) {
        await supabase.storage.from('agent-resources').remove([filePath]);
      }

      const { error } = await supabase
        .from('agent_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully"
      });

      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
    }
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

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.icon : FileText;
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading resources...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Agent Resources
            </CardTitle>
            <CardDescription>
              Manage training materials, FAQs, and support documents for agents
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Upload training materials, FAQs, or other resources for agents
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Commission Structure Guide"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this resource"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Text/HTML)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter text content or leave empty if uploading a file"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.jpg,.jpeg,.png"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Add Resource'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => {
              const Icon = getCategoryIcon(resource.category);
              return (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      {resource.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {resource.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Icon className="h-3 w-3" />
                      {getCategoryLabel(resource.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {resource.file_name ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(resource.file_path!, resource.file_name!)}
                        className="text-primary"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {resource.file_name.length > 20 
                          ? resource.file_name.substring(0, 20) + '...' 
                          : resource.file_name}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={resource.is_active}
                        onCheckedChange={() => toggleActive(resource.id, resource.is_active)}
                      />
                      <span className="text-sm">
                        {resource.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(resource.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteResource(resource.id, resource.file_path)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {resources.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No resources yet. Add your first resource above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentResourcesManager;
