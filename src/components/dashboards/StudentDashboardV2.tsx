import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ModernDashboardLayout from './ModernDashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import CourseCard from '@/components/dashboard/CourseCard';
import GradeCard from '@/components/dashboard/GradeCard';
import AssignmentList from '@/components/dashboard/AssignmentList';
import GPAOverview from '@/components/dashboard/GPAOverview';
import FinancialOverview from '@/components/dashboard/FinancialOverview';
import DegreeProgress from '@/components/dashboard/DegreeProgress';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import FormsSection from '@/components/dashboard/FormsSection';
import { InternalMessagingApp, InstantChat } from '@/components/messaging';
import StudentResourcesView from '@/components/student/StudentResourcesView';
import { LibraryView } from '@/components/library';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, ClipboardList, Award, GraduationCap, Library, Users, FileText, LayoutDashboard, MessageSquare, MessagesSquare, Mail, HelpCircle, BookMarked } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentData {
  id: string;
  student_id: string;
  name: string;
  course_name: string;
  course_id: string | null;
  program: string;
  specialization: string;
  enrollment_year: number;
  student_type: 'current' | 'alumni';
  cgpa: number;
  status: string;
}

interface CourseInfo {
  id: string;
  course_name: string;
  course_code: string;
  college: string;
  department: string;
  degree_type: string;
  duration_years: number;
  credit_hours: number;
}

