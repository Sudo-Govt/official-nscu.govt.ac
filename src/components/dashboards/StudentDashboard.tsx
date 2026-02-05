import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CreditCard, User, Users, LogOut, FileText, Calendar, GraduationCap, Library, MapPin, Briefcase, Award, MessageSquare, Clock, Download, Upload, TrendingUp, Bell, Star, Target, Zap, Trophy, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChangePassword from '@/components/ChangePassword';
import DashboardLayout from '@/components/DashboardLayout';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import StudentCourseProgress from './StudentCourseProgress';
import UserCourseInfo from './UserCourseInfo';

interface StudentRecord {
  id: string;
  user_id: string;
  student_id: string;
  name: string;
  program: string | null;
  course_name: string | null;
  enrollment_year: number | null;
  status: string | null;
  cgpa: number | null;
  total_fees?: number;
}

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('overview');
  const [studentData, setStudentData] = useState<StudentRecord | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [feeData, setFeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch student record from Supabase
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.user_id)
        .maybeSingle();

      if (studentError) {
        console.error('Error fetching student data:', studentError);
      }

      if (student) {
        setStudentData(student as StudentRecord);
        
        // Set default fee data
        const totalFees = 50000; // Default value
        setFeeData({
          totalFees: totalFees,
          paidFees: 0,
          pendingFees: totalFees
        });
      } else {
        // Fallback: use profile data if no student record
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.user_id)
          .maybeSingle();

        if (profile) {
          setStudentData({
            id: profile.id,
            user_id: profile.user_id,
            student_id: 'STU-' + user.user_id.slice(0, 8).toUpperCase(),
            name: profile.full_name || user.full_name || 'Student',
            program: null,
            course_name: null,
            enrollment_year: new Date().getFullYear(),
            status: 'active',
            cgpa: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const feePercentage = feeData ? (feeData.paidFees / feeData.totalFees) * 100 : 0;

  // Student Action Handlers
  const handleDownloadTranscript = () => {
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJYqhoralU3ViIFZhcmlhYmxlcy9GaWxsYWJsZSAvUGFnZTF8';
    link.download = `transcript_${studentData?.student_id || 'student'}.pdf`;
    link.click();
    toast({
      title: "Success",
      description: "Transcript downloaded successfully"
    });
  };

  const handleSubmitAssignment = () => {
    // Open file upload dialog simulation
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Assignment Submitted",
          description: `${file.name} uploaded successfully`
        });
      }
    };
    input.click();
  };

  const handleLibraryServices = () => {
    toast({
      title: "Library Services",
      description: "Opening digital library portal...",
      action: (
        <Button variant="outline" size="sm">
          Visit Library
        </Button>
      )
    });
  };

  const handleContactAdvisor = () => {
    toast({
      title: "Academic Advisor",
      description: "Connecting to advisor chat...",
      action: (
        <Button variant="outline" size="sm">
          Start Chat
        </Button>
      )
    });
  };

  const handleMakePayment = () => {
    toast({
      title: "Fee Payment",
      description: "Redirecting to secure payment gateway...",
      action: (
        <Button variant="outline" size="sm">
          Proceed
        </Button>
      )
    });
  };

  const menuGroups = [
    {
      label: "Academic",
      items: [
        { title: "Overview", icon: Trophy, value: "overview", onClick: () => setCurrentTab("overview") },
        { title: "My Courses", icon: GraduationCap, value: "my-courses", onClick: () => setCurrentTab("my-courses") },
        { title: "Courses", icon: BookOpen, value: "courses", onClick: () => setCurrentTab("courses") },
        { title: "Academics", icon: GraduationCap, value: "academics", onClick: () => setCurrentTab("academics") },
        { title: "Fees", icon: CreditCard, value: "fees", onClick: () => setCurrentTab("fees") },
      ]
    },
    {
      label: "Communication",
      items: [
        { title: "Internal Mail", icon: Mail, value: "mail", onClick: () => setCurrentTab("mail") },
      ]
    },
    {
      label: "Services",
      items: [
        { title: "Library", icon: Library, value: "library", onClick: () => setCurrentTab("library") },
        { title: "Career", icon: Briefcase, value: "career", onClick: () => setCurrentTab("career") },
        { title: "Messages", icon: MessageSquare, value: "messages", onClick: () => setCurrentTab("messages") },
        { title: "Campus Life", icon: MapPin, value: "campus", onClick: () => setCurrentTab("campus") },
      ]
    },
    {
      label: "Account",
      items: [
        { title: "Profile", icon: User, value: "profile", onClick: () => setCurrentTab("profile") },
        { title: "Password", icon: Users, value: "password", onClick: () => setCurrentTab("password") },
      ]
    }
  ];

  return (
    <DashboardLayout
      title="Student Portal"
      subtitle={
        <div className="space-y-1">
          <span>{studentData?.student_id} • {studentData?.program}</span>
          {user && <UserCourseInfo userId={user.user_id} userRole="student" compact />}
        </div>
      }
      userBadge={studentData?.enrollment_year ? `Batch ${studentData.enrollment_year}` : ''}
      menuGroups={menuGroups}
      activeTab={currentTab}
    >
      {/* My Courses Tab - Academic Progress */}
      {currentTab === "my-courses" && user && (
        <StudentCourseProgress userId={user.user_id} />
      )}

      {/* Content based on active tab */}
      {currentTab === "overview" && (
        <div className="space-y-8">
          {/* Course Info with Semester Details */}
          {user && <UserCourseInfo userId={user.user_id} userRole="student" />}
          
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-primary">Enrolled Courses</CardTitle>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">{courses.length}</div>
                <p className="text-muted-foreground font-medium">Current semester</p>
                <div className="mt-4 flex items-center text-sm text-primary">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2 from last semester
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-accent">CGPA</CardTitle>
                <div className="p-3 bg-accent/10 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent mb-2">8.7</div>
                <p className="text-muted-foreground font-medium">Overall grade</p>
                <div className="mt-4 flex items-center text-sm text-accent">
                  <Star className="h-4 w-4 mr-1" />
                  Excellent performance
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-destructive">Fee Status</CardTitle>
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <CreditCard className="h-6 w-6 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive mb-2">{feePercentage.toFixed(0)}%</div>
                <p className="text-muted-foreground font-medium">Fees paid</p>
                <div className="mt-4">
                  <Progress value={feePercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-secondary">Credits Earned</CardTitle>
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary mb-2">142</div>
                <p className="text-muted-foreground font-medium">Out of 180 required</p>
                <div className="mt-4 flex items-center text-sm text-secondary">
                  <Target className="h-4 w-4 mr-1" />
                  79% complete
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-card via-card to-muted/20">
            <CardHeader className="pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                  <CardDescription className="text-lg mt-2">Frequently used services and tools</CardDescription>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  onClick={handleDownloadTranscript}
                >
                  <Download className="h-8 w-8 text-primary" />
                  <span className="font-medium">Download Transcript</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  onClick={handleSubmitAssignment}
                >
                  <Upload className="h-8 w-8 text-emerald-600" />
                  <span className="font-medium">Submit Assignment</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  onClick={handleLibraryServices}
                >
                  <Library className="h-8 w-8 text-amber-600" />
                  <span className="font-medium">Library Services</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  onClick={handleContactAdvisor}
                >
                  <MessageSquare className="h-8 w-8 text-violet-600" />
                  <span className="font-medium">Contact Advisor</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Recent Grades</CardTitle>
                    <CardDescription className="text-base mt-1">Your latest course grades</CardDescription>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Trophy className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200">
                      <div>
                        <p className="font-semibold text-foreground">{course.course_name}</p>
                        <p className="text-sm text-muted-foreground font-medium">{course.course_code}</p>
                      </div>
                      <Badge 
                        variant={course.grade ? "default" : "secondary"} 
                        className="text-sm px-3 py-1"
                      >
                        {course.grade || "In Progress"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Fee Payment Status</CardTitle>
                    <CardDescription className="text-base mt-1">Current semester fee details</CardDescription>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="font-medium">Total Fees</span>
                    <span className="font-bold text-lg">${feeData?.totalFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <span className="font-medium">Paid</span>
                    <span className="font-bold text-lg text-emerald-600">${feeData?.paidFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <span className="font-medium">Pending</span>
                    <span className="font-bold text-lg text-red-600">${feeData?.pendingFees.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={feePercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground text-center">{feePercentage.toFixed(1)}% completed</p>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={handleMakePayment}
                >
                  Make Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentTab === "courses" && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Enrolled Courses</CardTitle>
                <CardDescription className="text-lg mt-2">Your current semester courses</CardDescription>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {courses.map((course, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl border-2 border-border/50 hover:border-primary/30 bg-gradient-to-r from-card to-muted/20 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{course.course_name}</h3>
                        <p className="text-muted-foreground font-medium text-lg">{course.course_code}</p>
                      </div>
                      <Badge 
                        variant={course.grade ? "default" : "secondary"} 
                        className="text-sm px-4 py-2 font-medium"
                      >
                        {course.grade || "In Progress"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="text-center p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Credits</p>
                        <p className="text-lg font-bold text-foreground">{course.credits}</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                        <p className="text-sm font-medium text-foreground">Prof. Smith</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                        <p className="text-sm font-medium text-foreground">MWF 10:00 AM</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Room</p>
                        <p className="text-sm font-medium text-foreground">SB 101</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "academics" && (
        <Card>
          <CardHeader>
            <CardTitle>Academic Records</CardTitle>
            <CardDescription>View your academic performance and transcripts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Academic records interface coming soon</p>
          </CardContent>
        </Card>
      )}

      {currentTab === "library" && (
        <Card>
          <CardHeader>
            <CardTitle>Library Services</CardTitle>
            <CardDescription>Access digital library and book reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Library services interface coming soon</p>
          </CardContent>
        </Card>
      )}

      {currentTab === "career" && (
        <Card>
          <CardHeader>
            <CardTitle>Career Services</CardTitle>
            <CardDescription>Career guidance and job opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Career services interface coming soon</p>
          </CardContent>
        </Card>
      )}

      {currentTab === "campus" && (
        <Card>
          <CardHeader>
            <CardTitle>Campus Life</CardTitle>
            <CardDescription>Events, clubs, and campus activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Campus life interface coming soon</p>
          </CardContent>
        </Card>
      )}

      {currentTab === "mail" && <InternalMailSystem />}

      {currentTab === "fees" && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Management</CardTitle>
            <CardDescription>View and manage your fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Fee management interface coming soon</p>
          </CardContent>
        </Card>
      )}

      {currentTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <p className="text-sm text-muted-foreground mt-1">{user?.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Student ID</label>
                <p className="text-sm text-muted-foreground mt-1">{studentData?.student_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Program</label>
                <p className="text-sm text-muted-foreground mt-1">{studentData?.program}</p>
              </div>
            </div>
            <Button className="mt-4">Edit Profile</Button>
          </CardContent>
        </Card>
      )}

      {currentTab === "password" && <ChangePassword />}
    </DashboardLayout>
  );
};

export default StudentDashboard;