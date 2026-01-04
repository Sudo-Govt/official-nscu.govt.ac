import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, FileText, Users, Globe, BarChart3,
  CheckCircle, XCircle, Clock, TrendingUp
} from 'lucide-react';
import ApplicationManagement from '@/components/admin/ApplicationManagement';

const AdmissionAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    newApplications: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  const [countryStats, setCountryStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // New applications
      const { count: newApplications } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Pending approvals
      const { count: pendingApprovals } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Approved today
      const { count: approvedToday } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('updated_at', today);

      // Country-wise stats
      const { data: applications } = await supabase
        .from('student_applications')
        .select('nationality');
      
      const countryCounts: Record<string, number> = {};
      applications?.forEach(app => {
        if (app.nationality) {
          countryCounts[app.nationality] = (countryCounts[app.nationality] || 0) + 1;
        }
      });
      setCountryStats(countryCounts);

      setStats({
        newApplications: newApplications || 0,
        pendingApprovals: pendingApprovals || 0,
        approvedToday: approvedToday || 0,
        rejectedToday: 0
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
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Admission Administration</h1>
              <p className="text-sm text-muted-foreground">University Admission Governance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              ADMISSION ADMIN
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
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newApplications}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
                  <p className="text-xs text-muted-foreground">Successfully processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Country-wise Intake</CardTitle>
                <CardDescription>Application distribution by nationality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.entries(countryStats).slice(0, 8).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{country}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(countryStats).length === 0 && (
                    <p className="text-muted-foreground col-span-4">No country data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" onClick={() => setActiveTab('applications')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Review Applications
                </Button>
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Staff
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('analytics')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationManagement />
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Monitor agent recruitment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Agent performance analytics</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries">
            <Card>
              <CardHeader>
                <CardTitle>Country-wise Admission Control</CardTitle>
                <CardDescription>Manage quotas and restrictions by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(countryStats).map(([country, count]) => (
                    <Card key={country}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {country}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{count}</span>
                          <span className="text-sm text-muted-foreground">applications</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Admission Analytics</CardTitle>
                <CardDescription>Detailed admission statistics and heatmaps</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdmissionAdminDashboard;
