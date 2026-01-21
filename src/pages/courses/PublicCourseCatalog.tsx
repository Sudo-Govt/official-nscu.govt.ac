import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, GraduationCap, BookOpen, Search, Filter } from 'lucide-react';
import type { AcademicCourse, Faculty, Department } from '@/types/academic';

// New hierarchy: Faculty -> Department -> Course
interface CourseWithDepartment extends AcademicCourse {
  department: Department & { faculty: Faculty };
}

export default function PublicCourseCatalog() {
  const [courses, setCourses] = useState<CourseWithDepartment[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, facRes, deptRes] = await Promise.all([
        supabase
          .from('academic_courses')
          .select('*, department:academic_departments(*, faculty:academic_faculties(*))')
          .eq('is_active', true)
          .eq('is_visible_on_website', true)
          .order('name'),
        supabase.from('academic_faculties').select('*').eq('is_active', true).order('name'),
        supabase.from('academic_departments').select('*').eq('is_active', true).order('name'),
      ]);

      setCourses((coursesRes.data || []) as CourseWithDepartment[]);
      setFaculties(facRes.data as Faculty[] || []);
      setDepartments(deptRes.data as Department[] || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.course_code.toLowerCase().includes(search.toLowerCase()) ||
        course.short_description?.toLowerCase().includes(search.toLowerCase());
      
      // Filter by faculty (through department)
      const matchesFaculty = facultyFilter === 'all' || 
        course.department?.faculty?.id === facultyFilter;
      
      // Filter by department
      const matchesDept = departmentFilter === 'all' || 
        course.department_id === departmentFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        course.enrollment_status === statusFilter;

      return matchesSearch && matchesFaculty && matchesDept && matchesStatus;
    });
  }, [courses, search, facultyFilter, departmentFilter, statusFilter]);

  // Filter departments by selected faculty
  const filteredDepartments = useMemo(() => {
    if (facultyFilter === 'all') return departments;
    return departments.filter(d => d.faculty_id === facultyFilter);
  }, [departments, facultyFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500 text-white">Open for Enrollment</Badge>;
      case 'closed':
        return <Badge variant="destructive">Enrollment Closed</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <PageLayout title="Course Catalog" description="Explore our academic programs">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Our Programs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover a wide range of academic programs designed to prepare you for success in your chosen field.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={facultyFilter} onValueChange={(val) => { setFacultyFilter(val); setDepartmentFilter('all'); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {filteredDepartments.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open for Enrollment</SelectItem>
                  <SelectItem value="closed">Enrollment Closed</SelectItem>
                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredCourses.length} of {courses.length} programs
        </p>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {course.thumbnail_image_url && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={course.thumbnail_image_url} 
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.course_code}
                    </Badge>
                    {getStatusBadge(course.enrollment_status || 'open')}
                  </div>
                  <CardTitle className="text-lg mt-2">{course.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.department?.faculty?.name} → {course.department?.name}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {course.short_description || 'Explore this comprehensive program designed to build your expertise.'}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration_months} months
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      {course.total_credits} credits
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.slug || course.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
