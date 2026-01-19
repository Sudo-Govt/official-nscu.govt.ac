import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, Clock, GraduationCap, CheckCircle2, Circle, 
  PlayCircle, FileText, ChevronRight, TrendingUp
} from 'lucide-react';
import { calculateProgress, fetchCourseWithHierarchy } from '@/hooks/useAcademicData';
import type { AcademicStudent, CourseWithHierarchy, StudentProgress as StudentProgressType } from '@/types/academic';
import { useToast } from '@/hooks/use-toast';

interface Props {
  userId: string;
}

export default function StudentCourseProgress({ userId }: Props) {
  const [studentData, setStudentData] = useState<AcademicStudent | null>(null);
  const [courseData, setCourseData] = useState<CourseWithHierarchy | null>(null);
  const [progress, setProgress] = useState<StudentProgressType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchStudentData();
    }
  }, [userId]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Get student enrollment
      const { data: student, error: studentError } = await supabase
        .from('academic_students')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (studentError || !student) {
        setLoading(false);
        return;
      }

      setStudentData(student as AcademicStudent);

      // Fetch course with full hierarchy
      const course = await fetchCourseWithHierarchy(student.course_id);
      setCourseData(course);

      // Fetch progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', student.id);

      setProgress((progressData || []) as StudentProgressType[]);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!studentData) return;

    try {
      const existingProgress = progress.find(p => p.lesson_id === lessonId);
      
      if (existingProgress) {
        await supabase
          .from('student_progress')
          .update({ 
            is_completed: !existingProgress.is_completed,
            completion_date: !existingProgress.is_completed ? new Date().toISOString() : null,
            progress_percentage: !existingProgress.is_completed ? 100 : 0
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('student_progress')
          .insert([{
            student_id: studentData.id,
            lesson_id: lessonId,
            is_completed: true,
            completion_date: new Date().toISOString(),
            progress_percentage: 100
          } as any]);
      }

      // Refresh progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentData.id);

      setProgress((progressData || []) as StudentProgressType[]);
      toast({ title: 'Progress updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update progress', variant: 'destructive' });
    }
  };

  const isLessonComplete = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.is_completed);
  };

  const getSubjectProgress = (subjectId: string) => {
    if (!courseData) return 0;
    const subject = courseData.subjects.find(s => s.id === subjectId);
    if (!subject) return 0;
    
    const lessonIds = subject.topics.flatMap(t => t.lessons.map(l => l.id));
    if (lessonIds.length === 0) return 0;
    
    const completed = lessonIds.filter(id => isLessonComplete(id)).length;
    return Math.round((completed / lessonIds.length) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!studentData || !courseData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium">No Course Enrollment</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You are not currently enrolled in any academic courses.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalLessons = courseData.subjects.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.lessons.length, 0), 0
  );
  const completedLessons = progress.filter(p => p.is_completed).length;
  const { completionProgress, timeProgress, overallProgress } = calculateProgress(
    courseData, completedLessons, totalLessons
  );

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">{courseData.course_code}</Badge>
              <CardTitle className="text-xl">{courseData.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Enrollment: {studentData.enrollment_number}
              </p>
            </div>
            <Badge className="bg-green-500 text-white">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{completedLessons}/{totalLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{courseData.subjects.length}</div>
              <div className="text-sm text-muted-foreground">Total Subjects</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Completion Progress
                </span>
                <span>{completionProgress}%</span>
              </div>
              <Progress value={completionProgress} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Time Progress
                </span>
                <span>{timeProgress}%</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {courseData.subjects.map((subject, sIdx) => {
              const subjectProgress = getSubjectProgress(subject.id);
              return (
                <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {sIdx + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{subject.subject_code}</span>
                          <span>•</span>
                          <span>{subject.credits} credits</span>
                        </div>
                      </div>
                      <div className="w-32 mr-4">
                        <div className="text-xs text-right mb-1">{subjectProgress}%</div>
                        <Progress value={subjectProgress} className="h-1.5" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-14 pb-4">
                    {subject.topics.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No topics available yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {subject.topics.map(topic => (
                          <div key={topic.id} className="border-l-2 border-muted pl-4">
                            <div className="font-medium text-sm flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {topic.name}
                              <Badge variant="outline" className="text-xs">{topic.topic_code}</Badge>
                            </div>
                            {topic.lessons.length > 0 && (
                              <ul className="space-y-2">
                                {topic.lessons.map(lesson => {
                                  const completed = isLessonComplete(lesson.id);
                                  return (
                                    <li 
                                      key={lesson.id}
                                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                                        completed ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : 'hover:bg-muted/50'
                                      }`}
                                      onClick={() => markLessonComplete(lesson.id)}
                                    >
                                      <div className="flex items-center gap-3">
                                        {completed ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <div>
                                          <div className="text-sm font-medium">{lesson.name}</div>
                                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{lesson.lesson_code}</span>
                                            {lesson.estimated_duration_minutes && (
                                              <>
                                                <span>•</span>
                                                <span>{lesson.estimated_duration_minutes} min</span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {lesson.video_url && (
                                          <Badge variant="secondary" className="text-xs">
                                            <PlayCircle className="h-3 w-3 mr-1" />
                                            Video
                                          </Badge>
                                        )}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
