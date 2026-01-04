import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, UserCheck, AlertTriangle, FileCheck, Lock, 
  Unlock, FileText, Search
} from 'lucide-react';
import AuditLogsModule from '@/components/transparency/AuditLogsModule';

const ComplianceAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    pendingKYC: 0,
    flaggedAgents: 0,
    fraudAlerts: 0,
    lockedAccounts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Pending KYC
      const { count: pendingKYC } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'pending');

      // Flagged agents
      const { count: flaggedAgents } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'flagged');

      setStats({
        pendingKYC: pendingKYC || 0,
        flaggedAgents: flaggedAgents || 0,
        fraudAlerts: 0,
        lockedAccounts: 0
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
            <Shield className="h-8 w-8 text-amber-600" />
            <div>
              <h1 className="text-xl font-bold">Compliance & Legal</h1>
              <p className="text-sm text-muted-foreground">Risk & Governance Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1 border-amber-600 text-amber-600">
              <Shield className="h-3 w-3" />
              COMPLIANCE ADMIN
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
            <TabsTrigger value="kyc">KYC Review</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Alerts</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="logs">Compliance Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                  <UserCheck className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingKYC}</div>
                  <p className="text-xs text-muted-foreground">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Agents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.flaggedAgents}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.fraudAlerts}</div>
                  <p className="text-xs text-muted-foreground">Active investigations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Locked Accounts</CardTitle>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.lockedAccounts}</div>
                  <p className="text-xs text-muted-foreground">Compliance holds</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" onClick={() => setActiveTab('kyc')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Review KYC
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('fraud')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Fraud Panel
                </Button>
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Account
                </Button>
                <Button variant="outline">
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock Account
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No recent compliance activity</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification Queue</CardTitle>
                <CardDescription>Review and verify agent and student documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">KYC verification interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Investigation Panel</CardTitle>
                <CardDescription>Investigate and manage fraud alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fraud investigation interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreements">
            <Card>
              <CardHeader>
                <CardTitle>Agreement Enforcement</CardTitle>
                <CardDescription>Manage legal agreements and document versions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Agreement management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <AuditLogsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceAdminDashboard;
