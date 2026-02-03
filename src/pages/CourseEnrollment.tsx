import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, Clock, DollarSign, FileText, User, Mail, Phone, 
  MapPin, Calendar, CheckCircle2, ArrowLeft, Loader2, BookOpen
} from 'lucide-react';

interface CourseInfo {
  id: string;
  name: string;
  course_code: string;
  slug: string;
  duration_months: number;
  total_credits: number;
  degree_level: string;
  enrollment_status: string;
  fee_structure: {
    tuition?: number;
    registration?: number;
    total?: number;
    currency?: string;
  } | null;
  eligibility_criteria: string | null;
  ai_generated_content: {
    eligibility?: {
      minimumQualification?: string;
      requiredSubjects?: string[];
      entranceRequirements?: string[];
      preferredProfile?: string;
    };
  } | null;
  department?: {
    name: string;
    faculty?: {
      name: string;
    };
  };
}

export default function CourseEnrollment() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    previousQualification: '',
    previousInstitution: '',
    graduationYear: '',
    statementOfPurpose: '',
    agreedToTerms: false,
  });

  useEffect(() => {
    if (slug) {
      fetchCourseDetails();
    }
  }, [slug]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('academic_courses')
        .select(`
          id, name, course_code, slug, duration_months, total_credits,
          degree_level, enrollment_status, fee_structure, eligibility_criteria,
          ai_generated_content,
          department:academic_departments(
            name,
            faculty:academic_faculties(name)
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setCourse(data as unknown as CourseInfo);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique application number
  const generateApplicationNumber = () => {
    const prefix = 'APP';
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${year}-${randomPart}${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Submit to student_applications table
      const applicationData = {
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        previousQualification: formData.previousQualification,
        previousInstitution: formData.previousInstitution,
        graduationYear: formData.graduationYear,
        statementOfPurpose: formData.statementOfPurpose,
        applicationType: 'enrollment',
        courseCode: course?.course_code,
        courseSlug: course?.slug,
      };

      // Generate unique application number to avoid constraint violation
      const applicationNumber = generateApplicationNumber();

      // Note: course_id FK references 'courses' table, not 'academic_courses'
      // So we don't pass course_id for academic_courses based enrollments
      const { error } = await supabase.from('student_applications').insert({
        application_number: applicationNumber,
        program: course?.name,
        full_name: formData.fullName,
        first_name: formData.fullName.split(' ')[0] || '',
        last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        application_data: applicationData,
        status: 'pending',
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Application Submitted!',
        description: `Your application number is ${applicationNumber}. We will review your application and contact you soon.`,
      });
    } catch (err: any) {
      console.error('Application submission error:', err);
      toast({
        title: 'Submission Failed',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getFees = () => {
    if (course?.fee_structure) {
      const fees = course.fee_structure;
      return {
        tuition: fees.tuition || 0,
        registration: fees.registration || 0,
        total: fees.total || (fees.tuition || 0) + (fees.registration || 0),
        currency: fees.currency || 'USD',
      };
    }
    // Default fees based on degree level
    const defaults: Record<string, number> = {
      certificate: 1500,
      undergraduate: 2500,
      postgraduate: 3500,
      doctoral: 5000,
    };
    return {
      tuition: defaults[course?.degree_level || 'undergraduate'] || 2500,
      registration: 100,
      total: (defaults[course?.degree_level || 'undergraduate'] || 2500) + 100,
      currency: 'USD',
    };
  };

  const getEligibility = () => {
    // Priority: AI-generated content > manual eligibility_criteria > defaults
    const aiEligibility = course?.ai_generated_content?.eligibility;
    if (aiEligibility) {
      return aiEligibility;
    }
    
    // Parse manual eligibility if available
    if (course?.eligibility_criteria) {
      return {
        minimumQualification: course.eligibility_criteria,
        requiredSubjects: [],
        entranceRequirements: [],
        preferredProfile: '',
      };
    }

    // Defaults based on degree level
    const levelDefaults: Record<string, any> = {
      certificate: {
        minimumQualification: 'High School Diploma or equivalent',
        requiredSubjects: ['English'],
        entranceRequirements: ['Application form', 'ID proof'],
        preferredProfile: 'Students seeking professional certification',
      },
      undergraduate: {
        minimumQualification: 'High School Diploma with minimum 2.5 GPA',
        requiredSubjects: ['English', 'Mathematics'],
        entranceRequirements: ['SAT/ACT scores (optional)', 'Application essay', 'Letters of recommendation'],
        preferredProfile: 'Students with strong academic foundation and commitment to learning',
      },
      postgraduate: {
        minimumQualification: "Bachelor's Degree with minimum 3.0 GPA",
        requiredSubjects: ['Relevant undergraduate major'],
        entranceRequirements: ['GRE/GMAT scores (optional)', 'Statement of Purpose', 'Professional references'],
        preferredProfile: 'Professionals seeking advanced knowledge and career advancement',
      },
      doctoral: {
        minimumQualification: "Master's Degree with minimum 3.5 GPA",
        requiredSubjects: ["Master's degree in related field"],
        entranceRequirements: ['Research proposal', 'Academic publications (preferred)', 'Interview'],
        preferredProfile: 'Scholars committed to original research and academic contribution',
      },
    };

    return levelDefaults[course?.degree_level || 'undergraduate'] || levelDefaults.undergraduate;
  };

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout title="Course Not Found">
        <div className="container mx-auto py-16 text-center">
          <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (course.enrollment_status === 'closed') {
    return (
      <PageLayout title={`Enrollment - ${course.name}`}>
        <div className="container mx-auto py-16 text-center">
          <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Enrollment Closed</h1>
          <p className="text-muted-foreground mb-4">
            Enrollment for {course.name} is currently closed. Please check back later.
          </p>
          <Button asChild>
            <Link to={`/courses/${course.slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (submitted) {
    return (
      <PageLayout title="Application Submitted">
        <div className="container mx-auto py-16 text-center max-w-xl">
          <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to <strong>{course.name}</strong>. We have received your application
            and will review it shortly. You will receive a confirmation email at <strong>{formData.email}</strong>.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={`/courses/${course.slug}`}>View Course Details</Link>
            </Button>
            <Button asChild>
              <Link to="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const fees = getFees();
  const eligibility = getEligibility();

  return (
    <PageLayout 
      title={`Enroll - ${course.name}`}
      description={`Apply for admission to ${course.name}`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/courses" className="hover:text-primary">Courses</Link>
          <span>/</span>
          <Link to={`/courses/${course.slug}`} className="hover:text-primary">{course.name}</Link>
          <span>/</span>
          <span className="text-foreground">Enrollment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Enrollment Application
                </CardTitle>
                <CardDescription>
                  Complete the form below to apply for {course.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality *</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          placeholder="e.g., United States"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter your full address"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Educational Background */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Educational Background
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prevQual">Highest Qualification *</Label>
                        <Select
                          value={formData.previousQualification}
                          onValueChange={(value) => setFormData({ ...formData, previousQualification: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School Diploma</SelectItem>
                            <SelectItem value="associate">Associate Degree</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prevInst">Previous Institution *</Label>
                        <Input
                          id="prevInst"
                          value={formData.previousInstitution}
                          onChange={(e) => setFormData({ ...formData, previousInstitution: e.target.value })}
                          placeholder="Name of your last institution"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gradYear">Year of Graduation</Label>
                        <Input
                          id="gradYear"
                          type="number"
                          min="1950"
                          max="2030"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          placeholder="e.g., 2023"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Statement of Purpose */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Statement of Purpose
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="sop">Why do you want to join this program?</Label>
                      <Textarea
                        id="sop"
                        value={formData.statementOfPurpose}
                        onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                        placeholder="Describe your motivation, goals, and how this program aligns with your career aspirations..."
                        rows={5}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked === true })}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the <Link to="/legal/terms-conditions" className="text-primary underline">Terms and Conditions</Link> and 
                      <Link to="/legal/privacy-policy" className="text-primary underline ml-1">Privacy Policy</Link>. 
                      I confirm that all information provided is accurate to the best of my knowledge.
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">{course.course_code}</Badge>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.department?.faculty?.name} • {course.department?.name}
                  </p>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{course.duration_months} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits</span>
                    <span>{course.total_credits} credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Degree Level</span>
                    <Badge variant="secondary" className="capitalize">{course.degree_level}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuition Fee</span>
                  <span>{fees.currency} {fees.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Fee</span>
                  <span>{fees.currency} {fees.registration.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{fees.currency} {fees.total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Fees are subject to change. Payment plans available.
                </p>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Minimum Qualification</p>
                  <p className="text-muted-foreground">{eligibility.minimumQualification}</p>
                </div>
                
                {eligibility.requiredSubjects && eligibility.requiredSubjects.length > 0 && (
                  <div>
                    <p className="font-medium mb-1">Required Subjects</p>
                    <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                      {eligibility.requiredSubjects.map((subj: string, idx: number) => (
                        <li key={idx}>{subj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {eligibility.entranceRequirements && eligibility.entranceRequirements.length > 0 && (
                  <div>
                    <p className="font-medium mb-1">Entrance Requirements</p>
                    <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                      {eligibility.entranceRequirements.map((req: string, idx: number) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {eligibility.preferredProfile && (
                  <Alert>
                    <AlertDescription className="text-xs">
                      <strong>Ideal Candidate:</strong> {eligibility.preferredProfile}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
