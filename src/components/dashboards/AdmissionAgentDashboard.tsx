import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, FileText, Users, LogOut, Download, Upload, BarChart3, MessageSquare, DollarSign, User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AgentProfile from '@/components/agent/AgentProfile';
import StudentManagement from '@/components/agent/StudentManagement';
import DocumentManagement from '@/components/agent/DocumentManagement';

const AdmissionAgentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalApplications: 0,
    todayApplications: 0,
    pendingReviews: 0,
    totalDocuments: 0,
    totalEarnings: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id, total_earnings')
        .eq('user_id', user.user_id)
        .single();

      if (agentProfile) {
        // Fetch applications stats
        const { data: applications } = await supabase
          .from('student_applications')
          .select('id, status, created_at')
          .eq('agent_id', agentProfile.id);

        // Fetch documents count
        const { data: documents } = await supabase
          .from('student_documents')
          .select('id')
          .in('application_id', applications?.map(app => app.id) || []);

        const today = new Date().toISOString().split('T')[0];
        const todayApps = applications?.filter(app => 
          app.created_at.startsWith(today)
        ).length || 0;

        const pendingReviews = applications?.filter(app => 
          app.status === 'submitted' || app.status === 'in_review'
        ).length || 0;

        const acceptedApps = applications?.filter(app => app.status === 'accepted').length || 0;
        const conversionRate = applications?.length ? (acceptedApps / applications.length) * 100 : 0;

        setStats({
          totalApplications: applications?.length || 0,
          todayApplications: todayApps,
          pendingReviews,
          totalDocuments: documents?.length || 0,
          totalEarnings: agentProfile.total_earnings || 0,
          conversionRate
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
                <h1 className="text-xl font-semibold text-foreground">Admission Portal</h1>
                <p className="text-sm text-muted-foreground">Student Admission Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  ADMISSION AGENT
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
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communications">Messages</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('students')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications Today</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.todayApplications}</div>
                  <p className="text-xs text-muted-foreground">New applications today</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('students')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">Students processed by you</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('students')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.pendingReviews}</div>
                  <p className="text-xs text-muted-foreground">Applications awaiting review</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('finance')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${loading ? '...' : stats.totalEarnings}</div>
                  <p className="text-xs text-muted-foreground">Commission earned</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Your recruitment performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documents Uploaded</span>
                    <span className="font-bold">{stats.totalDocuments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="font-bold">3.2 days</span>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest student applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "John Doe", program: "Computer Science", status: "Pending", time: "2 hours ago" },
                      { name: "Jane Smith", program: "Business Administration", status: "Approved", time: "4 hours ago" },
                      { name: "Mike Johnson", program: "Engineering", status: "Review", time: "6 hours ago" },
                      { name: "Sarah Wilson", program: "Medicine", status: "Pending", time: "8 hours ago" },
                    ].map((application, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{application.name}</p>
                          <p className="text-sm text-muted-foreground">{application.program}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            application.status === 'Approved' ? 'default' :
                            application.status === 'Pending' ? 'secondary' : 'outline'
                          }>
                            {application.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{application.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
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
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('communications')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Check Messages
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('finance')}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Earnings
                  </Button>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <AgentProfile />
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed insights into your recruitment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                        <p className="text-sm text-muted-foreground">Application to Acceptance Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">3.2 days</div>
                        <p className="text-sm text-muted-foreground">Average Processing Time</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-sm text-muted-foreground">Document Compliance Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed analytics charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle>Communications Hub</CardTitle>
                <CardDescription>Messages, announcements, and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Direct Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-4">
                          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No new messages</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Announcements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="p-2 bg-muted rounded">
                            <p className="text-sm font-medium">New intake dates announced</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <p className="text-sm font-medium">Document verification updates</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Commission & Payments</CardTitle>
                <CardDescription>Track your earnings and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">$0</div>
                        <p className="text-sm text-muted-foreground">Pending Payout</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">5.0%</div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Payment history will be displayed here</p>
                    <Button className="mt-4" variant="outline">
                      Request Payout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Agent Settings</CardTitle>
                <CardDescription>Configure your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email notifications</span>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">SMS alerts</span>
                            <Badge variant="secondary">Disabled</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Regional Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Time zone</span>
                            <span className="text-sm text-muted-foreground">UTC</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Language</span>
                            <span className="text-sm text-muted-foreground">English</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
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

export default AdmissionAgentDashboard;