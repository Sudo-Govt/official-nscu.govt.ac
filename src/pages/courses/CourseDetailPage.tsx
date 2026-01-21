import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseWithHierarchy } from '@/hooks/useAcademicData';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, Clock, GraduationCap, Calendar, ChevronRight,
  FileText, Video, Users, ArrowLeft, BookMarked, CheckCircle2, Circle
} from 'lucide-react';
import type { CourseWithHierarchy } from '@/types/academic';
import { format } from 'date-fns';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseWithHierarchy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    setLoading(true);
    const data = await fetchCourseWithHierarchy(slug!);
    setCourse(data);
    setLoading(false);
  };

  const totalLessons = course?.subjects.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.lessons.length, 0), 0
  ) || 0;

  const totalDuration = course?.subjects.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.lessons.reduce((d, l) => d + (l.estimated_duration_minutes || 0), 0), 0), 0
  ) || 0;

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
                <CardContent>
                  <p className="whitespace-pre-wrap">{course.long_description}</p>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Curriculum
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.subjects.length} subjects • {totalLessons} lessons • {Math.round(totalDuration / 60)} hours of content
                </p>
              </CardHeader>
              <CardContent>
                {course.subjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Curriculum details coming soon.
                  </p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {course.subjects.map((subject, sIdx) => (
                      <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {sIdx + 1}
                            </div>
                            <div>
                              <div className="font-medium">{subject.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {subject.subject_code} • {subject.credits} credits
                                {subject.semester && ` • Semester ${subject.semester}`}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-11 pb-4">
                          {subject.description && (
                            <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                          )}
                          {subject.topics.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Topics coming soon.</p>
                          ) : (
                            <div className="space-y-3">
                              {subject.topics.map((topic, tIdx) => (
                                <div key={topic.id} className="border-l-2 border-muted pl-4">
                                  <div className="font-medium text-sm flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {topic.name}
                                    <Badge variant="outline" className="text-xs">{topic.topic_code}</Badge>
                                  </div>
                                  {topic.lessons.length > 0 && (
                                    <ul className="mt-2 space-y-1 pl-6">
                                      {topic.lessons.map(lesson => (
                                        <li key={lesson.id} className="text-sm text-muted-foreground flex items-center gap-2">
                                          {lesson.video_url ? (
                                            <Video className="h-3 w-3" />
                                          ) : (
                                            <Circle className="h-3 w-3" />
                                          )}
                                          <span>{lesson.name}</span>
                                          {lesson.estimated_duration_minutes && (
                                            <span className="text-xs">({lesson.estimated_duration_minutes} min)</span>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Books */}
            {course.books && course.books.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5" />
                    Reading Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.books.map(cb => (
                      <div key={cb.id} className="flex gap-3 p-3 border rounded-lg">
                        {cb.book?.cover_image_url ? (
                          <img 
                            src={cb.book.cover_image_url} 
                            alt={cb.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                            <BookMarked className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{cb.book?.title}</div>
                          <div className="text-xs text-muted-foreground">{cb.book?.author}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={cb.is_required ? 'default' : 'outline'} className="text-xs">
                              {cb.is_required ? 'Required' : 'Recommended'}
                            </Badge>
                            {cb.book?.book_code && (
                              <span className="text-xs text-muted-foreground">{cb.book.book_code}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      {course.duration_months} months
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
                      {course.subjects.length} subjects
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Total Lessons</div>
                    <div className="text-sm text-muted-foreground">
                      {totalLessons} lessons
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button className="w-full mb-3" size="lg" disabled={course.enrollment_status === 'closed'}>
                  {course.enrollment_status === 'open' ? 'Enroll Now' : 
                   course.enrollment_status === 'coming_soon' ? 'Coming Soon' : 'Enrollment Closed'}
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
