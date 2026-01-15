import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
import { 
  BookOpen, GraduationCap, Calendar, CreditCard, Library, 
  ClipboardList, Award, Search, Plus, Pencil, Trash2, Save,
  DollarSign, Target, Users, RefreshCw
} from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  user_id: string;
  full_name: string;
  email: string;
  program: string;
  year_of_study: number;
}

interface CourseItem {
  code: string;
  name: string;
  credits: number;
  professor: string;
  progress: number;
  nextClass?: string;
}

interface GradeItem {
  course: string;
  code: string;
  grade: string;
  score: number;
  credits: number;
}

interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'submitted' | 'graded';
}

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'lab' | 'meeting' | 'event';
  location?: string;
}

interface LibraryResource {
  title: string;
  type: string;
  available: boolean;
}

const StudentDataManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  
  // Data states
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>([]);
  const [financialData, setFinancialData] = useState({
    total_due: 0,
    amount_paid: 0,
    due_date: '',
    has_financial_aid: false,
    meal_plan_balance: 0,
    print_credits: 0
  });
  const [degreeProgress, setDegreeProgress] = useState({
    total_credits_earned: 0,
    total_credits_required: 120,
    expected_graduation: '',
    categories: [] as { name: string; earned: number; required: number }[]
  });
  const [gpaData, setGpaData] = useState({
    cumulative_gpa: 0,
    semester_gpa: 0,
    is_deans_list: false
  });
  
  // Dialog states
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
  
  // Form states
  const [courseForm, setCourseForm] = useState<CourseItem>({ code: '', name: '', credits: 3, professor: '', progress: 0, nextClass: '' });
  const [gradeForm, setGradeForm] = useState<GradeItem>({ course: '', code: '', grade: '', score: 0, credits: 3 });
  const [assignmentForm, setAssignmentForm] = useState<AssignmentItem>({ id: '', title: '', course: '', dueDate: '', priority: 'medium', status: 'pending' });
  const [scheduleForm, setScheduleForm] = useState<ScheduleItem>({ id: '', title: '', time: '', type: 'class', location: '' });
  const [libraryForm, setLibraryForm] = useState<LibraryResource>({ title: '', type: '', available: true });
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentDashboardData(selectedStudent.id);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_id, user_id, email, program, year_of_study')
        .order('student_id');
      
      if (error) throw error;
      const mapped = (data || []).map((s: any) => ({
        id: s.id,
        student_id: s.student_id,
        user_id: s.user_id,
        full_name: s.student_id,
        email: s.email,
        program: s.program,
        year_of_study: s.year_of_study
      }));
      setStudents(mapped);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({ title: 'Error', description: 'Failed to fetch students', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentDashboardData = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_dashboard_data')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setCourses((data.courses as unknown as CourseItem[]) || []);
        setGrades((data.grades as unknown as GradeItem[]) || []);
        setAssignments((data.assignments as unknown as AssignmentItem[]) || []);
        setSchedule((data.schedule as unknown as ScheduleItem[]) || []);
        setLibraryResources((data.library_resources as unknown as LibraryResource[]) || []);
        setFinancialData((data.financial_data as unknown as typeof financialData) || financialData);
        setDegreeProgress((data.degree_progress as unknown as typeof degreeProgress) || degreeProgress);
        setGpaData((data.gpa_data as unknown as typeof gpaData) || gpaData);
      } else {
        // Reset to defaults if no data exists
        setCourses([]);
        setGrades([]);
        setAssignments([]);
        setSchedule([]);
        setLibraryResources([]);
        setFinancialData({ total_due: 0, amount_paid: 0, due_date: '', has_financial_aid: false, meal_plan_balance: 0, print_credits: 0 });
        setDegreeProgress({ total_credits_earned: 0, total_credits_required: 120, expected_graduation: '', categories: [] });
        setGpaData({ cumulative_gpa: 0, semester_gpa: 0, is_deans_list: false });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const saveAllData = async () => {
    if (!selectedStudent) return;
    
    try {
      const dataToSave = {
        student_id: selectedStudent.id,
        courses: JSON.parse(JSON.stringify(courses)) as Json,
        grades: JSON.parse(JSON.stringify(grades)) as Json,
        assignments: JSON.parse(JSON.stringify(assignments)) as Json,
        schedule: JSON.parse(JSON.stringify(schedule)) as Json,
        library_resources: JSON.parse(JSON.stringify(libraryResources)) as Json,
        financial_data: JSON.parse(JSON.stringify(financialData)) as Json,
        degree_progress: JSON.parse(JSON.stringify(degreeProgress)) as Json,
        gpa_data: JSON.parse(JSON.stringify(gpaData)) as Json
      };

      const { data: existing } = await supabase
        .from('student_dashboard_data')
        .select('id')
        .eq('student_id', selectedStudent.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('student_dashboard_data')
          .update(dataToSave)
          .eq('student_id', selectedStudent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_dashboard_data')
          .insert([dataToSave]);
        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Student dashboard data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({ title: 'Error', description: 'Failed to save data', variant: 'destructive' });
    }
  };

  // Course handlers
  const handleAddCourse = () => {
    if (editingIndex !== null) {
      const updated = [...courses];
      updated[editingIndex] = courseForm;
      setCourses(updated);
      setEditingIndex(null);
    } else {
      setCourses([...courses, courseForm]);
    }
    setCourseForm({ code: '', name: '', credits: 3, professor: '', progress: 0, nextClass: '' });
    setIsCourseDialogOpen(false);
  };

  const handleEditCourse = (index: number) => {
    setCourseForm(courses[index]);
    setEditingIndex(index);
    setIsCourseDialogOpen(true);
  };

  const handleDeleteCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  // Grade handlers
  const handleAddGrade = () => {
    if (editingIndex !== null) {
      const updated = [...grades];
      updated[editingIndex] = gradeForm;
      setGrades(updated);
      setEditingIndex(null);
    } else {
      setGrades([...grades, gradeForm]);
    }
    setGradeForm({ course: '', code: '', grade: '', score: 0, credits: 3 });
    setIsGradeDialogOpen(false);
  };

  const handleEditGrade = (index: number) => {
    setGradeForm(grades[index]);
    setEditingIndex(index);
    setIsGradeDialogOpen(true);
  };

  const handleDeleteGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  // Assignment handlers
  const handleAddAssignment = () => {
    const newAssignment = { ...assignmentForm, id: assignmentForm.id || `asgn-${Date.now()}` };
    if (editingIndex !== null) {
      const updated = [...assignments];
      updated[editingIndex] = newAssignment;
      setAssignments(updated);
      setEditingIndex(null);
    } else {
      setAssignments([...assignments, newAssignment]);
    }
    setAssignmentForm({ id: '', title: '', course: '', dueDate: '', priority: 'medium', status: 'pending' });
    setIsAssignmentDialogOpen(false);
  };

  const handleEditAssignment = (index: number) => {
    setAssignmentForm(assignments[index]);
    setEditingIndex(index);
    setIsAssignmentDialogOpen(true);
  };

  const handleDeleteAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  // Schedule handlers
  const handleAddSchedule = () => {
    const newSchedule = { ...scheduleForm, id: scheduleForm.id || `sched-${Date.now()}` };
    if (editingIndex !== null) {
      const updated = [...schedule];
      updated[editingIndex] = newSchedule;
      setSchedule(updated);
      setEditingIndex(null);
    } else {
      setSchedule([...schedule, newSchedule]);
    }
    setScheduleForm({ id: '', title: '', time: '', type: 'class', location: '' });
    setIsScheduleDialogOpen(false);
  };

  const handleEditSchedule = (index: number) => {
    setScheduleForm(schedule[index]);
    setEditingIndex(index);
    setIsScheduleDialogOpen(true);
  };

  const handleDeleteSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  // Library handlers
  const handleAddLibrary = () => {
    if (editingIndex !== null) {
      const updated = [...libraryResources];
      updated[editingIndex] = libraryForm;
      setLibraryResources(updated);
      setEditingIndex(null);
    } else {
      setLibraryResources([...libraryResources, libraryForm]);
    }
    setLibraryForm({ title: '', type: '', available: true });
    setIsLibraryDialogOpen(false);
  };

  const handleEditLibrary = (index: number) => {
    setLibraryForm(libraryResources[index]);
    setEditingIndex(index);
    setIsLibraryDialogOpen(true);
  };

  const handleDeleteLibrary = (index: number) => {
    setLibraryResources(libraryResources.filter((_, i) => i !== index));
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Data Management
          </CardTitle>
          <CardDescription>
            Manage student dashboard data including courses, grades, assignments, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Student Selector */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={selectedStudent?.id || ''} 
              onValueChange={(value) => {
                const student = students.find(s => s.id === value);
                setSelectedStudent(student || null);
              }}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {filteredStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.full_name} ({student.student_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent ? (
            <>
              {/* Selected Student Info */}
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.student_id} • {selectedStudent.program} • Year {selectedStudent.year_of_study}
                    </p>
                  </div>
                  <Button onClick={saveAllData} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save All Changes
                  </Button>
                </div>
              </div>

              {/* Data Management Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1 h-auto">
                  <TabsTrigger value="courses" className="gap-1 text-xs">
                    <BookOpen className="h-3 w-3" /> Courses
                  </TabsTrigger>
                  <TabsTrigger value="grades" className="gap-1 text-xs">
                    <Award className="h-3 w-3" /> Grades
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="gap-1 text-xs">
                    <ClipboardList className="h-3 w-3" /> Assignments
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="gap-1 text-xs">
                    <Calendar className="h-3 w-3" /> Schedule
                  </TabsTrigger>
                  <TabsTrigger value="library" className="gap-1 text-xs">
                    <Library className="h-3 w-3" /> Library
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="gap-1 text-xs">
                    <DollarSign className="h-3 w-3" /> Financial
                  </TabsTrigger>
                  <TabsTrigger value="degree" className="gap-1 text-xs">
                    <Target className="h-3 w-3" /> Degree
                  </TabsTrigger>
                  <TabsTrigger value="gpa" className="gap-1 text-xs">
                    <GraduationCap className="h-3 w-3" /> GPA
                  </TabsTrigger>
                </TabsList>

                {/* Courses Tab */}
                <TabsContent value="courses" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Student Courses</h4>
                    <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingIndex(null); setCourseForm({ code: '', name: '', credits: 3, professor: '', progress: 0, nextClass: '' }); }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Course</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Course Code</Label>
                              <Input value={courseForm.code} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} />
                            </div>
                            <div>
                              <Label>Credits</Label>
                              <Input type="number" value={courseForm.credits} onChange={(e) => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) })} />
                            </div>
                          </div>
                          <div>
                            <Label>Course Name</Label>
                            <Input value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} />
                          </div>
                          <div>
                            <Label>Professor</Label>
                            <Input value={courseForm.professor} onChange={(e) => setCourseForm({ ...courseForm, professor: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Progress (%)</Label>
                              <Input type="number" min="0" max="100" value={courseForm.progress} onChange={(e) => setCourseForm({ ...courseForm, progress: parseInt(e.target.value) })} />
                            </div>
                            <div>
                              <Label>Next Class</Label>
                              <Input value={courseForm.nextClass} onChange={(e) => setCourseForm({ ...courseForm, nextClass: e.target.value })} placeholder="e.g., Mon 10:00 AM" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddCourse}>{editingIndex !== null ? 'Update' : 'Add'} Course</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Professor</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">No courses added yet</TableCell>
                        </TableRow>
                      ) : (
                        courses.map((course, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{course.code}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.professor}</TableCell>
                            <TableCell>{course.progress}%</TableCell>
                            <TableCell>{course.nextClass}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditCourse(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Grades Tab */}
                <TabsContent value="grades" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Student Grades</h4>
                    <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingIndex(null); setGradeForm({ course: '', code: '', grade: '', score: 0, credits: 3 }); }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Grade
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Grade</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Course Code</Label>
                              <Input value={gradeForm.code} onChange={(e) => setGradeForm({ ...gradeForm, code: e.target.value })} />
                            </div>
                            <div>
                              <Label>Credits</Label>
                              <Input type="number" value={gradeForm.credits} onChange={(e) => setGradeForm({ ...gradeForm, credits: parseInt(e.target.value) })} />
                            </div>
                          </div>
                          <div>
                            <Label>Course Name</Label>
                            <Input value={gradeForm.course} onChange={(e) => setGradeForm({ ...gradeForm, course: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Grade</Label>
                              <Select value={gradeForm.grade} onValueChange={(v) => setGradeForm({ ...gradeForm, grade: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Score (%)</Label>
                              <Input type="number" min="0" max="100" value={gradeForm.score} onChange={(e) => setGradeForm({ ...gradeForm, score: parseInt(e.target.value) })} />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddGrade}>{editingIndex !== null ? 'Update' : 'Add'} Grade</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">No grades added yet</TableCell>
                        </TableRow>
                      ) : (
                        grades.map((grade, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{grade.code}</TableCell>
                            <TableCell>{grade.course}</TableCell>
                            <TableCell><Badge>{grade.grade}</Badge></TableCell>
                            <TableCell>{grade.score}%</TableCell>
                            <TableCell>{grade.credits}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditGrade(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteGrade(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Student Assignments</h4>
                    <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingIndex(null); setAssignmentForm({ id: '', title: '', course: '', dueDate: '', priority: 'medium', status: 'pending' }); }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Assignment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Assignment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} />
                          </div>
                          <div>
                            <Label>Course</Label>
                            <Input value={assignmentForm.course} onChange={(e) => setAssignmentForm({ ...assignmentForm, course: e.target.value })} />
                          </div>
                          <div>
                            <Label>Due Date</Label>
                            <Input value={assignmentForm.dueDate} onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })} placeholder="e.g., Jan 20, 2026" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Priority</Label>
                              <Select value={assignmentForm.priority} onValueChange={(v: 'high' | 'medium' | 'low') => setAssignmentForm({ ...assignmentForm, priority: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select value={assignmentForm.status} onValueChange={(v: 'pending' | 'submitted' | 'graded') => setAssignmentForm({ ...assignmentForm, status: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="submitted">Submitted</SelectItem>
                                  <SelectItem value="graded">Graded</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddAssignment}>{editingIndex !== null ? 'Update' : 'Add'} Assignment</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">No assignments added yet</TableCell>
                        </TableRow>
                      ) : (
                        assignments.map((assignment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.course}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant={assignment.priority === 'high' ? 'destructive' : assignment.priority === 'medium' ? 'default' : 'secondary'}>
                                {assignment.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={assignment.status === 'graded' ? 'default' : 'outline'}>
                                {assignment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditAssignment(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteAssignment(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Today's Schedule</h4>
                    <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingIndex(null); setScheduleForm({ id: '', title: '', time: '', type: 'class', location: '' }); }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Schedule Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Schedule Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input value={scheduleForm.title} onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })} />
                          </div>
                          <div>
                            <Label>Time</Label>
                            <Input value={scheduleForm.time} onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })} placeholder="e.g., 9:00 AM - 10:30 AM" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Type</Label>
                              <Select value={scheduleForm.type} onValueChange={(v: 'class' | 'lab' | 'meeting' | 'event') => setScheduleForm({ ...scheduleForm, type: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="class">Class</SelectItem>
                                  <SelectItem value="lab">Lab</SelectItem>
                                  <SelectItem value="meeting">Meeting</SelectItem>
                                  <SelectItem value="event">Event</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input value={scheduleForm.location} onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })} />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddSchedule}>{editingIndex !== null ? 'Update' : 'Add'} Schedule Item</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">No schedule items added yet</TableCell>
                        </TableRow>
                      ) : (
                        schedule.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.time}</TableCell>
                            <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Library Tab */}
                <TabsContent value="library" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Library Resources</h4>
                    <Dialog open={isLibraryDialogOpen} onOpenChange={setIsLibraryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => { setEditingIndex(null); setLibraryForm({ title: '', type: '', available: true }); }}>
                          <Plus className="h-4 w-4 mr-1" /> Add Resource
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Library Resource</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input value={libraryForm.title} onChange={(e) => setLibraryForm({ ...libraryForm, title: e.target.value })} />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Input value={libraryForm.type} onChange={(e) => setLibraryForm({ ...libraryForm, type: e.target.value })} placeholder="e.g., E-Book, Journal, Database" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={libraryForm.available} onCheckedChange={(v) => setLibraryForm({ ...libraryForm, available: v })} />
                            <Label>Available</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddLibrary}>{editingIndex !== null ? 'Update' : 'Add'} Resource</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {libraryResources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">No library resources added yet</TableCell>
                        </TableRow>
                      ) : (
                        libraryResources.map((resource, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{resource.title}</TableCell>
                            <TableCell>{resource.type}</TableCell>
                            <TableCell>
                              <Badge variant={resource.available ? 'default' : 'secondary'}>
                                {resource.available ? 'Available' : 'In Use'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditLibrary(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteLibrary(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Financial Tab */}
                <TabsContent value="financial" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Fee Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Total Due ($)</Label>
                            <Input type="number" value={financialData.total_due} onChange={(e) => setFinancialData({ ...financialData, total_due: parseFloat(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Amount Paid ($)</Label>
                            <Input type="number" value={financialData.amount_paid} onChange={(e) => setFinancialData({ ...financialData, amount_paid: parseFloat(e.target.value) })} />
                          </div>
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input value={financialData.due_date} onChange={(e) => setFinancialData({ ...financialData, due_date: e.target.value })} placeholder="e.g., Feb 15, 2026" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={financialData.has_financial_aid} onCheckedChange={(v) => setFinancialData({ ...financialData, has_financial_aid: v })} />
                          <Label>Has Financial Aid</Label>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Other Balances</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Meal Plan Balance ($)</Label>
                          <Input type="number" value={financialData.meal_plan_balance} onChange={(e) => setFinancialData({ ...financialData, meal_plan_balance: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Print Credits</Label>
                          <Input type="number" value={financialData.print_credits} onChange={(e) => setFinancialData({ ...financialData, print_credits: parseInt(e.target.value) })} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Degree Progress Tab */}
                <TabsContent value="degree" className="mt-4">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Degree Progress Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Credits Earned</Label>
                            <Input type="number" value={degreeProgress.total_credits_earned} onChange={(e) => setDegreeProgress({ ...degreeProgress, total_credits_earned: parseInt(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Credits Required</Label>
                            <Input type="number" value={degreeProgress.total_credits_required} onChange={(e) => setDegreeProgress({ ...degreeProgress, total_credits_required: parseInt(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Expected Graduation</Label>
                            <Input value={degreeProgress.expected_graduation} onChange={(e) => setDegreeProgress({ ...degreeProgress, expected_graduation: e.target.value })} placeholder="e.g., May 2027" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Category Progress</CardTitle>
                        <CardDescription>Manage progress by academic category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {degreeProgress.categories.map((cat, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                              <Input 
                                className="flex-1" 
                                value={cat.name} 
                                onChange={(e) => {
                                  const updated = [...degreeProgress.categories];
                                  updated[index].name = e.target.value;
                                  setDegreeProgress({ ...degreeProgress, categories: updated });
                                }}
                                placeholder="Category name"
                              />
                              <Input 
                                className="w-24" 
                                type="number"
                                value={cat.earned} 
                                onChange={(e) => {
                                  const updated = [...degreeProgress.categories];
                                  updated[index].earned = parseInt(e.target.value);
                                  setDegreeProgress({ ...degreeProgress, categories: updated });
                                }}
                                placeholder="Earned"
                              />
                              <span>/</span>
                              <Input 
                                className="w-24" 
                                type="number"
                                value={cat.required} 
                                onChange={(e) => {
                                  const updated = [...degreeProgress.categories];
                                  updated[index].required = parseInt(e.target.value);
                                  setDegreeProgress({ ...degreeProgress, categories: updated });
                                }}
                                placeholder="Required"
                              />
                              <Button variant="ghost" size="sm" onClick={() => {
                                setDegreeProgress({ ...degreeProgress, categories: degreeProgress.categories.filter((_, i) => i !== index) });
                              }}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => {
                            setDegreeProgress({ ...degreeProgress, categories: [...degreeProgress.categories, { name: '', earned: 0, required: 0 }] });
                          }}>
                            <Plus className="h-4 w-4 mr-1" /> Add Category
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* GPA Tab */}
                <TabsContent value="gpa" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">GPA Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cumulative GPA</Label>
                          <Input type="number" step="0.01" min="0" max="4" value={gpaData.cumulative_gpa} onChange={(e) => setGpaData({ ...gpaData, cumulative_gpa: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Semester GPA</Label>
                          <Input type="number" step="0.01" min="0" max="4" value={gpaData.semester_gpa} onChange={(e) => setGpaData({ ...gpaData, semester_gpa: parseFloat(e.target.value) })} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={gpaData.is_deans_list} onCheckedChange={(v) => setGpaData({ ...gpaData, is_deans_list: v })} />
                        <Label>Dean's List</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a student to manage their dashboard data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDataManagement;
