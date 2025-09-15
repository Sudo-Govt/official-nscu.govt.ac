import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CreditCard, User, Users, LogOut, FileText, Calendar, GraduationCap, Library, MapPin, Briefcase, Award, MessageSquare, Clock, Download, Upload } from 'lucide-react';
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
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="campus">Campus Life</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">CGPA</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7</div>
                  <p className="text-xs text-muted-foreground">Overall grade</p>
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
                  <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">Out of 180 required</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used services and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span className="text-xs">Download Transcript</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">Submit Assignment</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <Library className="h-5 w-5" />
                    <span className="text-xs">Library Services</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Contact Advisor</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

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