import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, Loader2, GraduationCap, BookOpen, Target, 
  Calendar, Award, ExternalLink, Plus, CheckCircle2, 
  FileText, Download, Users, Briefcase 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedCourse {
  course_info: {
    name: string;
    code: string;
    description: string;
    duration_semesters: number;
    total_credits: number;
    degree_type: string;
    specialization: string;
  };
  abet_outcomes: {
    student_outcomes: Array<{
      id: string;
      description: string;
      performance_indicators: string[];
    }>;
    program_educational_objectives: string[];
  };
  semester_structure: Array<{
    semester: number;
    subjects: Array<{
      name: string;
      code: string;
      credits: number;
      type: string;
      description: string;
      learning_outcomes: string[];
      syllabus: {
        units: Array<{
          unit_number: number;
          title: string;
          topics: string[];
          hours: number;
        }>;
      };
      assessment: {
        internal: number;
        external: number;
        methods: string[];
      };
    }>;
    total_credits: number;
  }>;
  grading_system: {
    cgpa_scale: number;
    grade_points: Record<string, number>;
    passing_cgpa: number;
    distinction_cgpa: number;
  };
  reference_materials: {
    textbooks: Array<{
      title: string;
      author: string;
      isbn: string;
      publisher: string;
      edition: string;
      year: number;
      is_mandatory: boolean;
    }>;
    reference_books: Array<{
      title: string;
      author: string;
      isbn: string;
      publisher: string;
    }>;
    online_resources: Array<{
      title: string;
      url: string;
      type: string;
      platform: string;
    }>;
    free_ebooks: Array<{
      title: string;
      url: string;
      format: string;
    }>;
  };
  career_outcomes: {
    job_roles: string[];
    industries: string[];
    higher_studies: string[];
    average_salary_range: string;
  };
  eligibility: {
    minimum_qualification: string;
    required_subjects: string[];
    entrance_exams: string[];
    age_limit: string;
  };
}

interface Department {
  id: string;
  name: string;
  code: string;
  faculty_id: string;
}

interface Faculty {
  id: string;
  name: string;
  code: string;
}

const ABETCourseGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedCourse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  
  // Form state
  const [courseName, setCourseName] = useState('');
  const [courseType, setCourseType] = useState('Undergraduate');
  const [semesters, setSemesters] = useState('8');
  const [specialization, setSpecialization] = useState('');

  // For adding course
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchFacultiesAndDepartments();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      const filtered = departments.filter(d => d.faculty_id === selectedFaculty);
      if (filtered.length > 0 && !filtered.find(d => d.id === selectedDepartment)) {
        setSelectedDepartment('');
      }
    }
  }, [selectedFaculty, departments]);

  const fetchFacultiesAndDepartments = async () => {
    const [facRes, deptRes] = await Promise.all([
      supabase.from('academic_faculties').select('id, name, code').eq('is_active', true),
      supabase.from('academic_departments').select('id, name, code, faculty_id').eq('is_active', true),
    ]);
    
    if (facRes.data) setFaculties(facRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
  };

  const generateCourse = async () => {
    if (!courseName.trim()) {
      toast({
        title: 'Course Name Required',
        description: 'Please enter a course name to generate curriculum',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-abet-course', {
        body: {
          courseName,
          courseType,
          semesters: parseInt(semesters),
          specialization,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate course data');
      }

      setGeneratedData(data.data);
      setActiveTab('overview');
      
      toast({
        title: 'Course Generated!',
        description: 'ABET-compliant curriculum has been generated successfully.',
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({
        title: 'Generation Failed',
        description: err.message || 'Failed to generate course data',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const createNavigationItem = async (
    title: string, 
    href: string, 
    parentId: string | null
  ): Promise<string | null> => {
    const { data: existing } = await supabase
      .from('site_navigation')
      .select('id')
      .eq('href', href)
      .single();

    if (existing) return existing.id;

    const { data: maxPos } = await supabase
      .from('site_navigation')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from('site_navigation')
      .insert({
        title,
        href,
        parent_id: parentId,
        menu_location: 'main',
        is_active: true,
        position: (maxPos?.position || 0) + 1,
      })
      .select('id')
      .single();

    return data?.id || null;
  };

  const createCmsPage = async (title: string, slug: string, description: string): Promise<void> => {
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) return;

    await supabase.from('cms_pages').insert({
      title,
      slug,
      description,
      status: 'published',
      page_type: 'academic',
      meta_title: title,
      meta_description: description,
    });
  };

  const addCourseToSystem = async () => {
    if (!generatedData || !selectedDepartment) {
      toast({
        title: 'Selection Required',
        description: 'Please select a faculty and department',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingCourse(true);

    try {
      const courseInfo = generatedData.course_info;
      const courseSlug = generateSlug(`${courseInfo.name}-${courseInfo.code}`);

      // 1. Create the course
      const { data: course, error: courseError } = await supabase
        .from('academic_courses')
        .insert({
          name: courseInfo.name,
          course_code: courseInfo.code,
          slug: courseSlug,
          department_id: selectedDepartment,
          duration_months: courseInfo.duration_semesters * 6,
          total_credits: courseInfo.total_credits,
          short_description: courseInfo.description.slice(0, 200),
          long_description: courseInfo.description,
          enrollment_status: 'open',
          is_active: true,
          is_visible_on_website: true,
        })
        .select('id')
        .single();

      if (courseError) throw courseError;

      // 2. Create subjects for each semester
      for (const semester of generatedData.semester_structure) {
        for (const subject of semester.subjects) {
          await supabase.from('academic_subjects').insert({
            course_id: course.id,
            name: subject.name,
            subject_code: subject.code,
            credits: subject.credits,
            semester: semester.semester,
            description: subject.description,
            is_active: true,
          });
        }
      }

      // 3. Create library books from textbooks
      const allBooks = [...generatedData.reference_materials.textbooks, ...generatedData.reference_materials.reference_books];
      for (const book of allBooks) {
        const { data: existingBook } = await supabase
          .from('library_books')
          .select('id')
          .eq('isbn', book.isbn)
          .single();

        if (!existingBook) {
          const { data: newBook } = await supabase
            .from('library_books')
            .insert([{
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              publisher: book.publisher,
              is_active: true,
              book_code: `BOOK-${book.isbn?.replace(/-/g, '').slice(-6) || Date.now()}`,
            }])
            .select('id')
            .single();

          if (newBook) {
            await supabase.from('course_books').insert([{
              course_id: course.id,
              book_id: newBook.id,
              is_mandatory: 'is_mandatory' in book ? (book as any).is_mandatory : false,
            }]);
          }
        }
      }

      // 4. Create CMS page
      await createCmsPage(
        courseInfo.name,
        courseSlug,
        courseInfo.description.slice(0, 160)
      );

      // 5. Create navigation item
      const dept = departments.find(d => d.id === selectedDepartment);
      const deptSlug = dept ? `department-${generateSlug(dept.name)}` : null;
      
      let parentNavId: string | null = null;
      if (deptSlug) {
        const { data: deptNav } = await supabase
          .from('site_navigation')
          .select('id')
          .eq('href', `/page/${deptSlug}`)
          .single();
        parentNavId = deptNav?.id || null;
      }

      await createNavigationItem(courseInfo.name, `/courses/${courseSlug}`, parentNavId);

      toast({
        title: 'Course Added Successfully!',
        description: `${courseInfo.name} has been added with ${generatedData.semester_structure.length} semesters and all subjects.`,
      });

      // Reset
      setGeneratedData(null);
      setCourseName('');
      setSpecialization('');

    } catch (err: any) {
      console.error('Add course error:', err);
      toast({
        title: 'Failed to Add Course',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsAddingCourse(false);
    }
  };

  const filteredDepartments = selectedFaculty 
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ABET Course Generator (AI-Powered)
          </CardTitle>
          <CardDescription>
            Generate comprehensive ABET-compliant curriculum using OpenAI. 
            Includes semester structure, subjects, syllabus, and learning resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                placeholder="e.g., Bachelor of Computer Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Artificial Intelligence, Data Science"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type</Label>
              <Select value={courseType} onValueChange={setCourseType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate (Bachelor's)</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate (Master's)</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="PhD">Doctoral (PhD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semesters">Number of Semesters</Label>
              <Select value={semesters} onValueChange={setSemesters}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Semesters (1 Year)</SelectItem>
                  <SelectItem value="4">4 Semesters (2 Years)</SelectItem>
                  <SelectItem value="6">6 Semesters (3 Years)</SelectItem>
                  <SelectItem value="8">8 Semesters (4 Years)</SelectItem>
                  <SelectItem value="10">10 Semesters (5 Years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateCourse} 
            disabled={isGenerating || !courseName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating ABET Curriculum...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Course Curriculum
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Data Display */}
      {generatedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {generatedData.course_info.name}
                </CardTitle>
                <CardDescription>
                  {generatedData.course_info.degree_type} • {generatedData.course_info.duration_semesters} Semesters • {generatedData.course_info.total_credits} Credits
                </CardDescription>
              </div>
              <Badge variant="secondary">{generatedData.course_info.code}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="grading">Grading</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Course Description</h4>
                  <p className="text-sm text-muted-foreground">{generatedData.course_info.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedData.course_info.duration_semesters}</p>
                    <p className="text-sm text-muted-foreground">Semesters</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedData.course_info.total_credits}</p>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {generatedData.semester_structure.reduce((acc, s) => acc + s.subjects.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedData.abet_outcomes.student_outcomes.length}</p>
                    <p className="text-sm text-muted-foreground">Student Outcomes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Eligibility</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Minimum Qualification</p>
                      <p className="text-sm text-muted-foreground">{generatedData.eligibility.minimum_qualification}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Required Subjects</p>
                      <p className="text-sm text-muted-foreground">{generatedData.eligibility.required_subjects.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum">
                <ScrollArea className="h-[500px]">
                  <Accordion type="single" collapsible className="w-full">
                    {generatedData.semester_structure.map((semester) => (
                      <AccordionItem key={semester.semester} value={`sem-${semester.semester}`}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Semester {semester.semester}</Badge>
                            <span className="text-muted-foreground">
                              {semester.subjects.length} subjects • {semester.total_credits} credits
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pl-4">
                            {semester.subjects.map((subject, idx) => (
                              <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium">{subject.name}</h5>
                                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary">{subject.credits} Credits</Badge>
                                    <Badge variant="outline">{subject.type}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
                                
                                <Accordion type="single" collapsible>
                                  <AccordionItem value="syllabus">
                                    <AccordionTrigger className="text-sm">View Syllabus</AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-2">
                                        {subject.syllabus.units.map((unit) => (
                                          <div key={unit.unit_number} className="p-2 bg-muted rounded">
                                            <p className="font-medium text-sm">Unit {unit.unit_number}: {unit.title}</p>
                                            <p className="text-xs text-muted-foreground">{unit.topics.join(' • ')}</p>
                                            <p className="text-xs">{unit.hours} hours</p>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Program Educational Objectives (PEOs)</h4>
                  <div className="space-y-2">
                    {generatedData.abet_outcomes.program_educational_objectives.map((peo, idx) => (
                      <div key={idx} className="flex gap-2 p-3 bg-muted rounded-lg">
                        <Badge variant="outline">PEO{idx + 1}</Badge>
                        <span className="text-sm">{peo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Student Outcomes (ABET Criteria)</h4>
                  <div className="space-y-3">
                    {generatedData.abet_outcomes.student_outcomes.map((so) => (
                      <div key={so.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{so.id}</Badge>
                          <span className="font-medium text-sm">{so.description}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pl-4">
                          {so.performance_indicators.map((pi, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{pi}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {/* Textbooks */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Mandatory Textbooks
                      </h4>
                      <div className="space-y-2">
                        {generatedData.reference_materials.textbooks.map((book, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.author} • {book.publisher} • {book.edition} ({book.year})
                            </p>
                            <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Online Resources */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Online Learning Resources
                      </h4>
                      <div className="space-y-2">
                        {generatedData.reference_materials.online_resources.map((resource, idx) => (
                          <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">{resource.platform} • {resource.type}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Free eBooks */}
                    {generatedData.reference_materials.free_ebooks?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Free Downloadable Books
                        </h4>
                        <div className="space-y-2">
                          {generatedData.reference_materials.free_ebooks.map((ebook, idx) => (
                            <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                              <div>
                                <p className="font-medium">{ebook.title}</p>
                                <Badge variant="secondary">{ebook.format}</Badge>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={ebook.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Grading Tab */}
              <TabsContent value="grading" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedData.grading_system.cgpa_scale}</p>
                    <p className="text-sm text-muted-foreground">CGPA Scale</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedData.grading_system.passing_cgpa}</p>
                    <p className="text-sm text-muted-foreground">Passing CGPA</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedData.grading_system.distinction_cgpa}</p>
                    <p className="text-sm text-muted-foreground">Distinction CGPA</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Grade Points</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {Object.entries(generatedData.grading_system.grade_points).map(([grade, points]) => (
                      <div key={grade} className="p-2 border rounded-lg text-center">
                        <p className="font-bold">{grade}</p>
                        <p className="text-sm text-muted-foreground">{points}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Careers Tab */}
              <TabsContent value="careers" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedData.career_outcomes.job_roles.map((role, idx) => (
                        <Badge key={idx} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Industries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedData.career_outcomes.industries.map((industry, idx) => (
                        <Badge key={idx} variant="outline">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Expected Salary Range</h4>
                  <p className="text-lg font-bold text-primary">{generatedData.career_outcomes.average_salary_range}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Higher Studies Options</h4>
                  <div className="space-y-2">
                    {generatedData.career_outcomes.higher_studies.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Add Course Section */}
            <Separator className="my-6" />
            
            <Alert>
              <Plus className="h-4 w-4" />
              <AlertTitle>Add This Course to Your System</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-4">
                  <p className="text-sm">
                    This will create the course, all subjects, link reference books, and generate navigation pages.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Faculty</Label>
                      <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Department</Label>
                      <Select 
                        value={selectedDepartment} 
                        onValueChange={setSelectedDepartment}
                        disabled={!selectedFaculty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDepartments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={addCourseToSystem} 
                    disabled={isAddingCourse || !selectedDepartment}
                    className="w-full"
                  >
                    {isAddingCourse ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding Course...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add This Course
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABETCourseGenerator;
