import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  TrendingUp,
  Download,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Form states
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    amount: '',
    paymentMethod: '',
    scholarshipType: '',
    year: '',
    transactionType: ''
  });

  const mockFeeData = [
    { student: 'John Smith', id: 'NSCU2024001', totalFee: 15000, paid: 10000, pending: 5000, status: 'Partial' },
    { student: 'Sarah Johnson', id: 'NSCU2024002', totalFee: 18000, paid: 18000, pending: 0, status: 'Paid' },
    { student: 'Michael Brown', id: 'NSCU2024003', totalFee: 16000, paid: 8000, pending: 8000, status: 'Pending' }
  ];

  const mockReceipts = [
    { id: 'RCP001', student: 'John Smith', amount: 5000, date: '2024-09-15', method: 'Bank Transfer', status: 'Completed' },
    { id: 'RCP002', student: 'Sarah Johnson', amount: 9000, date: '2024-09-14', method: 'Credit Card', status: 'Completed' },
    { id: 'RCP003', student: 'Michael Brown', amount: 4000, date: '2024-09-13', method: 'Cash', status: 'Processing' }
  ];

  const mockScholarships = [
    { student: 'John Smith', type: 'Merit Scholarship', amount: 3000, status: 'Active', year: '2024-25' },
    { student: 'Sarah Johnson', type: 'Need-based Aid', amount: 2500, status: 'Active', year: '2024-25' },
    { student: 'Emily Davis', type: 'Athletic Scholarship', amount: 5000, status: 'Pending', year: '2024-25' }
  ];

  const getPaymentStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'partial': return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'pending': return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default: return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const totalRevenue = mockFeeData.reduce((sum, item) => sum + item.paid, 0);
  const totalPending = mockFeeData.reduce((sum, item) => sum + item.pending, 0);
  const collectionRate = ((totalRevenue / (totalRevenue + totalPending)) * 100).toFixed(1);

  const handleAddNew = () => {
    setFormData({
      studentName: '',
      studentId: '',
      amount: '',
      paymentMethod: '',
      scholarshipType: '',
      year: '',
      transactionType: ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.studentName || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const typeLabel = activeTab === 'overview' ? 'Fee Payment' : activeTab === 'receipts' ? 'Receipt' : 'Scholarship';
    toast({
      title: "Success",
      description: `${typeLabel} recorded successfully`
    });
    
    setDialogOpen(false);
  };

  const renderDialogContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g., John Smith"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="studentId">Student ID *</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="e.g., NSCU2024001"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 5000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (activeTab === 'receipts') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g., John Smith"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 5000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (activeTab === 'scholarships') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g., John Smith"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scholarshipType">Scholarship Type *</Label>
            <Select value={formData.scholarshipType} onValueChange={(value) => setFormData({ ...formData, scholarshipType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select scholarship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Merit Scholarship">Merit Scholarship</SelectItem>
                <SelectItem value="Need-based Aid">Need-based Aid</SelectItem>
                <SelectItem value="Athletic Scholarship">Athletic Scholarship</SelectItem>
                <SelectItem value="Academic Excellence">Academic Excellence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 3000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Academic Year</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g., 2024-25"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Finance Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          {activeTab !== 'reports' && (
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              New {activeTab === 'overview' ? 'Payment' : activeTab === 'receipts' ? 'Receipt' : 'Scholarship'}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New {activeTab === 'overview' ? 'Fee Payment' : activeTab === 'receipts' ? 'Receipt' : 'Scholarship'}
            </DialogTitle>
            <DialogDescription>
              Record a new {activeTab === 'overview' ? 'fee payment' : activeTab === 'receipts' ? 'receipt' : 'scholarship'} for a student.
            </DialogDescription>
          </DialogHeader>
          {renderDialogContent()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              Submit {activeTab === 'overview' ? 'Payment' : activeTab === 'receipts' ? 'Receipt' : 'Scholarship'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {mockFeeData.filter(f => f.pending > 0).length} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate}%</div>
            <Progress value={parseFloat(collectionRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockScholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{mockScholarships.length} active scholarships</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Fee Management</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Fee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeeData.map((fee, index) => {
                  const statusInfo = getPaymentStatus(fee.status);
                  const paidPercentage = (fee.paid / fee.totalFee) * 100;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{fee.student}</h4>
                          <p className="text-sm text-muted-foreground">{fee.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Total: ${fee.totalFee.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid: ${fee.paid.toLocaleString()} | Pending: ${fee.pending.toLocaleString()}
                          </p>
                          <Progress value={paidPercentage} className="mt-1 w-24" />
                        </div>
                        <Badge className={statusInfo.color}>{fee.status}</Badge>
                        <Button variant="outline" size="sm">
                          <Receipt className="mr-2 h-4 w-4" />
                          Generate Receipt
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">Receipt #{receipt.id}</h4>
                        <p className="text-sm text-muted-foreground">{receipt.student} • {receipt.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${receipt.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{receipt.method}</p>
                      </div>
                      <Badge variant={receipt.status === 'Completed' ? 'default' : 'secondary'}>
                        {receipt.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScholarships.map((scholarship, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{scholarship.type}</h4>
                        <p className="text-sm text-muted-foreground">{scholarship.student} • {scholarship.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${scholarship.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Annual Award</p>
                      </div>
                      <Badge variant={scholarship.status === 'Active' ? 'default' : 'secondary'}>
                        {scholarship.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Monthly Revenue Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Outstanding Dues Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Scholarship Distribution
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Payment Methods Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campus-wise Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Main Campus</span>
                    <span className="font-semibold">$120,000</span>
                  </div>
                  <Progress value={75} />
                  <div className="flex justify-between items-center">
                    <span>Online Programs</span>
                    <span className="font-semibold">$45,000</span>
                  </div>
                  <Progress value={28} />
                  <div className="flex justify-between items-center">
                    <span>Extension Centers</span>
                    <span className="font-semibold">$25,000</span>
                  </div>
                  <Progress value={15} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;