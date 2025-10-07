import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Award, 
  FileText, 
  Microscope, 
  Shield,
  BarChart3
} from 'lucide-react';
import StudentRecordsModule from '@/components/transparency/StudentRecordsModule';
import FacultyRecordsModule from '@/components/transparency/FacultyRecordsModule';
import FinancialRecordsModule from '@/components/transparency/FinancialRecordsModule';
import GovernanceModule from '@/components/transparency/GovernanceModule';
import ResearchModule from '@/components/transparency/ResearchModule';
import AuditLogsModule from '@/components/transparency/AuditLogsModule';
import ReportsGeneratorModule from '@/components/transparency/ReportsGeneratorModule';
import AcademicQualityModule from '@/components/transparency/AcademicQualityModule';

const TransparencyDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const menuGroups = [
    {
      label: 'Transparency Portal',
      items: [
        { title: 'Overview', value: 'overview', icon: BarChart3 },
        { title: 'Student Records', value: 'students', icon: Users },
        { title: 'Faculty Records', value: 'faculty', icon: GraduationCap },
        { title: 'Financial Records', value: 'financial', icon: DollarSign },
        { title: 'Academic Quality', value: 'quality', icon: Award },
        { title: 'Governance', value: 'governance', icon: Shield },
        { title: 'Research', value: 'research', icon: Microscope },
        { title: 'Audit Logs', value: 'audit', icon: FileText },
        { title: 'Reports', value: 'reports', icon: FileText }
      ]
    }
  ];

  return (
    <DashboardLayout
      title="Transparency & Reporting Portal"
      subtitle="Institutional integrity through blockchain-verified records"
      userBadge={user?.role || 'User'}
      menuGroups={menuGroups}
      activeTab={activeTab}
    >
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Transparency & Records Management</h1>
          <p className="text-muted-foreground mt-2">
            "Even if no one is watching, we believe in ethical integrity."
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,845</div>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Student Records</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,420</div>
                  <p className="text-xs text-muted-foreground">Active students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faculty Records</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">467</div>
                  <p className="text-xs text-muted-foreground">Qualified faculty</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Research Projects</CardTitle>
                  <Microscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">Active research</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Manage institutional records with blockchain verification and immutable audit trails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Blockchain-verified record hashing for tamper-proof integrity</li>
                      <li>Role-based access control for sensitive data</li>
                      <li>Automatic audit logging for all modifications</li>
                      <li>Public/private visibility controls</li>
                      <li>Multi-signature approval workflows</li>
                      <li>Automated report generation</li>
                      <li>Compliance with ethical governance standards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Access Levels:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li><strong>Administrator:</strong> Full access to all modules</li>
                      <li><strong>Registrar:</strong> Student and faculty records management</li>
                      <li><strong>Finance Officer:</strong> Financial records and audits</li>
                      <li><strong>Faculty:</strong> Limited access to relevant records</li>
                      <li><strong>Auditor:</strong> Read-only access to audit trails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <StudentRecordsModule />
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyRecordsModule />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialRecordsModule />
          </TabsContent>

          <TabsContent value="quality">
            <AcademicQualityModule />
          </TabsContent>

          <TabsContent value="governance">
            <GovernanceModule />
          </TabsContent>

          <TabsContent value="research">
            <ResearchModule />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogsModule />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsGeneratorModule />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TransparencyDashboard;