import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, LogOut } from 'lucide-react';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
                alt="NSCU Logo" 
                className="h-8 w-auto mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Faculty Portal</h1>
                <p className="text-sm text-muted-foreground">Academic Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  {user?.role.toUpperCase()}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  );
};

export default FacultyDashboard;