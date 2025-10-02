import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Download, FileText, TrendingUp, CreditCard, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { convertCurrency, formatCurrency, getExchangeRate, SUPPORTED_CURRENCIES } from '@/lib/currencyConversion';

interface Student {
  user_id: string;
  full_name: string;
  email: string;
}

interface Payment {
  id: string;
  student_id: string;
  payment_amount: number;
  balance_amount: number;
  currency: string;
  agent_currency: string;
  exchange_rate: number;
  payment_date: string;
  notes: string;
  student: {
    full_name: string;
  };
}

const PaymentsFinance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentCurrency, setAgentCurrency] = useState('USD');
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalBalance: 0,
    thisMonth: 0,
    studentCount: 0
  });
  
  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id, preferred_currency')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const currency = agentProfile.preferred_currency || 'USD';
      setAgentCurrency(currency);

      // Fetch students from applications added by this agent
      const { data: studentsData, error: studentsError } = await supabase
        .from('student_applications')
        .select('id, first_name, last_name, email, student_id')
        .eq('agent_id', agentProfile.id)
        .eq('status', 'submitted');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      }

      console.log('Students applications data:', studentsData);

      // Use application data directly since student_id may be null for pending applications
      const uniqueStudents = studentsData?.map((app: any) => ({
        user_id: app.id, // Use application id as the identifier
        full_name: `${app.first_name} ${app.last_name}`,
        email: app.email
      })) || [];

      console.log('Unique students:', uniqueStudents);
      setStudents(uniqueStudents);

      // Fetch payments - handle both application-based and student-based payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('student_payments')
        .select(`
          *,
          application:student_applications!student_payments_application_id_fkey(
            first_name,
            last_name
          ),
          student:profiles!student_payments_student_id_fkey(
            full_name
          )
        `)
        .eq('agent_id', agentProfile.id)
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Transform payments to have consistent student name
      const transformedPayments = paymentsData?.map(p => ({
        ...p,
        student: {
          full_name: p.application 
            ? `${p.application.first_name} ${p.application.last_name}`
            : p.student?.full_name || 'Unknown'
        }
      })) || [];

      setPayments(transformedPayments);

      // Calculate stats in agent's currency
      const totalPayments = paymentsData?.reduce((sum, p) => {
        const converted = convertCurrency(Number(p.payment_amount), p.currency, currency);
        return sum + converted;
      }, 0) || 0;

      const totalBalance = paymentsData?.reduce((sum, p) => {
        const converted = convertCurrency(Number(p.balance_amount), p.currency, currency);
        return sum + converted;
      }, 0) || 0;

      const thisMonth = paymentsData?.filter(p => {
        const date = new Date(p.payment_date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).reduce((sum, p) => {
        const converted = convertCurrency(Number(p.payment_amount), p.currency, currency);
        return sum + converted;
      }, 0) || 0;

      setStats({
        totalPayments,
        totalBalance,
        thisMonth,
        studentCount: uniqueStudents.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleAddPayment = async () => {
    if (!selectedStudentId || !paymentAmount || !balanceAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user?.user_id)
        .single();

      if (!agentProfile) throw new Error('Agent profile not found');

      const exchangeRate = getExchangeRate(agentCurrency, 'USD');

      // selectedStudentId is actually the application id in this context
      const { error } = await supabase
        .from('student_payments')
        .insert({
          application_id: selectedStudentId,
          agent_id: agentProfile.id,
          payment_amount: Number(paymentAmount),
          balance_amount: Number(balanceAmount),
          currency: agentCurrency,
          agent_currency: agentCurrency,
          exchange_rate: exchangeRate,
          created_by: user?.user_id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payment of ${formatCurrency(Number(paymentAmount), agentCurrency)} recorded successfully`
      });
      
      setPaymentDialogOpen(false);
      setSelectedStudentId('');
      setPaymentAmount('');
      setBalanceAmount('');
      
      fetchData();
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        title: "Error",
        description: "Failed to add payment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading payment information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments & Finance</h2>
          <p className="text-muted-foreground">Track commissions, earnings, and payment history</p>
        </div>
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
              <DialogDescription>
                Record a new payment transaction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Student Name</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {students.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground">No students found</div>
                    ) : (
                      students.map((student) => (
                        <SelectItem key={student.user_id} value={student.user_id}>
                          {student.full_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Balance Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Currency</Label>
                <Input value={agentCurrency} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">
                  Change currency in Agent Profile → Payment Info
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment}>
                Add Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPayments, agentCurrency)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance, agentCurrency)}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonth, agentCurrency)}</div>
            <p className="text-xs text-muted-foreground">This month's payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentCount}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
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
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>All student payments in {agentCurrency}</CardDescription>
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
                    <TableHead>Payment Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const paymentConverted = convertCurrency(
                      Number(payment.payment_amount),
                      payment.currency,
                      agentCurrency
                    );
                    const balanceConverted = convertCurrency(
                      Number(payment.balance_amount),
                      payment.currency,
                      agentCurrency
                    );
                    const total = paymentConverted + balanceConverted;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.student.full_name}</div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(paymentConverted, agentCurrency)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(balanceConverted, agentCurrency)}
                        </TableCell>
                        <TableCell className="font-mono font-bold">
                          {formatCurrency(total, agentCurrency)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {payments.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Receipts</CardTitle>
              <CardDescription>Download payment receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          Receipt #{payment.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(payment.payment_date), 'MMMM dd, yyyy')} - {formatCurrency(Number(payment.payment_amount), payment.currency)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}

                {payments.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment receipts available</p>
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
                    Minimum payout threshold: {formatCurrency(100, agentCurrency)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Request Payout</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Current balance: <span className="font-bold">{formatCurrency(stats.totalBalance, agentCurrency)}</span>
                </p>
                <Button disabled={stats.totalBalance < convertCurrency(100, 'USD', agentCurrency)}>
                  Request Early Payout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsFinance;
