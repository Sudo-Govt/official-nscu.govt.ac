// SuperAdmin User Management Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Pencil, Search, Shield, Users, Key, Trash2, Info, Mail, DollarSign, Share2, GraduationCap } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLE_DEFINITIONS, getRolesByCategory, getRoleDisplayName, getRoleDescription, CATEGORY_LABELS } from '@/lib/roles';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserFileSharing from './UserFileSharing';
import UserEnrollmentEditor from './UserEnrollmentEditor';
import AcademicCourseSelector from './AcademicCourseSelector';

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

interface AgentProfile {
  id: string;
  user_id: string;
  agent_id: string | null;
  commission_rate: number;
  agency_name: string | null;
  status: string;
}

interface SuperAdminUserManagementProps {
  filterRole?: string;
}

const SuperAdminUserManagement = ({ filterRole }: SuperAdminUserManagementProps) => {
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
  const [courseSelection, setCourseSelection] = useState<{
    faculty_id?: string;
    department_id?: string;
    course_id?: string;
    course_code?: string;
    course_name?: string;
  }>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Enhanced edit state
  const [editDialogTab, setEditDialogTab] = useState('basic');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [editCommissionRate, setEditCommissionRate] = useState('');
  const [editAgencyName, setEditAgencyName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    void loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return;
    setCurrentUserId(data.user?.id ?? null);
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const rolesMap = new Map(userRoles?.map(ur => [ur.user_id, ur.role]) || []);
      
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: rolesMap.get(profile.user_id) || profile.role
      })) || [];
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const fetchAgentProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching agent profile:', error);
      return null;
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const enrollmentFields = (newUser.role === 'student' || newUser.role === 'alumni') ? {
        faculty_id: courseSelection.faculty_id,
        department_id: courseSelection.department_id,
        course_id: courseSelection.course_id,
        course_code: courseSelection.course_code,
        course_name: courseSelection.course_name,
      } : {};

      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: newUser.email,
          password: newUser.password,
          full_name: newUser.full_name,
          role: newUser.role,
          department: newUser.department,
          phone: newUser.phone,
          ...enrollmentFields,
        },
      });

      // Check for error in response data (edge function returns error in body)
      if (error) {
        throw new Error(error.message || 'Failed to create user');
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }

      const createdRole = data?.role ?? newUser.role;
      const agentCode = data?.agent_code as string | null | undefined;

      toast({
        title: "Success",
        description: agentCode
          ? `User created as ${getRoleDisplayName(createdRole)} (Agent Code: ${agentCode})`
          : `User created as ${getRoleDisplayName(createdRole)}`,
      });

      setNewUser({
        email: '',
        password: '',
        full_name: '',
        role: filterRole || 'student',
        department: '',
        phone: '',
        permissions: [],
      });
      setCourseSelection({});

      setIsCreateDialogOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error?.message || "Failed to create user";
      
      // Provide user-friendly messages for common errors
      let displayMessage = errorMessage;
      if (errorMessage.includes('already been registered')) {
        displayMessage = "A user with this email address already exists. Please use a different email.";
      }
      
      toast({
        title: "Error",
        description: displayMessage,
        variant: "destructive",
      });
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;
    setIsUpdating(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: newUser.full_name,
          phone: newUser.phone
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Update role in user_roles table
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUser.user_id);

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: editingUser.user_id,
          role: newUser.role as any
        });

      if (roleError) throw roleError;

      // Update email if changed
      if (editEmail && editEmail !== editingUser.email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error: emailError } = await supabase.functions.invoke('admin-update-email', {
            body: { userId: editingUser.user_id, newEmail: editEmail }
          });
          if (emailError) {
            toast({
              title: "Warning",
              description: "Profile updated but email change failed: " + emailError.message,
              variant: "destructive"
            });
          }
        }
      }

      // Update password if provided
      if (editPassword && editPassword.length >= 6) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const response = await fetch(
            `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-update-password`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                userId: editingUser.user_id,
                newPassword: editPassword
              })
            }
          );
          if (!response.ok) {
            const result = await response.json();
            toast({
              title: "Warning",
              description: "Profile updated but password change failed: " + (result.error || 'Unknown error'),
              variant: "destructive"
            });
          }
        }
      }

      // Update agent profile if applicable
      if (agentProfile && (editCommissionRate || editAgencyName)) {
        const updates: any = {};
        if (editCommissionRate) updates.commission_rate = parseFloat(editCommissionRate);
        if (editAgencyName !== undefined) updates.agency_name = editAgencyName || null;

        const { error: agentError } = await supabase
          .from('agent_profiles')
          .update(updates)
          .eq('id', agentProfile.id);

        if (agentError) {
          toast({
            title: "Warning",
            description: "Profile updated but agent details failed to update",
            variant: "destructive"
          });
        }
      }

      toast({
        title: "Success",
        description: "User updated successfully"
      });

      setEditingUser(null);
      setIsCreateDialogOpen(false);
      setAgentProfile(null);
      setEditEmail('');
      setEditPassword('');
      setEditCommissionRate('');
      setEditAgencyName('');
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
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

  const handleEditUser = async (user: UserProfile) => {
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
    setEditEmail('');
    setEditPassword('');
    setEditDialogTab('basic');

    // Fetch agent profile if user is an agent
    if (user.role === 'admission_agent' || user.role === 'master_agent') {
      const profile = await fetchAgentProfile(user.user_id);
      setAgentProfile(profile);
      setEditCommissionRate(profile?.commission_rate?.toString() || '10');
      setEditAgencyName(profile?.agency_name || '');
    } else {
      setAgentProfile(null);
      setEditCommissionRate('');
      setEditAgencyName('');
    }

    setIsCreateDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser({
      email: '',
      password: '',
      full_name: '',
      role: filterRole || 'student',
      department: '',
      phone: '',
      permissions: []
    });
    setCourseSelection({});
    setAgentProfile(null);
    setEditEmail('');
    setEditPassword('');
    setEditCommissionRate('');
    setEditAgencyName('');
    setEditDialogTab('basic');
    setIsCreateDialogOpen(true);
  };

  const handleChangePassword = (user: UserProfile) => {
    setSelectedUserForPassword(user);
    setNewPassword('');
    setIsPasswordDialogOpen(true);
  };

  const updateUserPassword = async () => {
    if (!selectedUserForPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-update-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            userId: selectedUserForPassword.user_id,
            newPassword: newPassword
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      setIsPasswordDialogOpen(false);
      setSelectedUserForPassword(null);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const deleteUser = async (user: UserProfile) => {
    if (user.user_id === currentUserId) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingUser(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: {
          userId: user.user_id,
        },
      });

      if (error) {
        // Try to parse error message from response
        let errorMessage = error.message || "Failed to delete user";
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error) errorMessage = parsed.error;
        } catch {}
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Also check if response contains error
      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeletingUser(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => !filterRole || user.role === filterRole);

  const roleCategories = getRolesByCategory();
  const isAgentRole = editingUser && (editingUser.role === 'admission_agent' || editingUser.role === 'master_agent');

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {filterRole === 'admission_agent' ? 'Agent Management' : 'User Management'}
              </CardTitle>
              <CardDescription className="text-base">
                {filterRole === 'admission_agent' 
                  ? 'Manage admission agents and their permissions' 
                  : 'Manage system users, roles, and permissions'}
              </CardDescription>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddUser} className="h-12">
                <UserPlus className="h-5 w-5 mr-2" />
                {filterRole === 'admission_agent' ? 'Add Agent' : 'Add User'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingUser ? 'Edit User' : filterRole === 'admission_agent' ? 'Create New Agent' : 'Create New User'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information, credentials, and permissions' : filterRole === 'admission_agent' ? 'Add a new admission agent to the system' : 'Add a new user to the system with specific roles and permissions'}
                </DialogDescription>
              </DialogHeader>

              {editingUser ? (
                <Tabs value={editDialogTab} onValueChange={setEditDialogTab} className="w-full">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${isAgentRole ? 4 : (editingUser?.role === 'student' || editingUser?.role === 'alumni') ? 4 : 3}, minmax(0, 1fr))` }}>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                    {isAgentRole && <TabsTrigger value="agent">Agent</TabsTrigger>}
                    {(editingUser?.role === 'student' || editingUser?.role === 'alumni') && (
                      <TabsTrigger value="enrollment">
                        <GraduationCap className="h-3.5 w-3.5 mr-1" />
                        Enrollment
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="files">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      Files
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 py-4">
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
                        {filterRole ? (
                          <Input
                            id="role"
                            value={getRoleDisplayName(filterRole)}
                            disabled
                            className="bg-muted"
                          />
                        ) : (
                          <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {Object.entries(roleCategories).map(([category, roles]) => (
                                roles.length > 0 && (
                                  <SelectGroup key={category}>
                                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                      {CATEGORY_LABELS[category]}
                                    </SelectLabel>
                                    {roles.map((role) => (
                                      <SelectItem key={role.id} value={role.id}>
                                        <div className="flex items-center gap-2">
                                          <span>{role.name}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                )
                              ))}
                            </SelectContent>
                          </Select>
                        )}
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

                    {newUser.role && ROLE_DEFINITIONS[newUser.role] && (
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{getRoleDisplayName(newUser.role)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getRoleDescription(newUser.role)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="credentials" className="space-y-4 py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="editEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          New Email Address
                        </Label>
                        <Input
                          id="editEmail"
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="Leave empty to keep current email"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave empty if you don't want to change the email
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="editPassword" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          New Password
                        </Label>
                        <Input
                          id="editPassword"
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="Leave empty to keep current password"
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum 6 characters. Leave empty if you don't want to change the password
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {isAgentRole && (
                    <TabsContent value="agent" className="space-y-4 py-4">
                      <div className="space-y-4">
                        {agentProfile && (
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm font-medium">Agent Code: <span className="font-mono">{agentProfile.agent_id || 'Not assigned'}</span></p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="commissionRate" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Commission Rate (%)
                          </Label>
                          <Input
                            id="commissionRate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={editCommissionRate}
                            onChange={(e) => setEditCommissionRate(e.target.value)}
                            placeholder="10"
                          />
                          <p className="text-xs text-muted-foreground">
                            Percentage commission on successful student enrollments
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="agencyName">Agency Name</Label>
                          <Input
                            id="agencyName"
                            value={editAgencyName}
                            onChange={(e) => setEditAgencyName(e.target.value)}
                            placeholder="e.g., Global Education Partners"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Enrollment Tab for Students/Alumni */}
                  {(editingUser?.role === 'student' || editingUser?.role === 'alumni') && (
                    <TabsContent value="enrollment" className="py-4">
                      <UserEnrollmentEditor
                        userId={editingUser.user_id}
                        userName={editingUser.full_name}
                        userRole={editingUser.role}
                      />
                    </TabsContent>
                  )}

                  {/* File Sharing Tab */}
                  <TabsContent value="files" className="py-4">
                    {editingUser && (
                      <UserFileSharing
                        userId={editingUser.user_id}
                        userName={editingUser.full_name}
                        userRole={editingUser.role}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                // Create new user form
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      {filterRole ? (
                        <Input
                          id="role"
                          value={getRoleDisplayName(filterRole)}
                          disabled
                          className="bg-muted"
                        />
                      ) : (
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="max-h-80">
                            {Object.entries(roleCategories).map(([category, roles]) => (
                              roles.length > 0 && (
                                <SelectGroup key={category}>
                                  <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {CATEGORY_LABELS[category]}
                                  </SelectLabel>
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      <div className="flex items-center gap-2">
                                        <span>{role.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {newUser.role && ROLE_DEFINITIONS[newUser.role] && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{getRoleDisplayName(newUser.role)}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getRoleDescription(newUser.role)}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {Object.entries(ROLE_DEFINITIONS[newUser.role].permissions).map(([category, actions]) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}: {(actions as string[]).join(', ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Academic Course Selector for Students and Alumni */}
                  {(newUser.role === 'student' || filterRole === 'student' || newUser.role === 'alumni' || filterRole === 'alumni') && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {newUser.role === 'alumni' ? 'Graduation Program' : 'Academic Enrollment'}
                      </Label>
                      <AcademicCourseSelector
                        value={courseSelection}
                        onChange={setCourseSelection}
                        showCourseCodeInput={true}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Text)</Label>
                      <Input
                        id="department"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                        placeholder="Optional text description"
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

                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Permissions are automatically assigned based on the selected role.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingUser ? updateUser : createUser} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : editingUser ? 'Update User' : 'Create User'}
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant={user.status === 'active' ? "default" : "secondary"} className="font-medium cursor-help">
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">{getRoleDescription(user.role)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {user.status !== 'active' && (
                    <Badge variant="destructive">INACTIVE</Badge>
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
                  onClick={() => handleChangePassword(user)}
                >
                  <Key className="h-4 w-4 mr-1" />
                  Password
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditUser(user)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {currentUserId && user.user_id !== currentUserId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={isDeletingUser}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User Permanently?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user
                          <span className="font-semibold"> {user.full_name}</span> and all their associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUser(user)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUserForPassword?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                disabled={isChangingPassword}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(false)}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateUserPassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SuperAdminUserManagement;

