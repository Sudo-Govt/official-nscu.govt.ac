import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  TrendingUp,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';

// Helper function to open printable HTML in new window
const openPrintableDocument = (htmlContent: string, title: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = title;
  }
  return printWindow;
};

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
    transactionType: '',
    delegatorId: '',
    delegatorAmount: '',
    delegatorPercentage: '',
    totalFees: ''
  });

  const [delegators, setDelegators] = useState<any[]>([]);
  const [pendingDues, setPendingDues] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [feePayments, setFeePayments] = useState<any[]>([]);

  useEffect(() => {
    fetchDelegators();
    fetchPendingDues();
    fetchStudents();
    fetchFeePayments();
  }, []);

  const fetchDelegators = async () => {
    const { data } = await supabase
      .from('agent_profiles')
      .select('id, user_id, agent_id, profiles!inner(full_name)');
    if (data) setDelegators(data);
  };

  const fetchPendingDues = async () => {
    const { data } = await supabase
      .from('student_applications')
      .select('*')
      .neq('status', 'paid') as { data: any[] | null; error: any };
    if (data) setPendingDues(data);
  };

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('id, name, cgpa, course_name, specialization')
      .order('created_at', { ascending: false });
    if (data) setStudents(data);
  };

  const fetchFeePayments = async () => {
    const { data } = await supabase
      .from('fee_payments')
      .select('*')
      .order('payment_date', { ascending: false });
    if (data) setFeePayments(data);
  };

  const handleStudentSelect = (studentId: string) => {
    const selected = students.find(s => s.id === studentId);
    if (selected) {
      setFormData({
        ...formData,
        studentName: selected.name,
        studentId: selected.id
      });
    }
  };

  // Calculate delegator percentage when amount changes
  const handleDelegatorAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const total = parseFloat(formData.totalFees) || 0;
    const percentage = total > 0 ? (amount / total * 100).toFixed(2) : '0';
    
    setFormData({
      ...formData,
      delegatorAmount: value,
      delegatorPercentage: percentage
    });
  };

  // Calculate delegator amount when percentage changes
  const handleDelegatorPercentageChange = (value: string) => {
    const percentage = parseFloat(value) || 0;
    const total = parseFloat(formData.totalFees) || 0;
    const amount = (total * percentage / 100).toFixed(2);
    
    setFormData({
      ...formData,
      delegatorPercentage: value,
      delegatorAmount: amount
    });
  };

  // Update calculations when total fees change
  const handleTotalFeesChange = (value: string) => {
    const total = parseFloat(value) || 0;
    const percentage = parseFloat(formData.delegatorPercentage) || 0;
    const amount = (total * percentage / 100).toFixed(2);
    
    setFormData({
      ...formData,
      totalFees: value,
      delegatorAmount: amount
    });
  };

  const mockFeeData = [
    { student: 'John Smith', id: 'NSCU2024001', totalFee: 15000, paid: 10000, pending: 5000, status: 'Partial' },
    { student: 'Sarah Johnson', id: 'NSCU2024002', totalFee: 18000, paid: 18000, pending: 0, status: 'Paid' },
    { student: 'Michael Brown', id: 'NSCU2024003', totalFee: 16000, paid: 8000, pending: 8000, status: 'Pending' }
  ];



  const getPaymentStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'partial': return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'pending': return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default: return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const totalRevenue = feePayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const totalPending = mockFeeData.reduce((sum, item) => sum + item.pending, 0);
  const collectionRate = totalRevenue > 0 ? ((totalRevenue / (totalRevenue + totalPending)) * 100).toFixed(1) : '0';

  const handleAddNew = () => {
    setFormData({
      studentName: '',
      studentId: '',
      amount: '',
      paymentMethod: '',
      scholarshipType: '',
      year: '',
      transactionType: '',
      delegatorId: '',
      delegatorAmount: '',
      delegatorPercentage: '',
      totalFees: ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.studentId || !formData.amount) {
      toast({
        title: "Error",
        description: "Please select a student and enter amount",
        variant: "destructive"
      });
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.studentId);
    
    let transactionType = 'fee_payment';
    if (activeTab === 'receipts') transactionType = 'receipt';
    if (activeTab === 'scholarships') transactionType = 'scholarship';
    
    const { error } = await supabase
      .from('fee_payments')
      .insert({
        student_id: formData.studentId,
        student_name: selectedStudent?.name || formData.studentName,
        amount: parseFloat(formData.amount),
        payment_method: formData.paymentMethod || null,
        total_fees: formData.totalFees ? parseFloat(formData.totalFees) : null,
        delegator_id: formData.delegatorId || null,
        delegator_amount: formData.delegatorAmount ? parseFloat(formData.delegatorAmount) : 0,
        delegator_percentage: formData.delegatorPercentage ? parseFloat(formData.delegatorPercentage) : 0,
        transaction_type: transactionType,
        notes: formData.scholarshipType ? `Scholarship Type: ${formData.scholarshipType}, Year: ${formData.year}` : null
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save: " + error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${activeTab === 'receipts' ? 'Receipt' : activeTab === 'scholarships' ? 'Scholarship' : 'Fee payment'} recorded successfully`
    });
    
    setDialogOpen(false);
    fetchFeePayments();
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) {
      return;
    }

    const { error } = await supabase
      .from('fee_payments')
      .delete()
      .eq('id', paymentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment: " + error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment deleted successfully"
    });

    fetchFeePayments();
  };

  const handleDeletePendingDue = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this pending due record?')) {
      return;
    }

    const { error } = await supabase
      .from('student_applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete pending due: " + error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Pending due deleted successfully"
    });

    fetchPendingDues();
  };

  const generateReceiptPDF = (receipt: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NSCU Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: #2980b9; color: white; text-align: center; padding: 20px; margin: -20px -20px 20px -20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .details { margin: 20px 0; }
          .row { display: flex; margin: 8px 0; }
          .label { font-weight: bold; width: 150px; }
          .amount-box { background: #f0f0f0; padding: 15px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
          .amount-label { font-weight: bold; font-size: 16px; }
          .amount-value { font-size: 20px; font-weight: bold; }
          .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 15px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NSCU</h1>
          <p>New States Continental University</p>
        </div>
        <div class="title">PAYMENT RECEIPT</div>
        <div class="details">
          <div class="row"><span class="label">Receipt Number:</span><span>${receipt.id.substring(0, 8).toUpperCase()}</span></div>
          <div class="row"><span class="label">Date:</span><span>${new Date(receipt.payment_date).toLocaleDateString()}</span></div>
          <div class="row"><span class="label">Student Name:</span><span>${receipt.student_name}</span></div>
          <div class="row"><span class="label">Payment Method:</span><span>${receipt.payment_method || 'N/A'}</span></div>
        </div>
        <div class="amount-box">
          <span class="amount-label">Amount Paid:</span>
          <span class="amount-value">$${parseFloat(receipt.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="footer">
          <p>New States Continental University</p>
          <p>123 University Avenue, Campus City, ST 12345</p>
          <p>Phone: (555) 123-4567 | Email: finance@nscu.edu</p>
          <p>Website: www.nscu.edu</p>
        </div>
      </body>
      </html>
    `;
    
    openPrintableDocument(htmlContent, `NSCU_Receipt_${receipt.id.substring(0, 8)}`);
    
    toast({
      title: "Success",
      description: "Receipt opened in new tab. Use Print (Ctrl+P) to save as PDF."
    });
  };

  const generateMonthlyRevenueReport = () => {
    const paymentsRows = feePayments.slice(0, 15).map(payment => `
      <tr>
        <td>${new Date(payment.payment_date).toLocaleDateString()}</td>
        <td>${payment.student_name.substring(0, 20)}</td>
        <td>${payment.payment_method || 'N/A'}</td>
        <td style="text-align: right;">$${parseFloat(payment.amount).toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NSCU Monthly Revenue Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: #2980b9; color: white; text-align: center; padding: 20px; margin: -20px -20px 20px -20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .generated { text-align: center; color: #666; margin-bottom: 20px; }
          .summary { margin: 20px 0; }
          .summary h3 { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 12px; }
          td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
          .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 15px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NSCU</h1>
          <p>New States Continental University</p>
        </div>
        <div class="title">MONTHLY REVENUE REPORT</div>
        <div class="generated">Generated: ${new Date().toLocaleDateString()}</div>
        <div class="summary">
          <h3>Revenue Summary</h3>
          <p>Total Revenue: $${totalRevenue.toLocaleString()}</p>
          <p>Total Payments: ${feePayments.length}</p>
          <p>Collection Rate: ${collectionRate}%</p>
        </div>
        <h3>Recent Payments</h3>
        <table>
          <thead><tr><th>Date</th><th>Student</th><th>Method</th><th style="text-align: right;">Amount</th></tr></thead>
          <tbody>${paymentsRows}</tbody>
        </table>
        <div class="footer">
          <p>New States Continental University</p>
          <p>Phone: (555) 123-4567 | Email: finance@nscu.edu</p>
        </div>
      </body>
      </html>
    `;
    
    openPrintableDocument(htmlContent, `NSCU_Monthly_Revenue_${new Date().toISOString().split('T')[0]}`);
    toast({ title: "Success", description: "Monthly revenue report opened. Use Print (Ctrl+P) to save as PDF." });
  };

  const generateOutstandingDuesReport = () => {
    const duesRows = pendingDues.slice(0, 15).map(due => {
      const totalFee = due.courses?.fee_structure?.total || 0;
      const paidAmount = due.application_fee_paid ? (due.application_fee_amount || 0) : 0;
      const pending = totalFee - paidAmount;
      return `
        <tr>
          <td>${due.application_number.substring(0, 10)}</td>
          <td>${`${due.first_name} ${due.last_name}`.substring(0, 18)}</td>
          <td>$${totalFee.toLocaleString()}</td>
          <td>$${paidAmount.toLocaleString()}</td>
          <td style="text-align: right;">$${pending.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NSCU Outstanding Dues Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: #2980b9; color: white; text-align: center; padding: 20px; margin: -20px -20px 20px -20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .generated { text-align: center; color: #666; margin-bottom: 20px; }
          .summary { margin: 20px 0; }
          .summary h3 { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 12px; }
          td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
          .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 15px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NSCU</h1>
          <p>New States Continental University</p>
        </div>
        <div class="title">OUTSTANDING DUES REPORT</div>
        <div class="generated">Generated: ${new Date().toLocaleDateString()}</div>
        <div class="summary">
          <h3>Summary</h3>
          <p>Total Pending: $${totalPending.toLocaleString()}</p>
          <p>Students with Dues: ${pendingDues.length}</p>
        </div>
        <h3>Pending Dues Details</h3>
        <table>
          <thead><tr><th>Application</th><th>Student</th><th>Total</th><th>Paid</th><th style="text-align: right;">Pending</th></tr></thead>
          <tbody>${duesRows}</tbody>
        </table>
        <div class="footer">
          <p>New States Continental University</p>
          <p>Phone: (555) 123-4567 | Email: finance@nscu.edu</p>
        </div>
      </body>
      </html>
    `;
    
    openPrintableDocument(htmlContent, `NSCU_Outstanding_Dues_${new Date().toISOString().split('T')[0]}`);
    toast({ title: "Success", description: "Outstanding dues report opened. Use Print (Ctrl+P) to save as PDF." });
  };

  const generateScholarshipReport = () => {
    const scholarships = feePayments.filter(p => p.transaction_type === 'scholarship');
    const totalScholarships = scholarships.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    
    const scholarshipRows = scholarships.slice(0, 15).map(scholarship => {
      const date = new Date(scholarship.payment_date).toLocaleDateString();
      const type = scholarship.notes?.split(':')[1]?.split(',')[0]?.trim() || 'N/A';
      return `
        <tr>
          <td>${date}</td>
          <td>${scholarship.student_name.substring(0, 20)}</td>
          <td>${type.substring(0, 15)}</td>
          <td style="text-align: right;">$${parseFloat(scholarship.amount).toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NSCU Scholarship Distribution Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: #2980b9; color: white; text-align: center; padding: 20px; margin: -20px -20px 20px -20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .generated { text-align: center; color: #666; margin-bottom: 20px; }
          .summary { margin: 20px 0; }
          .summary h3 { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 12px; }
          td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
          .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 15px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NSCU</h1>
          <p>New States Continental University</p>
        </div>
        <div class="title">SCHOLARSHIP DISTRIBUTION REPORT</div>
        <div class="generated">Generated: ${new Date().toLocaleDateString()}</div>
        <div class="summary">
          <h3>Summary</h3>
          <p>Total Scholarships Distributed: $${totalScholarships.toLocaleString()}</p>
          <p>Number of Recipients: ${scholarships.length}</p>
        </div>
        <h3>Scholarship Details</h3>
        <table>
          <thead><tr><th>Date</th><th>Student</th><th>Type</th><th style="text-align: right;">Amount</th></tr></thead>
          <tbody>${scholarshipRows}</tbody>
        </table>
        <div class="footer">
          <p>New States Continental University</p>
          <p>Phone: (555) 123-4567 | Email: finance@nscu.edu</p>
        </div>
      </body>
      </html>
    `;
    
    openPrintableDocument(htmlContent, `NSCU_Scholarship_Distribution_${new Date().toISOString().split('T')[0]}`);
    toast({ title: "Success", description: "Scholarship distribution report opened. Use Print (Ctrl+P) to save as PDF." });
  };

  const generatePaymentMethodsReport = () => {
    // Calculate payment method stats
    const methodStats: { [key: string]: { count: number; total: number } } = {};
    feePayments.forEach(payment => {
      const method = payment.payment_method || 'Not Specified';
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, total: 0 };
      }
      methodStats[method].count++;
      methodStats[method].total += parseFloat(payment.amount);
    });
    
    const methodRows = Object.entries(methodStats).map(([method, stats]) => {
      const percentage = totalRevenue > 0 ? ((stats.total / totalRevenue) * 100).toFixed(1) : '0';
      return `
        <tr>
          <td>${method}</td>
          <td>${stats.count}</td>
          <td>$${stats.total.toLocaleString()}</td>
          <td style="text-align: right;">${percentage}%</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NSCU Payment Methods Analysis</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: #2980b9; color: white; text-align: center; padding: 20px; margin: -20px -20px 20px -20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0 0; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .generated { text-align: center; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 12px; }
          td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 12px; }
          .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 15px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NSCU</h1>
          <p>New States Continental University</p>
        </div>
        <div class="title">PAYMENT METHODS ANALYSIS</div>
        <div class="generated">Generated: ${new Date().toLocaleDateString()}</div>
        <h3>Payment Method Breakdown</h3>
        <table>
          <thead><tr><th>Payment Method</th><th>Transactions</th><th>Total Amount</th><th style="text-align: right;">Percentage</th></tr></thead>
          <tbody>${methodRows}</tbody>
        </table>
        <div class="footer">
          <p>New States Continental University</p>
          <p>Phone: (555) 123-4567 | Email: finance@nscu.edu</p>
        </div>
      </body>
      </html>
    `;
    
    openPrintableDocument(htmlContent, `NSCU_Payment_Methods_Analysis_${new Date().toISOString().split('T')[0]}`);
    toast({ title: "Success", description: "Payment methods analysis opened. Use Print (Ctrl+P) to save as PDF." });
  };

  const renderDialogContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentSelect">Select Student *</Label>
            <Select onValueChange={handleStudentSelect} value={formData.studentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student">
                  {formData.studentName || "Select a student"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {students.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No students found</div>
                ) : (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.course_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="totalFees">Total Fees *</Label>
            <Input
              id="totalFees"
              type="number"
              value={formData.totalFees}
              onChange={(e) => handleTotalFeesChange(e.target.value)}
              placeholder="e.g., 10000"
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
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3">Delegator Commission</h4>
            <div className="grid gap-2">
              <Label htmlFor="delegatorId">Select Delegator (Optional)</Label>
              <Select value={formData.delegatorId} onValueChange={(value) => setFormData({ ...formData, delegatorId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delegator" />
                </SelectTrigger>
                <SelectContent>
                  {delegators.map((del) => (
                    <SelectItem key={del.id} value={del.id}>
                      {del.profiles?.full_name} ({del.agent_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formData.delegatorId && (
              <>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="grid gap-2">
                    <Label htmlFor="delegatorAmount">Delegator Amount ($)</Label>
                    <Input
                      id="delegatorAmount"
                      type="number"
                      value={formData.delegatorAmount}
                      onChange={(e) => handleDelegatorAmountChange(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="delegatorPercentage">Percentage (%)</Label>
                    <Input
                      id="delegatorPercentage"
                      type="number"
                      value={formData.delegatorPercentage}
                      onChange={(e) => handleDelegatorPercentageChange(e.target.value)}
                      placeholder="0.00"
                      max="100"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  University receives: ${(parseFloat(formData.totalFees || '0') - parseFloat(formData.delegatorAmount || '0')).toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'receipts') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentSelect">Select Student *</Label>
            <Select onValueChange={handleStudentSelect} value={formData.studentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student">
                  {formData.studentName || "Select a student"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {students.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No students found</div>
                ) : (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.course_name}
                    </SelectItem>
                  ))
                )}
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
            <Label htmlFor="studentSelect">Select Student *</Label>
            <Select onValueChange={handleStudentSelect} value={formData.studentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student">
                  {formData.studentName || "Select a student"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {students.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No students found</div>
                ) : (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.course_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
            <div className="text-2xl font-bold">${feePayments.filter(p => p.transaction_type === 'scholarship').reduce((sum, s) => sum + parseFloat(s.amount), 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{feePayments.filter(p => p.transaction_type === 'scholarship').length} scholarships</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Fee Management</TabsTrigger>
          <TabsTrigger value="pending">Pending Dues</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Dues Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDues.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending dues found</p>
                ) : (
                  pendingDues.map((due, index) => {
                    const totalFee = due.courses?.fee_structure?.total || 0;
                    const paidAmount = due.application_fee_paid ? (due.application_fee_amount || 0) : 0;
                    const pending = totalFee - paidAmount;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{due.first_name} {due.last_name}</h4>
                            <p className="text-sm text-muted-foreground">{due.application_number}</p>
                            <p className="text-xs text-muted-foreground">{due.courses?.course_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Total: ${totalFee.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Paid: ${paidAmount.toLocaleString()}
                            </p>
                            <p className="text-sm font-bold text-red-600">
                              Pending: ${pending.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setFormData({
                                ...formData,
                                studentName: `${due.first_name} ${due.last_name}`,
                                studentId: due.application_number,
                                totalFees: totalFee.toString()
                              });
                              setActiveTab('overview');
                              setDialogOpen(true);
                            }}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Collect Payment
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeletePendingDue(due.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Fee Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feePayments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No payments recorded yet</p>
                ) : (
                  feePayments.map((payment) => {
                    const paymentDate = new Date(payment.payment_date).toLocaleDateString();
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{payment.student_name}</h4>
                            <p className="text-sm text-muted-foreground">Payment Date: {paymentDate}</p>
                            {payment.payment_method && (
                              <p className="text-xs text-muted-foreground">Method: {payment.payment_method}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Amount: ${parseFloat(payment.amount).toLocaleString()}</p>
                            {payment.total_fees && (
                              <p className="text-sm text-muted-foreground">
                                Total Fees: ${parseFloat(payment.total_fees).toLocaleString()}
                              </p>
                            )}
                            {payment.delegator_amount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Delegator: ${parseFloat(payment.delegator_amount).toLocaleString()} ({parseFloat(payment.delegator_percentage).toFixed(1)}%)
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
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
                {feePayments.filter(p => p.transaction_type === 'receipt').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No receipts recorded yet</p>
                ) : (
                  feePayments.filter(p => p.transaction_type === 'receipt').map((receipt) => {
                    const receiptDate = new Date(receipt.payment_date).toLocaleDateString();
                    
                    return (
                      <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-semibold">{receipt.student_name}</h4>
                            <p className="text-sm text-muted-foreground">{receiptDate}</p>
                            {receipt.payment_method && (
                              <p className="text-xs text-muted-foreground">Method: {receipt.payment_method}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">${parseFloat(receipt.amount).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => generateReceiptPDF(receipt)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeletePayment(receipt.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
                {feePayments.filter(p => p.transaction_type === 'scholarship').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No scholarships recorded yet</p>
                ) : (
                  feePayments.filter(p => p.transaction_type === 'scholarship').map((scholarship) => {
                    const scholarshipDate = new Date(scholarship.payment_date).toLocaleDateString();
                    
                    return (
                      <div key={scholarship.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{scholarship.student_name}</h4>
                            <p className="text-sm text-muted-foreground">{scholarshipDate}</p>
                            {scholarship.notes && (
                              <p className="text-xs text-muted-foreground">{scholarship.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">${parseFloat(scholarship.amount).toLocaleString()}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePayment(scholarship.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  <Button variant="outline" className="w-full justify-start" onClick={generateMonthlyRevenueReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Monthly Revenue Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={generateOutstandingDuesReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Outstanding Dues Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={generateScholarshipReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Scholarship Distribution
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={generatePaymentMethodsReport}>
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