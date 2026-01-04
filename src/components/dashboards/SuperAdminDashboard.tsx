import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, DollarSign, AlertTriangle, Activity, 
  Settings, Database, Lock, Unlock, Key, FileText,
  Globe, Server, Bell, Clock, TrendingUp
} from 'lucide-react';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import AuditLogsModule from '@/components/transparency/AuditLogsModule';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import { useToast } from '@/hooks/use-toast';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingActions: 0,
    securityAlerts: 0,
    systemHealth: 'Healthy'
  });
  const [usersByRole, setUsersByRole] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch user counts by role
      const { data: roles } = await supabase.from('user_roles').select('role');
      const roleCounts: Record<string, number> = {};
      roles?.forEach(r => {
        roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
      });
      setUsersByRole(roleCounts);

      // Fetch total users
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      // Fetch revenue from payments
      const { data: payments } = await supabase.from('student_payments').select('amount').eq('payment_status', 'completed');
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Fetch pending applications
      const { count: pendingActions } = await supabase.from('student_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0,
        totalRevenue,
        pendingActions: pendingActions || 0,
        securityAlerts: 0,
        systemHealth: 'Healthy'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyLock = () => {
    toast({
      title: "System Lock Initiated",
      description: "Emergency system lock has been activated.",
      variant: "destructive"
    });
  };

  const handleEmergencyUnlock = () => {
    toast({
      title: "System Unlocked",
      description: "Emergency system lock has been deactivated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-destructive" />
            <div>
              <h1 className="text-xl font-bold">Super Admin Console</h1>
              <p className="text-sm text-muted-foreground">System Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              SUPER ADMIN
            </Badge>
            <span className="text-sm font-medium">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 w-full max-w-4xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Emergency Controls */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="destructive" onClick={handleEmergencyLock} className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Emergency Lock System
                </Button>
                <Button variant="outline" onClick={handleEmergencyUnlock} className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  Unlock System
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{stats.systemHealth}</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Across all roles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Global Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.securityAlerts}</div>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </CardContent>
              </Card>
            </div>

            {/* Users by Role */}
            <Card>
              <CardHeader>
                <CardTitle>Active Users by Role</CardTitle>
                <CardDescription>Distribution of users across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.entries(usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="capitalize text-sm font-medium">{role.replace('_', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('logs')}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('settings')}>
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </Button>
                <Button variant="outline" className="justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Tools
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <SuperAdminUserManagement />
          </TabsContent>

          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Global Admissions Control</CardTitle>
                <CardDescription>Manage all admissions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Admissions management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Global Finance Control</CardTitle>
                <CardDescription>Financial oversight and controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Override Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">Financial Override</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Blockchain Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">Verify Records</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Oversight</CardTitle>
                <CardDescription>System-wide compliance and security</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Compliance management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <AuditLogsModule />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
