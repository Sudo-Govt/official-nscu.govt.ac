import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CreditCard, User, Users, LogOut, FileText, Calendar } from 'lucide-react';
import mockDb from '@/database/mockDb';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [feeData, setFeeData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      // Fetch student data
      const student = mockDb.getStudentByUserId(user.user_id);
      setStudentData(student);

      // Fetch enrolled courses
      if (student) {
        const studentCourses = mockDb.getStudentCourses(student.student_id);
        setCourses(studentCourses);

        // Calculate fee data
        const transactions = mockDb.getFeeTransactionsByStudent(student.student_id);
        const totalPaid = transactions
          .filter(t => t.transaction_type === 'payment')
          .reduce((sum, t) => sum + t.amount, 0);
        
        setFeeData({
          totalFees: student.total_fees || 0,
          paidFees: totalPaid || 0,
          pendingFees: (student.total_fees || 0) - (totalPaid || 0)
        });
      }
    }
  }, [user]);

  const feePercentage = feeData ? (feeData.paidFees / feeData.totalFees) * 100 : 0;

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
                <h1 className="text-xl font-semibold text-foreground">Student Portal</h1>
                <p className="text-sm text-muted-foreground">
                  {studentData?.student_id} - {studentData?.program}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  Year {studentData?.year_of_study}
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="fees">Fee Status</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground">Current semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feePercentage.toFixed(0)}%</div>
                  <p className="text-xs text-muted-foreground">Fees paid</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Year of Study</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData?.year_of_study}</div>
                  <p className="text-xs text-muted-foreground">{studentData?.program}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Uploaded documents</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription>Your latest course grades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{course.course_name}</p>
                          <p className="text-xs text-muted-foreground">{course.course_code}</p>
                        </div>
                        <Badge variant={course.grade ? "default" : "secondary"}>
                          {course.grade || "In Progress"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fee Payment Status</CardTitle>
                  <CardDescription>Current semester fee details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Fees</span>
                      <span>₹{feeData?.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid</span>
                      <span className="text-green-600">₹{feeData?.paidFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Pending</span>
                      <span className="text-red-600">₹{feeData?.pendingFees.toLocaleString()}</span>
                    </div>
                    <Progress value={feePercentage} className="h-2" />
                  </div>
                  <Button className="w-full" variant="outline">
                    Make Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Your current semester courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{course.course_name}</h3>
                        <p className="text-sm text-muted-foreground">{course.course_code}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{course.credits} Credits</Badge>
                          <span className="text-xs text-muted-foreground">
                            Semester {course.semester} • Year {course.year}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={course.grade ? "default" : "secondary"}>
                          {course.grade || "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee Management</CardTitle>
                <CardDescription>View and manage your fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-medium text-lg">₹{feeData?.totalFees.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">Total Fees</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-green-50">
                      <h3 className="font-medium text-lg text-green-600">₹{feeData?.paidFees.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">Paid</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-red-50">
                      <h3 className="font-medium text-lg text-red-600">₹{feeData?.pendingFees.toLocaleString()}</h3>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Payment Progress</h4>
                    <Progress value={feePercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground">{feePercentage.toFixed(1)}% completed</p>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1">Make Payment</Button>
                    <Button variant="outline">Download Receipt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
                    <div>
                      <label className="text-sm font-medium">Year of Study</label>
                      <p className="text-sm text-muted-foreground mt-1">Year {studentData?.year_of_study}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Admission Date</label>
                      <p className="text-sm text-muted-foreground mt-1">{studentData?.admission_date}</p>
                    </div>
                  </div>
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumni">
            <Card>
              <CardHeader>
                <CardTitle>Alumni Network</CardTitle>
                <CardDescription>Connect with fellow alumni and current students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Alumni Network</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with thousands of NSCU alumni worldwide
                  </p>
                  <Button>Browse Alumni Directory</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;