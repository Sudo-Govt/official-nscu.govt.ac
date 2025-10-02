import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  degree_type: string;
  college: string;
  department: string | null;
  duration_years: number;
  credit_hours: number | null;
  eligibility_criteria: string | null;
  seat_capacity: number | null;
  available_seats: number | null;
  is_active: boolean;
  created_at: string;
}

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form state
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [degreeType, setDegreeType] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [durationYears, setDurationYears] = useState('4');
  const [creditHours, setCreditHours] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('50');

  const degreeTypes = [
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Master', label: 'Master' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Certificate', label: 'Certificate' }
  ];

  const colleges = [
    { value: 'College of Arts and Sciences', label: 'College of Arts and Sciences' },
    { value: 'College of Engineering', label: 'College of Engineering' },
    { value: 'College of Business', label: 'College of Business' },
    { value: 'College of Health Sciences', label: 'College of Health Sciences' },
    { value: 'College of Education', label: 'College of Education' },
    { value: 'School of Law', label: 'School of Law' },
    { value: 'School of Medicine', label: 'School of Medicine' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseCode(course.course_code);
      setCourseName(course.course_name);
      setDegreeType(course.degree_type);
      setCollege(course.college);
      setDepartment(course.department || '');
      setDurationYears(course.duration_years.toString());
      setCreditHours(course.credit_hours?.toString() || '');
      setEligibility(course.eligibility_criteria || '');
      setSeatCapacity(course.seat_capacity?.toString() || '50');
    } else {
      setEditingCourse(null);
      setCourseCode('');
      setCourseName('');
      setDegreeType('');
      setCollege('');
      setDepartment('');
      setDurationYears('4');
      setCreditHours('');
      setEligibility('');
      setSeatCapacity('50');
    }
    setDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!courseCode || !courseName || !degreeType || !college || !durationYears) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const courseData = {
        course_code: courseCode,
        course_name: courseName,
        degree_type: degreeType,
        college: college,
        department: department || null,
        duration_years: parseInt(durationYears),
        credit_hours: creditHours ? parseInt(creditHours) : null,
        eligibility_criteria: eligibility || null,
        seat_capacity: seatCapacity ? parseInt(seatCapacity) : 50,
        available_seats: seatCapacity ? parseInt(seatCapacity) : 50
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(courseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully"
        });
      }

      setDialogOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully"
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Management
              </CardTitle>
              <CardDescription>
                Manage all courses, programs, and their details
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCourse ? 'Update course information' : 'Create a new course offering'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Course Code *</Label>
                      <Input
                        placeholder="e.g., CS101"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Degree Type *</Label>
                      <Select value={degreeType} onValueChange={setDegreeType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Course Name *</Label>
                    <Input
                      placeholder="e.g., Computer Science"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>College *</Label>
                      <Select value={college} onValueChange={setCollege}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                        <SelectContent>
                          {colleges.map((col) => (
                            <SelectItem key={col.value} value={col.value}>
                              {col.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        placeholder="e.g., Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Duration (Years) *</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={durationYears}
                        onChange={(e) => setDurationYears(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Credit Hours</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 120"
                        value={creditHours}
                        onChange={(e) => setCreditHours(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Seat Capacity</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        value={seatCapacity}
                        onChange={(e) => setSeatCapacity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Eligibility Criteria</Label>
                    <Textarea
                      placeholder="Enter eligibility requirements..."
                      value={eligibility}
                      onChange={(e) => setEligibility(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCourse}>
                    {editingCourse ? 'Update' : 'Create'} Course
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No courses found. Add your first course to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.course_code}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.degree_type}</TableCell>
                    <TableCell className="text-sm">{course.college}</TableCell>
                    <TableCell>{course.duration_years} years</TableCell>
                    <TableCell>
                      {course.available_seats}/{course.seat_capacity}
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.is_active ? "default" : "secondary"}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCourseStatus(course.id, course.is_active)}
                        >
                          {course.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
