import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, UserCheck, Eye } from 'lucide-react';
import { useAcademicStudents, useAcademicCourses, useDepartments } from '@/hooks/useAcademicData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AcademicStudent, AcademicCourse, Faculty, Department } from '@/types/academic';

export function AcademicStudentManagement() {
  const { data: students, loading, fetchWithCourse, create, update, remove } = useAcademicStudents();
  const { data: courses, fetchWithHierarchy } = useAcademicCourses();
  const { data: departments, fetch: fetchDepartments } = useDepartments();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AcademicStudent | null>(null);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [editingStudent, setEditingStudent] = useState<AcademicStudent | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    course_id: '',
    name: '',
    email: '',
    phone: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    is_active: true,
  });

  // Get unique faculties from courses
  const facultiesFromCourses = courses.reduce((acc, course) => {
    const faculty = (course as any).faculty;
    if (faculty && !acc.find(f => f.id === faculty.id)) {
      acc.push(faculty);
    }
    return acc;
  }, [] as Faculty[]);

  // New hierarchy: Faculty -> Department -> Course
  const filteredDepartments = selectedFacultyId
    ? departments.filter((d) => d.faculty_id === selectedFacultyId)
    : departments;

  const filteredCourses = selectedDeptId
    ? courses.filter((c) => c.department_id === selectedDeptId && c.is_active)
    : courses.filter((c) => c.is_active);

  useEffect(() => {
    fetchWithCourse();
    fetchWithHierarchy();
    fetchDepartments();
  }, []);

  const handleOpenDialog = (student?: AcademicStudent) => {
    if (student) {
      setEditingStudent(student);
      const course = courses.find(c => c.id === student.course_id) as AcademicCourse & { department?: Department & { faculty_id?: string } };
      if (course?.department) {
        setSelectedFacultyId(course.department.faculty_id || '');
        setSelectedDeptId(course.department_id);
      }
      setFormData({
        user_id: student.user_id,
        course_id: student.course_id,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        enrollment_date: student.enrollment_date,
        is_active: student.is_active,
      });
    } else {
      setEditingStudent(null);
      setSelectedDeptId('');
      setSelectedFacultyId('');
      setFormData({
        user_id: '',
        course_id: '',
        name: '',
        email: '',
        phone: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.course_id) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    try {
      if (editingStudent) {
        await update(editingStudent.id, formData);
      } else {
        // For new students, we need a user_id - for demo, we'll use a placeholder
        // In real app, this would be linked to auth.users
        const tempUserId = crypto.randomUUID();
        await create({ ...formData, user_id: tempUserId });
      }
      setDialogOpen(false);
      setEditingStudent(null);
      fetchWithCourse();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await remove(id);
    }
  };

  const viewProgress = async (student: AcademicStudent) => {
    setSelectedStudent(student);
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*, lesson:academic_lessons(*)')
        .eq('student_id', student.id);
      if (error) throw error;
      setStudentProgress(data || []);
      setProgressDialogOpen(true);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load progress', variant: 'destructive' });
    }
  };

  const calculateStudentProgress = (student: AcademicStudent) => {
    const progress = studentProgress.filter(p => p.is_completed);
    // This is simplified - in real app, calculate based on total lessons in course
    return progress.length;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Academic Student Management
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" /> Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Student' : 'Enroll New Student'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Student Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={selectedDeptId}
                    onValueChange={(value) => {
                      setSelectedDeptId(value);
                      setSelectedFacultyId('');
                      setFormData({ ...formData, course_id: '' });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d.is_active).map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Select
                    value={selectedFacultyId}
                    onValueChange={(value) => {
                      setSelectedFacultyId(value);
                      setFormData({ ...formData, course_id: '' });
                    }}
                    disabled={!selectedDeptId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {facultiesFromCourses.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course *</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.course_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Enrollment Date</Label>
                  <Input
                    type="date"
                    value={formData.enrollment_date}
                    onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  {editingStudent ? 'Update' : 'Enroll'} Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-muted-foreground">No students enrolled. Add one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enrollment #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-sm">{student.enrollment_number}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {(student as any).course?.name || '-'}
                    </TableCell>
                    <TableCell>{new Date(student.enrollment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewProgress(student)}
                        title="View Progress"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Progress: {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {studentProgress.length === 0 ? (
              <p className="text-muted-foreground">No progress recorded yet.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Completed {studentProgress.filter(p => p.is_completed).length} of {studentProgress.length} lessons started
                </p>
                {studentProgress.map((progress) => (
                  <div key={progress.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{progress.lesson?.name || 'Unknown Lesson'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      progress.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {progress.is_completed ? 'Completed' : `${progress.progress_percentage}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
