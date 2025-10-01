import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, FileText, Users, LogOut, Download, Upload, DollarSign, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StudentManagement from '@/components/agent/StudentManagement';
import DocumentManagement from '@/components/agent/DocumentManagement';

const DelegatorDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApplications: 0,
    acceptedStudents: 0,
    totalCommission: 0,
    pendingCommission: 0
  });
  const [loading, setLoading] = useState(true);
  const [delegatorProfile, setDelegatorProfile] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('agent_profiles')
        .select('id, total_earnings, agent_id')
        .eq('user_id', user.user_id)
        .single();

      setDelegatorProfile(profile);

      if (profile) {
        // Fetch students added by this delegator
        const { data: applications } = await supabase
          .from('student_applications')
          .select('id, status, created_at')
          .eq('agent_id', profile.id);

        // Fetch commissions
        const { data: commissions } = await supabase
          .from('agent_commissions')
          .select('amount, status')
          .eq('agent_id', profile.id);

        const pendingApps = applications?.filter(app => 
          app.status === 'submitted' || app.status === 'in_review'
        ).length || 0;

        const acceptedApps = applications?.filter(app => 
          app.status === 'accepted'
        ).length || 0;

        const totalCommission = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
        const pendingCommission = commissions?.filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + Number(c.amount), 0) || 0;

        setStats({
          totalStudents: applications?.length || 0,
          pendingApplications: pendingApps,
          acceptedStudents: acceptedApps,
          totalCommission,
          pendingCommission
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
                alt="NSCU Logo" 
                className="h-8 w-auto mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Delegator Portal</h1>
                <p className="text-sm text-muted-foreground">Student Management & Commission Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  DELEGATOR {delegatorProfile?.agent_id && `(${delegatorProfile.agent_id})`}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Students you've added</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{loading ? '...' : stats.acceptedStudents}</div>
                  <p className="text-xs text-muted-foreground">Successfully enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${loading ? '...' : stats.totalCommission.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">All-time earnings</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your students and documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setActiveTab('students')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Student
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('documents')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('commission')}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Commission
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commission Summary</CardTitle>
                  <CardDescription>Your earning details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Earned</span>
                    <span className="font-bold text-green-600">${stats.totalCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Payment</span>
                    <span className="font-bold text-yellow-600">${stats.pendingCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-bold">
                      {stats.totalStudents > 0 ? ((stats.acceptedStudents / stats.totalStudents) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle>Commission Details</CardTitle>
                <CardDescription>Track your commission earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${stats.totalCommission.toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground">Total Commission</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">${stats.pendingCommission.toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground">Pending Payment</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">
                          ${(stats.totalCommission - stats.pendingCommission).toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground">Paid Out</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Commission history and detailed breakdown coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Delegator Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{user?.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delegator ID</p>
                      <p className="text-sm text-muted-foreground">{delegatorProfile?.agent_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <Badge>Delegator</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DelegatorDashboard;
