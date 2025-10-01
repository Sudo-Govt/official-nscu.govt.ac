import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LogOut,
  DollarSign,
  TrendingUp,
  User,
  Mail
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
import DashboardLayout from '@/components/DashboardLayout';
import AvatarUpload from '@/components/AvatarUpload';
import AdminDocumentManagement from '@/components/admin/AdminDocumentManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import EmailSettings from '@/components/admin/EmailSettings';

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

interface AlumniDocumentRequest {
  id: string;
  requester_id: string;
  document_type: string;
  purpose: string;
  delivery_method: string;
  quantity: number;
  urgent: boolean;
  status: string;
  fee: number;
  payment_status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email?: string;
  };
}

interface AlumniSupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name?: string;
  } | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [alumniDocumentRequests, setAlumniDocumentRequests] = useState<AlumniDocumentRequest[]>([]);
  const [alumniSupportTickets, setAlumniSupportTickets] = useState<AlumniSupportTicket[]>([]);
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

  // Student management state
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [studentPhone, setStudentPhone] = useState('');

  // Announcement state
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState('normal');
  const [announcementAudience, setAnnouncementAudience] = useState('all');
  const [announcementExpiresAt, setAnnouncementExpiresAt] = useState('');

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

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (documentsData) setDocuments(documentsData);

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (announcementsData) setAnnouncements(announcementsData);

      // Fetch alumni document requests
      const { data: alumniDocRequestsData } = await supabase
        .from('alumni_document_requests')
        .select(`
          *,
          profiles:requester_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (alumniDocRequestsData) setAlumniDocumentRequests(alumniDocRequestsData);

      // Fetch alumni support tickets  
      const { data: supportTicketsData } = await supabase
        .from('alumni_support_tickets')
        .select(`
          *,
          requester:user_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false});

      if (supportTicketsData) setAlumniSupportTickets(supportTicketsData as AlumniSupportTicket[]);

      // Calculate stats
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('role');

      if (allProfiles) {
        setStats({
          totalStudents: allProfiles.filter(p => p.role === 'student').length,
          totalFaculty: allProfiles.filter(p => p.role === 'faculty').length,
          totalDocuments: documentsData?.length || 0,
          activeAnnouncements: announcementsData?.filter(a => a.is_active).length || 0,
          pendingAlumniRequests: alumniDocRequestsData?.filter(r => r.status === 'pending').length || 0,
          openSupportTickets: supportTicketsData?.filter(t => t.status === 'open').length || 0
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

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadTitle || !uploadCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${uploadCategory}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title: uploadTitle,
          description: uploadDescription,
          file_name: uploadFile.name,
          file_path: filePath,
          file_size: uploadFile.size,
          file_type: uploadFile.type,
          category: uploadCategory,
          target_audience: uploadAudience,
          uploaded_by: user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      // Reset form and refresh data
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadCategory('');
      setUploadAudience('all');
      fetchData();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle || !announcementContent) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        const { error } = await supabase
          .from('announcements')
          .update({
            title: announcementTitle,
            content: announcementContent,
            priority: announcementPriority,
            target_audience: announcementAudience,
            expires_at: announcementExpiresAt || null
          })
          .eq('id', editingAnnouncement.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement updated successfully"
        });
      } else {
        // Create new announcement
        const { error } = await supabase
          .from('announcements')
          .insert({
            title: announcementTitle,
            content: announcementContent,
            priority: announcementPriority,
            target_audience: announcementAudience,
            expires_at: announcementExpiresAt || null,
            created_by: user?.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement created successfully"
        });
      }

      // Reset form and refresh data
      setAnnouncementDialogOpen(false);
      setEditingAnnouncement(null);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setAnnouncementPriority('normal');
      setAnnouncementAudience('all');
      setAnnouncementExpiresAt('');
      fetchData();
    } catch (error) {
      console.error('Error with announcement:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`,
        variant: "destructive"
      });
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setStudentName('');
    setStudentEmail('');
    setStudentDepartment('');
    setStudentPhone('');
    setStudentDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentName(student.full_name);
    setStudentEmail(''); // Email from auth table, we'll handle separately
    setStudentDepartment(student.department || '');
    setStudentPhone(student.phone || '');
    setStudentDialogOpen(true);
  };

  const handleSaveStudent = async () => {
    if (!studentName || !studentEmail) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingStudent) {
        // Update existing student
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: studentName,
            department: studentDepartment,
            phone: studentPhone
          })
          .eq('id', editingStudent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Student updated successfully"
        });
      } else {
        // Create new student by signing them up
        const generateSecurePassword = () => {
          const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
          let password = '';
          for (let i = 0; i < 16; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
          }
          return password;
        };
        const temporaryPassword = generateSecurePassword(); // Students should change this on first login
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: studentEmail,
          password: temporaryPassword,
          options: {
            data: {
              full_name: studentName,
              role: 'student'
            }
          }
        });

        if (authError) {
          if (authError.message.includes('User already registered')) {
            toast({
              title: "Error",
              description: "A user with this email already exists",
              variant: "destructive"
            });
          } else {
            throw authError;
          }
          return;
        }

        // Update the profile with additional info (profile is created by trigger)
        if (authData.user) {
          // Wait a bit for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              department: studentDepartment,
              phone: studentPhone,
            })
            .eq('user_id', authData.user.id);

          if (profileError) {
            console.error('Profile update error:', profileError);
            toast({
              title: "Warning", 
              description: "Student created but profile update failed",
              variant: "destructive"
            });
          }
        }

        toast({
          title: "Success",
          description: `Student created successfully. Temporary password: ${temporaryPassword}`,
          duration: 10000
        });
      }

      setStudentDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('student-documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementTitle(announcement.title);
    setAnnouncementContent(announcement.content);
    setAnnouncementPriority(announcement.priority);
    setAnnouncementAudience(announcement.target_audience);
    setAnnouncementExpiresAt(announcement.expires_at ? announcement.expires_at.split('T')[0] : '');
    setAnnouncementDialogOpen(true);
  };

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementPriority('normal');
    setAnnouncementAudience('all');
    setAnnouncementExpiresAt('');
    setAnnouncementDialogOpen(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const handleViewReports = () => {
    toast({
      title: "Reports",
      description: "Advanced reporting dashboard coming soon!",
      variant: "default"
    });
  };

  const handleProcessRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('alumni_document_requests')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request marked as processing"
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive"
      });
    }
  };

  const handleViewStudent = (student: Student) => {
    toast({
      title: "Student Details",
      description: `Viewing profile for ${student.full_name}`,
      variant: "default"
    });
  };

  const toggleAnnouncementStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Announcement ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      fetchData();
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive"
      });
    }
  };

  const menuGroups = [
    {
      label: "Main",
      items: [
        { title: "Overview", icon: BarChart3, value: "overview", onClick: () => setCurrentTab("overview") },
        { title: "Academic", icon: BookOpen, value: "academic", onClick: () => setCurrentTab("academic") },
        { title: "Students", icon: Users, value: "students", onClick: () => setCurrentTab("students") },
        { title: "Finance", icon: DollarSign, value: "finance", onClick: () => setCurrentTab("finance") },
      ]
    },
    {
      label: "Admissions",
      items: [
        { title: "Applications", icon: FileText, value: "applications", onClick: () => setCurrentTab("applications") },
        { title: "Scoring", icon: TrendingUp, value: "scoring", onClick: () => setCurrentTab("scoring") },
        { title: "Messages", icon: Bell, value: "messaging", onClick: () => setCurrentTab("messaging") },
      ]
    },
    {
      label: "Management",
      items: [
        { title: "Document Gen", icon: Upload, value: "docgen", onClick: () => setCurrentTab("docgen") },
        { title: "User Management", icon: Shield, value: "user-management", onClick: () => setCurrentTab("user-management") },
        { title: "Documents", icon: FileText, value: "documents", onClick: () => setCurrentTab("documents") },
        { title: "Announcements", icon: Bell, value: "announcements", onClick: () => setCurrentTab("announcements") },
      ]
    },
    {
      label: "Settings",
      items: [
        { title: "Profile", icon: User, value: "profile", onClick: () => setCurrentTab("profile") },
        { title: "Email Settings", icon: Mail, value: "email", onClick: () => setCurrentTab("email") },
        { title: "System Settings", icon: Settings, value: "settings", onClick: () => setCurrentTab("settings") },
      ]
    }
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="System Administration Portal"
      userBadge={user?.role?.toUpperCase()}
      menuGroups={menuGroups}
      activeTab={currentTab}
    >
      {/* Content based on active tab */}
      {currentTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('students')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Total Students</CardTitle>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.totalStudents}</div>
                <p className="text-muted-foreground font-medium">Enrolled students</p>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('students')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Faculty Members</CardTitle>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.totalFaculty}</div>
                <p className="text-muted-foreground font-medium">Teaching staff</p>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('documents')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Documents</CardTitle>
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.totalDocuments}</div>
                <p className="text-muted-foreground font-medium">Uploaded files</p>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('announcements')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Announcements</CardTitle>
                <div className="p-3 bg-violet-500/10 rounded-xl">
                  <Bell className="h-6 w-6 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.activeAnnouncements}</div>
                <p className="text-muted-foreground font-medium">Active posts</p>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('applications')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Alumni Requests</CardTitle>
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.pendingAlumniRequests}</div>
                <p className="text-muted-foreground font-medium">Pending requests</p>
              </CardContent>
            </Card>

            <Card 
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => setCurrentTab('messaging')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold">Support Tickets</CardTitle>
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                  <Bell className="h-6 w-6 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">{stats.openSupportTickets}</div>
                <p className="text-muted-foreground font-medium">Open tickets</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-card via-card to-muted/20">
            <CardHeader className="pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                  <CardDescription className="text-lg mt-2">Common administrative tasks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={handleAddStudent}
                >
                  <UserPlus className="h-8 w-8 text-primary" />
                  <span className="font-medium">Add Student</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-8 w-8 text-emerald-600" />
                  <span className="font-medium">Upload Document</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={() => setAnnouncementDialogOpen(true)}
                >
                  <Bell className="h-8 w-8 text-amber-600" />
                  <span className="font-medium">New Announcement</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={handleViewReports}
                >
                  <BarChart3 className="h-8 w-8 text-violet-600" />
                  <span className="font-medium">View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "academic" && <AcademicManagement />}
      {currentTab === "students" && <StudentsTab />}
      {currentTab === "finance" && <FinanceManagement />}
      {currentTab === "applications" && <ApplicationManagement />}
      {currentTab === "scoring" && <ApplicationScoringSystem />}
      {currentTab === "messaging" && <AdminMessagingSystem />}
      {currentTab === "docgen" && <DocGenTab />}
      {currentTab === "user-management" && <SuperAdminUserManagement />}
      {currentTab === "documents" && <AdminDocumentManagement />}
      {currentTab === "announcements" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
                <CardDescription className="text-lg mt-2">Create and manage announcements for homepage and users</CardDescription>
              </div>
              <Button onClick={handleAddAnnouncement} className="h-12">
                <Bell className="mr-2 h-5 w-5" />
                New Announcement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Create your first announcement to display on the homepage</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start justify-between p-6 border rounded-xl hover:shadow-lg transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <Badge variant={announcement.priority === 'high' ? 'destructive' : 'default'}>
                          {announcement.priority}
                        </Badge>
                        <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {announcement.target_audience}
                        </Badge>
                      </div>
                      <div 
                        className="prose prose-sm max-w-none mb-3"
                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                      />
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                        {announcement.expires_at && (
                          <span>Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAnnouncementStatus(announcement.id, announcement.is_active)}
                      >
                        {announcement.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {currentTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>Manage your administrator information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AvatarUpload 
                currentAvatarUrl={user?.avatar_url}
                userId={user?.user_id || ''}
                userName={user?.full_name || 'Admin'}
                onAvatarUpdate={(url) => {
                  // Avatar updated successfully
                  toast({
                    title: "Success",
                    description: "Profile picture updated"
                  });
                }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user?.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user?.role?.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Admin ID</Label>
                  <p className="text-sm text-muted-foreground mt-1">ADM001</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ChangePassword />
        </div>
      )}
      {currentTab === "email" && <EmailSettings />}
      {currentTab === "settings" && <SystemSettings />}

      {/* Dialogs remain the same */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Upload Document</DialogTitle>
            <DialogDescription className="text-base">
              Upload a new document to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Document Title *</Label>
              <Input
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Enter document title"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">Description</Label>
              <Textarea
                id="description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Enter document description"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">Category *</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="student-services">Student Services</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-base font-medium">Target Audience</Label>
                <Select value={uploadAudience} onValueChange={setUploadAudience}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="alumni">Alumni Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file" className="text-base font-medium">File *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFileUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingStudent ? 'Edit Student' : 'Add Student'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingStudent ? 'Update student information.' : 'Add a new student to the system.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-base font-medium">Full Name *</Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student full name"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email" className="text-base font-medium">Email *</Label>
              <Input
                id="student-email"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Enter student email"
                className="h-12"
                disabled={!!editingStudent}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-dept" className="text-base font-medium">Department</Label>
                <Input
                  id="student-dept"
                  value={studentDepartment}
                  onChange={(e) => setStudentDepartment(e.target.value)}
                  placeholder="Enter department"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-phone" className="text-base font-medium">Phone</Label>
                <Input
                  id="student-phone"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="h-12"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStudent}>
              {editingStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
            </DialogTitle>
            <DialogDescription className="text-base">
              Create announcements with HTML/CSS styling that will appear on the homepage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title" className="text-base font-medium">Title *</Label>
              <Input
                id="ann-title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-content" className="text-base font-medium">
                Content (HTML/CSS Supported) *
              </Label>
              <Textarea
                id="ann-content"
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Enter announcement content. You can use HTML tags like <strong>, <em>, <p>, <ul>, <li>, etc."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Example: &lt;p&gt;Welcome to &lt;strong&gt;NSCU&lt;/strong&gt;! Check out our &lt;a href="/programs"&gt;programs&lt;/a&gt;.&lt;/p&gt;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ann-priority" className="text-base font-medium">Priority</Label>
                <Select value={announcementPriority} onValueChange={setAnnouncementPriority}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High (Red Alert)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-audience" className="text-base font-medium">Target Audience</Label>
                <Select value={announcementAudience} onValueChange={setAnnouncementAudience}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All (Homepage)</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-expires" className="text-base font-medium">Expiry Date (Optional)</Label>
              <Input
                id="ann-expires"
                type="date"
                value={announcementExpiresAt}
                onChange={(e) => setAnnouncementExpiresAt(e.target.value)}
                className="h-12"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration. Announcement will auto-hide after this date.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement}>
              {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;