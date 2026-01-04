import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, Users, UserPlus, GraduationCap, BookOpen,
  FileText, MessageSquare, Bell, TrendingUp, Clock
} from 'lucide-react';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import { useToast } from '@/hooks/use-toast';

const PlatformAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    todayAdmissions: 0,
    agentQueue: 0,
    pendingApprovals: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Today's admissions
      const { count: todayAdmissions } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Agent onboarding queue
      const { count: agentQueue } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'pending');

      // Pending approvals
      const { count: pendingApprovals } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Revenue
      const { data: payments } = await supabase
        .from('student_payments')
        .select('amount')
        .eq('payment_status', 'completed');
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        todayAdmissions: todayAdmissions || 0,
        agentQueue: agentQueue || 0,
        pendingApprovals: pendingApprovals || 0,
        totalRevenue
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
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Platform Admin</h1>
              <p className="text-sm text-muted-foreground">Operations Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="flex items-center gap-1">
              <LayoutDashboard className="h-3 w-3" />
              PLATFORM ADMIN
            </Badge>
            <span className="text-sm font-medium">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Today's Admissions</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayAdmissions}</div>
                  <p className="text-xs text-muted-foreground">New applications today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Agent Queue</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.agentQueue}</div>
                  <p className="text-xs text-muted-foreground">Pending onboarding</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total collected</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" onClick={() => setActiveTab('users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('agents')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agent Onboarding
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('courses')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Management
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('messages')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Broadcast Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-sm">No new alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <SuperAdminUserManagement />
          </TabsContent>

          <TabsContent value="agents">
            <SuperAdminUserManagement filterRole="admission_agent" />
          </TabsContent>

          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Admissions Oversight</CardTitle>
                <CardDescription>Review and manage all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Admissions management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="messages">
            <InternalMailSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
