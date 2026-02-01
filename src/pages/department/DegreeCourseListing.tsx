import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentData {
  id: string;
  name: string;
  slug: string;
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
  thumbnail_image_url: string | null;
}

const DEGREE_LABELS: Record<string, string> = {
  certificate: 'Certificate Programs',
  undergraduate: 'Undergraduate Programs',
  postgraduate: 'Postgraduate Programs',
  doctoral: 'Doctoral Programs',
};

const DegreeCourseListing = () => {
  const { slug, degreeType } = useParams<{ slug: string; degreeType: string }>();
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && degreeType) {
      fetchData();
    }
  }, [slug, degreeType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch department by slug
      let deptData = await supabase
        .from('academic_departments')
        .select('id, name, slug, faculty_id')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (deptData.error) {
        // Try by code
        deptData = await supabase
          .from('academic_departments')
          .select('id, name, slug, faculty_id')
          .ilike('code', slug?.replace(/-/g, '') || '')
          .eq('is_active', true)
          .single();
      }

      if (deptData.error || !deptData.data) {
        throw new Error('Department not found');
      }

      setDepartment(deptData.data as DepartmentData);

      // Fetch faculty
      if (deptData.data.faculty_id) {
        const { data: facultyData } = await supabase
          .from('academic_faculties')
          .select('id, name, slug')
          .eq('id', deptData.data.faculty_id)
          .single();
        
        setFaculty(facultyData as FacultyData);
      }

      // Fetch courses by degree level
      const { data: coursesData, error: coursesError } = await supabase
        .from('academic_courses')
        .select('id, name, course_code, slug, degree_level, duration_months, total_credits, short_description, enrollment_status, thumbnail_image_url')
        .eq('department_id', deptData.data.id)
        .eq('degree_level', degreeType)
        .eq('is_active', true)
        .eq('is_visible_on_website', true)
        .order('name');

      if (!coursesError && coursesData) {
        setCourses(coursesData as CourseData[]);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-emerald-500 text-white">Open for Enrollment</Badge>;
      case 'closed':
        return <Badge variant="secondary">Enrollment Closed</Badge>;
      case 'coming_soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const degreeLabel = DEGREE_LABELS[degreeType || ''] || 'Programs';

  if (loading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <Skeleton className="h-8 w-64" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !department) {
    return (
      <PageLayout title="Not Found" description="">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Programs Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The programs you're looking for don't exist or are not available.
          </p>
          <Link to="/academics/course-catalog" className="text-primary hover:underline">
            Browse all programs →
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={`${degreeLabel} - ${department.name}`} 
      description={`Explore ${degreeLabel.toLowerCase()} in ${department.name}`}
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
          <Link to={`/department/${slug}`} className="hover:text-primary">
            {department.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{degreeLabel}</span>
        </nav>

        {/* Back Button */}
        <Link to={`/department/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {department.name}
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{degreeLabel}</h1>
          <p className="text-lg text-muted-foreground">
            {department.name} • {courses.length} program{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Programs Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no {degreeLabel.toLowerCase()} in this department.
              </p>
              <Link to={`/department/${slug}`}>
                <Button>View Other Programs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/courses/${course.slug}`}>
                <Card className="hover:shadow-lg transition-all h-full cursor-pointer group hover:border-primary overflow-hidden">
                  {course.thumbnail_image_url && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={course.thumbnail_image_url} 
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{course.course_code}</Badge>
                      {getEnrollmentBadge(course.enrollment_status)}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {course.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.short_description || 'A comprehensive program designed for your success.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_months} months</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.total_credits} credits</span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-primary group-hover:underline flex items-center gap-1">
                      View Full Curriculum
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DegreeCourseListing;
