import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Receipt, TrendingUp, Users, LogOut, FileText, DollarSign, BarChart3, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';

const FinanceDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleRecordPayment = () => {
    toast({
      title: "Record Payment",
      description: "Payment recording interface will open here",
    });
  };

  const handleGenerateReceipt = () => {
    toast({
      title: "Generate Receipt",
      description: "Creating new receipt...",
    });
  };

  const handleDownloadAll = () => {
    toast({
      title: "Download All Receipts",
      description: "Preparing receipt archive...",
    });
  };

  const handleReportClick = (reportType: string) => {
    toast({
      title: `${reportType} Report`,
      description: "Generating report...",
    });
  };

  const menuGroups = [
    {
      label: "Finance",
      items: [
        { title: "Overview", icon: BarChart3, value: "overview", onClick: () => setActiveTab("overview") },
        { title: "Fee Collections", icon: CreditCard, value: "fees", onClick: () => setActiveTab("fees") },
        { title: "Receipts", icon: Receipt, value: "receipts", onClick: () => setActiveTab("receipts") },
        { title: "Reports", icon: FileText, value: "reports", onClick: () => setActiveTab("reports") },
        { title: "Internal Mail", icon: User, value: "mail", onClick: () => setActiveTab("mail") },
      ]
    },
    {
      label: "Account",
      items: [
        { title: "Profile", icon: User, value: "profile", onClick: () => setActiveTab("profile") },
      ]
    }
  ];

  const financialData = {
    totalRevenue: 1250000,
    collectedFees: 950000,
    pendingFees: 300000,
    totalStudents: 245,
    paidStudents: 189,
    pendingStudents: 56
  };

  const collectionRate = (financialData.collectedFees / financialData.totalRevenue) * 100;

  return (
    <DashboardLayout
      title="Finance Dashboard"
      subtitle="Financial Management System"
      userBadge={user?.role.toUpperCase()}
      menuGroups={menuGroups}
      activeTab={activeTab}
    >
      {/* Dashboard Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(financialData.totalRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">Expected this year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected Fees</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${(financialData.collectedFees / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">{collectionRate.toFixed(1)}% collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${(financialData.pendingFees / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">Yet to be collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Fee collection rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(financialData.totalRevenue / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">Expected this year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collected Fees</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${(financialData.collectedFees / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">{collectionRate.toFixed(1)}% collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${(financialData.pendingFees / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">Yet to be collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Fee collection rate</p>
                </CardContent>
              </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Progress</CardTitle>
                <CardDescription>Current academic year fee collection status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collected</span>
                    <span>${financialData.collectedFees.toLocaleString()}</span>
                  </div>
                  <Progress value={collectionRate} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{collectionRate.toFixed(1)}% Complete</span>
                    <span>${financialData.pendingFees.toLocaleString()} Pending</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{financialData.paidStudents}</div>
                    <p className="text-xs text-muted-foreground">Students Paid</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{financialData.pendingStudents}</div>
                    <p className="text-xs text-muted-foreground">Pending Payment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest fee payments and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { student: "John Doe", amount: 25000, type: "Semester Fee", time: "2 hours ago", receipt: "RCP001" },
                    { student: "Jane Smith", amount: 15000, type: "Library Fee", time: "4 hours ago", receipt: "RCP002" },
                    { student: "Mike Johnson", amount: 30000, type: "Tuition Fee", time: "6 hours ago", receipt: "RCP003" },
                    { student: "Sarah Wilson", amount: 5000, type: "Lab Fee", time: "1 day ago", receipt: "RCP004" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.student}</p>
                        <p className="text-sm text-muted-foreground">{transaction.type} • {transaction.receipt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">${transaction.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{transaction.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "fees" && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Collections</CardTitle>
            <CardDescription>Manage student fee collections and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Fee collection interface will be available here</p>
              <Button className="mt-4" onClick={handleRecordPayment}>Record Payment</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "receipts" && (
        <Card>
          <CardHeader>
            <CardTitle>Receipt Management</CardTitle>
            <CardDescription>Generate and manage fee receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Receipt generation and management tools</p>
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={handleGenerateReceipt}>Generate Receipt</Button>
                <Button variant="outline" onClick={handleDownloadAll}>Download All</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "reports" && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription>Generate financial reports and balance sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Daily Collection")}>
                <FileText className="h-6 w-6 mb-2" />
                Daily Collection Report
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Monthly Balance Sheet")}>
                <TrendingUp className="h-6 w-6 mb-2" />
                Monthly Balance Sheet
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Student Payment Status")}>
                <Users className="h-6 w-6 mb-2" />
                Student Payment Status
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Revenue Analysis")}>
                <DollarSign className="h-6 w-6 mb-2" />
                Revenue Analysis
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Receipt Register")}>
                <Receipt className="h-6 w-6 mb-2" />
                Receipt Register
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => handleReportClick("Payment Mode")}>
                <CreditCard className="h-6 w-6 mb-2" />
                Payment Mode Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "mail" && <InternalMailSystem />}
    </DashboardLayout>
  );
};

export default FinanceDashboard;