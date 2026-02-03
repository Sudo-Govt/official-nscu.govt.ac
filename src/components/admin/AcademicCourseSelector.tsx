import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
}

interface Course {
  id: string;
  name: string;
  course_code: string;
  department_id: string;
}

interface AcademicCourseSelectorProps {
  value: {
    faculty_id?: string;
    department_id?: string;
    course_id?: string;
    course_code?: string;
    course_name?: string;
  };
  onChange: (value: {
    faculty_id?: string;
    department_id?: string;
    course_id?: string;
    course_code?: string;
    course_name?: string;
  }) => void;
  showCourseCodeInput?: boolean;
}

const AcademicCourseSelector: React.FC<AcademicCourseSelectorProps> = ({
  value,
  onChange,
  showCourseCodeInput = true
}) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseCodeSearch, setCourseCodeSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch faculties on mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Fetch departments when faculty changes
  useEffect(() => {
    if (value.faculty_id) {
      fetchDepartments(value.faculty_id);
    } else {
      setDepartments([]);
      setCourses([]);
    }
  }, [value.faculty_id]);

  // Fetch courses when department changes
  useEffect(() => {
    if (value.department_id) {
      fetchCourses(value.department_id);
    } else {
      setCourses([]);
    }
  }, [value.department_id]);

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('academic_faculties')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setFaculties(data || []);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async (facultyId: string) => {
    try {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('id, name, code, faculty_id')
        .eq('faculty_id', facultyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async (departmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('academic_courses')
        .select('id, name, course_code, department_id')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleFacultyChange = (facultyId: string) => {
    onChange({
      faculty_id: facultyId,
      department_id: undefined,
      course_id: undefined,
      course_code: undefined,
      course_name: undefined
    });
  };

  const handleDepartmentChange = (departmentId: string) => {
    onChange({
      ...value,
      department_id: departmentId,
      course_id: undefined,
      course_code: undefined,
      course_name: undefined
    });
  };

  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find(c => c.id === courseId);
    onChange({
      ...value,
      course_id: courseId,
      course_code: selectedCourse?.course_code,
      course_name: selectedCourse?.name
    });
  };

  const handleCourseCodeSearch = async () => {
    if (!courseCodeSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('academic_courses')
        .select(`
          id, 
          name, 
          course_code, 
          department_id,
          academic_departments!inner (
            id,
            name,
            faculty_id,
            academic_faculties!inner (
              id,
              name
            )
          )
        `)
        .eq('course_code', courseCodeSearch.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const dept = data.academic_departments as any;
        const faculty = dept?.academic_faculties;
        
        // Auto-populate all fields
        onChange({
          faculty_id: faculty?.id,
          department_id: dept?.id,
          course_id: data.id,
          course_code: data.course_code,
          course_name: data.name
        });

        // Refresh dropdowns
        if (faculty?.id) {
          await fetchDepartments(faculty.id);
        }
        if (dept?.id) {
          await fetchCourses(dept.id);
        }
      }
    } catch (error) {
      console.error('Error searching course code:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {showCourseCodeInput && (
        <div className="space-y-2">
          <Label>Quick Search by Course Code</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter course code (e.g., COURSE001)"
              value={courseCodeSearch}
              onChange={(e) => setCourseCodeSearch(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleCourseCodeSearch()}
            />
            <button
              type="button"
              onClick={handleCourseCodeSearch}
              disabled={isSearching}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a course code to auto-fill Faculty, Department, and Course
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Faculty</Label>
          <Select
            value={value.faculty_id || ''}
            onValueChange={handleFacultyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading..." : "Select Faculty"} />
            </SelectTrigger>
            <SelectContent>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  {faculty.name} ({faculty.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={value.department_id || ''}
            onValueChange={handleDepartmentChange}
            disabled={!value.faculty_id}
          >
            <SelectTrigger>
              <SelectValue placeholder={value.faculty_id ? "Select Department" : "Select Faculty first"} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Course</Label>
          <Select
            value={value.course_id || ''}
            onValueChange={handleCourseChange}
            disabled={!value.department_id}
          >
            <SelectTrigger>
              <SelectValue placeholder={value.department_id ? "Select Course" : "Select Department first"} />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.course_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {value.course_name && (
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-sm">
            <span className="font-medium">Selected:</span> {value.course_name} 
            {value.course_code && <span className="text-muted-foreground"> ({value.course_code})</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default AcademicCourseSelector;
