import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Download, FileText, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Commission {
  id: string;
  amount: number;
  commission_type: string;
  status: string;
  currency: string;
  payment_reference: string;
  created_at: string;
  paid_at: string;
  application: {
    application_number: string;
    first_name: string;
    last_name: string;
    course: {
      course_name: string;
    };
  };
}

const PaymentsFinance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayout: 0,
    thisMonth: 0,
    lastPayout: 0
  });

  useEffect(() => {
    fetchCommissions();
  }, [user]);

  const fetchCommissions = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id, total_earnings')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const { data, error } = await supabase
        .from('agent_commissions')
        .select(`
          *,
          application:student_applications(
            application_number,
            first_name,
            last_name,
            course:courses(course_name)
          )
        `)
        .eq('agent_id', agentProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCommissions(data || []);

      // Calculate stats
      const pending = data?.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const thisMonth = data?.filter(c => {
        const date = new Date(c.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      const lastPayoutCommission = data?.find(c => c.status === 'paid' && c.paid_at);

      setStats({
        totalEarnings: agentProfile.total_earnings || 0,
        pendingPayout: pending,
        thisMonth,
        lastPayout: lastPayoutCommission ? Number(lastPayoutCommission.amount) : 0
      });
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="default">Paid</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'processing': return <Badge variant="outline">Processing</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExportInvoices = () => {
    toast({
      title: "Export Started",
      description: "Your invoices are being prepared for download"
    });
  };

  if (loading) {
    return <div>Loading payment information...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payments & Finance</h2>
        <p className="text-muted-foreground">Track commissions, earnings, and payment history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingPayout.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-green-600">+{((stats.thisMonth / (stats.totalEarnings || 1)) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.lastPayout.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Most recent payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-info">Payment Info</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission History</CardTitle>
                  <CardDescription>All commission payments and pending amounts</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportInvoices}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        {format(new Date(commission.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {commission.application.first_name} {commission.application.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {commission.application.application_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{commission.application.course.course_name}</TableCell>
                      <TableCell className="capitalize">{commission.commission_type.replace('_', ' ')}</TableCell>
                      <TableCell className="font-mono">
                        {commission.currency} ${Number(commission.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell>
                        {commission.paid_at 
                          ? format(new Date(commission.paid_at), 'MMM dd, yyyy')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {commissions.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No commission records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices & Receipts</CardTitle>
              <CardDescription>Download invoices and payment receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.filter(c => c.status === 'paid').map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          Invoice #{commission.payment_reference || commission.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(commission.paid_at), 'MMMM dd, yyyy')} - ${Number(commission.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}

                {commissions.filter(c => c.status === 'paid').length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No paid invoices available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Manage your payment details and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Bank Account Details</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your bank account information to receive payments
                  </p>
                  <Button variant="outline">Add Bank Details</Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Payment Schedule</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Monthly payouts on the 15th of each month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Minimum payout threshold: $100
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Request Payout</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Current pending balance: <span className="font-bold">${stats.pendingPayout.toFixed(2)}</span>
                </p>
                <Button disabled={stats.pendingPayout < 100}>
                  Request Early Payout
                </Button>
                {stats.pendingPayout < 100 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Minimum balance of $100 required for payout request
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsFinance;
