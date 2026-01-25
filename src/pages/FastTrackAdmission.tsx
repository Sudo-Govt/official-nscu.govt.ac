import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  GraduationCap, 
  FileText, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Zap
} from 'lucide-react';

interface FeeStructure {
  fast_mode?: number;
  [key: string]: number | undefined;
}

interface Course {
  id: string;
  course_name: string;
  degree_type: string;
  duration_years: number;
  fee_structure: FeeStructure | null;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
}

interface AcademicInfo {
  highestQualification: string;
  institution: string;
  graduationYear: string;
  courseId: string;
  courseName: string;
  degreeType: string;
}

interface AdditionalInfo {
  workExperience: string;
  currentEmployer: string;
  motivation: string;
}

interface ConsentInfo {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

const STEPS = [
  { title: 'Personal Information', icon: User },
  { title: 'Academic Background', icon: GraduationCap },
  { title: 'Additional Details', icon: FileText },
  { title: 'Review & Payment', icon: CreditCard },
];

const FastTrackAdmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [calculatedFee, setCalculatedFee] = useState(0);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
  });

  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    highestQualification: '',
    institution: '',
    graduationYear: '',
    courseId: '',
    courseName: '',
    degreeType: '',
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    workExperience: '',
    currentEmployer: '',
    motivation: '',
  });

  const [consentInfo, setConsentInfo] = useState<ConsentInfo>({
    termsAccepted: false,
    privacyAccepted: false,
    marketingOptIn: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      calculateFee(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_name, degree_type, duration_years, fee_structure')
        .eq('is_active', true)
        .order('course_name');

      if (error) throw error;
      // Cast the fee_structure to our expected type
      const typedCourses: Course[] = (data || []).map(c => ({
        ...c,
        fee_structure: c.fee_structure as FeeStructure | null,
      }));
      setCourses(typedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFee = (course: Course) => {
    // Check if fast_mode fee exists in fee_structure
    const fastModeFee = course.fee_structure?.fast_mode;
    
    if (fastModeFee && fastModeFee > 0) {
      setCalculatedFee(fastModeFee);
      return;
    }

    // Default fees based on degree type
    const degreeType = course.degree_type.toLowerCase();
    const isPG = degreeType.includes('master') || 
                 degreeType.includes('doctor') || 
                 degreeType.includes('phd') ||
                 degreeType.includes('mba') ||
                 degreeType.includes('m.') ||
                 degreeType.includes('pg');
    
    setCalculatedFee(isPG ? 2800 : 1900);
  };

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setAcademicInfo({
        ...academicInfo,
        courseId: course.id,
        courseName: course.course_name,
        degreeType: course.degree_type,
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.phone) {
          toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
          toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
          return false;
        }
        return true;
      case 1:
        if (!academicInfo.highestQualification || !academicInfo.courseId) {
          toast({ title: 'Error', description: 'Please select your qualification and course', variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (!additionalInfo.motivation || additionalInfo.motivation.length < 50) {
          toast({ title: 'Error', description: 'Please provide your motivation (at least 50 characters)', variant: 'destructive' });
          return false;
        }
        return true;
      case 3:
        if (!consentInfo.termsAccepted || !consentInfo.privacyAccepted) {
          toast({ title: 'Error', description: 'Please accept the terms and privacy policy', variant: 'destructive' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmitAndPay = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Create application record using existing table schema
      const { data: application, error: appError } = await supabase
        .from('student_applications')
        .insert({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          full_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          email: personalInfo.email,
          phone: personalInfo.phone,
          nationality: personalInfo.nationality || null,
          course_id: academicInfo.courseId,
          program: academicInfo.courseName,
          status: 'pending_payment',
          payment_status: 'pending',
          approved_fee: calculatedFee,
          application_data: {
            application_type: 'fast_track',
            date_of_birth: personalInfo.dateOfBirth,
            gender: personalInfo.gender,
            highest_qualification: academicInfo.highestQualification,
            previous_institution: academicInfo.institution,
            graduation_year: academicInfo.graduationYear,
            work_experience: additionalInfo.workExperience,
            current_employer: additionalInfo.currentEmployer,
            motivation_statement: additionalInfo.motivation,
            degree_type: academicInfo.degreeType,
          },
        })
        .select()
        .single();

      if (appError) throw appError;

      // Create Razorpay payment link
      const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('create-razorpay-payment', {
        body: {
          amount: calculatedFee,
          currency: 'USD',
          description: `Fast Track Admission - ${academicInfo.courseName}`,
          customer_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          customer_email: personalInfo.email,
          customer_phone: personalInfo.phone,
          course_id: academicInfo.courseId,
          application_id: application.id,
          callback_url: `${window.location.origin}/fast-track-success?application_id=${application.id}`,
        },
      });

      if (paymentError) throw paymentError;

      if (paymentResult?.payment_link_url) {
        // Redirect to payment
        window.location.href = paymentResult.payment_link_url;
      } else {
        throw new Error('Failed to generate payment link');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process application',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={personalInfo.gender}
                  onValueChange={(value) => setPersonalInfo({ ...personalInfo, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={personalInfo.nationality}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                  placeholder="e.g., American"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Select Your Fast Track Course *</Label>
              <Select
                value={academicInfo.courseId}
                onValueChange={handleCourseChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent className="bg-background border max-h-60">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_name} - {course.degree_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification *</Label>
                <Select
                  value={academicInfo.highestQualification}
                  onValueChange={(value) => setAcademicInfo({ ...academicInfo, highestQualification: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="high_school">High School Diploma</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                    <SelectItem value="professional">Professional Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={academicInfo.graduationYear}
                  onChange={(e) => setAcademicInfo({ ...academicInfo, graduationYear: e.target.value })}
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Previous Institution</Label>
              <Input
                id="institution"
                value={academicInfo.institution}
                onChange={(e) => setAcademicInfo({ ...academicInfo, institution: e.target.value })}
                placeholder="Name of your previous college/university"
              />
            </div>
            {selectedCourse && (
              <div className="bg-primary/10 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Fast Track Program Details</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>{selectedCourse.course_name}</strong> - {selectedCourse.degree_type}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your degree in an accelerated format designed for working professionals.
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workExperience">Years of Work Experience</Label>
                <Select
                  value={additionalInfo.workExperience}
                  onValueChange={(value) => setAdditionalInfo({ ...additionalInfo, workExperience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentEmployer">Current Employer</Label>
                <Input
                  id="currentEmployer"
                  value={additionalInfo.currentEmployer}
                  onChange={(e) => setAdditionalInfo({ ...additionalInfo, currentEmployer: e.target.value })}
                  placeholder="Company name (if employed)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">
                Why do you want to pursue this Fast Track program? *
                <span className="text-xs text-muted-foreground ml-2">(minimum 50 characters)</span>
              </Label>
              <Textarea
                id="motivation"
                value={additionalInfo.motivation}
                onChange={(e) => setAdditionalInfo({ ...additionalInfo, motivation: e.target.value })}
                placeholder="Describe your career goals and why this program is right for you..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                {additionalInfo.motivation.length}/50 characters minimum
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Application Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">Application Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{personalInfo.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Qualification</p>
                  <p className="font-medium capitalize">{academicInfo.highestQualification.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Course & Fee Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Fast Track Course</h3>
              </div>
              <p className="font-medium text-lg">{academicInfo.courseName}</p>
              <p className="text-muted-foreground">{academicInfo.degreeType}</p>
              <div className="mt-4 pt-4 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Program Fee</span>
                  <span className="text-2xl font-bold text-primary">US$ {calculatedFee.toLocaleString()}</span>
                </div>
                {selectedCourse?.fee_structure?.fast_mode ? (
                  <p className="text-xs text-muted-foreground mt-1">Course-specific fast track fee</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard fast track fee ({selectedCourse?.degree_type?.toLowerCase().includes('master') || 
                    selectedCourse?.degree_type?.toLowerCase().includes('doctor') ? 'Postgraduate' : 'Undergraduate'})
                  </p>
                )}
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={consentInfo.termsAccepted}
                  onCheckedChange={(checked) => setConsentInfo({ ...consentInfo, termsAccepted: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the <a href="/legal/terms-conditions" target="_blank" className="text-primary underline">Terms and Conditions</a> *
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={consentInfo.privacyAccepted}
                  onCheckedChange={(checked) => setConsentInfo({ ...consentInfo, privacyAccepted: checked as boolean })}
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                  I have read and accept the <a href="/legal/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</a> *
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={consentInfo.marketingOptIn}
                  onCheckedChange={(checked) => setConsentInfo({ ...consentInfo, marketingOptIn: checked as boolean })}
                />
                <Label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
                  I would like to receive updates and promotional communications
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Fast Track Admission</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Accelerate Your Career</h1>
          <p className="text-muted-foreground">
            Complete your degree in less time with our Fast Track program
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-1 text-xs ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep].icon, { className: 'h-5 w-5' })}
              {STEPS[currentStep].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Tell us about yourself'}
              {currentStep === 1 && 'Your educational background and course selection'}
              {currentStep === 2 && 'Professional experience and motivation'}
              {currentStep === 3 && 'Review your application and complete payment'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              renderStepContent()
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitAndPay}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Submit & Pay US$ {calculatedFee.toLocaleString()}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FastTrackAdmission;
