import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Pencil, Search, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  department?: string;
  phone?: string;
  metadata?: any;
}

const SuperAdminUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
    department: '',
    phone: '',
    permissions: [] as string[]
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
            role: newUser.role
          }
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast({
            title: "Error",
            description: "A user with this email already exists",
            variant: "destructive"
          });
        } else {
          throw authError;
        }
        return;
      }

      // Update profile with additional info
      if (authData.user) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for trigger
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            department: newUser.department,
            phone: newUser.phone,
            metadata: {
              permissions: newUser.permissions,
              created_by: 'superadmin'
            }
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      toast({
        title: "Success",
        description: "User created successfully"
      });
      
      setNewUser({
        email: '',
        password: '',
        full_name: '',
        role: 'student',
        department: '',
        phone: '',
        permissions: []
      });
      setIsCreateDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newUser.full_name,
          role: newUser.role as any,
          department: newUser.department,
          phone: newUser.phone,
          metadata: {
            ...editingUser.metadata,
            permissions: newUser.permissions
          }
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully"
      });

      setEditingUser(null);
      setIsCreateDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User status updated successfully"
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setNewUser({
      email: '',
      password: '',
      full_name: user.full_name,
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      permissions: user.metadata?.permissions || []
    });
    setIsCreateDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser({
      email: '',
      password: '',
      full_name: '',
      role: 'student',
      department: '',
      phone: '',
      permissions: []
    });
    setIsCreateDialogOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availablePermissions = [
    'view_all_applications',
    'approve_applications',
    'manage_finances',
    'send_messages',
    'access_reports',
    'manage_courses',
    'bulk_operations'
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription className="text-base">Manage system users, roles, and permissions</CardDescription>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddUser} className="h-12">
                <UserPlus className="h-5 w-5 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information and permissions' : 'Add a new user to the system with specific roles and permissions'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {!editingUser && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@example.com"
                      />
                    </div>
                  )}
                  {!editingUser && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Secure password"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                        <SelectItem value="admission_agent">Admission Agent</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="accounts">Accounts</SelectItem>
                        <SelectItem value="registrar">Registrar</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Special Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={permission}
                          checked={newUser.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [...newUser.permissions, permission]
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={permission} className="text-sm font-normal">
                          {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingUser ? updateUser : createUser}>
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-lg transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-lg">{user.full_name}</h3>
                  <Badge variant={user.status === 'active' ? "default" : "secondary"} className="font-medium">
                    {user.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {user.status !== 'active' && (
                    <Badge variant="destructive">INACTIVE</Badge>
                  )}
                  {user.metadata?.permissions?.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Special Permissions
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <p>ID: {user.user_id}</p>
                  {user.department && <p>Department: {user.department}</p>}
                  {user.phone && <p>Phone: {user.phone}</p>}
                  <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleUserStatus(user.user_id, user.status)}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditUser(user)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuperAdminUserManagement;