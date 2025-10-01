import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    department: '',
    semester: '',
    type: '',
    duration: '',
    faculty: '',
    students: '',
    programs: ''
  });

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

  const handleAddNew = () => {
    setFormData({
      name: '',
      code: '',
      credits: '',
      department: '',
      semester: '',
      type: '',
      duration: '',
      faculty: '',
      students: '',
      programs: ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validation based on active tab
    if (activeTab === 'departments' && (!formData.name || !formData.faculty)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'courses' && (!formData.name || !formData.code || !formData.credits)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'programs' && (!formData.name || !formData.type || !formData.duration)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `${activeTab === 'departments' ? 'Department' : activeTab === 'courses' ? 'Course' : 'Program'} added successfully`
    });
    
    setDialogOpen(false);
  };

  const renderDialogContent = () => {
    switch (activeTab) {
      case 'departments':
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Faculty Count *</Label>
                <Input
                  id="faculty"
                  type="number"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  placeholder="e.g., 15"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="students">Student Count</Label>
                <Input
                  id="students"
                  type="number"
                  value={formData.students}
                  onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                  placeholder="e.g., 240"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programs">Number of Programs</Label>
                <Input
                  id="programs"
                  type="number"
                  value={formData.programs}
                  onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
                  placeholder="e.g., 4"
                />
              </div>
            </div>
          </>
        );
      
      case 'courses':
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Introduction to Programming"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Liberal Arts">Liberal Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      
      case 'programs':
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bachelor of Computer Science"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Program Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Doctoral">Doctoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 4 years"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Total Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  placeholder="e.g., 120"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Academic Management</h2>
        {activeTab !== 'accreditation' && (
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New {activeTab === 'departments' ? 'Department' : activeTab === 'courses' ? 'Course' : 'Program'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new {activeTab === 'departments' ? 'department' : activeTab === 'courses' ? 'course' : 'program'}.
            </DialogDescription>
          </DialogHeader>
          {renderDialogContent()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add {activeTab === 'departments' ? 'Department' : activeTab === 'courses' ? 'Course' : 'Program'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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