import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, GraduationCap, ChevronRight, Building2, Award, FileText, Scroll } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentData {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  faculty_id: string;
}

interface FacultyData {
  id: string;
  name: string;
  slug: string;
}

interface CourseData {
  id: string;
  name: string;
  course_code: string;
  slug: string;
  degree_level: string;
  duration_months: number;
  total_credits: number;
  short_description: string | null;
  enrollment_status: string;
}

const DEGREE_LEVELS = [
  { key: 'certificate', label: 'Certificate Programs', icon: Award, color: 'bg-amber-500', description: 'Short-term professional certifications' },
  { key: 'undergraduate', label: 'Undergraduate Programs', icon: GraduationCap, color: 'bg-blue-500', description: "Bachelor's degrees and undergraduate studies" },
  { key: 'postgraduate', label: 'Postgraduate Programs', icon: FileText, color: 'bg-purple-500', description: "Master's degrees and advanced studies" },
  { key: 'doctoral', label: 'Doctoral Programs', icon: Scroll, color: 'bg-emerald-600', description: 'Ph.D. and doctoral research programs' },
];

const DynamicDepartmentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDepartmentData();
    }
  }, [slug]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch department by slug
      const { data: deptData, error: deptError } = await supabase
        .from('academic_departments')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (deptError) {
        // Try fetching by code
        const { data: deptByCode, error: codeError } = await supabase
          .from('academic_departments')
          .select('*')
          .ilike('code', slug?.replace(/-/g, '') || '')
          .eq('is_active', true)
          .single();
        
        if (codeError) throw new Error('Department not found');
        setDepartment(deptByCode as DepartmentData);
      } else {
        setDepartment(deptData as DepartmentData);
      }

      const currentDept = deptData || (await supabase
        .from('academic_departments')
        .select('*')
        .ilike('code', slug?.replace(/-/g, '') || '')
        .eq('is_active', true)
        .single()).data;

      if (currentDept) {
        // Fetch parent faculty
        if (currentDept.faculty_id) {
          const { data: facultyData } = await supabase
            .from('academic_faculties')
            .select('id, name, slug')
            .eq('id', currentDept.faculty_id)
            .single();
          
          setFaculty(facultyData as FacultyData);
        }

        // Fetch courses for this department
        const { data: coursesData, error: coursesError } = await supabase
          .from('academic_courses')
          .select('id, name, course_code, slug, degree_level, duration_months, total_credits, short_description, enrollment_status')
          .eq('department_id', currentDept.id)
          .eq('is_active', true)
          .eq('is_visible_on_website', true)
          .order('name');

        if (!coursesError && coursesData) {
          setCourses(coursesData as CourseData[]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching department:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCoursesByLevel = (level: string) => {
    return courses.filter(c => c.degree_level === level);
  };

  const getEnrollmentBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-emerald-500 text-white">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'coming_soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !department) {
    return (
      <PageLayout title="Department Not Found" description="">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Department Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The department you're looking for doesn't exist or is not available.
          </p>
          <Link to="/academics/course-catalog" className="text-primary hover:underline">
            Browse all programs →
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Get levels that have courses
  const activeLevels = DEGREE_LEVELS.filter(level => getCoursesByLevel(level.key).length > 0);

  return (
    <PageLayout 
      title={department.name} 
      description={department.description || `Explore programs in ${department.name}`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/academics/course-catalog" className="hover:text-primary">Academics</Link>
          {faculty && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link to={`/faculty/${faculty.slug}`} className="hover:text-primary">
                {faculty.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{department.name}</span>
        </nav>

        {/* Department Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{department.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {department.long_description || department.description || 
              `Welcome to the ${department.name}. Explore our comprehensive range of programs designed to prepare you for success.`}
          </p>
        </div>

        {/* Programs by Degree Level - Block Layout */}
        {activeLevels.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No programs are currently available in this department.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {activeLevels.map((level) => {
              const levelCourses = getCoursesByLevel(level.key);
              const Icon = level.icon;
              
              return (
                <section key={level.key} className="scroll-mt-20" id={level.key}>
                  {/* Level Header Block */}
                  <div className={`${level.color} text-white rounded-t-xl p-6`}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8" />
                      <div>
                        <h2 className="text-2xl font-bold">{level.label}</h2>
                        <p className="text-white/80 text-sm">{level.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-0">
                        {levelCourses.length} {levelCourses.length === 1 ? 'Program' : 'Programs'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Courses Grid */}
                  <div className="border border-t-0 rounded-b-xl bg-card p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {levelCourses.map((course) => (
                        <Link key={course.id} to={`/courses/${course.slug}`}>
                          <Card className="hover:shadow-md transition-all h-full cursor-pointer group hover:border-primary border">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{course.course_code}</Badge>
                                {getEnrollmentBadge(course.enrollment_status)}
                              </div>
                              <CardTitle className="text-base group-hover:text-primary transition-colors leading-tight">
                                {course.name}
                              </CardTitle>
                              {course.short_description && (
                                <CardDescription className="line-clamp-2 text-xs">
                                  {course.short_description}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{course.duration_months}mo</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  <span>{course.total_credits} cr</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Quick navigation if multiple levels */}
        {activeLevels.length > 1 && (
          <div className="fixed bottom-6 right-6 bg-card border rounded-lg shadow-lg p-3 hidden lg:block">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Jump to:</p>
            <div className="flex flex-col gap-1">
              {activeLevels.map(level => (
                <a
                  key={level.key}
                  href={`#${level.key}`}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {level.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DynamicDepartmentPage;
