import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, UserCheck, FileText, Bell, Clock, 
  AlertCircle, Briefcase, Calendar
} from 'lucide-react';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';

const HRAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    activeStaff: 0,
    newRequests: 0,
    documentExpiry: 0,
    announcements: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Count staff members (faculty and staff roles)
      const { data: staffRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['faculty', 'staff', 'admission_staff', 'support']);
      
      // Count active announcements
      const { count: announcements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        activeStaff: staffRoles?.length || 0,
        newRequests: 0,
        documentExpiry: 0,
        announcements: announcements || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">HR Administration</h1>
              <p className="text-sm text-muted-foreground">Staff Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              HR ADMIN
            </Badge>
            <span className="text-sm font-medium">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff Directory</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeStaff}</div>
                  <p className="text-xs text-muted-foreground">Total staff members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">New Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newRequests}</div>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Document Expiry</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.documentExpiry}</div>
                  <p className="text-xs text-muted-foreground">Expiring soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.announcements}</div>
                  <p className="text-xs text-muted-foreground">Active notices</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" onClick={() => setActiveTab('staff')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('documents')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('notices')}>
                  <Bell className="h-4 w-4 mr-2" />
                  Post Notice
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Activity logs and attendance tracking</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <SuperAdminUserManagement filterRole="staff" />
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Staff Documents</CardTitle>
                <CardDescription>Manage staff documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Document management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <CardTitle>HR Notices & Circulars</CardTitle>
                <CardDescription>Post and manage HR announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <InternalMailSystem />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>HR Reports</CardTitle>
                <CardDescription>Staff analytics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">HR reports interface</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HRAdminDashboard;
