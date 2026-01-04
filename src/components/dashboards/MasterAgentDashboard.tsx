import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, UserPlus, DollarSign, TrendingUp, Target,
  BarChart3, Award, ArrowUpRight
} from 'lucide-react';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import { useToast } from '@/hooks/use-toast';

const MasterAgentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    subAgentCount: 0,
    teamLeads: 0,
    overrideCommission: 0,
    targetProgress: 75
  });
  const [subAgents, setSubAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // For demo purposes, using mock data
      setStats({
        subAgentCount: 12,
        teamLeads: 45,
        overrideCommission: 15000,
        targetProgress: 75
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubAgent = () => {
    toast({
      title: "Create Sub-Agent",
      description: "Sub-agent creation form will open",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-xl font-bold">Master Agent Portal</h1>
              <p className="text-sm text-muted-foreground">Team Management & Override Commissions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="flex items-center gap-1 bg-amber-500">
              <Award className="h-3 w-3" />
              MASTER AGENT
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
            <TabsTrigger value="team">My Team</TabsTrigger>
            <TabsTrigger value="leads">Team Leads</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Sub-Agents</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.subAgentCount}</div>
                  <p className="text-xs text-muted-foreground">Active team members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Team Leads</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.teamLeads}</div>
                  <p className="text-xs text-muted-foreground">Total leads generated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Override Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${stats.overrideCommission.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.targetProgress}%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${stats.targetProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" onClick={handleCreateSubAgent}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Sub-Agent
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('leads')}>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Assign Leads
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('performance')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('earnings')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Commission Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Team analytics and performance metrics</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Sub-Agents</CardTitle>
                    <CardDescription>Manage your agent network</CardDescription>
                  </div>
                  <Button onClick={handleCreateSubAgent}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Sub-Agent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No sub-agents found</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Team Leads</CardTitle>
                <CardDescription>Manage and assign leads to sub-agents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lead management interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Override Commissions</CardTitle>
                <CardDescription>Your earnings from sub-agent performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Override</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">${stats.overrideCommission.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$2,500</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Paid Out</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,500</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Team Analytics</CardTitle>
                <CardDescription>Performance metrics for your agent network</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Performance analytics dashboard</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterAgentDashboard;
