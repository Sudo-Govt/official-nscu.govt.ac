import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, Loader2, GraduationCap, BookOpen, Target, 
  Briefcase, CheckCircle2, ExternalLink, Save, Search,
  Building2, Users, HelpCircle, RefreshCw, Trash2, Eye, Edit,
  Calendar, Award, FileText, AlertTriangle, Layers
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// 7-Layer Curriculum Types
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

interface GeneratedCurriculum {
  skeleton: {
    semesterCount: number;
    creditsPerSemester: number;
    subjectsPerSemester: number;
    coreElectiveRatio: string;
    topicsPerSubject: number;
    subTopicsPerTopic: number;
    booksPerSubject: number;
    assessmentTemplate: Record<string, string>;
  };
  programInfo: {
    name: string;
    code: string;
    degreeType: string;
    durationSemesters: number;
    totalCredits: number;
    description: string;
  };
  semesters: CurriculumSemester[];
  gradingSystem: {
    scale: number;
    grades: Record<string, { min: number; max: number; points: number }>;
    passingGrade: number;
    distinctionGrade: number;
    graduationRequirements: string;
  };
  careerOutcomes: {
    overview: string;
    jobRoles: string[];
    industries: string[];
    salaryRange: string;
    higherStudies: string[];
  };
  eligibility: {
    minimumQualification: string;
    requiredSubjects: string[];
    entranceRequirements: string[];
    preferredProfile: string;
  };
  validation: {
    totalCreditsValid: boolean;
    subjectStructureValid: boolean;
    assessmentValid: boolean;
    booksValid: boolean;
    errors: string[];
  };
}

interface Course {
  id: string;
  name: string;
  slug: string;
  course_code: string;
  duration_months: number;
  total_credits: number;
  short_description: string | null;
  long_description: string | null;
  department_id: string;
  ai_generated_content: unknown;
  content_generated_at: string | null;
  semester_details: unknown;
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

const CourseContentGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedCurriculum, setGeneratedCurriculum] = useState<GeneratedCurriculum | null>(null);
  const [activeSemester, setActiveSemester] = useState('1');
  const [activeTab, setActiveTab] = useState('skeleton');

  // Data state
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Additional inputs for 7-layer generation
  const [degreeType, setDegreeType] = useState('Bachelor');
  const [institutionType, setInstitutionType] = useState('Research University');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [facRes, deptRes, courseRes] = await Promise.all([
      supabase.from('academic_faculties').select('id, name, code').eq('is_active', true).order('name'),
      supabase.from('academic_departments').select('id, name, code, faculty_id').eq('is_active', true).order('name'),
      supabase.from('academic_courses').select('id, name, slug, course_code, duration_months, total_credits, short_description, long_description, department_id, ai_generated_content, content_generated_at, semester_details').eq('is_active', true).order('name'),
    ]);
    
    if (facRes.data) setFaculties(facRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    if (courseRes.data) setCourses(courseRes.data as Course[]);
    setLoading(false);
  };

  const filteredDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  const filteredCourses = courses.filter(c => {
    const matchesDept = selectedDepartment ? c.department_id === selectedDepartment : true;
    const matchesSearch = courseSearch
      ? c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.course_code.toLowerCase().includes(courseSearch.toLowerCase())
      : true;
    return matchesDept && matchesSearch;
  });

  const getSelectedCourseDetails = () => courses.find(c => c.id === selectedCourse);
  const getSelectedDepartmentDetails = () => {
    const course = getSelectedCourseDetails();
    return departments.find(d => d.id === course?.department_id);
  };
  const getSelectedFacultyDetails = () => {
    const dept = getSelectedDepartmentDetails();
    return faculties.find(f => f.id === dept?.faculty_id);
  };

  const generateContent = async () => {
    const course = getSelectedCourseDetails();
    if (!course) {
      toast({
        title: 'Course Required',
        description: 'Please select a course to generate curriculum for',
        variant: 'destructive',
      });
      return;
    }

    const department = getSelectedDepartmentDetails();
    const faculty = getSelectedFacultyDetails();

    setIsGenerating(true);
    setGeneratedCurriculum(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-curriculum-v2', {
        body: {
          facultyName: faculty?.name,
          facultyCode: faculty?.code,
          departmentName: department?.name,
          departmentCode: department?.code,
          courseName: course.name,
          courseCode: course.course_code,
          degreeType,
          durationSemesters: Math.ceil(course.duration_months / 6),
          totalCredits: course.total_credits,
          institutionType,
          specialization,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate curriculum');
      }

      setGeneratedCurriculum(data.data);
      setActiveTab('skeleton');
      setActiveSemester('1');
      
      toast({
        title: 'Curriculum Generated!',
        description: '7-layer curriculum framework has been generated successfully.',
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({
        title: 'Generation Failed',
        description: err.message || 'Failed to generate curriculum',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    if (!generatedCurriculum || !selectedCourse) return;

    const course = getSelectedCourseDetails();
    if (!course) return;

    setIsSaving(true);

    try {
      // Build comprehensive description
      const longDescription = `
# ${generatedCurriculum.programInfo.name}

${generatedCurriculum.programInfo.description}

## Program Overview
- **Degree Type:** ${generatedCurriculum.programInfo.degreeType}
- **Duration:** ${generatedCurriculum.programInfo.durationSemesters} Semesters
- **Total Credits:** ${generatedCurriculum.programInfo.totalCredits}

## Career Outcomes
${generatedCurriculum.careerOutcomes.overview}

### Job Roles
${generatedCurriculum.careerOutcomes.jobRoles.map(r => `- ${r}`).join('\n')}

### Industries
${generatedCurriculum.careerOutcomes.industries.map(i => `- ${i}`).join('\n')}

**Expected Salary:** ${generatedCurriculum.careerOutcomes.salaryRange}

## Eligibility
**Minimum Qualification:** ${generatedCurriculum.eligibility.minimumQualification}

${generatedCurriculum.eligibility.preferredProfile}

### Required Subjects
${generatedCurriculum.eligibility.requiredSubjects.map(s => `- ${s}`).join('\n')}

### Entrance Requirements
${generatedCurriculum.eligibility.entranceRequirements.map(e => `- ${e}`).join('\n')}

## Grading System
- **GPA Scale:** ${generatedCurriculum.gradingSystem.scale}
- **Passing Grade:** ${generatedCurriculum.gradingSystem.passingGrade}
- **Distinction:** ${generatedCurriculum.gradingSystem.distinctionGrade}

${generatedCurriculum.gradingSystem.graduationRequirements}
      `.trim();

      // Update course with generated content
      const { error: updateError } = await supabase
        .from('academic_courses')
        .update({
          long_description: longDescription,
          short_description: generatedCurriculum.programInfo.description.slice(0, 200),
          ai_generated_content: JSON.parse(JSON.stringify(generatedCurriculum)),
          semester_details: JSON.parse(JSON.stringify(generatedCurriculum.semesters)),
          content_generated_at: new Date().toISOString(),
        })
        .eq('id', selectedCourse);

      if (updateError) throw updateError;

      // Create subjects for each semester
      for (const semester of generatedCurriculum.semesters) {
        for (const subject of semester.subjects) {
          // Check if subject exists
          const { data: existing } = await supabase
            .from('academic_subjects')
            .select('id')
            .eq('course_id', selectedCourse)
            .eq('subject_code', subject.code)
            .single();

          if (!existing) {
            await supabase.from('academic_subjects').insert({
              course_id: selectedCourse,
              name: subject.name,
              subject_code: subject.code,
              credits: subject.credits,
              semester: semester.number,
              description: subject.description,
              subject_type: subject.type,
              syllabus_units: subject.topics,
              reference_books: subject.books,
              learning_outcomes: subject.learningOutcomes,
              assessment_methods: subject.assessment,
              is_active: true,
            });
          }
        }
      }

      toast({
        title: 'Curriculum Saved!',
        description: 'Course curriculum and subjects have been saved successfully.',
      });

      fetchData();
      setGeneratedCurriculum(null);
      setSelectedCourse('');
    } catch (err: any) {
      console.error('Save error:', err);
      toast({
        title: 'Save Failed',
        description: err.message || 'Failed to save curriculum',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContent = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('academic_courses')
        .update({
          long_description: null,
          short_description: null,
          ai_generated_content: null,
          semester_details: null,
          content_generated_at: null,
        })
        .eq('id', courseId);

      if (error) throw error;

      // Also delete related subjects
      await supabase
        .from('academic_subjects')
        .delete()
        .eq('course_id', courseId);

      toast({
        title: 'Content Deleted',
        description: 'AI-generated curriculum has been removed.',
      });

      fetchData();
    } catch (err: any) {
      toast({
        title: 'Delete Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const viewExistingContent = (course: Course) => {
    if (course.ai_generated_content) {
      setGeneratedCurriculum(course.ai_generated_content as unknown as GeneratedCurriculum);
      setSelectedCourse(course.id);
      setActiveTab('skeleton');
      setActiveSemester('1');
    }
  };

  const coursesWithContent = courses.filter(c => c.ai_generated_content !== null);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            7-Layer AI Curriculum Generator
            <Badge variant="secondary" className="ml-2">
              <Layers className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </CardTitle>
          <CardDescription>
            Generate comprehensive ABET-compliant curricula using the 7-layer framework.
            Includes semester structure, topics, sub-topics, books, and assessment weights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Faculty
              </Label>
              <Select 
                value={selectedFaculty} 
                onValueChange={(value) => {
                  setSelectedFaculty(value === 'all' ? '' : value);
                  setSelectedDepartment('');
                  setSelectedCourse('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Department
              </Label>
              <Select 
                value={selectedDepartment} 
                onValueChange={(value) => {
                  setSelectedDepartment(value === 'all' ? '' : value);
                  setSelectedCourse('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {filteredDepartments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Course
              </Label>
              <Input
                placeholder="Search by name or code..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Degree Type</Label>
              <Select value={degreeType} onValueChange={setDegreeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor">Bachelor (BA/BS/BEng)</SelectItem>
                  <SelectItem value="Master">Master (MA/MS/MEng)</SelectItem>
                  <SelectItem value="Doctoral">Doctoral (PhD)</SelectItem>
                  <SelectItem value="Diploma">Diploma/Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Institution Type</Label>
              <Select value={institutionType} onValueChange={setInstitutionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Research University">Research University</SelectItem>
                  <SelectItem value="Liberal Arts College">Liberal Arts College</SelectItem>
                  <SelectItem value="Technical Institute">Technical Institute</SelectItem>
                  <SelectItem value="Professional School">Professional School</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specialization (Optional)</Label>
              <Input
                placeholder="e.g., AI, Data Science"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Select Course *
            </Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course to generate curriculum" />
              </SelectTrigger>
              <SelectContent>
                {filteredCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="font-mono text-xs text-muted-foreground mr-2">{c.course_code}</span>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{getSelectedCourseDetails()?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getSelectedFacultyDetails()?.name} → {getSelectedDepartmentDetails()?.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{getSelectedCourseDetails()?.duration_months} months</span>
                  <span>{getSelectedCourseDetails()?.total_credits} credits</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/courses/${getSelectedCourseDetails()?.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Page
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !selectedCourse}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating 7-Layer Curriculum...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Complete Curriculum
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Curriculum Display */}
      {generatedCurriculum && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {generatedCurriculum.programInfo.name}
                </CardTitle>
                <CardDescription>
                  {generatedCurriculum.programInfo.degreeType} • {generatedCurriculum.programInfo.durationSemesters} Semesters • {generatedCurriculum.programInfo.totalCredits} Credits
                </CardDescription>
              </div>
              <Button onClick={saveContent} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Curriculum
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Validation Alerts */}
            {generatedCurriculum.validation.errors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Validation Issues</AlertTitle>
                <AlertDescription>
                  <ul className="text-sm mt-2 space-y-1">
                    {generatedCurriculum.validation.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
                <TabsTrigger value="semesters">Semesters</TabsTrigger>
                <TabsTrigger value="grading">Grading</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              </TabsList>

              {/* Skeleton Tab - Layer 2 */}
              <TabsContent value="skeleton" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedCurriculum.skeleton.semesterCount}</p>
                    <p className="text-sm text-muted-foreground">Semesters</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedCurriculum.skeleton.creditsPerSemester}</p>
                    <p className="text-sm text-muted-foreground">Credits/Semester</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedCurriculum.skeleton.subjectsPerSemester}</p>
                    <p className="text-sm text-muted-foreground">Subjects/Semester</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{generatedCurriculum.skeleton.coreElectiveRatio}</p>
                    <p className="text-sm text-muted-foreground">Core:Elective</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-lg font-bold">{generatedCurriculum.skeleton.topicsPerSubject}</p>
                    <p className="text-sm text-muted-foreground">Topics/Subject</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-lg font-bold">{generatedCurriculum.skeleton.subTopicsPerTopic}</p>
                    <p className="text-sm text-muted-foreground">Sub-topics/Topic</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-lg font-bold">{generatedCurriculum.skeleton.booksPerSubject}</p>
                    <p className="text-sm text-muted-foreground">Books/Subject</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Assessment Template</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(generatedCurriculum.skeleton.assessmentTemplate).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Program Description</h4>
                  <p className="text-sm text-muted-foreground">{generatedCurriculum.programInfo.description}</p>
                </div>
              </TabsContent>

              {/* Semesters Tab - Layers 3-6 */}
              <TabsContent value="semesters">
                {/* Semester Tabs */}
                <div className="mb-4">
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                      {generatedCurriculum.semesters.map((sem) => (
                        <Button
                          key={sem.number}
                          variant={activeSemester === String(sem.number) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveSemester(String(sem.number))}
                        >
                          Sem {sem.number}
                          <Badge variant="secondary" className="ml-2">{sem.theme}</Badge>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {generatedCurriculum.semesters.map((semester) => (
                  <div
                    key={semester.number}
                    className={activeSemester === String(semester.number) ? 'block' : 'hidden'}
                  >
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

                    <ScrollArea className="h-[500px]">
                      <Accordion type="single" collapsible className="w-full">
                        {semester.subjects.map((subject, idx) => (
                          <AccordionItem key={idx} value={`subject-${idx}`}>
                            <AccordionTrigger>
                              <div className="flex items-center gap-2 text-left">
                                <Badge variant="outline">{subject.code}</Badge>
                                <span>{subject.name}</span>
                                <Badge variant="secondary">{subject.credits} cr</Badge>
                                <Badge variant={subject.type === 'Core' ? 'default' : 'outline'}>
                                  {subject.type}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <p className="text-sm text-muted-foreground">{subject.description}</p>
                              
                              {subject.prerequisites.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium">Prerequisites:</p>
                                  <div className="flex gap-1 mt-1">
                                    {subject.prerequisites.map((p, i) => (
                                      <Badge key={i} variant="outline">{p}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Topics & Sub-topics */}
                              <div>
                                <h5 className="font-medium mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Topics ({subject.topics.length})
                                </h5>
                                <div className="space-y-2">
                                  {subject.topics.map((topic, topicIdx) => (
                                    <div key={topicIdx} className="p-3 bg-muted rounded-lg">
                                      <p className="font-medium text-sm">{topicIdx + 1}. {topic.title}</p>
                                      <ul className="mt-2 space-y-1 pl-4">
                                        {topic.subTopics.map((sub, subIdx) => (
                                          <li key={subIdx} className="text-xs text-muted-foreground">
                                            • {sub}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Books */}
                              <div>
                                <h5 className="font-medium mb-2 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Books & Materials ({subject.books.length})
                                </h5>
                                <div className="space-y-2">
                                  {subject.books.map((book, bookIdx) => (
                                    <div key={bookIdx} className="p-2 border rounded flex items-start justify-between">
                                      <div>
                                        <p className="text-sm font-medium">{book.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {book.author} ({book.year})
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <Badge variant="outline" className="text-xs">{book.type}</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">{book.usage}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Assessment */}
                              <div>
                                <h5 className="font-medium mb-2 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Assessment
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(subject.assessment).map(([key, value]) => (
                                    <Badge key={key} variant="secondary">
                                      {key}: {value}%
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Learning Outcomes */}
                              <div>
                                <h5 className="font-medium mb-2">Learning Outcomes</h5>
                                <div className="flex flex-wrap gap-1">
                                  {subject.learningOutcomes.map((lo, loIdx) => (
                                    <Badge key={loIdx} variant="outline">{lo}</Badge>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  </div>
                ))}
              </TabsContent>

              {/* Grading Tab */}
              <TabsContent value="grading" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedCurriculum.gradingSystem.scale}</p>
                    <p className="text-sm text-muted-foreground">GPA Scale</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedCurriculum.gradingSystem.passingGrade}</p>
                    <p className="text-sm text-muted-foreground">Passing Grade</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">{generatedCurriculum.gradingSystem.distinctionGrade}</p>
                    <p className="text-sm text-muted-foreground">Distinction</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Grade Points</h4>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {Object.entries(generatedCurriculum.gradingSystem.grades).map(([grade, info]) => (
                      <div key={grade} className="p-2 border rounded-lg text-center">
                        <p className="font-bold">{grade}</p>
                        <p className="text-xs text-muted-foreground">{info.min}-{info.max}%</p>
                        <p className="text-sm">{info.points} pts</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Graduation Requirements</h4>
                  <p className="text-sm">{generatedCurriculum.gradingSystem.graduationRequirements}</p>
                </div>
              </TabsContent>

              {/* Careers Tab */}
              <TabsContent value="careers" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Career Overview</h4>
                  <p className="text-sm">{generatedCurriculum.careerOutcomes.overview}</p>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <p className="text-lg font-bold text-primary">{generatedCurriculum.careerOutcomes.salaryRange}</p>
                  <p className="text-sm text-muted-foreground">Expected Salary Range</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCurriculum.careerOutcomes.jobRoles.map((role, idx) => (
                        <Badge key={idx} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Industries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCurriculum.careerOutcomes.industries.map((industry, idx) => (
                        <Badge key={idx} variant="outline">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Higher Studies Options</h4>
                  <div className="space-y-2">
                    {generatedCurriculum.careerOutcomes.higherStudies.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Eligibility Tab */}
              <TabsContent value="eligibility" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Minimum Qualification</h4>
                    <p className="text-sm">{generatedCurriculum.eligibility.minimumQualification}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Ideal Candidate</h4>
                    <p className="text-sm text-muted-foreground">{generatedCurriculum.eligibility.preferredProfile}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Required Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCurriculum.eligibility.requiredSubjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Entrance Requirements</h4>
                    <div className="space-y-1">
                      {generatedCurriculum.eligibility.entranceRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Courses with AI-Generated Content */}
      {coursesWithContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Courses with AI-Generated Curriculum
            </CardTitle>
            <CardDescription>
              Manage courses with 7-layer AI-generated content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coursesWithContent.map((course) => {
                const dept = departments.find(d => d.id === course.department_id);
                const fac = faculties.find(f => f.id === dept?.faculty_id);
                return (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.course_code}</Badge>
                        <span className="font-medium">{course.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {fac?.name} → {dept?.name}
                      </p>
                      {course.content_generated_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Generated: {new Date(course.content_generated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewExistingContent(course)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/courses/${course.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Page
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course.id);
                          setGeneratedCurriculum(null);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteContent(course.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseContentGenerator;
