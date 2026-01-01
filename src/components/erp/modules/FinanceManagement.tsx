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
import jsPDF from 'jspdf';
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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header with NSCU branding
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NSCU', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('New States Continental University', pageWidth / 2, 30, { align: 'center' });
    
    // Receipt title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', pageWidth / 2, 55, { align: 'center' });
    
    // Receipt details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const leftMargin = 20;
    let yPosition = 75;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt Number:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.id.substring(0, 8).toUpperCase(), leftMargin + 50, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(receipt.payment_date).toLocaleDateString(), leftMargin + 50, yPosition);
    
    yPosition += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Student Name:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.student_name, leftMargin + 50, yPosition);
    
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.payment_method || 'N/A', leftMargin + 50, yPosition);
    
    yPosition += 20;
    
    // Amount box
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Amount Paid:', leftMargin + 5, yPosition + 15);
    doc.setFontSize(16);
    doc.text(`$${parseFloat(receipt.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - leftMargin - 5, yPosition + 15, { align: 'right' });
    
    // Footer with contact information
    const footerY = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    doc.text('New States Continental University', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('123 University Avenue, Campus City, ST 12345', pageWidth / 2, footerY + 13, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: finance@nscu.edu', pageWidth / 2, footerY + 18, { align: 'center' });
    doc.text('Website: www.nscu.edu', pageWidth / 2, footerY + 23, { align: 'center' });
    
    // Save the PDF
    doc.save(`NSCU_Receipt_${receipt.id.substring(0, 8)}.pdf`);
    
    toast({
      title: "Success",
      description: "Receipt downloaded successfully"
    });
  };

  const generateMonthlyRevenueReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NSCU', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('New States Continental University', pageWidth / 2, 30, { align: 'center' });
    
    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MONTHLY REVENUE REPORT', pageWidth / 2, 55, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 65, { align: 'center' });
    
    // Summary
    const leftMargin = 20;
    let yPosition = 85;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Revenue Summary', leftMargin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, leftMargin, yPosition);
    yPosition += 8;
    doc.text(`Total Payments: ${feePayments.length}`, leftMargin, yPosition);
    yPosition += 8;
    doc.text(`Collection Rate: ${collectionRate}%`, leftMargin, yPosition);
    
    // Payments table
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Payments', leftMargin, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(9);
    doc.text('Date', leftMargin + 2, yPosition);
    doc.text('Student', leftMargin + 35, yPosition);
    doc.text('Method', leftMargin + 95, yPosition);
    doc.text('Amount', pageWidth - leftMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    
    feePayments.slice(0, 15).forEach((payment, index) => {
      if (yPosition > pageHeight - 50) return;
      
      const date = new Date(payment.payment_date).toLocaleDateString();
      doc.text(date, leftMargin + 2, yPosition);
      doc.text(payment.student_name.substring(0, 20), leftMargin + 35, yPosition);
      doc.text(payment.payment_method || 'N/A', leftMargin + 95, yPosition);
      doc.text(`$${parseFloat(payment.amount).toLocaleString()}`, pageWidth - leftMargin - 2, yPosition, { align: 'right' });
      
      yPosition += 7;
    });
    
    // Footer
    const footerY = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('New States Continental University', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: finance@nscu.edu', pageWidth / 2, footerY + 13, { align: 'center' });
    
    doc.save(`NSCU_Monthly_Revenue_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "Monthly revenue report downloaded" });
  };

  const generateOutstandingDuesReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NSCU', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('New States Continental University', pageWidth / 2, 30, { align: 'center' });
    
    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('OUTSTANDING DUES REPORT', pageWidth / 2, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 65, { align: 'center' });
    
    // Summary
    const leftMargin = 20;
    let yPosition = 85;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', leftMargin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Pending: $${totalPending.toLocaleString()}`, leftMargin, yPosition);
    yPosition += 8;
    doc.text(`Students with Dues: ${pendingDues.length}`, leftMargin, yPosition);
    
    // Dues table
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Pending Dues Details', leftMargin, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(9);
    doc.text('Application', leftMargin + 2, yPosition);
    doc.text('Student', leftMargin + 40, yPosition);
    doc.text('Total', leftMargin + 95, yPosition);
    doc.text('Paid', leftMargin + 125, yPosition);
    doc.text('Pending', pageWidth - leftMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    
    pendingDues.slice(0, 15).forEach((due) => {
      if (yPosition > pageHeight - 50) return;
      
      const totalFee = due.courses?.fee_structure?.total || 0;
      const paidAmount = due.application_fee_paid ? (due.application_fee_amount || 0) : 0;
      const pending = totalFee - paidAmount;
      
      doc.text(due.application_number.substring(0, 10), leftMargin + 2, yPosition);
      doc.text(`${due.first_name} ${due.last_name}`.substring(0, 18), leftMargin + 40, yPosition);
      doc.text(`$${totalFee.toLocaleString()}`, leftMargin + 95, yPosition);
      doc.text(`$${paidAmount.toLocaleString()}`, leftMargin + 125, yPosition);
      doc.text(`$${pending.toLocaleString()}`, pageWidth - leftMargin - 2, yPosition, { align: 'right' });
      
      yPosition += 7;
    });
    
    // Footer
    const footerY = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('New States Continental University', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: finance@nscu.edu', pageWidth / 2, footerY + 13, { align: 'center' });
    
    doc.save(`NSCU_Outstanding_Dues_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "Outstanding dues report downloaded" });
  };

  const generateScholarshipReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    const scholarships = feePayments.filter(p => p.transaction_type === 'scholarship');
    const totalScholarships = scholarships.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NSCU', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('New States Continental University', pageWidth / 2, 30, { align: 'center' });
    
    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOLARSHIP DISTRIBUTION REPORT', pageWidth / 2, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 65, { align: 'center' });
    
    // Summary
    const leftMargin = 20;
    let yPosition = 85;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', leftMargin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Scholarships Distributed: $${totalScholarships.toLocaleString()}`, leftMargin, yPosition);
    yPosition += 8;
    doc.text(`Number of Recipients: ${scholarships.length}`, leftMargin, yPosition);
    
    // Scholarships table
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Scholarship Details', leftMargin, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(9);
    doc.text('Date', leftMargin + 2, yPosition);
    doc.text('Student', leftMargin + 35, yPosition);
    doc.text('Type', leftMargin + 95, yPosition);
    doc.text('Amount', pageWidth - leftMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    
    scholarships.slice(0, 15).forEach((scholarship) => {
      if (yPosition > pageHeight - 50) return;
      
      const date = new Date(scholarship.payment_date).toLocaleDateString();
      const type = scholarship.notes?.split(':')[1]?.split(',')[0]?.trim() || 'N/A';
      
      doc.text(date, leftMargin + 2, yPosition);
      doc.text(scholarship.student_name.substring(0, 20), leftMargin + 35, yPosition);
      doc.text(type.substring(0, 15), leftMargin + 95, yPosition);
      doc.text(`$${parseFloat(scholarship.amount).toLocaleString()}`, pageWidth - leftMargin - 2, yPosition, { align: 'right' });
      
      yPosition += 7;
    });
    
    // Footer
    const footerY = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('New States Continental University', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: finance@nscu.edu', pageWidth / 2, footerY + 13, { align: 'center' });
    
    doc.save(`NSCU_Scholarship_Distribution_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "Scholarship distribution report downloaded" });
  };

  const generatePaymentMethodsReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
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
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('NSCU', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('New States Continental University', pageWidth / 2, 30, { align: 'center' });
    
    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT METHODS ANALYSIS', pageWidth / 2, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 65, { align: 'center' });
    
    // Summary
    const leftMargin = 20;
    let yPosition = 85;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method Breakdown', leftMargin, yPosition);
    yPosition += 15;
    
    // Method stats table
    doc.setFillColor(240, 240, 240);
    doc.rect(leftMargin, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(9);
    doc.text('Payment Method', leftMargin + 2, yPosition);
    doc.text('Transactions', leftMargin + 80, yPosition);
    doc.text('Total Amount', leftMargin + 125, yPosition);
    doc.text('Percentage', pageWidth - leftMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    
    Object.entries(methodStats).forEach(([method, stats]) => {
      const percentage = ((stats.total / totalRevenue) * 100).toFixed(1);
      
      doc.text(method, leftMargin + 2, yPosition);
      doc.text(stats.count.toString(), leftMargin + 80, yPosition);
      doc.text(`$${stats.total.toLocaleString()}`, leftMargin + 125, yPosition);
      doc.text(`${percentage}%`, pageWidth - leftMargin - 2, yPosition, { align: 'right' });
      
      yPosition += 7;
    });
    
    // Footer
    const footerY = pageHeight - 40;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('New States Continental University', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('Phone: (555) 123-4567 | Email: finance@nscu.edu', pageWidth / 2, footerY + 13, { align: 'center' });
    
    doc.save(`NSCU_Payment_Methods_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "Payment methods analysis downloaded" });
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