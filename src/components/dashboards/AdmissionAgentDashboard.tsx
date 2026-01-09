import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, FileText, Users, LogOut, Download, Upload, BarChart3, 
  MessageSquare, DollarSign, User, Settings, Copy, TrendingUp, 
  Clock, CheckCircle, AlertCircle, Calendar, Bell, Target,
  Wallet, Award, Globe, Phone, Mail, ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AgentProfileComponent from '@/components/agent/AgentProfile';
import StudentManagement from '@/components/agent/StudentManagement';
import DocumentManagement from '@/components/agent/DocumentManagement';
import PaymentsFinance from '@/components/agent/PaymentsFinance';
import CommunicationsHub from '@/components/agent/CommunicationsHub';
import ReportsAnalytics from '@/components/agent/ReportsAnalytics';
import SupportResources from '@/components/agent/SupportResources';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import FormsSection from '@/components/dashboard/FormsSection';

interface AgentProfile {
  id: string;
  agent_id: string;
  kyc_status: string;
  commission_rate: number;
  total_earnings: number;
  preferred_currency: string;
  total_applications: number;
  total_commission: number;
}

interface RecentApplication {
  id: string;
  full_name: string;
  program: string;
  status: string;
  created_at: string;
}

const AdmissionAgentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    todayApplications: 0,
    pendingReviews: 0,
    acceptedApps: 0,
    rejectedApps: 0,
    totalDocuments: 0,
    totalEarnings: 0,
    pendingCommissions: 0,
    conversionRate: 0,
    avgProcessingDays: 3.2
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch agent profile
      const { data: profile } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', user.user_id)
        .single();

      if (profile) {
        setAgentProfile(profile);

        // Fetch applications stats
        const { data: applications } = await supabase
          .from('student_applications')
          .select('id, full_name, program, status, created_at')
          .eq('agent_id', profile.id)
          .order('created_at', { ascending: false });

        // Set recent applications (last 5)
        setRecentApplications(applications?.slice(0, 5) || []);

        // Fetch documents count
        const { data: documents } = await supabase
          .from('student_documents')
          .select('id')
          .in('application_id', applications?.map(app => app.id) || []);

        // Fetch commissions
        const { data: commissions } = await supabase
          .from('agent_commissions')
          .select('amount, status')
          .eq('agent_id', profile.id);

        const pendingCommissions = commissions?.filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + Number(c.amount), 0) || 0;

        const today = new Date().toISOString().split('T')[0];
        const todayApps = applications?.filter(app => 
          app.created_at.startsWith(today)
        ).length || 0;

        const pendingReviews = applications?.filter(app => 
          app.status === 'submitted' || app.status === 'in_review' || app.status === 'pending'
        ).length || 0;

        const acceptedApps = applications?.filter(app => app.status === 'accepted' || app.status === 'enrolled').length || 0;
        const rejectedApps = applications?.filter(app => app.status === 'rejected').length || 0;
        const conversionRate = applications?.length ? (acceptedApps / applications.length) * 100 : 0;

        setStats({
          totalApplications: applications?.length || 0,
          todayApplications: todayApps,
          pendingReviews,
          acceptedApps,
          rejectedApps,
          totalDocuments: documents?.length || 0,
          totalEarnings: profile.total_earnings || 0,
          pendingCommissions,
          conversionRate,
          avgProcessingDays: 3.2
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAgentCode = () => {
    if (agentProfile?.agent_id) {
      navigator.clipboard.writeText(agentProfile.agent_id);
      toast({ title: "Copied!", description: "Agent code copied to clipboard" });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'accepted': 'default',
      'enrolled': 'default',
      'pending': 'secondary',
      'submitted': 'secondary',
      'in_review': 'outline',
      'rejected': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
                alt="NSCU Logo" 
                className="h-10 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Agent Portal</h1>
                <p className="text-xs text-muted-foreground">Student Recruitment Dashboard</p>
              </div>
            </div>
            
            {/* Agent Code Display */}
            {agentProfile && (
              <div className="hidden md:flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Your Agent Code</p>
                  <p className="font-mono font-bold text-lg tracking-widest text-primary">{agentProfile.agent_id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={copyAgentCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {stats.pendingReviews > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.pendingReviews}
                  </span>
                )}
              </Button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  {agentProfile?.kyc_status === 'verified' ? 'VERIFIED AGENT' : 'PENDING VERIFICATION'}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 gap-1">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="students" className="text-xs">Students</TabsTrigger>
            <TabsTrigger value="forms" className="text-xs">Forms</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            <TabsTrigger value="communications" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
            <TabsTrigger value="mail" className="text-xs">Mail</TabsTrigger>
            <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Agent Code Card - Mobile */}
            {agentProfile && (
              <Card className="md:hidden bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Your Agent Code</p>
                    <p className="font-mono font-bold text-2xl tracking-widest text-primary">{agentProfile.agent_id}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyAgentCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveTab('students')}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Applications</p>
                      <p className="text-3xl font-bold">{loading ? '...' : stats.todayApplications}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveTab('students')}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                      <p className="text-3xl font-bold">{loading ? '...' : stats.totalApplications}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveTab('students')}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-3xl font-bold">{loading ? '...' : stats.pendingReviews}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveTab('payments')}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-3xl font-bold">${loading ? '...' : stats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Accepted</p>
                      <p className="text-xl font-bold">{stats.acceptedApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                      <p className="text-xl font-bold">{stats.rejectedApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                      <p className="text-xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pending Payout</p>
                      <p className="text-xl font-bold">${stats.pendingCommissions.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Applications */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Latest student applications using your code</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('students')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentApplications.length > 0 ? (
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{app.full_name}</p>
                              <p className="text-sm text-muted-foreground">{app.program}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusBadge(app.status)}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(app.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No applications yet</p>
                      <p className="text-sm">Share your agent code to start receiving referrals</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions & Performance */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('reports')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('payments')}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Request Payout
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Commission Rate</span>
                      <span className="font-bold text-primary">{agentProfile?.commission_rate || 10}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Documents Uploaded</span>
                      <span className="font-bold">{stats.totalDocuments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Processing Time</span>
                      <span className="font-bold">{stats.avgProcessingDays} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">KYC Status</span>
                      <Badge variant={agentProfile?.kyc_status === 'verified' ? 'default' : 'secondary'}>
                        {agentProfile?.kyc_status?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <AgentProfileComponent />
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="forms">
            <FormsSection />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsFinance />
          </TabsContent>

          <TabsContent value="communications">
            <CommunicationsHub />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>

          <TabsContent value="mail">
            <InternalMailSystem />
          </TabsContent>

          <TabsContent value="support">
            <SupportResources />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdmissionAgentDashboard;