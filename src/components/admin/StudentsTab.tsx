import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddStudentDialog } from './AddStudentDialog';

interface Student {
  id: string;
  name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  address: string;
  course_name: string;
  specialization: string;
  exam_format: string;
  cgpa: number;
  created_at: string;
  updated_at: string;
}

export const StudentsTab = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    dob: '',
    address: '',
    course_name: '',
    specialization: '',
    exam_format: 'Semester',
    cgpa: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      father_name: '',
      mother_name: '',
      dob: '',
      address: '',
      course_name: '',
      specialization: '',
      exam_format: 'Semester',
      cgpa: 0,
    });
    setEditingStudent(null);
  };

  const generateDefaultPassword = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `Nscu_${month}-${day}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingStudent.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Student updated successfully"
        });
      } else {
        // Generate email if not provided (using name)
        const email = `${formData.name.toLowerCase().replace(/\s+/g, '.')}@nscu.edu`;
        const defaultPassword = generateDefaultPassword();
        
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: defaultPassword,
          options: {
            data: {
              full_name: formData.name,
              role: 'student',
              requires_password_change: true
            }
          }
        });
        
        if (authError) throw authError;
        
        // Insert student data
        const studentId = 'STU' + Date.now();
        const { error: studentError } = await supabase
          .from('students')
          .insert([{
            ...formData,
            student_id: studentId,
            enrollment_year: new Date().getFullYear(),
            program: formData.course_name || 'General',
            user_id: authData.user.id
          }]);
        
        if (studentError) throw studentError;
        
        toast({
          title: "Success",
          description: `Student added successfully. Login credentials: Email: ${email}, Password: ${defaultPassword}`,
          duration: 10000
        });
      }
      
      fetchStudents();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save student",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      father_name: student.father_name,
      mother_name: student.mother_name,
      dob: student.dob,
      address: student.address,
      course_name: student.course_name,
      specialization: student.specialization,
      exam_format: student.exam_format,
      cgpa: student.cgpa,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Student deleted successfully"
      });
      
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading students...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Students Management</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddStudentDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add (Existing User)
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="father_name">Father's Name *</Label>
                    <Input
                      id="father_name"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">Mother's Name *</Label>
                    <Input
                      id="mother_name"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course_name">Course Name *</Label>
                    <Input
                      id="course_name"
                      value={formData.course_name}
                      onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="exam_format">Exam Format *</Label>
                    <Select value={formData.exam_format} onValueChange={(value) => 
                      setFormData({ ...formData, exam_format: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Semester">Semester</SelectItem>
                        <SelectItem value="Year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA *</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStudent ? 'Update' : 'Add'} Student
                  </Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {/* Add Student Dialog */}
        <AddStudentDialog 
          open={isAddStudentDialogOpen}
          onOpenChange={setIsAddStudentDialogOpen}
          onSuccess={fetchStudents}
        />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Exam Format</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course_name}</TableCell>
                  <TableCell>{student.specialization}</TableCell>
                  <TableCell>{student.exam_format}</TableCell>
                  <TableCell>{student.cgpa}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No students found. Add your first student to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};