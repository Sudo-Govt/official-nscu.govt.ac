import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Headphones, MessageSquare, Clock, CheckCircle, AlertCircle,
  BookOpen, ArrowUpRight
} from 'lucide-react';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';

const SupportDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    openTickets: 0,
    pendingResponse: 0,
    resolvedToday: 0,
    escalated: 0
  });
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch support tickets
      const { data: ticketsData, count } = await supabase
        .from('alumni_support_tickets')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10);

      setTickets(ticketsData || []);
      setStats({
        openTickets: count || 0,
        pendingResponse: 0,
        resolvedToday: 0,
        escalated: 0
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
            <Headphones className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Support Center</h1>
              <p className="text-sm text-muted-foreground">Help Desk Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              SUPPORT
            </Badge>
            <span className="text-sm font-medium">{user?.full_name}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg mb-6">
            <TabsTrigger value="overview">Tickets</TabsTrigger>
            <TabsTrigger value="users">User Lookup</TabsTrigger>
            <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.openTickets}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Response</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.pendingResponse}</div>
                  <p className="text-xs text-muted-foreground">User replied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
                  <p className="text-xs text-muted-foreground">Closed tickets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.escalated}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <p className="text-muted-foreground">No tickets found</p>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">{ticket.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                          <Button size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Lookup</CardTitle>
                <CardDescription>Search for user information (limited view)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User search interface</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kb">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>FAQs and support articles</CardDescription>
                  </div>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Article
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Knowledge base management</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <InternalMailSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupportDashboard;
