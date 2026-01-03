import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Download, FileText, Clock, Users, BookOpen, Briefcase, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  description: string | null;
  curriculum_data: any[];
  slug: string | null;
  featured: boolean;
  brochure_url: string | null;
  application_deadline: string | null;
  reference_books: any[];
  career_outcomes: any[];
  faculty_info: any[];
}

const DynamicCoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError('Course not found');
          return;
        }
        
        setCourse(data as Course);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout title="Loading..." description="Please wait">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !course) {
    return (
      <PageLayout title="Course Not Found" description="The requested course could not be found">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist or is no longer available.
          </p>
          <Button asChild>
            <Link to="/academics/course-catalog">Browse All Courses</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const curriculum = Array.isArray(course.curriculum_data) ? course.curriculum_data : [];
  const careerOutcomes = Array.isArray(course.career_outcomes) ? course.career_outcomes : [];
  const referenceBooks = Array.isArray(course.reference_books) ? course.reference_books : [];
  const facultyInfo = Array.isArray(course.faculty_info) ? course.faculty_info : [];

  return (
    <PageLayout 
      title={`${course.degree_type} in ${course.course_name}`}
      description={course.description || `${course.degree_type} program in ${course.course_name} at NSCU`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Program Overview Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Badge className="mb-2">{course.degree_type}</Badge>
                  <CardTitle className="text-2xl">{course.course_name}</CardTitle>
                  <CardDescription className="mt-2">{course.college}</CardDescription>
                </div>
                {course.brochure_url && (
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download Brochure
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{course.duration_years} Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Hours</p>
                    <p className="font-semibold">{course.credit_hours || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Seats</p>
                    <p className="font-semibold">{course.available_seats || course.seat_capacity || 'Limited'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{course.department || course.college}</p>
                  </div>
                </div>
              </div>

              {course.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Program Description</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
              )}

              {course.eligibility_criteria && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
                  <p className="text-muted-foreground">{course.eligibility_criteria}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Section */}
        {curriculum.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Semester-wise Curriculum</h2>
            <Tabs defaultValue={curriculum[0]?.id || 'sem1'} className="w-full">
              <TabsList className="flex flex-wrap gap-2">
                {curriculum.map((semester: any, index: number) => (
                  <TabsTrigger key={semester.id || index} value={semester.id || `sem${index + 1}`}>
                    {semester.title || `Semester ${index + 1}`}
                  </TabsTrigger>
                ))}
              </TabsList>

              {curriculum.map((semester: any, index: number) => (
                <TabsContent key={semester.id || index} value={semester.id || `sem${index + 1}`} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        {semester.title || `Semester ${index + 1}`}
                      </CardTitle>
                      <CardDescription>
                        Total Credits: {semester.totalCredits || 'N/A'} | Contact Hours: {semester.contactHours || 'N/A'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {semester.courses && semester.courses.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {semester.courses.map((semCourse: any, courseIndex: number) => (
                            <AccordionItem key={courseIndex} value={`course-${courseIndex}`}>
                              <AccordionTrigger className="text-left">
                                <div className="flex justify-between items-center w-full pr-4">
                                  <span>{semCourse.name} ({semCourse.code})</span>
                                  <Badge variant="outline">{semCourse.credits} Credits</Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Course Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <div><strong>Course Code:</strong> {semCourse.code}</div>
                                      <div><strong>Credits:</strong> {semCourse.credits}</div>
                                      {semCourse.contactHours && (
                                        <div><strong>Contact Hours:</strong> {semCourse.contactHours}</div>
                                      )}
                                      {semCourse.assessment && (
                                        <div><strong>Assessment:</strong> {semCourse.assessment}</div>
                                      )}
                                    </div>
                                  </div>
                                  {semCourse.topics && semCourse.topics.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Topics Covered</h4>
                                      <ul className="text-sm space-y-1">
                                        {semCourse.topics.map((topic: string, topicIndex: number) => (
                                          <li key={topicIndex} className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                                            {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <p className="text-muted-foreground">Course details will be updated soon.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Reference Books Section */}
        {referenceBooks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Reference Books</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {referenceBooks.map((book: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <FileText className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                      <span>{typeof book === 'string' ? book : book.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Career Outcomes Section */}
        {careerOutcomes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Career Outcomes</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Career Opportunities
                </CardTitle>
                <CardDescription>Potential career paths after completing this program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {careerOutcomes.map((career: any, index: number) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">{typeof career === 'string' ? career : career.title}</p>
                      {typeof career === 'object' && career.description && (
                        <p className="text-sm text-muted-foreground mt-1">{career.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Faculty Section */}
        {facultyInfo.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Faculty</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facultyInfo.map((faculty: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faculty.name}</CardTitle>
                    <CardDescription>{faculty.designation || faculty.title}</CardDescription>
                  </CardHeader>
                  {faculty.specialization && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{faculty.specialization}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Apply Now Section */}
        <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg mb-6 opacity-90">
            Begin your journey in {course.course_name} with our comprehensive {course.degree_type} program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/apply">Apply Now</Link>
            </Button>
            {course.brochure_url && (
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                  Download Brochure
                </a>
              </Button>
            )}
          </div>
          {course.application_deadline && (
            <p className="text-sm mt-4 opacity-75 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Application deadline: {new Date(course.application_deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default DynamicCoursePage;
