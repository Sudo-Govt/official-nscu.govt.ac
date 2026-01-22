import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Users, DollarSign, AlertTriangle, Activity, 
  Settings, Database, Lock, Unlock, Key, FileText,
  LayoutDashboard, BookOpen, GraduationCap, ClipboardCheck, Globe, Briefcase, ClipboardList, MessageSquare, FolderOpen, Mail, UserCheck, UserCog, Heart, Building2, Layers, Library
} from 'lucide-react';
import AlumniManagement from '@/components/admin/AlumniManagement';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import AuditLogsModule from '@/components/transparency/AuditLogsModule';
import CourseManagement from '@/components/admin/CourseManagement';
import DashboardLayout from '@/components/DashboardLayout';
import SiteEditor from '@/components/admin/SiteEditor';
import ResourcesManager from '@/components/admin/ResourcesManager';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import FormsManagement from '@/components/admin/FormsManagement';
import AdminDocumentManagement from '@/components/admin/AdminDocumentManagement';
import AdminMessagingSystem from '@/components/admin/AdminMessagingSystem';
import JobManagement from '@/components/admin/JobManagement';
import { InternalMessagingApp } from '@/components/messaging';
import StudentDataManagement from '@/components/admin/StudentDataManagement';
import { useToast } from '@/hooks/use-toast';
import { 
  DepartmentManagement, 
  FacultyManagement, 
  AcademicCourseManagement, 
  LibraryBooksManagement,
  AcademicStudentManagement,
  BulkUploadManager,
  MegaCourseUploader,
  ABETCourseGenerator
} from '@/components/admin/academic';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingActions: 0,
    securityAlerts: 0,
    systemHealth: 'Healthy'
  });
  const [usersByRole, setUsersByRole] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data: roles } = await supabase.from('user_roles').select('role');
      const roleCounts: Record<string, number> = {};
      roles?.forEach(r => {
        roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
      });
      setUsersByRole(roleCounts);

      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: payments } = await supabase.from('student_payments').select('amount').eq('payment_status', 'completed');
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const { count: pendingActions } = await supabase.from('student_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0,
        totalRevenue,
        pendingActions: pendingActions || 0,
        securityAlerts: 0,
        systemHealth: 'Healthy'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyLock = () => {
    toast({
      title: "System Lock Initiated",
      description: "Emergency system lock has been activated.",
      variant: "destructive"
    });
  };

  const handleEmergencyUnlock = () => {
    toast({
      title: "System Unlocked",
      description: "Emergency system lock has been deactivated.",
    });
  };

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { title: 'Overview', icon: LayoutDashboard, value: 'overview', onClick: () => setActiveTab('overview') },
        { title: 'Site Editor', icon: Globe, value: 'site-editor', onClick: () => setActiveTab('site-editor') },
        { title: 'Users & Roles', icon: Users, value: 'users', onClick: () => setActiveTab('users') },
        { title: 'Content', icon: BookOpen, value: 'content', onClick: () => setActiveTab('content') },
      ]
    },
    {
      label: 'Operations',
      items: [
        { title: 'Student Management', icon: UserCog, value: 'student-management', onClick: () => setActiveTab('student-management') },
        { title: 'Alumni Management', icon: Heart, value: 'alumni-management', onClick: () => setActiveTab('alumni-management') },
        { title: 'Email', icon: Mail, value: 'email', onClick: () => setActiveTab('email') },
        { title: 'Jobs', icon: Briefcase, value: 'jobs', onClick: () => setActiveTab('jobs') },
        { title: 'Admissions', icon: GraduationCap, value: 'admissions', onClick: () => setActiveTab('admissions') },
        { title: 'Forms', icon: ClipboardList, value: 'forms', onClick: () => setActiveTab('forms') },
        { title: 'Documents', icon: FolderOpen, value: 'documents', onClick: () => setActiveTab('documents') },
        { title: 'Messaging', icon: MessageSquare, value: 'messaging', onClick: () => setActiveTab('messaging') },
        { title: 'Agent Resources', icon: Briefcase, value: 'agent-resources', onClick: () => setActiveTab('agent-resources') },
        { title: 'Student Resources', icon: UserCheck, value: 'student-resources', onClick: () => setActiveTab('student-resources') },
        { title: 'Finance', icon: DollarSign, value: 'finance', onClick: () => setActiveTab('finance') },
        { title: 'Compliance', icon: ClipboardCheck, value: 'compliance', onClick: () => setActiveTab('compliance') },
      ]
    },
    {
      label: 'Academic',
      items: [
        { title: 'Faculties', icon: Users, value: 'faculties', onClick: () => setActiveTab('faculties') },
        { title: 'Departments', icon: Building2, value: 'departments', onClick: () => setActiveTab('departments') },
        { title: 'Courses', icon: Layers, value: 'academic-courses', onClick: () => setActiveTab('academic-courses') },
        { title: 'Library', icon: Library, value: 'library', onClick: () => setActiveTab('library') },
        { title: 'Enrolled Students', icon: GraduationCap, value: 'enrolled-students', onClick: () => setActiveTab('enrolled-students') },
        { title: 'Bulk Upload', icon: FileText, value: 'bulk-upload', onClick: () => setActiveTab('bulk-upload') },
        { title: 'Mega Uploader', icon: FileText, value: 'mega-uploader', onClick: () => setActiveTab('mega-uploader') },
        { title: 'AI Course Generator', icon: BookOpen, value: 'abet-generator', onClick: () => setActiveTab('abet-generator') },
      ]
    },
    {
      label: 'System',
      items: [
        { title: 'System Logs', icon: FileText, value: 'logs', onClick: () => setActiveTab('logs') },
        { title: 'Settings', icon: Settings, value: 'settings', onClick: () => setActiveTab('settings') },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Emergency Controls */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="destructive" onClick={handleEmergencyLock} className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Emergency Lock System
                </Button>
                <Button variant="outline" onClick={handleEmergencyUnlock} className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  Unlock System
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{stats.systemHealth}</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Across all roles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Global Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total collected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.securityAlerts}</div>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </CardContent>
              </Card>
            </div>

            {/* Users by Role */}
            <Card>
              <CardHeader>
                <CardTitle>Active Users by Role</CardTitle>
                <CardDescription>Distribution of users across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.entries(usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="capitalize text-sm font-medium">{role.replace('_', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('logs')}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('settings')}>
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </Button>
                <Button variant="outline" className="justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Tools
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'site-editor':
        return <SiteEditor />;

      case 'users':
        return <SuperAdminUserManagement />;

      case 'content':
        return <CourseManagement />;

      case 'student-management':
        return <StudentDataManagement />;

      case 'alumni-management':
        return <AlumniManagement />;

      case 'agent-resources':
        return <ResourcesManager resourceType="agent" />;

      case 'student-resources':
        return <ResourcesManager resourceType="student" />;

      case 'email':
        return <InternalMessagingApp />;

      case 'admissions':
        return <ApplicationManagement />;

      case 'jobs':
        return <JobManagement />;

      case 'forms':
        return <FormsManagement />;

      case 'documents':
        return <AdminDocumentManagement />;

      case 'messaging':
        return <AdminMessagingSystem />;

      case 'finance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Global Finance Control</CardTitle>
              <CardDescription>Financial oversight and controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Override Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">Financial Override</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Blockchain Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm">Verify Records</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      case 'compliance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Oversight</CardTitle>
              <CardDescription>System-wide compliance and security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Compliance management interface</p>
            </CardContent>
          </Card>
        );

      case 'logs':
        return <AuditLogsModule />;

      case 'settings':
        return <SystemSettings />;

      case 'departments':
        return <DepartmentManagement />;

      case 'faculties':
        return <FacultyManagement />;

      case 'academic-courses':
        return <AcademicCourseManagement />;

      case 'library':
        return <LibraryBooksManagement />;

      case 'enrolled-students':
        return <AcademicStudentManagement />;

      case 'bulk-upload':
        return <BulkUploadManager />;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Super Admin Console"
      subtitle="System Control Center"
      userBadge="SUPER ADMIN"
      menuGroups={menuGroups}
      activeTab={activeTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
