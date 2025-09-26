import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Upload, 
  Calendar, 
  Settings, 
  Bell, 
  Download,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  BookOpen,
  GraduationCap,
  Building,
  Shield,
  Database,
  BarChart3,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import ChangePassword from '@/components/ChangePassword';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import ApplicationScoringSystem from '@/components/admin/ApplicationScoringSystem';
import AdminMessagingSystem from '@/components/admin/AdminMessagingSystem';
import { StudentsTab } from '@/components/admin/StudentsTab';
import { DocGenTab } from '@/components/admin/DocGenTab';
import AcademicManagement from '@/components/erp/modules/AcademicManagement';
import StudentManagement from '@/components/erp/modules/StudentManagement';
import FinanceManagement from '@/components/erp/modules/FinanceManagement';

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  status: string;
  enrollment_year?: number;
  graduation_year?: number;
  department?: string;
  phone?: string;
  created_at: string;
}

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  category: string;
  target_audience: string;
  created_at: string;
  uploaded_by: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  target_audience: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDocuments: 0,
    activeAnnouncements: 0,
    totalFaculty: 0,
    pendingAlumniRequests: 0,
    openSupportTickets: 0
  });

  // Document upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadAudience, setUploadAudience] = useState('all');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (studentsData) setStudents(studentsData);

      // Calculate stats
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('role');

      if (allProfiles) {
        setStats({
          totalStudents: allProfiles.filter(p => p.role === 'student').length,
          totalFaculty: allProfiles.filter(p => p.role === 'faculty').length,
          totalDocuments: 0,
          activeAnnouncements: 0,
          pendingAlumniRequests: 0,
          openSupportTickets: 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText
    },
    {
      id: 'student-management',
      label: 'Students',
      icon: Users,
      subItems: [
        { id: 'students', label: 'Student Records' },
        { id: 'enrollment', label: 'Enrollment' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Shield,
      subItems: [
        { id: 'users', label: 'All Users' },
        { id: 'roles', label: 'Roles & Permissions' }
      ]
    },
    {
      id: 'content-management',
      label: 'Content',
      icon: Upload,
      subItems: [
        { id: 'documents', label: 'Documents' },
        { id: 'announcements', label: 'Announcements' }
      ]
    },
    {
      id: 'erp-system',
      label: 'ERP System',
      icon: Building,
      subItems: [
        { id: 'erp', label: 'ERP Dashboard' },
        { id: 'academic', label: 'Academic Management' },
        { id: 'finance', label: 'Finance Management' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subItems: [
        { id: 'password', label: 'Change Password' },
        { id: 'system', label: 'System Settings' }
      ]
    }
  ];

  return (
    <DashboardLayout 
      menuItems={menuItems}
      title="Admin Portal"
      subtitle="University Management System"
    >
      <TabsContent value="overview" className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +10% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFaculty}</div>
              <p className="text-xs text-muted-foreground">
                +2 new hires this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAnnouncements}</div>
              <p className="text-xs text-muted-foregreen">
                3 pending approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student registration</p>
                  <p className="text-xs text-muted-foreground">John Doe registered for Computer Science program</p>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-muted-foreground">Academic calendar updated for 2024</p>
                </div>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System maintenance</p>
                  <p className="text-xs text-muted-foreground">Scheduled maintenance completed successfully</p>
                </div>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="applications" className="p-6 space-y-6">
        <ApplicationManagement />
      </TabsContent>

      <TabsContent value="students" className="p-6 space-y-6">
        <StudentsTab />
      </TabsContent>

      <TabsContent value="users" className="p-6 space-y-6">
        <SuperAdminUserManagement />
      </TabsContent>

      <TabsContent value="documents" className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Upload and manage university documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Document management coming soon</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="announcements" className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Create and manage university announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Announcement management coming soon</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="erp" className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ERP System Dashboard</CardTitle>
            <CardDescription>Enterprise Resource Planning overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-6">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">Academic Management</h3>
                <p className="text-sm text-muted-foreground">Manage courses, programs, and schedules</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">Student Management</h3>
                <p className="text-sm text-muted-foreground">Handle student records and enrollment</p>
              </Card>
              <Card className="text-center p-6">
                <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">Finance Management</h3>
                <p className="text-sm text-muted-foreground">Track fees, payments, and budgets</p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="academic" className="p-6">
        <AcademicManagement />
      </TabsContent>

      <TabsContent value="finance" className="p-6">
        <FinanceManagement />
      </TabsContent>

      <TabsContent value="password" className="p-6 space-y-6">
        <ChangePassword />
      </TabsContent>
    </DashboardLayout>
  );
};

export default AdminDashboard;