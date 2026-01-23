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
import { 
  Sparkles, Loader2, GraduationCap, BookOpen, Target, 
  Briefcase, CheckCircle2, ExternalLink, Save, Search,
  Building2, Users, HelpCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  hero: {
    tagline: string;
    headline: string;
  };
  overview: {
    introduction: string;
    highlights: string[];
    unique_selling_points: string[];
  };
  program_details: {
    description: string;
    learning_outcomes: string[];
    skills_acquired: string[];
  };
  career_prospects: {
    overview: string;
    job_roles: string[];
    industries: string[];
    average_salary_range: string;
    placement_rate: string;
  };
  eligibility: {
    minimum_qualification: string;
    required_subjects: string[];
    entrance_requirements: string[];
    preferred_profile: string;
  };
  faculty_info: {
    overview: string;
    specializations: string[];
  };
  testimonial_prompts: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  meta: {
    seo_title: string;
    seo_description: string;
    keywords: string[];
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
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [facRes, deptRes, courseRes] = await Promise.all([
      supabase.from('academic_faculties').select('id, name, code').eq('is_active', true).order('name'),
      supabase.from('academic_departments').select('id, name, code, faculty_id').eq('is_active', true).order('name'),
      supabase.from('academic_courses').select('id, name, slug, course_code, duration_months, total_credits, short_description, long_description, department_id').eq('is_active', true).order('name'),
    ]);
    
    if (facRes.data) setFaculties(facRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    if (courseRes.data) setCourses(courseRes.data);
    setLoading(false);
  };

  // Filter departments by selected faculty
  const filteredDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  // Filter courses by selected department and search
  const filteredCourses = courses.filter(c => {
    const matchesDept = selectedDepartment ? c.department_id === selectedDepartment : true;
    const matchesSearch = courseSearch
      ? c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.course_code.toLowerCase().includes(courseSearch.toLowerCase())
      : true;
    return matchesDept && matchesSearch;
  });

  const getSelectedCourseDetails = () => {
    return courses.find(c => c.id === selectedCourse);
  };

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
        description: 'Please select a course to generate content for',
        variant: 'destructive',
      });
      return;
    }

    const department = getSelectedDepartmentDetails();
    const faculty = getSelectedFacultyDetails();

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-course-content', {
        body: {
          courseName: course.name,
          departmentName: department?.name,
          facultyName: faculty?.name,
          duration: course.duration_months,
          credits: course.total_credits,
          existingDescription: course.long_description || course.short_description,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.data);
      setActiveTab('overview');
      
      toast({
        title: 'Content Generated!',
        description: 'Course page content has been generated successfully.',
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({
        title: 'Generation Failed',
        description: err.message || 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent || !selectedCourse) return;

    const course = getSelectedCourseDetails();
    if (!course) return;

    setIsSaving(true);

    try {
      // Build the long description from generated content
      const longDescription = `
${generatedContent.overview.introduction}

## Program Highlights
${generatedContent.overview.highlights.map(h => `- ${h}`).join('\n')}

## What You'll Learn
${generatedContent.program_details.description}

### Learning Outcomes
${generatedContent.program_details.learning_outcomes.map(o => `- ${o}`).join('\n')}

### Skills You'll Acquire
${generatedContent.program_details.skills_acquired.map(s => `- ${s}`).join('\n')}

## Career Opportunities
${generatedContent.career_prospects.overview}

## Eligibility
**Minimum Qualification:** ${generatedContent.eligibility.minimum_qualification}

${generatedContent.eligibility.preferred_profile}
      `.trim();

      // Update the course with generated content
      const { error: updateError } = await supabase
        .from('academic_courses')
        .update({
          long_description: longDescription,
          short_description: generatedContent.overview.introduction.slice(0, 200),
        })
        .eq('id', selectedCourse);

      if (updateError) throw updateError;

      // Store the full generated content as JSON in a new column or separate table
      // For now, we'll update/create a CMS page with the content
      const { data: existingPage } = await supabase
        .from('cms_pages')
        .select('id')
        .eq('slug', `course-${course.slug}`)
        .single();

      const pageContent = JSON.stringify({
        type: 'course_content',
        generated_at: new Date().toISOString(),
        content: generatedContent,
      });

      if (existingPage) {
        await supabase
          .from('cms_pages')
          .update({
            title: course.name,
            description: generatedContent.meta.seo_description,
            meta_title: generatedContent.meta.seo_title,
            meta_description: generatedContent.meta.seo_description,
          })
          .eq('id', existingPage.id);
      } else {
        await supabase.from('cms_pages').insert({
          title: course.name,
          slug: `course-${course.slug}`,
          description: generatedContent.meta.seo_description,
          status: 'published',
          page_type: 'course',
          meta_title: generatedContent.meta.seo_title,
          meta_description: generatedContent.meta.seo_description,
        });
      }

      toast({
        title: 'Content Saved!',
        description: 'Course page content has been saved and published.',
      });

      // Refresh course data
      fetchData();
      setGeneratedContent(null);
      setSelectedCourse('');
    } catch (err: any) {
      console.error('Save error:', err);
      toast({
        title: 'Save Failed',
        description: err.message || 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
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
            AI Course Content Generator
          </CardTitle>
          <CardDescription>
            Select an existing course and generate comprehensive page content using AI.
            The content will be displayed publicly on the course detail page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Faculty Dropdown */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Faculty
              </Label>
              <Select 
                value={selectedFaculty} 
                onValueChange={(value) => {
                  setSelectedFaculty(value);
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

            {/* Department Dropdown */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Department
              </Label>
              <Select 
                value={selectedDepartment} 
                onValueChange={(value) => {
                  setSelectedDepartment(value);
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

            {/* Course Search */}
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

          {/* Course Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Select Course *
            </Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course to generate content" />
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

          {/* Selected Course Info */}
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
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Course Page Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Generated Content Preview
                </CardTitle>
                <CardDescription>
                  {generatedContent.hero.tagline}
                </CardDescription>
              </div>
              <Button onClick={saveContent} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save & Publish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                <TabsTrigger value="seo">SEO & FAQ</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-bold">{generatedContent.hero.headline}</h3>
                  <p className="text-sm text-muted-foreground italic">{generatedContent.hero.tagline}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Introduction</h4>
                  <p className="text-sm">{generatedContent.overview.introduction}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Program Highlights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {generatedContent.overview.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-muted rounded">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">What Sets Us Apart</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.overview.unique_selling_points.map((usp, idx) => (
                      <Badge key={idx} variant="secondary" className="py-1">
                        {usp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Program Tab */}
              <TabsContent value="program" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Program Description</h4>
                  <p className="text-sm whitespace-pre-wrap">{generatedContent.program_details.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Learning Outcomes
                  </h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {generatedContent.program_details.learning_outcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border rounded">
                          <Badge variant="outline" className="shrink-0">{idx + 1}</Badge>
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Skills Acquired
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.program_details.skills_acquired.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Faculty Overview</h4>
                  <p className="text-sm text-muted-foreground mb-2">{generatedContent.faculty_info.overview}</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.faculty_info.specializations.map((spec, idx) => (
                      <Badge key={idx} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Careers Tab */}
              <TabsContent value="careers" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Career Overview</h4>
                  <p className="text-sm">{generatedContent.career_prospects.overview}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{generatedContent.career_prospects.placement_rate}</p>
                    <p className="text-sm text-muted-foreground">Placement Rate</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-lg font-bold text-primary">{generatedContent.career_prospects.average_salary_range}</p>
                    <p className="text-sm text-muted-foreground">Expected Salary</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Roles
                    </h4>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1">
                        {generatedContent.career_prospects.job_roles.map((role, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            <span className="text-sm">{role}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Industries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.career_prospects.industries.map((industry, idx) => (
                        <Badge key={idx} variant="outline">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Eligibility Tab */}
              <TabsContent value="eligibility" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Minimum Qualification</h4>
                    <p className="text-sm">{generatedContent.eligibility.minimum_qualification}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Ideal Candidate</h4>
                    <p className="text-sm text-muted-foreground">{generatedContent.eligibility.preferred_profile}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Required Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.eligibility.required_subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Entrance Requirements</h4>
                    <div className="space-y-1">
                      {generatedContent.eligibility.entrance_requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SEO & FAQ Tab */}
              <TabsContent value="seo" className="space-y-4">
                <Alert>
                  <AlertTitle>SEO Metadata</AlertTitle>
                  <AlertDescription className="space-y-2 mt-2">
                    <p><strong>Title:</strong> {generatedContent.meta.seo_title}</p>
                    <p><strong>Description:</strong> {generatedContent.meta.seo_description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {generatedContent.meta.keywords.map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Frequently Asked Questions
                  </h4>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {generatedContent.faq.map((item, idx) => (
                        <div key={idx} className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">{item.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Sample Testimonials</h4>
                  <div className="space-y-2">
                    {generatedContent.testimonial_prompts.map((testimonial, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg italic text-sm">
                        "{testimonial}"
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseContentGenerator;
