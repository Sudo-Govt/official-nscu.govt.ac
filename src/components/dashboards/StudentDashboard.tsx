import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CreditCard, User, Users, LogOut, FileText, Calendar, GraduationCap, Library, MapPin, Briefcase, Award, MessageSquare, Clock, Download, Upload, TrendingUp, Bell, Star, Target, Zap, Trophy } from 'lucide-react';
import mockDb from '@/database/mockDb';
import ChangePassword from '@/components/ChangePassword';
import MessagesPanel from '@/components/student/MessagesPanel';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Header with Glass Effect */}
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
                  Student Portal
                </h1>
                <p className="text-muted-foreground font-medium">
                  {studentData?.student_id} • {studentData?.program}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-semibold text-foreground text-lg">{user?.full_name}</p>
                <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                  Year {studentData?.year_of_study}
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

      {/* Main Content with Enhanced Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-9 h-14 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
            <TabsTrigger value="courses" className="text-sm font-medium">Courses</TabsTrigger>
            <TabsTrigger value="academics" className="text-sm font-medium">Academics</TabsTrigger>
            <TabsTrigger value="library" className="text-sm font-medium">Library</TabsTrigger>
            <TabsTrigger value="career" className="text-sm font-medium">Career</TabsTrigger>
            <TabsTrigger value="campus" className="text-sm font-medium">Campus Life</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm font-medium">Messages</TabsTrigger>
            <TabsTrigger value="fees" className="text-sm font-medium">Fees</TabsTrigger>
            <TabsTrigger value="profile" className="text-sm font-medium">Profile</TabsTrigger>
            <TabsTrigger value="password" className="text-sm font-medium">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">Enrolled Courses</CardTitle>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">{courses.length}</div>
                  <p className="text-muted-foreground font-medium">Current semester</p>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2 from last semester
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">CGPA</CardTitle>
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <GraduationCap className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">8.7</div>
                  <p className="text-muted-foreground font-medium">Overall grade</p>
                  <div className="mt-4 flex items-center text-sm text-emerald-600">
                    <Star className="h-4 w-4 mr-1" />
                    Excellent performance
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">Fee Status</CardTitle>
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">{feePercentage.toFixed(0)}%</div>
                  <p className="text-muted-foreground font-medium">Fees paid</p>
                  <div className="mt-4">
                    <Progress value={feePercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base font-semibold">Credits Earned</CardTitle>
                  <div className="p-3 bg-violet-500/10 rounded-xl">
                    <Award className="h-6 w-6 text-violet-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground mb-2">142</div>
                  <p className="text-muted-foreground font-medium">Out of 180 required</p>
                  <div className="mt-4 flex items-center text-sm text-violet-600">
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
                  >
                    <Download className="h-8 w-8 text-primary" />
                    <span className="font-medium">Download Transcript</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  >
                    <Upload className="h-8 w-8 text-emerald-600" />
                    <span className="font-medium">Submit Assignment</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
                  >
                    <Library className="h-8 w-8 text-amber-600" />
                    <span className="font-medium">Library Services</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col gap-3 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-muted/30 border-2"
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
                  <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Make Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
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
                            className="text-base px-4 py-2 font-semibold"
                          >
                            {course.grade || "In Progress"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{course.credits} Credits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                              <Calendar className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium">Semester {course.semester} • Year {course.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <MessagesPanel />
          </TabsContent>

          <TabsContent value="fees">
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Fee Management</CardTitle>
                    <CardDescription className="text-lg mt-2">View and manage your fee payments</CardDescription>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <CreditCard className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative overflow-hidden text-center p-8 border-2 border-border/50 rounded-2xl bg-gradient-to-br from-muted/30 to-background hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                      <h3 className="font-bold text-3xl text-foreground mb-2">${feeData?.totalFees.toLocaleString()}</h3>
                      <p className="text-muted-foreground font-medium text-lg">Total Fees</p>
                    </div>
                    <div className="relative overflow-hidden text-center p-8 border-2 border-emerald-200/50 rounded-2xl bg-gradient-to-br from-emerald-50 to-background dark:from-emerald-950/20 hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                      <h3 className="font-bold text-3xl text-emerald-600 mb-2">${feeData?.paidFees.toLocaleString()}</h3>
                      <p className="text-muted-foreground font-medium text-lg">Paid</p>
                    </div>
                    <div className="relative overflow-hidden text-center p-8 border-2 border-red-200/50 rounded-2xl bg-gradient-to-br from-red-50 to-background dark:from-red-950/20 hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                      <h3 className="font-bold text-3xl text-red-600 mb-2">${feeData?.pendingFees.toLocaleString()}</h3>
                      <p className="text-muted-foreground font-medium text-lg">Pending</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-muted/30 space-y-4">
                    <h4 className="font-bold text-xl">Payment Progress</h4>
                    <Progress value={feePercentage} className="h-4" />
                    <p className="text-muted-foreground font-medium text-center">{feePercentage.toFixed(1)}% completed</p>
                  </div>

                  <div className="flex gap-6">
                    <Button className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                      Make Payment
                    </Button>
                    <Button variant="outline" className="flex-1 h-14 text-lg font-semibold border-2">
                      Download Receipt
                    </Button>
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

          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Calendar</CardTitle>
                  <CardDescription>Important dates and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Mid-term Examinations</p>
                        <p className="text-sm text-muted-foreground">March 15-22, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Spring Break</p>
                        <p className="text-sm text-muted-foreground">March 25-31, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Final Examinations</p>
                        <p className="text-sm text-muted-foreground">May 1-15, 2024</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Full Calendar</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Opportunities</CardTitle>
                  <CardDescription>Available research projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium">AI in Healthcare</h4>
                      <p className="text-sm text-muted-foreground">Dr. Smith • Computer Science</p>
                      <Badge variant="secondary" className="mt-2">Apply</Badge>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium">Renewable Energy Systems</h4>
                      <p className="text-sm text-muted-foreground">Dr. Johnson • Engineering</p>
                      <Badge variant="secondary" className="mt-2">Apply</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Browse All Projects</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Digital Transcript</CardTitle>
                <CardDescription>Download your official academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Official Transcript</p>
                    <p className="text-sm text-muted-foreground">Last updated: March 1, 2024</p>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Library Services</CardTitle>
                  <CardDescription>Access digital and physical resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">Book Search</Button>
                    <Button variant="outline">Renew Books</Button>
                    <Button variant="outline">Study Rooms</Button>
                    <Button variant="outline">Digital Archives</Button>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">Current Borrowings</h4>
                    <p className="text-sm text-muted-foreground">3 books due by March 20</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Databases</CardTitle>
                  <CardDescription>Access academic journals and papers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">IEEE Xplore</Button>
                  <Button variant="outline" className="w-full justify-start">ACM Digital Library</Button>
                  <Button variant="outline" className="w-full justify-start">SpringerLink</Button>
                  <Button variant="outline" className="w-full justify-start">PubMed</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Career Services</CardTitle>
                  <CardDescription>Professional development and job placement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Job Portal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">Resume Builder</Button>
                  <Button variant="outline" className="w-full justify-start">Interview Prep</Button>
                  <Button variant="outline" className="w-full justify-start">Career Counseling</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internship Opportunities</CardTitle>
                  <CardDescription>Current openings for students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">Software Engineering Intern</h4>
                    <p className="text-sm text-muted-foreground">TechCorp • Summer 2024</p>
                    <Badge variant="secondary" className="mt-2">Apply</Badge>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">Research Assistant</h4>
                    <p className="text-sm text-muted-foreground">NSCU Labs • Part-time</p>
                    <Badge variant="secondary" className="mt-2">Apply</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scholarships & Financial Aid</CardTitle>
                <CardDescription>Available funding opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <h4 className="font-medium">Merit Scholarship</h4>
                      <p className="text-sm text-muted-foreground">Deadline: April 15, 2024</p>
                    </div>
                    <Badge>Eligible</Badge>
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <h4 className="font-medium">Research Grant</h4>
                      <p className="text-sm text-muted-foreground">Deadline: May 1, 2024</p>
                    </div>
                    <Badge variant="secondary">Apply</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campus" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campus Life</CardTitle>
                  <CardDescription>Activities and events on campus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Campus Map
                    </Button>
                    <Button variant="outline">Event Calendar</Button>
                    <Button variant="outline">Dining Services</Button>
                    <Button variant="outline">Transportation</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Organizations</CardTitle>
                  <CardDescription>Join clubs and societies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">Computer Science Society</h4>
                    <p className="text-sm text-muted-foreground">150 members</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium">Debate Club</h4>
                    <p className="text-sm text-muted-foreground">85 members</p>
                  </div>
                  <Button variant="outline" className="w-full mt-3">Browse All Organizations</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Wellness & Health</CardTitle>
                <CardDescription>Support services for student wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm">Health Center</Button>
                  <Button variant="outline" size="sm">Counseling</Button>
                  <Button variant="outline" size="sm">Fitness Center</Button>
                  <Button variant="outline" size="sm">Mental Health</Button>
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