const StudentDashboardV2 = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestAccount, setIsTestAccount] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user?.id]);

  const fetchStudentData = async () => {
    try {
      // Check if this is a test account
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_test_account')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profile?.is_test_account) {
        setIsTestAccount(true);
      }

      // Fetch student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (studentError) {
        console.error('Error fetching student:', studentError);
      }

      if (student) {
        setStudentData(student as StudentData);
        
        // Fetch course details if course_id exists
        if (student.course_id) {
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', student.course_id)
            .maybeSingle();

          if (!courseError && course) {
            setCourseInfo(course as CourseInfo);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAlumni = studentData?.student_type === 'alumni';
  const [activeTab, setActiveTab] = useState('overview');
  // Course-specific mock data (in production, filter based on course_id)
  const stats = {
    currentSemester: 'Fall 2026',
    weekOfSemester: 8,
    totalWeeks: 16,
    enrolledCourses: 5,
    totalCredits: courseInfo?.credit_hours || 15,
    pendingAssignments: isAlumni ? 0 : 3,
    dueThisWeek: isAlumni ? 0 : 2,
    cumulativeGPA: studentData?.cgpa || 3.67,
  };

  // Define course type
  type CourseItem = {
    code: string;
    name: string;
    credits: number;
    professor: string;
    progress: number;
    nextClass: string;
  };

  // Course-specific courses (filtered by program/department)
  const getCourseSpecificCourses = (): CourseItem[] => {
    const department = courseInfo?.department || studentData?.program || 'General';
    
    const coursesByDepartment: Record<string, CourseItem[]> = {
      'Computer Science': [
        { code: 'CS 301', name: 'Data Structures & Algorithms', credits: 3, professor: 'Dr. Smith', progress: 65, nextClass: 'Mon 10:00 AM' },
        { code: 'CS 302', name: 'Database Systems', credits: 3, professor: 'Dr. Johnson', progress: 72, nextClass: 'Tue 2:00 PM' },
        { code: 'CS 401', name: 'Machine Learning', credits: 3, professor: 'Prof. Williams', progress: 80, nextClass: 'Wed 11:00 AM' },
        { code: 'CS 350', name: 'Operating Systems', credits: 4, professor: 'Dr. Brown', progress: 55, nextClass: 'Thu 9:00 AM' },
      ],
      'Business Administration': [
        { code: 'BUS 301', name: 'Strategic Management', credits: 3, professor: 'Dr. Miller', progress: 65, nextClass: 'Mon 10:00 AM' },
        { code: 'BUS 302', name: 'Financial Accounting', credits: 3, professor: 'Dr. Davis', progress: 72, nextClass: 'Tue 2:00 PM' },
        { code: 'BUS 401', name: 'Marketing Analytics', credits: 3, professor: 'Prof. Wilson', progress: 80, nextClass: 'Wed 11:00 AM' },
        { code: 'BUS 350', name: 'Business Law', credits: 3, professor: 'Dr. Garcia', progress: 55, nextClass: 'Thu 9:00 AM' },
      ],
      'Engineering': [
        { code: 'ENG 301', name: 'Thermodynamics', credits: 4, professor: 'Dr. Lee', progress: 65, nextClass: 'Mon 10:00 AM' },
        { code: 'ENG 302', name: 'Fluid Mechanics', credits: 4, professor: 'Dr. Chen', progress: 72, nextClass: 'Tue 2:00 PM' },
        { code: 'ENG 401', name: 'Control Systems', credits: 3, professor: 'Prof. Patel', progress: 80, nextClass: 'Wed 11:00 AM' },
        { code: 'ENG 350', name: 'Materials Science', credits: 3, professor: 'Dr. Kim', progress: 55, nextClass: 'Thu 9:00 AM' },
      ],
    };

    return coursesByDepartment[department] || [
      { code: 'GEN 301', name: 'Core Subject 1', credits: 3, professor: 'Dr. Smith', progress: 65, nextClass: 'Mon 10:00 AM' },
      { code: 'GEN 302', name: 'Core Subject 2', credits: 3, professor: 'Dr. Johnson', progress: 72, nextClass: 'Tue 2:00 PM' },
      { code: 'GEN 401', name: 'Advanced Topic', credits: 3, professor: 'Prof. Williams', progress: 80, nextClass: 'Wed 11:00 AM' },
      { code: 'GEN 350', name: 'Elective Course', credits: 3, professor: 'Dr. Brown', progress: 55, nextClass: 'Thu 9:00 AM' },
    ];
  };

  const courses = getCourseSpecificCourses();

  // Course-specific library resources
  const getLibraryResources = () => {
    const department = courseInfo?.department || studentData?.program || 'General';
    
    const libraryByDepartment: Record<string, { title: string; type: string; available: boolean }[]> = {
      'Computer Science': [
        { title: 'Introduction to Algorithms (CLRS)', type: 'Textbook', available: true },
        { title: 'Clean Code by Robert Martin', type: 'Reference', available: true },
        { title: 'Design Patterns: Elements of Reusable OO Software', type: 'Reference', available: false },
        { title: 'IEEE Digital Library Access', type: 'Database', available: true },
      ],
      'Business Administration': [
        { title: 'Principles of Corporate Finance', type: 'Textbook', available: true },
        { title: 'Good to Great by Jim Collins', type: 'Reference', available: true },
        { title: 'Harvard Business Review Collection', type: 'Journal', available: true },
        { title: 'Bloomberg Terminal Access', type: 'Database', available: false },
      ],
      'Engineering': [
        { title: 'Engineering Mechanics: Statics', type: 'Textbook', available: true },
        { title: 'Fundamentals of Thermodynamics', type: 'Textbook', available: true },
        { title: 'ASME Digital Collection', type: 'Journal', available: true },
        { title: 'MATLAB Software License', type: 'Software', available: true },
      ],
    };

    return libraryByDepartment[department] || [
      { title: 'General Reference Book 1', type: 'Textbook', available: true },
      { title: 'Academic Journal Access', type: 'Journal', available: true },
      { title: 'Research Database', type: 'Database', available: true },
    ];
  };

  const grades = courses.map((course, i) => ({
    course: course.name,
    code: course.code,
    grade: ['A', 'B+', 'A-', 'B'][i % 4],
    score: [92, 87, 90, 83][i % 4],
    credits: course.credits,
  }));

  const assignments = isAlumni ? [] : [
    {
      id: '1',
      title: `${courses[0]?.code || 'CS 301'} - Analysis Report`,
      course: courses[0]?.code || 'CS 301',
      dueDate: 'Tomorrow, 11:59 PM',
      priority: 'high' as const,
      status: 'pending' as const,
    },
    {
      id: '2',
      title: `${courses[1]?.code || 'CS 302'} - Problem Set`,
      course: courses[1]?.code || 'CS 302',
      dueDate: 'Jan 5, 2026',
      priority: 'medium' as const,
      status: 'pending' as const,
    },
    {
      id: '3',
      title: `${courses[2]?.code || 'CS 401'} - Lab Report`,
      course: courses[2]?.code || 'CS 401',
      dueDate: 'Jan 7, 2026',
      priority: 'medium' as const,
      status: 'submitted' as const,
    },
  ];

  const schedule = isAlumni ? [] : [
    { id: '1', title: `${courses[0]?.code} - Lecture`, time: '10:00 AM - 11:30 AM', type: 'class' as const, location: 'Room 201' },
    { id: '2', title: 'Study Group', time: '2:00 PM - 3:30 PM', type: 'meeting' as const, location: 'Library' },
    { id: '3', title: 'Office Hours', time: '4:00 PM - 5:00 PM', type: 'meeting' as const, location: 'Faculty Building' },
  ];

  const notifications = [
    {
      id: '1',
      title: isAlumni ? 'Alumni Event' : 'Assignment Due',
      message: isAlumni ? 'Annual alumni meetup scheduled for next month' : `${courses[0]?.name} report due tomorrow`,
      type: isAlumni ? 'info' as const : 'warning' as const,
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      title: isAlumni ? 'Job Opportunity' : 'Grade Posted',
      message: isAlumni ? 'New job posting matching your profile' : `Your grade for ${courses[1]?.code} has been posted`,
      type: 'success' as const,
      time: '5 hours ago',
      isRead: false,
    },
    {
      id: '3',
      title: isAlumni ? 'Network Update' : 'Course Announcement',
      message: isAlumni ? 'A colleague from your batch is now connected' : `${courses[2]?.code} class cancelled for Friday`,
      type: 'info' as const,
      time: '1 day ago',
      isRead: true,
    },
  ];

  const degreeCategories = [
    { name: 'Core Requirements', earned: 42, required: 60 },
    { name: 'Major Courses', earned: 24, required: 36 },
    { name: 'Electives', earned: 12, required: 18 },
    { name: 'General Education', earned: 18, required: 24 },
  ];

  const handleCourseClick = (code: string) => {
    toast({
      title: `Opening ${code}`,
      description: 'Redirecting to course page...',
    });
  };

  const libraryResources = getLibraryResources();

  return (
    <ModernDashboardLayout
      title={`Welcome back${studentData?.name ? `, ${studentData.name.split(' ')[0]}` : ''}`}
      subtitle={
        <div className="flex items-center gap-2">
          <span>
            {isAlumni 
              ? `Alumni - Class of ${studentData?.enrollment_year || 'N/A'}`
              : `${studentData?.program || 'Student'} - ${courseInfo?.college || 'University'}`
            }
          </span>
          <Badge variant={isAlumni ? 'secondary' : 'default'}>
            {isAlumni ? 'Alumni' : 'Current Student'}
          </Badge>
          {isTestAccount && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-400">
              Test Account - View Only
            </Badge>
          )}
        </div>
      }
      notificationCount={notifications.filter((n) => !n.isRead).length}
    >
      <div className="space-y-6">
        {/* Test Account Banner */}
        {isTestAccount && (
          <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="py-3">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <span className="font-medium">🔒 Test Account</span>
                <span className="text-sm">This account is for payment gateway testing only. All action buttons are disabled.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="mail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Mail
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
        {/* Course Info Banner */}
        {courseInfo && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">{courseInfo.course_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {courseInfo.course_code} • {courseInfo.degree_type} • {courseInfo.department}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{' '}
                    <span className="font-medium">{courseInfo.duration_years} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credits:</span>{' '}
                    <span className="font-medium">{courseInfo.credit_hours}</span>
                  </div>
                  {studentData?.specialization && (
                    <div>
                      <span className="text-muted-foreground">Specialization:</span>{' '}
                      <span className="font-medium">{studentData.specialization}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={isAlumni ? "Graduation Year" : "Current Semester"}
            value={isAlumni ? (studentData?.enrollment_year ? studentData.enrollment_year + (courseInfo?.duration_years || 4) : 'N/A').toString() : stats.currentSemester}
            subtitle={isAlumni ? studentData?.program : `Week ${stats.weekOfSemester} of ${stats.totalWeeks}`}
            icon={Calendar}
            variant="gold"
          />
          <StatCard
            title={isAlumni ? "Completed Courses" : "Enrolled Courses"}
            value={stats.enrolledCourses}
            subtitle={`${stats.totalCredits} credits`}
            icon={BookOpen}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title={isAlumni ? "Alumni Network" : "Pending Assignments"}
            value={isAlumni ? 1250 : stats.pendingAssignments}
            subtitle={isAlumni ? "Connected alumni" : `${stats.dueThisWeek} due this week`}
            icon={isAlumni ? Users : ClipboardList}
          />
          <StatCard
            title={isAlumni ? "Final CGPA" : "Cumulative GPA"}
            value={stats.cumulativeGPA.toFixed(2)}
            subtitle={isAlumni ? "Graduated with Honors" : "Dean's List"}
            icon={Award}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions disabled={isTestAccount} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Courses & Assignments */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {isAlumni ? 'Completed Courses' : 'My Courses'}
                </CardTitle>
                <CardDescription>
                  {courseInfo?.department ? `${courseInfo.department} Department` : studentData?.program || 'Your enrolled courses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.code}
                      {...course}
                      progress={isAlumni ? 100 : course.progress}
                      onClick={() => handleCourseClick(course.code)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Library Resources - Course Specific */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Library Resources
                </CardTitle>
                <CardDescription>
                  Resources for {courseInfo?.course_name || studentData?.program || 'your program'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {libraryResources.map((resource, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.type}</p>
                      </div>
                      <Badge variant={resource.available ? 'default' : 'secondary'}>
                        {resource.available ? 'Available' : 'In Use'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignments - only for current students */}
            {!isAlumni && <AssignmentList assignments={assignments} />}

            {/* Grades */}
            <GradeCard grades={grades} />
          </div>

          {/* Right Column - Calendar, GPA, Notifications */}
          <div className="space-y-6">
            {!isAlumni && <CalendarWidget date={new Date()} schedule={schedule} />}
            <GPAOverview
              cumulativeGPA={stats.cumulativeGPA}
              semesterGPA={isAlumni ? stats.cumulativeGPA : 3.72}
              creditsEarned={isAlumni ? 120 : 96}
              creditsRequired={120}
              isDeansList={true}
            />
            <NotificationsPanel
              notifications={notifications}
              onMarkAllRead={() => {
                toast({ title: 'All notifications marked as read' });
              }}
            />
          </div>
        </div>

        {/* Bottom Row - Financial & Degree Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!isAlumni && (
            <FinancialOverview
              totalDue={15000}
              amountPaid={10500}
              dueDate="Feb 15, 2026"
              hasFinancialAid={true}
              mealPlanBalance={450}
              printCredits={25}
            />
          )}
          <DegreeProgress
            totalCreditsEarned={isAlumni ? 120 : 96}
            totalCreditsRequired={120}
            expectedGraduation={isAlumni ? `Graduated ${(studentData?.enrollment_year || 2022) + (courseInfo?.duration_years || 4)}` : 'May 2027'}
            categories={degreeCategories.map(cat => isAlumni ? { ...cat, earned: cat.required } : cat)}
          />
        </div>
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <LibraryView />
          </TabsContent>

          <TabsContent value="mail" className="mt-6">
            <InternalMessagingApp />
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <FormsSection />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <StudentResourcesView />
          </TabsContent>
        </Tabs>
      </div>
    </ModernDashboardLayout>
  );
};

export default StudentDashboardV2;
