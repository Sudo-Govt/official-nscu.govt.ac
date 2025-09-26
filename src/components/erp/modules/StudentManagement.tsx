import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  GraduationCap, 
  FileText, 
  Calendar,
  Award,
  Upload,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [searchTerm, setSearchTerm] = useState('');

  const mockStudents = [
    { 
      id: 1, 
      name: 'John Smith', 
      studentId: 'NSCU2024001', 
      program: 'Computer Science', 
      year: 'Junior',
      gpa: 3.7,
      status: 'Active',
      admissionDate: '2022-09-01',
      graduation: '2026-06-15'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      studentId: 'NSCU2024002', 
      program: 'Business Administration', 
      year: 'Senior',
      gpa: 3.9,
      status: 'Active',
      admissionDate: '2021-09-01',
      graduation: '2025-06-15'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      studentId: 'NSCU2024003', 
      program: 'Engineering', 
      year: 'Sophomore',
      gpa: 3.5,
      status: 'Active',
      admissionDate: '2023-09-01',
      graduation: '2027-06-15'
    }
  ];

  const mockGrades = [
    { student: 'John Smith', course: 'CS301 - Data Structures', grade: 'A-', points: 3.7, semester: 'Fall 2024' },
    { student: 'Sarah Johnson', course: 'BUS401 - Strategic Management', grade: 'A', points: 4.0, semester: 'Fall 2024' },
    { student: 'Michael Brown', course: 'ENG201 - Engineering Math', grade: 'B+', points: 3.3, semester: 'Fall 2024' }
  ];

  const mockDocuments = [
    { student: 'John Smith', type: 'Transcript', status: 'Available', uploaded: '2024-09-15', verified: true },
    { student: 'Sarah Johnson', type: 'Certificate', status: 'Processing', uploaded: '2024-09-20', verified: false },
    { student: 'Michael Brown', type: 'ID Card', status: 'Available', uploaded: '2024-09-10', verified: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Students
          </Button>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">Student Records</TabsTrigger>
          <TabsTrigger value="academic">Academic History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
              <div className="flex space-x-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.studentId} • {student.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">GPA: {student.gpa}</p>
                        <p className="text-sm text-muted-foreground">{student.year}</p>
                      </div>
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Record</DropdownMenuItem>
                          <DropdownMenuItem>View Grades</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recent Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGrades.map((grade, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{grade.course}</p>
                        <p className="text-xs text-muted-foreground">{grade.student}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{grade.grade}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{grade.semester}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Graduation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{student.name}</span>
                        <span>{student.year === 'Senior' ? '85' : student.year === 'Junior' ? '65' : '40'}%</span>
                      </div>
                      <Progress 
                        value={student.year === 'Senior' ? 85 : student.year === 'Junior' ? 65 : 40} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Student Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{doc.type}</h4>
                        <p className="text-sm text-muted-foreground">{doc.student}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <p>Uploaded: {doc.uploaded}</p>
                        <p className={doc.verified ? 'text-green-600' : 'text-yellow-600'}>
                          {doc.verified ? 'Verified' : 'Pending Verification'}
                        </p>
                      </div>
                      <Badge variant={doc.status === 'Available' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Attendance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Attendance Module</h3>
                <p>Attendance tracking system will be implemented here.</p>
                <Button className="mt-4">Configure Attendance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentManagement;