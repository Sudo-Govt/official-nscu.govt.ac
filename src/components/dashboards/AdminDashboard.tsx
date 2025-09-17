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
  LogOut
} from 'lucide-react';
import ChangePassword from '@/components/ChangePassword';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import SuperAdminUserManagement from '@/components/admin/SuperAdminUserManagement';
import ApplicationScoringSystem from '@/components/admin/ApplicationScoringSystem';
import AdminMessagingSystem from '@/components/admin/AdminMessagingSystem';

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
  const { user, logout } = useAuth();
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
            target_audience: announcementAudience
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
    setAnnouncementDialogOpen(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <img 
                  src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
                  alt="NSCU Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground font-medium">System Administration Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-semibold text-foreground text-lg">{user?.full_name}</p>
                <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={logout}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-12 h-14 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="user-management">User Mgmt</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="alumni-requests">Alumni</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
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
                  <CardTitle className="text-base font-semibold">Active Announcements</CardTitle>
                  <div className="p-3 bg-violet-500/10 rounded-xl">
                    <Bell className="h-6 w-6 text-violet-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">{stats.activeAnnouncements}</div>
                  <p className="text-muted-foreground font-medium">Currently active</p>
                </CardContent>
              </Card>

              <Card 
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
                onClick={() => setCurrentTab('alumni-requests')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">Pending Alumni Requests</CardTitle>
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">{stats.pendingAlumniRequests}</div>
                  <p className="text-muted-foreground font-medium">Awaiting review</p>
                </CardContent>
              </Card>

              <Card 
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm cursor-pointer hover:scale-105"
                onClick={() => setCurrentTab('alumni-requests')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">Open Support Tickets</CardTitle>
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">{stats.openSupportTickets}</div>
                  <p className="text-muted-foreground font-medium">Need attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-card via-card to-muted/20">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                    <CardDescription className="text-lg mt-2">Administrative tools and shortcuts</CardDescription>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                      >
                        <Upload className="h-8 w-8 text-primary" />
                        <span className="font-medium">Upload Document</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Upload Document</DialogTitle>
                        <DialogDescription className="text-base">
                          Upload a new document to the system. Choose the appropriate category and audience.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-base font-medium">Title *</Label>
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
                            placeholder="Enter document description (optional)"
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
                                <SelectItem value="transcript">Transcript</SelectItem>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="announcement">Announcement</SelectItem>
                                <SelectItem value="course_material">Course Material</SelectItem>
                                <SelectItem value="policy">Policy Document</SelectItem>
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
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <p className="text-sm text-muted-foreground">
                            Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleFileUpload} disabled={uploading}>
                          {uploading ? 'Uploading...' : 'Upload Document'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                      >
                        <Bell className="h-8 w-8 text-emerald-600" />
                        <span className="font-medium">New Announcement</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                       <DialogHeader>
                         <DialogTitle className="text-2xl font-bold">
                           {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                         </DialogTitle>
                         <DialogDescription className="text-base">
                           {editingAnnouncement ? 'Update the announcement details.' : 'Create a new announcement to communicate with students and faculty.'}
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
                          <Label htmlFor="ann-content" className="text-base font-medium">Content *</Label>
                          <Textarea
                            id="ann-content"
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                            placeholder="Enter announcement content"
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="priority" className="text-base font-medium">Priority</Label>
                            <Select value={announcementPriority} onValueChange={setAnnouncementPriority}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
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
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="students">Students Only</SelectItem>
                                <SelectItem value="faculty">Faculty Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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

                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                    onClick={handleAddStudent}
                  >
                    <UserPlus className="h-8 w-8 text-amber-600" />
                    <span className="font-medium">Add Student</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                    onClick={handleViewReports}
                  >
                    <BarChart3 className="h-8 w-8 text-violet-600" />
                    <span className="font-medium">View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationManagement />
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            <ApplicationScoringSystem />
          </TabsContent>

          <TabsContent value="messaging" className="space-y-6">
            <AdminMessagingSystem />
          </TabsContent>

          <TabsContent value="user-management" className="space-y-6">
            <SuperAdminUserManagement />
          </TabsContent>

        <TabsContent value="students" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
                    <CardDescription className="text-lg mt-2">View and manage student records</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={handleAddStudent}>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/30 bg-gradient-to-r from-card to-muted/20 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{student.full_name}</h3>
                            <p className="text-muted-foreground font-medium">ID: {student.user_id}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline">{student.department || 'No Department'}</Badge>
                              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                {student.status || 'Active'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewStudent(student)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Document Management</CardTitle>
                    <CardDescription className="text-lg mt-2">Upload and manage documents</CardDescription>
                  </div>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-primary/80">
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/30 bg-gradient-to-r from-card to-muted/20 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-amber-500/10 rounded-xl">
                            <FileText className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{doc.title}</h3>
                            <p className="text-muted-foreground font-medium">{doc.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline">{doc.category}</Badge>
                              <Badge variant="secondary">{doc.target_audience}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
                    <CardDescription className="text-lg mt-2">Create and manage announcements</CardDescription>
                  </div>
                  <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-primary/80">
                        <Bell className="h-5 w-5 mr-2" />
                        New Announcement
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/30 bg-gradient-to-r from-card to-muted/20 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-xl ${
                            announcement.priority === 'urgent' ? 'bg-red-500/10' :
                            announcement.priority === 'high' ? 'bg-orange-500/10' :
                            'bg-blue-500/10'
                          }`}>
                            <Bell className={`h-6 w-6 ${
                              announcement.priority === 'urgent' ? 'text-red-600' :
                              announcement.priority === 'high' ? 'text-orange-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground">{announcement.title}</h3>
                            <p className="text-muted-foreground font-medium mt-1">{announcement.content}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant={
                                announcement.priority === 'urgent' ? 'destructive' :
                                announcement.priority === 'high' ? 'default' :
                                'secondary'
                              }>
                                {announcement.priority}
                              </Badge>
                              <Badge variant="outline">{announcement.target_audience}</Badge>
                              <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                                {announcement.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(announcement.created_at).toLocaleDateString()}
                              </span>
                            </div>
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
                          <Button variant="outline" size="sm" onClick={() => handleEditAnnouncement(announcement)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumni-requests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alumni Document Requests */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Document Requests</CardTitle>
                  <CardDescription>Alumni requesting transcripts, certificates, and other documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {alumniDocumentRequests.length > 0 ? (
                      alumniDocumentRequests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold capitalize">
                                {request.document_type.replace('_', ' ')}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {request.profiles?.full_name || 'Unknown User'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                request.status === 'pending' ? 'secondary' :
                                request.status === 'processing' ? 'default' :
                                request.status === 'ready' ? 'outline' : 'default'
                              }>
                                {request.status}
                              </Badge>
                              {request.urgent && (
                                <Badge variant="destructive" className="ml-2">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Purpose:</strong> {request.purpose}</p>
                            <p><strong>Delivery:</strong> {request.delivery_method}</p>
                            <p><strong>Requested:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleProcessRequest(request.id)}
                            >
                              Process Request
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No document requests found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Alumni Support Tickets */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Support Tickets</CardTitle>
                  <CardDescription>Alumni support requests and inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {alumniSupportTickets.length > 0 ? (
                      alumniSupportTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{ticket.subject}</h4>
                              <p className="text-sm text-muted-foreground">
                                {ticket.profiles?.full_name || 'Unknown User'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                ticket.status === 'open' ? 'destructive' :
                                ticket.status === 'in_progress' ? 'default' :
                                ticket.status === 'resolved' ? 'outline' : 'secondary'
                              }>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Category:</strong> {ticket.category}</p>
                            <p><strong>Description:</strong> {ticket.description.substring(0, 100)}...</p>
                            <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="default">
                              Respond
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No support tickets found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Academic Calendar</CardTitle>
                <CardDescription className="text-lg mt-2">Manage academic events and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Academic calendar management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Manage your administrator information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
            
            <ChangePassword />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">System Settings</CardTitle>
                <CardDescription className="text-lg mt-2">Configure system preferences and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">System settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Management Dialog */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;