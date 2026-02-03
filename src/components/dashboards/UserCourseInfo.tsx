import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GraduationCap, Book, BookOpen, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface SemesterSubject {
  name: string;
  code: string;
  credits: number;
  type: 'Core' | 'Elective';
  topics?: string[];
  referenceBooks?: { title: string; author: string; year?: string }[];
  learningOutcomes?: string[];
  assessment?: { type: string; weight: string }[];
}

interface SemesterDetails {
  semester: number;
  subjects: SemesterSubject[];
}

interface CourseInfo {
  id: string;
  name: string;
  course_code: string;
  duration_months: number;
  total_credits: number;
  degree_level: string | null;
  degree_type: string | null;
  semester_details: SemesterDetails[] | null;
  department?: { name: string; code: string };
  faculty?: { name: string; code: string };
}

interface UserCourseInfoProps {
  userId: string;
  userRole: 'student' | 'alumni';
  compact?: boolean;
}

const UserCourseInfo: React.FC<UserCourseInfoProps> = ({ userId, userRole, compact = false }) => {
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseInfo();
  }, [userId, userRole]);

  const fetchCourseInfo = async () => {
    setLoading(true);
    try {
      let courseId: string | null = null;

      if (userRole === 'student') {
        // Fetch from students table
        const { data: student } = await supabase
          .from('students')
          .select('course_id')
          .eq('user_id', userId)
          .maybeSingle();
        
        courseId = student?.course_id;
      } else {
        // Fetch from alumni_profiles table
        const { data: alumni } = await supabase
          .from('alumni_profiles')
          .select('course_id')
          .eq('user_id', userId)
          .maybeSingle();
        
        courseId = alumni?.course_id;
      }

      if (courseId) {
        const { data: course, error } = await supabase
          .from('academic_courses')
          .select(`
            id,
            name,
            course_code,
            duration_months,
            total_credits,
            degree_level,
            degree_type,
            semester_details,
            academic_departments!inner (
              name,
              code,
              academic_faculties!inner (
                name,
                code
              )
            )
          `)
          .eq('id', courseId)
          .maybeSingle();

        if (course && !error) {
          const dept = course.academic_departments as any;
          setCourseInfo({
            ...course,
            semester_details: course.semester_details as unknown as SemesterDetails[],
            department: dept ? { name: dept.name, code: dept.code } : undefined,
            faculty: dept?.academic_faculties ? { name: dept.academic_faculties.name, code: dept.academic_faculties.code } : undefined,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching course info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading course information...
      </div>
    );
  }

  if (!courseInfo) {
    return null; // No course assigned
  }

  // Compact view for header/subtitle
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <GraduationCap className="h-4 w-4 text-primary" />
        <span className="font-medium">{courseInfo.name}</span>
        <Badge variant="secondary" className="text-xs">{courseInfo.course_code}</Badge>
        {courseInfo.degree_level && (
          <Badge variant="outline" className="text-xs">{courseInfo.degree_level}</Badge>
        )}
      </div>
    );
  }

  const semesters = courseInfo.semester_details || [];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              {courseInfo.name}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {courseInfo.course_code} • {courseInfo.duration_months} months • {courseInfo.total_credits} credits
            </p>
            {courseInfo.faculty && (
              <p className="text-sm text-muted-foreground mt-1">
                {courseInfo.faculty.name} → {courseInfo.department?.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {courseInfo.degree_level && (
              <Badge variant="default">{courseInfo.degree_level}</Badge>
            )}
            {courseInfo.degree_type && (
              <Badge variant="secondary">{courseInfo.degree_type}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {semesters.length > 0 ? (
          <Tabs defaultValue={`sem-${semesters[0]?.semester || 1}`} className="w-full">
            <TabsList className="flex flex-wrap gap-1 h-auto bg-muted/50 p-1">
              {semesters.map((sem) => (
                <TabsTrigger
                  key={sem.semester}
                  value={`sem-${sem.semester}`}
                  className="text-xs px-3 py-1.5"
                >
                  Semester {sem.semester}
                </TabsTrigger>
              ))}
            </TabsList>

            {semesters.map((sem) => (
              <TabsContent key={sem.semester} value={`sem-${sem.semester}`} className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {sem.subjects?.length || 0} Subjects
                    </h4>
                    <Badge variant="outline">
                      {sem.subjects?.reduce((sum, s) => sum + (s.credits || 0), 0) || 0} Credits
                    </Badge>
                  </div>
                  
                  <Accordion type="multiple" className="w-full">
                    {sem.subjects?.map((subject, idx) => (
                      <AccordionItem key={idx} value={`subject-${idx}`}>
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 text-left">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <div>
                              <span className="font-medium">{subject.name}</span>
                              <span className="text-muted-foreground ml-2 text-sm">
                                ({subject.code})
                              </span>
                            </div>
                            <Badge 
                              variant={subject.type === 'Core' ? 'default' : 'secondary'}
                              className="ml-auto mr-4 text-xs"
                            >
                              {subject.type || 'Core'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {subject.credits} cr
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <div className="grid gap-4 pl-7">
                            {/* Topics */}
                            {subject.topics && subject.topics.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Book className="h-3.5 w-3.5" />
                                  Topics
                                </h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {subject.topics.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle2 className="h-3 w-3 mt-1 text-primary" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Reference Books */}
                            {subject.referenceBooks && subject.referenceBooks.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Reference Books</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {subject.referenceBooks.map((book, i) => (
                                    <li key={i}>
                                      <span className="font-medium">{book.title}</span>
                                      {book.author && <span> — {book.author}</span>}
                                      {book.year && <span className="text-xs"> ({book.year})</span>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Learning Outcomes */}
                            {subject.learningOutcomes && subject.learningOutcomes.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Learning Outcomes</h5>
                                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                  {subject.learningOutcomes.map((outcome, i) => (
                                    <li key={i}>{outcome}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Assessment */}
                            {subject.assessment && subject.assessment.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  Assessment
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {subject.assessment.map((a, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {a.type}: {a.weight}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Semester details not available for this course</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCourseInfo;