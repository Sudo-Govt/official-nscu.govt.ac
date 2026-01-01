import React from 'react';
import { useAuth } from '@/context/AuthContext';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, ClipboardList, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentDashboardV2 = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data - in production, this would come from Supabase
  const stats = {
    currentSemester: 'Fall 2026',
    weekOfSemester: 8,
    totalWeeks: 16,
    enrolledCourses: 5,
    totalCredits: 15,
    pendingAssignments: 3,
    dueThisWeek: 2,
    cumulativeGPA: 3.67,
  };

  const courses = [
    {
      code: 'CS 301',
      name: 'Data Structures & Algorithms',
      credits: 3,
      professor: 'Dr. Smith',
      progress: 65,
      nextClass: 'Mon 10:00 AM',
    },
    {
      code: 'MATH 201',
      name: 'Linear Algebra',
      credits: 4,
      professor: 'Dr. Johnson',
      progress: 72,
      nextClass: 'Tue 2:00 PM',
    },
    {
      code: 'ENG 102',
      name: 'Technical Writing',
      credits: 3,
      professor: 'Prof. Williams',
      progress: 80,
      nextClass: 'Wed 11:00 AM',
    },
    {
      code: 'PHYS 101',
      name: 'Physics I',
      credits: 4,
      professor: 'Dr. Brown',
      progress: 55,
      nextClass: 'Thu 9:00 AM',
    },
  ];

  const grades = [
    { course: 'Data Structures & Algorithms', code: 'CS 301', grade: 'A', score: 92, credits: 3 },
    { course: 'Linear Algebra', code: 'MATH 201', grade: 'B+', score: 87, credits: 4 },
    { course: 'Technical Writing', code: 'ENG 102', grade: 'A-', score: 90, credits: 3 },
    { course: 'Physics I', code: 'PHYS 101', grade: 'B', score: 83, credits: 4 },
  ];

  const assignments = [
    {
      id: '1',
      title: 'Algorithm Analysis Report',
      course: 'CS 301',
      dueDate: 'Tomorrow, 11:59 PM',
      priority: 'high' as const,
      status: 'pending' as const,
    },
    {
      id: '2',
      title: 'Matrix Operations Problem Set',
      course: 'MATH 201',
      dueDate: 'Jan 5, 2026',
      priority: 'medium' as const,
      status: 'pending' as const,
    },
    {
      id: '3',
      title: 'Lab Report: Mechanics',
      course: 'PHYS 101',
      dueDate: 'Jan 7, 2026',
      priority: 'medium' as const,
      status: 'submitted' as const,
    },
  ];

  const schedule = [
    { id: '1', title: 'CS 301 - Lecture', time: '10:00 AM - 11:30 AM', type: 'class' as const, location: 'Room 201' },
    { id: '2', title: 'Study Group - Algorithms', time: '2:00 PM - 3:30 PM', type: 'meeting' as const, location: 'Library' },
    { id: '3', title: 'Office Hours - Dr. Smith', time: '4:00 PM - 5:00 PM', type: 'meeting' as const, location: 'CS Building' },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Assignment Due',
      message: 'Algorithm Analysis Report is due tomorrow at 11:59 PM',
      type: 'warning' as const,
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      title: 'Grade Posted',
      message: 'Your grade for PHYS 101 Quiz 3 has been posted',
      type: 'success' as const,
      time: '5 hours ago',
      isRead: false,
    },
    {
      id: '3',
      title: 'Course Announcement',
      message: 'MATH 201 class cancelled for Friday',
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

  return (
    <ModernDashboardLayout
      title="Welcome back"
      subtitle="Here's what's happening with your academics today"
      notificationCount={notifications.filter((n) => !n.isRead).length}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Current Semester"
            value={stats.currentSemester}
            subtitle={`Week ${stats.weekOfSemester} of ${stats.totalWeeks}`}
            icon={Calendar}
            variant="gold"
          />
          <StatCard
            title="Enrolled Courses"
            value={stats.enrolledCourses}
            subtitle={`${stats.totalCredits} credits`}
            icon={BookOpen}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            subtitle={`${stats.dueThisWeek} due this week`}
            icon={ClipboardList}
          />
          <StatCard
            title="Cumulative GPA"
            value={stats.cumulativeGPA.toFixed(2)}
            subtitle="Dean's List"
            icon={Award}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Courses & Assignments */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.code}
                      {...course}
                      onClick={() => handleCourseClick(course.code)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignments */}
            <AssignmentList assignments={assignments} />

            {/* Grades */}
            <GradeCard grades={grades} />
          </div>

          {/* Right Column - Calendar, GPA, Notifications */}
          <div className="space-y-6">
            <CalendarWidget date={new Date()} schedule={schedule} />
            <GPAOverview
              cumulativeGPA={stats.cumulativeGPA}
              semesterGPA={3.72}
              creditsEarned={96}
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
          <FinancialOverview
            totalDue={15000}
            amountPaid={10500}
            dueDate="Feb 15, 2026"
            hasFinancialAid={true}
            mealPlanBalance={450}
            printCredits={25}
          />
          <DegreeProgress
            totalCreditsEarned={96}
            totalCreditsRequired={120}
            expectedGraduation="May 2027"
            categories={degreeCategories}
          />
        </div>
      </div>
    </ModernDashboardLayout>
  );
};

export default StudentDashboardV2;
