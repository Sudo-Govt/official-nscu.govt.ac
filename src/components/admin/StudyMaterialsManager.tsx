import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Plus, Upload, Trash2, FileText, Users, User, Download, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ROLE_DEFINITIONS, getRoleDisplayName } from '@/lib/roles';

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  target_type: string;
  target_roles: string[] | null;
  target_user_ids: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
}

const StudyMaterialsManager = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_type: 'all',
    target_roles: [] as string[],
    target_user_ids: [] as string[],
    is_active: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMaterials();
    fetchUsers();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials((data as unknown as StudyMaterial[]) || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({ title: 'Error', description: 'Failed to fetch study materials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, role')
        .order('full_name');

      if (profilesError) throw profilesError;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const rolesMap = new Map(userRoles?.map(ur => [ur.user_id, ur.role]) || []);
      
      const usersWithRoles = profiles?.map(p => ({
        ...p,
        role: rolesMap.get(p.user_id) || p.role
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title) {
      toast({ title: 'Error', description: 'Please provide a title and select a file', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `materials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create database record
      const materialData: any = {
        title: formData.title,
        description: formData.description || null,
        file_name: selectedFile.name,
        file_path: filePath,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        target_type: formData.target_type,
        is_active: formData.is_active
      };

      if (formData.target_type === 'role') {
        materialData.target_roles = formData.target_roles;
      } else if (formData.target_type === 'user') {
        materialData.target_user_ids = formData.target_user_ids;
      }

      const { error: dbError } = await supabase
        .from('study_materials' as any)
        .insert([materialData]);

      if (dbError) throw dbError;

      toast({ title: 'Success', description: 'Study material uploaded successfully' });
      setIsDialogOpen(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error uploading material:', error);
      toast({ title: 'Error', description: 'Failed to upload study material', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (material: StudyMaterial) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      // Delete from storage
      await supabase.storage.from('study-materials').remove([material.file_path]);

      // Delete from database
      const { error } = await supabase.from('study_materials' as any).delete().eq('id', material.id);
      if (error) throw error;

      toast({ title: 'Success', description: 'Material deleted successfully' });
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({ title: 'Error', description: 'Failed to delete material', variant: 'destructive' });
    }
  };

  const handleDownload = async (material: StudyMaterial) => {
    try {
      const { data, error } = await supabase.storage
        .from('study-materials')
        .download(material.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({ title: 'Error', description: 'Failed to download material', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target_type: 'all',
      target_roles: [],
      target_user_ids: [],
      is_active: true
    });
    setSelectedFile(null);
    setUserSearchTerm('');
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  const toggleUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      target_user_ids: prev.target_user_ids.includes(userId)
        ? prev.target_user_ids.filter(id => id !== userId)
        : [...prev.target_user_ids, userId]
    }));
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getTargetLabel = (material: StudyMaterial) => {
    if (material.target_type === 'all') return 'All Users';
    if (material.target_type === 'role') {
      return material.target_roles?.map(r => getRoleDisplayName(r)).join(', ') || 'Specific Roles';
    }
    return `${material.target_user_ids?.length || 0} Users`;
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const availableRoles = Object.keys(ROLE_DEFINITIONS);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Study Materials Manager
          </h2>
          <p className="text-muted-foreground">Upload and manage study materials for users and roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to Computer Science"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the material..."
                  rows={3}
                />
              </div>

              <div>
                <Label>File *</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Target Audience *</Label>
                <Select value={formData.target_type} onValueChange={(value) => setFormData({ ...formData, target_type: value, target_roles: [], target_user_ids: [] })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="role">Specific Roles</SelectItem>
                    <SelectItem value="user">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.target_type === 'role' && (
                <div>
                  <Label>Select Roles</Label>
                  <ScrollArea className="h-48 border rounded-md p-4 mt-2">
                    <div className="space-y-2">
                      {availableRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={formData.target_roles.includes(role)}
                            onCheckedChange={() => toggleRole(role)}
                          />
                          <Label htmlFor={`role-${role}`} className="cursor-pointer">
                            {getRoleDisplayName(role)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {formData.target_roles.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formData.target_roles.map(r => getRoleDisplayName(r)).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {formData.target_type === 'user' && (
                <div>
                  <Label>Select Users</Label>
                  <Input
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="mt-2"
                  />
                  <ScrollArea className="h-48 border rounded-md p-4 mt-2">
                    <div className="space-y-2">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={formData.target_user_ids.includes(user.user_id)}
                            onCheckedChange={() => toggleUser(user.user_id)}
                          />
                          <Label htmlFor={`user-${user.id}`} className="cursor-pointer flex items-center gap-2">
                            {user.full_name}
                            <Badge variant="outline" className="text-xs">{getRoleDisplayName(user.role)}</Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {formData.target_user_ids.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formData.target_user_ids.length} users
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active (visible to users)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Study Materials Found</h3>
            <p className="text-muted-foreground mb-4">Upload your first study material to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className={!material.is_active ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {!material.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(material)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(material)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{material.title}</CardTitle>
                {material.description && (
                  <CardDescription className="line-clamp-2">{material.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{material.file_name}</span>
                  <span>{formatFileSize(material.file_size)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {material.target_type === 'all' && <Users className="h-4 w-4" />}
                  {material.target_type === 'role' && <Users className="h-4 w-4" />}
                  {material.target_type === 'user' && <User className="h-4 w-4" />}
                  <Badge variant="secondary">{getTargetLabel(material)}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsManager;
