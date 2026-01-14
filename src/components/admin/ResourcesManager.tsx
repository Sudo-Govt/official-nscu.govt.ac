import React, { useState, useEffect, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, FileText, Trash2, Plus, Download, BookOpen, HelpCircle, 
  Video, FileQuestion, Search, Users, User, GraduationCap, Briefcase,
  X, Check
} from 'lucide-react';
import { format } from 'date-fns';

interface Resource {
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
  target_type: string;
  target_user_ids: string[];
  created_at: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CATEGORIES = [
  { value: 'training', label: 'Training Material', icon: BookOpen },
  { value: 'faq', label: 'FAQ', icon: HelpCircle },
  { value: 'video', label: 'Video Tutorial', icon: Video },
  { value: 'guide', label: 'Guide', icon: FileText },
  { value: 'other', label: 'Other', icon: FileQuestion },
];

interface ResourcesManagerProps {
  resourceType: 'agent' | 'student';
}

const ResourcesManager: React.FC<ResourcesManagerProps> = ({ resourceType }) => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'training',
    content: '',
    targetType: 'all' as 'all' | 'selected',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tableName = resourceType === 'agent' ? 'agent_resources' : 'student_resources';
  const bucketName = resourceType === 'agent' ? 'agent-resources' : 'student-resources';
  const roleFilter = resourceType === 'agent' 
    ? ['admission_agent', 'master_agent'] 
    : ['student'];

  useEffect(() => {
    fetchResources();
  }, [resourceType]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources((data || []) as Resource[]);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAvailableUsers([]);
      return;
    }

    setLoadingUsers(true);
    try {
      let users: UserOption[] = [];

      if (resourceType === 'student') {
        // Search in students table for students
        const { data, error } = await supabase
          .from('students')
          .select('id, user_id, name, student_id, program')
          .ilike('name', `%${query}%`)
          .limit(20);

        if (error) throw error;

        users = (data || []).map(s => ({
          id: s.user_id || s.id,
          name: s.name || 'Unknown',
          email: s.student_id || '',
          role: s.program || 'Student',
        }));
      } else {
        // Search in agent_profiles joined with profiles for agents
        const { data: agentData, error: agentError } = await supabase
          .from('agent_profiles')
          .select('id, user_id, agency_name, agent_id')
          .limit(50);

        if (agentError) throw agentError;

        // Get profiles for these agents
        const userIds = (agentData || []).map(a => a.user_id);
        if (userIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', userIds)
            .ilike('full_name', `%${query}%`);

          if (profileError) throw profileError;

          users = (profileData || []).map(p => {
            const agent = agentData?.find(a => a.user_id === p.user_id);
            return {
              id: p.user_id,
              name: p.full_name || 'Unknown',
              email: agent?.agent_id || '',
              role: agent?.agency_name || 'Agent',
            };
          });
        }
      }

      setAvailableUsers(users.filter(u => !selectedUsers.some(s => s.id === u.id)));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, [selectedUsers, resourceType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearchQuery) {
        searchUsers(userSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearchQuery, searchUsers]);

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
          .from(bucketName)
          .upload(uniqueName, selectedFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        filePath = uploadData.path;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
      }

      const { data: userData } = await supabase.auth.getUser();

      const resourceData = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        content: formData.content || null,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        created_by: userData.user?.id,
        is_active: true,
        target_type: formData.targetType,
        target_user_ids: formData.targetType === 'selected' ? selectedUsers.map(u => u.id) : [],
      };

      const { error } = await supabase
        .from(tableName)
        .insert([resourceData]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Resource added successfully for ${formData.targetType === 'all' ? `all ${resourceType}s` : `${selectedUsers.length} selected ${resourceType}(s)`}`
      });

      resetForm();
      setIsDialogOpen(false);
      fetchResources();
    } catch (error: any) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'training', content: '', targetType: 'all' });
    setSelectedFile(null);
    setSelectedUsers([]);
    setUserSearchQuery('');
    setAvailableUsers([]);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(tableName)
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
      if (filePath) {
        await supabase.storage.from(bucketName).remove([filePath]);
      }

      const { error } = await supabase
        .from(tableName)
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
        .from(bucketName)
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

  const addUser = (user: UserOption) => {
    setSelectedUsers([...selectedUsers, user]);
    setAvailableUsers(availableUsers.filter(u => u.id !== user.id));
    setUserSearchQuery('');
  };

  const removeUser = (userId: string) => {
    const user = selectedUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TypeIcon = resourceType === 'agent' ? Briefcase : GraduationCap;
  const typeLabel = resourceType === 'agent' ? 'Agent' : 'Student';

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading resources...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5" />
              {typeLabel} Resources
            </CardTitle>
            <CardDescription>
              Manage training materials, FAQs, and support documents for {typeLabel.toLowerCase()}s
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New {typeLabel} Resource</DialogTitle>
                  <DialogDescription>
                    Upload training materials, FAQs, or other resources for {typeLabel.toLowerCase()}s
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
                      placeholder="e.g., Getting Started Guide"
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
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.jpg,.jpeg,.png"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <Label className="text-base font-semibold">Target Audience</Label>
                    <RadioGroup 
                      value={formData.targetType} 
                      onValueChange={(v: 'all' | 'selected') => setFormData({ ...formData, targetType: v })}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          Upload for All {typeLabel}s
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          Upload for Selected {typeLabel}(s)
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.targetType === 'selected' && (
                      <div className="space-y-3 mt-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={`Search ${typeLabel.toLowerCase()}s by name...`}
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        {loadingUsers && (
                          <p className="text-sm text-muted-foreground">Searching...</p>
                        )}

                        {availableUsers.length > 0 && (
                          <ScrollArea className="h-32 border rounded-md p-2">
                            {availableUsers.map((user) => (
                              <div 
                                key={user.id} 
                                className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                                onClick={() => addUser(user)}
                              >
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </ScrollArea>
                        )}

                        {selectedUsers.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Selected ({selectedUsers.length})</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedUsers.map((user) => (
                                <Badge key={user.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                                  {user.name}
                                  <button 
                                    type="button"
                                    onClick={() => removeUser(user.id)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.targetType === 'selected' && selectedUsers.length === 0 && (
                          <p className="text-sm text-amber-600">
                            Please select at least one {typeLabel.toLowerCase()} or choose "Upload for All"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={uploading || (formData.targetType === 'selected' && selectedUsers.length === 0)}
                    >
                      {uploading ? 'Uploading...' : 'Add Resource'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((resource) => {
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
                    <Badge variant={resource.target_type === 'all' ? 'default' : 'secondary'}>
                      {resource.target_type === 'all' ? (
                        <><Users className="h-3 w-3 mr-1" /> All {typeLabel}s</>
                      ) : (
                        <><User className="h-3 w-3 mr-1" /> {resource.target_user_ids?.length || 0} Selected</>
                      )}
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
                        {resource.file_name.length > 15 
                          ? resource.file_name.substring(0, 15) + '...' 
                          : resource.file_name}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No file</span>
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
                  <TableCell className="text-sm">
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

        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <TypeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No resources match your search.' : `No resources yet. Add your first ${typeLabel.toLowerCase()} resource above.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourcesManager;
