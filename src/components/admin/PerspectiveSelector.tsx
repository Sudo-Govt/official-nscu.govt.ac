import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePerspective } from '@/context/PerspectiveContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
}

const PerspectiveSelector = () => {
  const { enterPerspective } = usePerspective();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    'student', 'alumni', 'faculty', 'staff', 'admission_agent', 'master_agent',
    'admission_staff', 'admission_admin', 'finance', 'accounts', 'hr_admin',
    'marketing_admin', 'compliance_admin', 'support', 'auditor', 'admin',
    'platform_admin', 'superadmin'
  ];

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    let filtered = users;
    
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.full_name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search)
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with their roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, user_id, full_name')
        .order('full_name');

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Fetch auth users to get emails
      const { data: authData } = await supabase.auth.admin.listUsers().catch(() => ({ data: null }));
      const emailMap = new Map<string, string>();
      
      // If admin API isn't available, we'll use profile user_id as fallback
      if (authData?.users) {
        authData.users.forEach(u => emailMap.set(u.id, u.email || ''));
      }

      const roleMap = new Map(userRoles?.map(r => [r.user_id, r.role]) || []);

      const usersWithRoles: UserWithRole[] = (profiles || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        full_name: p.full_name || 'Unknown',
        email: emailMap.get(p.user_id) || `${p.user_id.substring(0, 8)}...`,
        role: roleMap.get(p.user_id) || 'student'
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: UserWithRole) => {
    enterPerspective({
      id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    });
    setOpen(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
      case 'platform_admin':
        return 'bg-destructive text-destructive-foreground';
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'student':
        return 'bg-blue-500 text-white';
      case 'alumni':
        return 'bg-green-500 text-white';
      case 'faculty':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Perspective
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            View Dashboard as Another User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role} className="capitalize">
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <p className="text-xs text-muted-foreground text-center">
            Click on a user to view their dashboard. You can return to your admin dashboard at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerspectiveSelector;
