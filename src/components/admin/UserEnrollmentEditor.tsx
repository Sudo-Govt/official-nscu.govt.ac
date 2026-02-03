import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Calendar, Building2, BookOpen, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  name: string;
  course_code: string;
  degree_level: string | null;
  college: string | null;
}

interface UserEnrollmentEditorProps {
  userId: string;
  userName: string;
  userRole: string;
}

const UserEnrollmentEditor: React.FC<UserEnrollmentEditorProps> = ({ userId, userName, userRole }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Student specific fields
  const [studentData, setStudentData] = useState({
    enrolled_course_id: '',
    enrollment_number: '',
    enrollment_date: '',
  });
  
  // Alumni specific fields
  const [alumniData, setAlumniData] = useState({
    graduation_year: '',
    program: '',
    degree_type: '',
    college: '',
    major: '',
    minor: '',
  });

  const isStudent = userRole === 'student';
  const isAlumni = userRole === 'alumni';

  useEffect(() => {
    fetchCourses();
    if (isStudent) {
      fetchStudentEnrollment();
    } else if (isAlumni) {
      fetchAlumniProfile();
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_courses')
        .select('id, name, course_code, degree_level, college')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudentEnrollment = async () => {
    try {
      const { data, error } = await supabase
        .from('student_dashboard_data')
        .select('enrolled_course_id')
        .eq('student_id', userId)
        .maybeSingle();

      if (error) throw error;

      // Also fetch from academic_students
      const { data: academicStudent } = await supabase
        .from('academic_students')
        .select('course_id, enrollment_number, enrollment_date')
        .eq('user_id', userId)
        .maybeSingle();

      setStudentData({
        enrolled_course_id: data?.enrolled_course_id || academicStudent?.course_id || '',
        enrollment_number: academicStudent?.enrollment_number || '',
        enrollment_date: academicStudent?.enrollment_date || '',
      });
    } catch (error) {
      console.error('Error fetching student enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumniProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('graduation_year, program, degree_type, college, major, minor')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAlumniData({
          graduation_year: data.graduation_year?.toString() || '',
          program: data.program || '',
          degree_type: data.degree_type || '',
          college: data.college || '',
          major: data.major || '',
          minor: data.minor || '',
        });
      }
    } catch (error) {
      console.error('Error fetching alumni profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudent = async () => {
    setSaving(true);
    try {
      // Update student_dashboard_data
      const { data: existingDashboard } = await supabase
        .from('student_dashboard_data')
        .select('id')
        .eq('student_id', userId)
        .maybeSingle();

      if (existingDashboard) {
        await supabase
          .from('student_dashboard_data')
          .update({ enrolled_course_id: studentData.enrolled_course_id || null })
          .eq('student_id', userId);
      } else {
        await supabase
          .from('student_dashboard_data')
          .insert({ 
            student_id: userId, 
            enrolled_course_id: studentData.enrolled_course_id || null 
          });
      }

      // Update academic_students
      const { data: existingAcademic } = await supabase
        .from('academic_students')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      // Get user profile for name - email comes from auth
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', userId)
        .maybeSingle();

      const academicData: any = {
        user_id: userId,
        course_id: studentData.enrolled_course_id || null,
        enrollment_number: studentData.enrollment_number || `STU-${Date.now()}`,
        enrollment_date: studentData.enrollment_date || new Date().toISOString().split('T')[0],
        name: (profile as any)?.full_name || 'Unknown',
        email: `${userId.substring(0, 8)}@student.edu`,
      };

      if (existingAcademic) {
        await supabase
          .from('academic_students')
          .update({
            course_id: academicData.course_id,
            enrollment_number: academicData.enrollment_number,
            enrollment_date: academicData.enrollment_date,
          })
          .eq('user_id', userId);
      } else if (studentData.enrolled_course_id) {
        await supabase
          .from('academic_students')
          .insert(academicData);
      }

      toast({ title: 'Saved', description: 'Student enrollment updated' });
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save enrollment',
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAlumni = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('alumni_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const updateData = {
        graduation_year: alumniData.graduation_year ? parseInt(alumniData.graduation_year) : null,
        program: alumniData.program || null,
        degree_type: alumniData.degree_type || null,
        college: alumniData.college || null,
        major: alumniData.major || null,
        minor: alumniData.minor || null,
      };

      if (existing) {
        await supabase
          .from('alumni_profiles')
          .update(updateData)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('alumni_profiles')
          .insert({ user_id: userId, ...updateData });
      }

      toast({ title: 'Saved', description: 'Alumni profile updated' });
    } catch (error: any) {
      console.error('Error saving alumni:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save profile',
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isStudent && !isAlumni) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Enrollment editing is only available for Students and Alumni</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedCourse = courses.find(c => c.id === studentData.enrolled_course_id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">
            {isStudent ? 'Enrollment Details' : 'Academic History'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isStudent 
              ? `Manage ${userName}'s course enrollment` 
              : `Manage ${userName}'s graduation info`}
          </p>
        </div>
      </div>

      <Separator />

      {isStudent && (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Enrolled Course
            </Label>
            <Select 
              value={studentData.enrolled_course_id} 
              onValueChange={(v) => setStudentData(prev => ({ ...prev, enrolled_course_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No course assigned</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center gap-2">
                      <span>{course.name}</span>
                      <Badge variant="outline" className="text-xs">{course.course_code}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCourse && (
              <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                {selectedCourse.degree_level && <Badge variant="secondary">{selectedCourse.degree_level}</Badge>}
                {selectedCourse.college && <span>{selectedCourse.college}</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Enrollment Number</Label>
              <Input
                value={studentData.enrollment_number}
                onChange={(e) => setStudentData(prev => ({ ...prev, enrollment_number: e.target.value }))}
                placeholder="e.g., STU-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Enrollment Date
              </Label>
              <Input
                type="date"
                value={studentData.enrollment_date}
                onChange={(e) => setStudentData(prev => ({ ...prev, enrollment_date: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveStudent} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Enrollment'}
          </Button>
        </div>
      )}

      {isAlumni && (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Graduation Year
              </Label>
              <Input
                type="number"
                value={alumniData.graduation_year}
                onChange={(e) => setAlumniData(prev => ({ ...prev, graduation_year: e.target.value }))}
                placeholder="e.g., 2020"
                min="1950"
                max="2100"
              />
            </div>
            <div className="space-y-2">
              <Label>Degree Type</Label>
              <Select 
                value={alumniData.degree_type} 
                onValueChange={(v) => setAlumniData(prev => ({ ...prev, degree_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                  <SelectItem value="Master's">Master's</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                  <SelectItem value="Associate">Associate</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Program / Course</Label>
            <Input
              value={alumniData.program}
              onChange={(e) => setAlumniData(prev => ({ ...prev, program: e.target.value }))}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              College / School
            </Label>
            <Input
              value={alumniData.college}
              onChange={(e) => setAlumniData(prev => ({ ...prev, college: e.target.value }))}
              placeholder="e.g., College of Engineering"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Major</Label>
              <Input
                value={alumniData.major}
                onChange={(e) => setAlumniData(prev => ({ ...prev, major: e.target.value }))}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Minor (Optional)</Label>
              <Input
                value={alumniData.minor}
                onChange={(e) => setAlumniData(prev => ({ ...prev, minor: e.target.value }))}
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <Button onClick={handleSaveAlumni} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Academic History'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserEnrollmentEditor;
