import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { BookOpen, Users, Calendar, Settings, User } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import ChangePassword from '@/components/ChangePassword';

const FacultyDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BookOpen
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: Users
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      subItems: [
        { id: 'profile', label: 'Profile' },
        { id: 'password', label: 'Change Password' }
      ]
    }
  ];

  return (
    <DashboardLayout 
      menuItems={menuItems}
      title="Faculty Portal"
      subtitle="Academic Management System"
    >

          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Faculty Dashboard</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                The faculty portal is currently under development. Please check back soon for access to course management, student grades, and academic tools.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Card className="text-center p-6">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Course Management</h3>
                  <p className="text-sm text-muted-foreground">Manage your courses and curriculum</p>
                </Card>
                <Card className="text-center p-6">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Student Grades</h3>
                  <p className="text-sm text-muted-foreground">View and update student grades</p>
                </Card>
                <Card className="text-center p-6">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Schedule</h3>
                  <p className="text-sm text-muted-foreground">Manage your teaching schedule</p>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                For immediate assistance, please contact IT support at{' '}
                <a href="mailto:it@nscu.govt.ac" className="text-primary hover:underline">
                  it@nscu.govt.ac
                </a>
              </p>
            </div>
      </TabsContent>

      <TabsContent value="courses" className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you are currently teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Course management coming soon</p>
              </CardContent>
            </Card>
      </TabsContent>

      <TabsContent value="profile" className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Profile</CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{user?.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Employee ID</Label>
                    <p className="text-sm text-muted-foreground mt-1">EMP001</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-sm text-muted-foreground mt-1">Computer Science</p>
                  </div>
                </div>
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
      </TabsContent>

      <TabsContent value="password" className="p-6 space-y-6">
        <ChangePassword />
      </TabsContent>
    </DashboardLayout>
  );
};

export default FacultyDashboard;