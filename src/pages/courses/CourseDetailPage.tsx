import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Clock, GraduationCap, Calendar, ChevronRight,
  FileText, Users, ArrowLeft, BookMarked, Target, Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

// Curriculum Types from generator
interface CurriculumSubject {
  code: string;
  name: string;
  credits: number;
  contactHours: number;
  type: 'Core' | 'Elective';
  description: string;
  prerequisites: string[];
  topics: {
    title: string;
    subTopics: string[];
  }[];
  books: {
    title: string;
    author: string;
    year: number;
    type: string;
    usage: string;
  }[];
  assessment: {
    midTerm: number;
    final: number;
    research: number;
    presentation: number;
    participation: number;
  };
  learningOutcomes: string[];
}

interface CurriculumSemester {
  number: number;
  theme: string;
  totalCredits: number;
  subjects: CurriculumSubject[];
}

interface CourseData {
  id: string;
  name: string;
  slug: string;
  course_code: string;
  duration_months: number;
  total_credits: number;
  short_description: string | null;
  long_description: string | null;
  thumbnail_image_url: string | null;
  enrollment_status: string | null;
  start_date: string | null;
  end_date: string | null;
  semester_details: CurriculumSemester[] | null;
  ai_generated_content: {
    careerOutcomes?: {
      overview: string;
      jobRoles: string[];
      industries: string[];
      salaryRange: string;
    };
    eligibility?: {
      minimumQualification: string;
      requiredSubjects: string[];
      entranceRequirements: string[];
    };
  } | null;
  department?: {
    name: string;
    faculty?: {
      name: string;
    };
  } | null;
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSemester, setActiveSemester] = useState('1');

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('academic_courses')
        .select('*, department:academic_departments(name, faculty:academic_faculties(name))')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      // Parse semester_details if it's a string
      const courseData = data as any;
      if (typeof courseData.semester_details === 'string') {
        try {
          courseData.semester_details = JSON.parse(courseData.semester_details);
        } catch {
          courseData.semester_details = null;
        }
      }
      
      setCourse(courseData as CourseData);
    } catch (error) {
      console.error('Error loading course:', error);
      setCourse(null);
    }
    setLoading(false);
  };

  const semesters = course?.semester_details || [];
  const totalSubjects = semesters.reduce((acc, s) => acc + s.subjects.length, 0);
  const totalTopics = semesters.reduce(
    (acc, s) => acc + s.subjects.reduce((a, sub) => a + sub.topics.length, 0), 0
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500 text-white">Open for Enrollment</Badge>;
      case 'closed':
        return <Badge variant="destructive">Enrollment Closed</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout title="Course Not Found">
        <div className="container mx-auto py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or is no longer available.
          </p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={course.name} 
      description={course.short_description || undefined}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/courses" className="hover:text-primary">Courses</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{course.department?.faculty?.name}</span>
          <ChevronRight className="h-4 w-4" />
          <span>{course.department?.name}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{course.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline">{course.course_code}</Badge>
              {getStatusBadge(course.enrollment_status || 'open')}
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {course.department?.faculty?.name} • {course.department?.name}
            </p>
            <p className="text-muted-foreground">
              {course.short_description}
            </p>
          </div>
          
          {course.thumbnail_image_url && (
            <div className="w-full lg:w-80 h-48 rounded-lg overflow-hidden">
              <img 
                src={course.thumbnail_image_url} 
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {course.long_description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Program</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">{children}</h3>,
                      p: ({ children }) => <p className="text-muted-foreground mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-4">{children}</ul>,
                      li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    }}
                  >
                    {course.long_description}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}

            {/* Curriculum - Semester Tabs View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Curriculum Structure
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {semesters.length} semesters • {totalSubjects} subjects • {totalTopics} topics
                </p>
              </CardHeader>
              <CardContent>
                {semesters.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Curriculum details coming soon.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Semester Tabs */}
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {semesters.map((sem) => (
                          <Button
                            key={sem.number}
                            variant={activeSemester === String(sem.number) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveSemester(String(sem.number))}
                            className="whitespace-nowrap"
                          >
                            Semester {sem.number}
                            <Badge variant="secondary" className="ml-2 text-xs">{sem.theme}</Badge>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Semester Content */}
                    {semesters.map((semester) => (
                      <div
                        key={semester.number}
                        className={activeSemester === String(semester.number) ? 'block' : 'hidden'}
                      >
                        {/* Semester Header */}
                        <div className="p-4 bg-muted rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Semester {semester.number}: {semester.theme}</h4>
                              <p className="text-sm text-muted-foreground">
                                {semester.subjects.length} subjects • {semester.totalCredits} credits
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Subjects Accordion */}
                        <Accordion type="single" collapsible className="w-full">
                          {semester.subjects.map((subject, idx) => (
                            <AccordionItem key={idx} value={`subject-${semester.number}-${idx}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left flex-wrap">
                                  <Badge variant="outline">{subject.code}</Badge>
                                  <span className="font-medium">{subject.name}</span>
                                  <Badge variant="secondary">{subject.credits} credits</Badge>
                                  <Badge variant={subject.type === 'Core' ? 'default' : 'outline'}>
                                    {subject.type}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4 pt-2">
                                {/* Description */}
                                <p className="text-sm text-muted-foreground">{subject.description}</p>
                                
                                {/* Prerequisites */}
                                {subject.prerequisites && subject.prerequisites.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Prerequisites:</p>
                                    <div className="flex gap-1 flex-wrap">
                                      {subject.prerequisites.map((p, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Topics & Sub-topics */}
                                <div>
                                  <h5 className="font-medium mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Topics ({subject.topics?.length || 0})
                                  </h5>
                                  <div className="space-y-2">
                                    {subject.topics?.map((topic, topicIdx) => (
                                      <div key={topicIdx} className="p-3 bg-muted rounded-lg">
                                        <p className="font-medium text-sm">{topicIdx + 1}. {topic.title}</p>
                                        {topic.subTopics && topic.subTopics.length > 0 && (
                                          <ul className="mt-2 space-y-1 pl-4">
                                            {topic.subTopics.map((sub, subIdx) => (
                                              <li key={subIdx} className="text-xs text-muted-foreground">
                                                • {sub}
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Books */}
                                {subject.books && subject.books.length > 0 && (
                                  <div>
                                    <h5 className="font-medium mb-2 flex items-center gap-2">
                                      <BookMarked className="h-4 w-4" />
                                      Books & Materials ({subject.books.length})
                                    </h5>
                                    <div className="space-y-2">
                                      {subject.books.map((book, bookIdx) => (
                                        <div key={bookIdx} className="p-2 border rounded flex items-start justify-between gap-2">
                                          <div className="flex-1">
                                            <p className="text-sm font-medium">{book.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {book.author} ({book.year})
                                            </p>
                                          </div>
                                          <div className="text-right shrink-0">
                                            <Badge variant="outline" className="text-xs">{book.type}</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">{book.usage}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Assessment */}
                                {subject.assessment && (
                                  <div>
                                    <h5 className="font-medium mb-2 flex items-center gap-2">
                                      <Target className="h-4 w-4" />
                                      Assessment Breakdown
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.entries(subject.assessment).map(([key, value]) => (
                                        value > 0 && (
                                          <Badge key={key} variant="secondary">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}: {value}%
                                          </Badge>
                                        )
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Learning Outcomes */}
                                {subject.learningOutcomes && subject.learningOutcomes.length > 0 && (
                                  <div>
                                    <h5 className="font-medium mb-2">Learning Outcomes</h5>
                                    <div className="flex flex-wrap gap-1">
                                      {subject.learningOutcomes.map((lo, loIdx) => (
                                        <Badge key={loIdx} variant="outline" className="text-xs">{lo}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Outcomes */}
            {course.ai_generated_content?.careerOutcomes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Career Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{course.ai_generated_content.careerOutcomes.overview}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Job Roles</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.ai_generated_content.careerOutcomes.jobRoles?.map((role, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{role}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industries</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.ai_generated_content.careerOutcomes.industries?.map((industry, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {course.ai_generated_content.careerOutcomes.salaryRange && (
                    <div className="p-3 bg-muted rounded-lg">
                      <span className="font-medium">Expected Salary Range: </span>
                      <span className="text-muted-foreground">{course.ai_generated_content.careerOutcomes.salaryRange}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Duration</div>
                    <div className="text-sm text-muted-foreground">
                      {course.duration_months} months ({semesters.length} semesters)
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Total Credits</div>
                    <div className="text-sm text-muted-foreground">
                      {course.total_credits} credits
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">
                      {course.start_date ? format(new Date(course.start_date), 'MMMM d, yyyy') : 'TBA'}
                    </div>
                  </div>
                </div>
                {course.end_date && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">End Date</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(course.end_date), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Subjects</div>
                    <div className="text-sm text-muted-foreground">
                      {totalSubjects} subjects across {semesters.length} semesters
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Total Topics</div>
                    <div className="text-sm text-muted-foreground">
                      {totalTopics} topics
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            {course.ai_generated_content?.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Minimum Qualification</p>
                    <p className="text-sm text-muted-foreground">
                      {course.ai_generated_content.eligibility.minimumQualification}
                    </p>
                  </div>
                  {course.ai_generated_content.eligibility.requiredSubjects?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Required Subjects</p>
                      <div className="flex flex-wrap gap-1">
                        {course.ai_generated_content.eligibility.requiredSubjects.map((sub, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{sub}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <Button 
                  className="w-full mb-3" 
                  size="lg" 
                  disabled={course.enrollment_status === 'closed'}
                  asChild={course.enrollment_status === 'open'}
                >
                  {course.enrollment_status === 'open' ? (
                    <Link to={`/courses/${course.slug}/enroll`}>Enroll Now</Link>
                  ) : course.enrollment_status === 'coming_soon' ? (
                    'Coming Soon'
                  ) : (
                    'Enrollment Closed'
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Contact Admissions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
