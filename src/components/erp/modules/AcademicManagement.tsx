import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Award,
  Users,
  Calendar,
  FileText,
  Plus
} from 'lucide-react';

const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const mockDepartments = [
    { id: 1, name: 'Computer Science', faculty: 15, students: 240, programs: 4 },
    { id: 2, name: 'Business Administration', faculty: 12, students: 180, programs: 3 },
    { id: 3, name: 'Engineering', faculty: 20, students: 320, programs: 6 },
    { id: 4, name: 'Liberal Arts', faculty: 8, students: 120, programs: 2 }
  ];

  const mockCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, department: 'Computer Science', semester: 'Fall 2024' },
    { id: 2, code: 'BUS201', name: 'Business Statistics', credits: 4, department: 'Business Administration', semester: 'Spring 2024' },
    { id: 3, code: 'ENG301', name: 'Advanced Engineering Design', credits: 3, department: 'Engineering', semester: 'Fall 2024' },
    { id: 4, code: 'LA150', name: 'Critical Thinking', credits: 2, department: 'Liberal Arts', semester: 'Both' }
  ];

  const mockPrograms = [
    { id: 1, name: 'Bachelor of Computer Science', type: 'Undergraduate', duration: '4 years', credits: 120 },
    { id: 2, name: 'Master of Business Administration', type: 'Graduate', duration: '2 years', credits: 60 },
    { id: 3, name: 'Bachelor of Engineering', type: 'Undergraduate', duration: '4 years', credits: 128 },
    { id: 4, name: 'Doctor of Philosophy in Computer Science', type: 'Doctoral', duration: '4-6 years', credits: 90 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Academic Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockDepartments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Faculty:</span>
                      <span className="font-semibold">{dept.faculty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Students:</span>
                      <span className="font-semibold">{dept.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Programs:</span>
                      <span className="font-semibold">{dept.programs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{course.code} - {course.name}</h4>
                        <p className="text-sm text-muted-foreground">{course.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{course.credits} Credits</Badge>
                      <Badge variant="secondary">{course.semester}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">{program.duration} • {program.credits} Credits</p>
                      </div>
                    </div>
                    <Badge variant="outline">{program.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accreditation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Current Accreditations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>GCHEA Accreditation</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Engineering Program (ABET)</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Business Program (AACSB)</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Renewal Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>GCHEA Review</span>
                    <span className="font-semibold">March 2025</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Engineering Accreditation</span>
                    <span className="font-semibold">September 2025</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Business Accreditation</span>
                    <span className="font-semibold">June 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicManagement;