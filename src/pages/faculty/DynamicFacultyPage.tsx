import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, Award, Building2, FlaskConical, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FacultyData {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  statistics: Record<string, any> | null;
  research_centers: unknown;
  special_programs: unknown;
  alumni_highlights: unknown;
}

interface DepartmentData {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  course_count?: number;
}

const DynamicFacultyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchFacultyData();
    }
  }, [slug]);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      
      // Fetch faculty by slug
      const { data: facultyData, error: facultyError } = await supabase
        .from('academic_faculties')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (facultyError) {
        // Try fetching by code if slug not found
        const { data: facultyByCode, error: codeError } = await supabase
          .from('academic_faculties')
          .select('*')
          .ilike('code', slug?.replace(/-/g, '') || '')
          .eq('is_active', true)
          .single();
        
        if (codeError) throw new Error('Faculty not found');
        setFaculty(facultyByCode as FacultyData);
      } else {
        setFaculty(facultyData as FacultyData);
      }

      const currentFaculty = facultyData || (await supabase
        .from('academic_faculties')
        .select('*')
        .ilike('code', slug?.replace(/-/g, '') || '')
        .eq('is_active', true)
        .single()).data;

      if (currentFaculty) {
        // Fetch departments for this faculty
        const { data: deptData, error: deptError } = await supabase
          .from('academic_departments')
          .select('id, name, code, slug, description')
          .eq('faculty_id', currentFaculty.id)
          .eq('is_active', true)
          .order('name');

        if (!deptError && deptData) {
          // Get course counts for each department
          const deptsWithCounts = await Promise.all(
            deptData.map(async (dept) => {
              const { count } = await supabase
                .from('academic_courses')
                .select('*', { count: 'exact', head: true })
                .eq('department_id', dept.id)
                .eq('is_active', true);
              
              return { ...dept, course_count: count || 0 };
            })
          );
          setDepartments(deptsWithCounts);
        }
      }
    } catch (err: any) {
      console.error('Error fetching faculty:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </PageLayout>
    );
  }

  if (error || !faculty) {
    return (
      <PageLayout title="Faculty Not Found" description="">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Faculty Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The faculty you're looking for doesn't exist or is not available.
          </p>
          <Link to="/academics/course-catalog" className="text-primary hover:underline">
            Browse all programs →
          </Link>
        </div>
      </PageLayout>
    );
  }

  const stats = (faculty.statistics as Record<string, any>) || {};
  const researchCenters = Array.isArray(faculty.research_centers) 
    ? (faculty.research_centers as Array<{ name: string; focus: string; funding?: string }>)
    : [];
  const specialPrograms = Array.isArray(faculty.special_programs) 
    ? (faculty.special_programs as Array<{ name: string; type: string; description?: string }>)
    : [];
  const alumniHighlights = Array.isArray(faculty.alumni_highlights) 
    ? (faculty.alumni_highlights as Array<{ title: string; value: string; description?: string }>)
    : [];

  return (
    <PageLayout 
      title={faculty.name} 
      description={faculty.description || `Explore programs and departments in ${faculty.name}`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary">{stats.students || departments.length * 250}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary">{departments.length}</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary">
                {departments.reduce((sum, d) => sum + (d.course_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary">{stats.research_funding || '$2.5M'}</div>
              <div className="text-sm text-muted-foreground">Research Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">About {faculty.name}</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg">
              {faculty.long_description || faculty.description || 
                `${faculty.name} is dedicated to providing excellence in education, research, and community engagement. 
                Our programs prepare students for successful careers and lifelong learning.`}
            </p>
          </div>
        </div>

        {/* Academic Departments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Departments</h2>
          {departments.length === 0 ? (
            <p className="text-muted-foreground">No departments have been added to this faculty yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <Link key={dept.id} to={`/department/${dept.slug || dept.code.toLowerCase()}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer group">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {dept.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {dept.description || 'Explore programs and courses in this department.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{dept.course_count || 0} Programs</Badge>
                        <span className="text-sm text-primary">View Details →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Research Centers */}
        {researchCenters.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Research Centers & Labs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {researchCenters.map((center, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      {center.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{center.focus}</p>
                    {center.funding && (
                      <Badge variant="outline" className="text-xs">{center.funding}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Special Programs */}
        {specialPrograms.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Special Programs & Opportunities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialPrograms.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <Badge variant="secondary">{program.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {program.description || 'A specialized program designed for student success.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Alumni Excellence */}
        {alumniHighlights.length > 0 && (
          <div className="bg-primary text-primary-foreground rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {alumniHighlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{highlight.value}</div>
                  <div className="text-lg">{highlight.title}</div>
                  {highlight.description && (
                    <p className="text-sm opacity-90 mt-2">{highlight.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Alumni Section if no highlights */}
        {alumniHighlights.length === 0 && (
          <div className="bg-primary text-primary-foreground rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Graduate Success</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-lg">Employment Rate</div>
                <p className="text-sm opacity-90 mt-2">Within 6 months of graduation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-lg">Active Alumni</div>
                <p className="text-sm opacity-90 mt-2">Across various industries</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$65K</div>
                <div className="text-lg">Average Starting Salary</div>
                <p className="text-sm opacity-90 mt-2">For recent graduates</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DynamicFacultyPage;
