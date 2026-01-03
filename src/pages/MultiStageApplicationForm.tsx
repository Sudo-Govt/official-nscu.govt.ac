import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Upload, 
  CheckCircle, 
  GraduationCap,
  User,
  MapPin,
  BookOpen,
  FileText,
  Info,
  CreditCard,
  HelpCircle,
  Loader2
} from 'lucide-react';

// Types
interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  countryOfBirth: string;
  passportNumber: string;
  nationalIdNumber: string;
  profilePhoto: File | null;
  contactNumber: string;
  countryCode: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

interface AddressInfo {
  currentStreet: string;
  currentCity: string;
  currentState: string;
  currentPostalCode: string;
  currentCountry: string;
  sameAsCurrent: boolean;
  permanentStreet: string;
  permanentCity: string;
  permanentState: string;
  permanentPostalCode: string;
  permanentCountry: string;
  countryOfResidence: string;
  visaStatus: string;
  nativeLanguage: string;
  englishProficiency: string;
  howDidYouHear: string;
  agentCode: string;
}

interface AcademicInfo {
  highSchoolName: string;
  highSchoolCountry: string;
  highSchoolYear: string;
  highSchoolGPA: string;
  previousUniversity: string;
  previousUniversityCountry: string;
  previousUniversityDegree: string;
  previousUniversityYear: string;
  previousUniversityGPA: string;
  programType: string;
  intendedMajor: string;
  preferredStartTerm: string;
  preferredStartYear: string;
  secondChoiceProgram: string;
  courseId: string;
}

interface Documents {
  academicTranscripts: File[];
  diplomaCertificates: File[];
  passportCopy: File | null;
  englishTest: File | null;
  statementOfPurpose: File | null;
  resume: File | null;
  recommendationLetter1: File | null;
  recommendationLetter2: File | null;
  portfolio: File | null;
  researchProposal: File | null;
  financialDocuments: File | null;
}

interface AdditionalInfo {
  extracurriculars: string;
  workExperience: string;
  specialNeeds: string;
  criminalBackground: boolean;
  criminalExplanation: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
}

interface PaymentInfo {
  paymentMethod: string;
  transactionReference: string;
  paymentReceipt: File | null;
}

interface Course {
  id: string;
  course_name: string;
  course_code: string;
  college: string;
  degree_type: string;
}

const STEPS = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Address & Background', icon: MapPin },
  { id: 3, title: 'Academic History', icon: BookOpen },
  { id: 4, title: 'Document Uploads', icon: FileText },
  { id: 5, title: 'Additional Information', icon: Info },
  { id: 6, title: 'Application Fee', icon: CreditCard },
];

const MultiStageApplicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [agentCodeValid, setAgentCodeValid] = useState<boolean | null>(null);
  const [validatedAgentId, setValidatedAgentId] = useState<string | null>(null);

  // Form state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    countryOfBirth: '',
    passportNumber: '',
    nationalIdNumber: '',
    profilePhoto: null,
    contactNumber: '',
    countryCode: '+1',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    currentStreet: '',
    currentCity: '',
    currentState: '',
    currentPostalCode: '',
    currentCountry: '',
    sameAsCurrent: false,
    permanentStreet: '',
    permanentCity: '',
    permanentState: '',
    permanentPostalCode: '',
    permanentCountry: '',
    countryOfResidence: '',
    visaStatus: '',
    nativeLanguage: '',
    englishProficiency: '',
    howDidYouHear: '',
    agentCode: '',
  });

  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    highSchoolName: '',
    highSchoolCountry: '',
    highSchoolYear: '',
    highSchoolGPA: '',
    previousUniversity: '',
    previousUniversityCountry: '',
    previousUniversityDegree: '',
    previousUniversityYear: '',
    previousUniversityGPA: '',
    programType: '',
    intendedMajor: '',
    preferredStartTerm: '',
    preferredStartYear: '',
    secondChoiceProgram: '',
    courseId: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    academicTranscripts: [],
    diplomaCertificates: [],
    passportCopy: null,
    englishTest: null,
    statementOfPurpose: null,
    resume: null,
    recommendationLetter1: null,
    recommendationLetter2: null,
    portfolio: null,
    researchProposal: null,
    financialDocuments: null,
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    extracurriculars: '',
    workExperience: '',
    specialNeeds: '',
    criminalBackground: false,
    criminalExplanation: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingOptIn: false,
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: '',
    transactionReference: '',
    paymentReceipt: null,
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
    loadDraft();
  }, []);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 120000);
    return () => clearInterval(interval);
  }, [personalInfo, addressInfo, academicInfo, additionalInfo]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, course_name, course_code, college, degree_type')
      .eq('is_active', true)
      .order('course_name');

    if (!error && data) {
      setCourses(data);
    }
  };

  // Validate agent code in real-time
  const validateAgentCode = async (code: string) => {
    if (!code || code.length < 6) {
      setAgentCodeValid(null);
      setValidatedAgentId(null);
      return;
    }

    const { data, error } = await supabase
      .from('agent_profiles')
      .select('id, agent_id')
      .eq('agent_id', code.toUpperCase())
      .maybeSingle();

    if (!error && data) {
      setAgentCodeValid(true);
      setValidatedAgentId(data.id);
    } else {
      setAgentCodeValid(false);
      setValidatedAgentId(null);
    }
  };

  const saveDraft = () => {
    setAutoSaveStatus('saving');
    try {
      const draft = {
        personalInfo,
        addressInfo,
        academicInfo,
        additionalInfo,
        paymentInfo,
        currentStep,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('application_draft', JSON.stringify(draft));
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch {
      setAutoSaveStatus('error');
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem('application_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.personalInfo) setPersonalInfo(draft.personalInfo);
        if (draft.addressInfo) setAddressInfo(draft.addressInfo);
        if (draft.academicInfo) setAcademicInfo(draft.academicInfo);
        if (draft.additionalInfo) setAdditionalInfo(draft.additionalInfo);
        if (draft.paymentInfo) setPaymentInfo(draft.paymentInfo);
        toast({
          title: "Draft Restored",
          description: "Your previous application progress has been restored.",
        });
      }
    } catch {
      // Ignore errors
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('application_draft');
  };

  const progress = (currentStep / STEPS.length) * 100;

  const generateApplicationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `APP${year}${random}`;
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('application-documents')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;
    
    const { data } = supabase.storage
      .from('application-documents')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!additionalInfo.termsAccepted || !additionalInfo.privacyAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms & Conditions and Privacy Policy",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const appNumber = generateApplicationNumber();

      // Upload profile photo if present
      let photoUrl = null;
      if (personalInfo.profilePhoto) {
        photoUrl = await uploadFile(personalInfo.profilePhoto, `${appNumber}/photo`);
      }

      // Upload required documents
      const uploadedDocs: Record<string, string | null> = {};
      
      if (documents.passportCopy) {
        uploadedDocs.passportCopy = await uploadFile(documents.passportCopy, `${appNumber}/passport`);
      }
      if (documents.statementOfPurpose) {
        uploadedDocs.sop = await uploadFile(documents.statementOfPurpose, `${appNumber}/sop`);
      }
      if (documents.resume) {
        uploadedDocs.resume = await uploadFile(documents.resume, `${appNumber}/resume`);
      }
      if (documents.englishTest) {
        uploadedDocs.englishTest = await uploadFile(documents.englishTest, `${appNumber}/english-test`);
      }
      if (paymentInfo.paymentReceipt) {
        uploadedDocs.paymentReceipt = await uploadFile(paymentInfo.paymentReceipt, `${appNumber}/payment`);
      }

      // Prepare application data
      const applicationData = {
        application_number: appNumber,
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        full_name: `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`.trim(),
        email: personalInfo.email,
        phone: `${personalInfo.countryCode}${personalInfo.contactNumber}`,
        nationality: personalInfo.nationality,
        course_id: academicInfo.courseId || null,
        program: academicInfo.intendedMajor || academicInfo.programType,
        status: 'submitted',
        agent_id: validatedAgentId, // Link to agent if valid code was entered
        application_data: JSON.parse(JSON.stringify({
          personalInfo: {
            ...personalInfo,
            profilePhoto: photoUrl,
          },
          addressInfo,
          academicInfo,
          additionalInfo: {
            ...additionalInfo,
            criminalBackground: additionalInfo.criminalBackground,
          },
          paymentInfo: {
            method: paymentInfo.paymentMethod,
            reference: paymentInfo.transactionReference,
          },
          documents: uploadedDocs,
          agentCode: addressInfo.agentCode || null,
        })),
        previous_education: JSON.parse(JSON.stringify({
          highSchool: {
            name: academicInfo.highSchoolName,
            country: academicInfo.highSchoolCountry,
            year: academicInfo.highSchoolYear,
            gpa: academicInfo.highSchoolGPA,
          },
          university: academicInfo.previousUniversity ? {
            name: academicInfo.previousUniversity,
            country: academicInfo.previousUniversityCountry,
            degree: academicInfo.previousUniversityDegree,
            year: academicInfo.previousUniversityYear,
            gpa: academicInfo.previousUniversityGPA,
          } : null,
        })),
      };

      const { error } = await supabase
        .from('student_applications')
        .insert([applicationData]);

      if (error) throw error;

      clearDraft();

      toast({
        title: "Application Submitted!",
        description: `Your application number is: ${appNumber}`,
      });

      navigate('/admission-success', { state: { applicationNumber: appNumber } });

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    saveDraft();
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step: number) => {
    saveDraft();
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={personalInfo} setData={setPersonalInfo} />;
      case 2:
        return <AddressInfoStep 
          data={addressInfo} 
          setData={setAddressInfo} 
          validateAgentCode={validateAgentCode}
          agentCodeValid={agentCodeValid}
        />;
      case 3:
        return <AcademicInfoStep data={academicInfo} setData={setAcademicInfo} courses={courses} />;
      case 4:
        return <DocumentUploadStep data={documents} setData={setDocuments} programType={academicInfo.programType} />;
      case 5:
        return <AdditionalInfoStep data={additionalInfo} setData={setAdditionalInfo} />;
      case 6:
        return <PaymentStep data={paymentInfo} setData={setPaymentInfo} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="Apply to NSCU"
      description="Complete your application in 6 easy steps"
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Application Form</h1>
          <p className="text-muted-foreground">
            Complete all sections to submit your application
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <Button
                key={step.id}
                variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => goToStep(step.id)}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden md:inline">{step.title}</span>
                <span className="md:hidden">{step.id}</span>
              </Button>
            );
          })}
        </div>

        {/* Auto-save indicator */}
        {autoSaveStatus && (
          <div className="text-center mb-4">
            <span className={`text-sm ${autoSaveStatus === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {autoSaveStatus === 'saving' && 'Saving...'}
              {autoSaveStatus === 'saved' && '✓ Draft saved'}
              {autoSaveStatus === 'error' && 'Failed to save draft'}
            </span>
          </div>
        )}

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5" })}
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={saveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Help Button */}
        <div className="fixed bottom-4 right-4">
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

// Step 1: Personal Information
const PersonalInfoStep: React.FC<{ data: PersonalInfo; setData: (data: PersonalInfo) => void }> = ({ data, setData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setData({ ...data, profilePhoto: file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Middle Name</Label>
          <Input
            value={data.middleName}
            onChange={(e) => setData({ ...data, middleName: e.target.value })}
          />
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Date of Birth *</Label>
          <Input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Gender *</Label>
          <Select value={data.gender} onValueChange={(v) => setData({ ...data, gender: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Nationality *</Label>
          <Input
            value={data.nationality}
            onChange={(e) => setData({ ...data, nationality: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Country of Birth *</Label>
          <Input
            value={data.countryOfBirth}
            onChange={(e) => setData({ ...data, countryOfBirth: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Passport Number (International Students)</Label>
          <Input
            value={data.passportNumber}
            onChange={(e) => setData({ ...data, passportNumber: e.target.value })}
          />
        </div>
        <div>
          <Label>National ID Number</Label>
          <Input
            value={data.nationalIdNumber}
            onChange={(e) => setData({ ...data, nationalIdNumber: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Profile Photo (Max 2MB, JPG/PNG)</Label>
        <Input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
        />
        {data.profilePhoto && (
          <p className="text-sm text-green-600 mt-1">✓ {data.profilePhoto.name}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Contact Number *</Label>
          <div className="flex gap-2">
            <Select value={data.countryCode} onValueChange={(v) => setData({ ...data, countryCode: v })}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+91">+91</SelectItem>
                <SelectItem value="+86">+86</SelectItem>
                <SelectItem value="+81">+81</SelectItem>
                <SelectItem value="+49">+49</SelectItem>
                <SelectItem value="+33">+33</SelectItem>
                <SelectItem value="+234">+234</SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="flex-1"
              value={data.contactNumber}
              onChange={(e) => setData({ ...data, contactNumber: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <Label>Email Address *</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">Emergency Contact Details</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Contact Name *</Label>
            <Input
              value={data.emergencyContactName}
              onChange={(e) => setData({ ...data, emergencyContactName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Contact Phone *</Label>
            <Input
              value={data.emergencyContactPhone}
              onChange={(e) => setData({ ...data, emergencyContactPhone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Relationship *</Label>
            <Input
              value={data.emergencyContactRelation}
              onChange={(e) => setData({ ...data, emergencyContactRelation: e.target.value })}
              placeholder="e.g., Parent, Spouse"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Address & Background
const AddressInfoStep: React.FC<{ 
  data: AddressInfo; 
  setData: (data: AddressInfo) => void;
  validateAgentCode: (code: string) => void;
  agentCodeValid: boolean | null;
}> = ({ data, setData, validateAgentCode, agentCodeValid }) => {
  const handleSameAddress = (checked: boolean) => {
    if (checked) {
      setData({
        ...data,
        sameAsCurrent: true,
        permanentStreet: data.currentStreet,
        permanentCity: data.currentCity,
        permanentState: data.currentState,
        permanentPostalCode: data.currentPostalCode,
        permanentCountry: data.currentCountry,
      });
    } else {
      setData({ ...data, sameAsCurrent: false });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">Current Residential Address</h4>
        <div className="space-y-4">
          <div>
            <Label>Street Address *</Label>
            <Input
              value={data.currentStreet}
              onChange={(e) => setData({ ...data, currentStreet: e.target.value })}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>City *</Label>
              <Input
                value={data.currentCity}
                onChange={(e) => setData({ ...data, currentCity: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>State/Province *</Label>
              <Input
                value={data.currentState}
                onChange={(e) => setData({ ...data, currentState: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Postal Code *</Label>
              <Input
                value={data.currentPostalCode}
                onChange={(e) => setData({ ...data, currentPostalCode: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Country *</Label>
              <Input
                value={data.currentCountry}
                onChange={(e) => setData({ ...data, currentCountry: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAddress"
          checked={data.sameAsCurrent}
          onCheckedChange={handleSameAddress}
        />
        <Label htmlFor="sameAddress">Permanent address is same as current address</Label>
      </div>

      {!data.sameAsCurrent && (
        <div>
          <h4 className="font-semibold mb-4">Permanent Address</h4>
          <div className="space-y-4">
            <div>
              <Label>Street Address *</Label>
              <Input
                value={data.permanentStreet}
                onChange={(e) => setData({ ...data, permanentStreet: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  value={data.permanentCity}
                  onChange={(e) => setData({ ...data, permanentCity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>State/Province *</Label>
                <Input
                  value={data.permanentState}
                  onChange={(e) => setData({ ...data, permanentState: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Postal Code *</Label>
                <Input
                  value={data.permanentPostalCode}
                  onChange={(e) => setData({ ...data, permanentPostalCode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Input
                  value={data.permanentCountry}
                  onChange={(e) => setData({ ...data, permanentCountry: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4 grid md:grid-cols-2 gap-4">
        <div>
          <Label>Country of Residence *</Label>
          <Input
            value={data.countryOfResidence}
            onChange={(e) => setData({ ...data, countryOfResidence: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Visa Status (if applicable)</Label>
          <Select value={data.visaStatus} onValueChange={(v) => setData({ ...data, visaStatus: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select visa status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen">Citizen</SelectItem>
              <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
              <SelectItem value="student_visa">Student Visa</SelectItem>
              <SelectItem value="work_visa">Work Visa</SelectItem>
              <SelectItem value="tourist_visa">Tourist Visa</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="not_applicable">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Native Language *</Label>
          <Input
            value={data.nativeLanguage}
            onChange={(e) => setData({ ...data, nativeLanguage: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>English Proficiency Level *</Label>
          <Select value={data.englishProficiency} onValueChange={(v) => setData({ ...data, englishProficiency: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="native">Native Speaker</SelectItem>
              <SelectItem value="fluent">Fluent (C1-C2)</SelectItem>
              <SelectItem value="advanced">Advanced (B2)</SelectItem>
              <SelectItem value="intermediate">Intermediate (B1)</SelectItem>
              <SelectItem value="basic">Basic (A1-A2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>How did you hear about us? *</Label>
          <Select value={data.howDidYouHear} onValueChange={(v) => setData({ ...data, howDidYouHear: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="search_engine">Search Engine</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="friend_family">Friend or Family</SelectItem>
              <SelectItem value="education_fair">Education Fair</SelectItem>
              <SelectItem value="agent">Education Agent</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Admission Agent Code (Optional)</Label>
          <div className="relative">
            <Input
              value={data.agentCode}
              onChange={(e) => {
                const code = e.target.value.toUpperCase();
                setData({ ...data, agentCode: code });
                validateAgentCode(code);
              }}
              placeholder="6-digit agent code"
              maxLength={6}
              className={agentCodeValid === true ? 'border-green-500' : agentCodeValid === false ? 'border-destructive' : ''}
            />
            {agentCodeValid === true && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm">✓ Valid</span>
            )}
            {agentCodeValid === false && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive text-sm">✗ Invalid</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enter if referred by an agent (6-character code)
          </p>
        </div>
      </div>
    </div>
  );
};

// Step 3: Academic History
const AcademicInfoStep: React.FC<{ 
  data: AcademicInfo; 
  setData: (data: AcademicInfo) => void;
  courses: Course[];
}> = ({ data, setData, courses }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const futureYears = Array.from({ length: 3 }, (_, i) => currentYear + i);

  const filteredCourses = data.programType 
    ? courses.filter(c => c.degree_type.toLowerCase().includes(data.programType.toLowerCase()))
    : courses;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">High School/Secondary Education</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>School Name *</Label>
            <Input
              value={data.highSchoolName}
              onChange={(e) => setData({ ...data, highSchoolName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Country *</Label>
            <Input
              value={data.highSchoolCountry}
              onChange={(e) => setData({ ...data, highSchoolCountry: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Year of Completion *</Label>
            <Select value={data.highSchoolYear} onValueChange={(v) => setData({ ...data, highSchoolYear: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>GPA/Percentage *</Label>
            <Input
              value={data.highSchoolGPA}
              onChange={(e) => setData({ ...data, highSchoolGPA: e.target.value })}
              placeholder="e.g., 3.5 or 85%"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Previous University/College (if applicable)</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>University Name</Label>
            <Input
              value={data.previousUniversity}
              onChange={(e) => setData({ ...data, previousUniversity: e.target.value })}
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              value={data.previousUniversityCountry}
              onChange={(e) => setData({ ...data, previousUniversityCountry: e.target.value })}
            />
          </div>
          <div>
            <Label>Degree Obtained</Label>
            <Input
              value={data.previousUniversityDegree}
              onChange={(e) => setData({ ...data, previousUniversityDegree: e.target.value })}
            />
          </div>
          <div>
            <Label>Year of Graduation</Label>
            <Select value={data.previousUniversityYear} onValueChange={(v) => setData({ ...data, previousUniversityYear: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>GPA</Label>
            <Input
              value={data.previousUniversityGPA}
              onChange={(e) => setData({ ...data, previousUniversityGPA: e.target.value })}
              placeholder="e.g., 3.5/4.0"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">Program Applied For</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Program Type *</Label>
            <Select value={data.programType} onValueChange={(v) => setData({ ...data, programType: v, courseId: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select program type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate/Masters</SelectItem>
                <SelectItem value="doctoral">Doctoral/PhD</SelectItem>
                <SelectItem value="certificate">Certificate/Diploma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Intended Major/Field of Study *</Label>
            <Select value={data.courseId} onValueChange={(v) => setData({ ...data, courseId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {filteredCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course_name} - {course.college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred Start Term *</Label>
            <Select value={data.preferredStartTerm} onValueChange={(v) => setData({ ...data, preferredStartTerm: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fall">Fall (August/September)</SelectItem>
                <SelectItem value="spring">Spring (January)</SelectItem>
                <SelectItem value="summer">Summer (May/June)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred Start Year *</Label>
            <Select value={data.preferredStartYear} onValueChange={(v) => setData({ ...data, preferredStartYear: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {futureYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Second Choice Program (Optional)</Label>
            <Select value={data.secondChoiceProgram} onValueChange={(v) => setData({ ...data, secondChoiceProgram: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select second choice" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course_name} - {course.college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Document Uploads
const DocumentUploadStep: React.FC<{ 
  data: Documents; 
  setData: (data: Documents) => void;
  programType: string;
}> = ({ data, setData, programType }) => {
  const handleFileChange = (field: keyof Documents, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'academicTranscripts' || field === 'diplomaCertificates') {
      setData({ ...data, [field]: Array.from(files) });
    } else {
      setData({ ...data, [field]: files[0] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">File Upload Guidelines</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Total application size limit: 50MB</li>
          <li>• Accepted formats: PDF (preferred), JPG, PNG, DOC, DOCX</li>
          <li>• File naming: LastName_FirstName_DocumentType</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Required Documents</h4>
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Academic Transcripts * (Max 5MB per file, PDF only)
            </Label>
            <Input
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileChange('academicTranscripts', e.target.files)}
            />
            {data.academicTranscripts.length > 0 && (
              <p className="text-sm text-green-600 mt-1">✓ {data.academicTranscripts.length} file(s) selected</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Diploma/Degree Certificates * (Max 5MB, PDF)
            </Label>
            <Input
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileChange('diplomaCertificates', e.target.files)}
            />
            {data.diplomaCertificates.length > 0 && (
              <p className="text-sm text-green-600 mt-1">✓ {data.diplomaCertificates.length} file(s) selected</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Passport Copy * (Max 2MB, PDF/JPG)
            </Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={(e) => handleFileChange('passportCopy', e.target.files)}
            />
            {data.passportCopy && (
              <p className="text-sm text-green-600 mt-1">✓ {data.passportCopy.name}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              English Proficiency Test Results (Max 2MB, PDF) - TOEFL/IELTS/Duolingo if applicable
            </Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('englishTest', e.target.files)}
            />
            {data.englishTest && (
              <p className="text-sm text-green-600 mt-1">✓ {data.englishTest.name}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Statement of Purpose * (Max 3MB, PDF/DOC, 500-1000 words)
            </Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('statementOfPurpose', e.target.files)}
            />
            {data.statementOfPurpose && (
              <p className="text-sm text-green-600 mt-1">✓ {data.statementOfPurpose.name}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resume/CV * (Max 2MB, PDF)
            </Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('resume', e.target.files)}
            />
            {data.resume && (
              <p className="text-sm text-green-600 mt-1">✓ {data.resume.name}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Recommendation Letter 1 (Max 2MB, PDF)
              </Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('recommendationLetter1', e.target.files)}
              />
              {data.recommendationLetter1 && (
                <p className="text-sm text-green-600 mt-1">✓ {data.recommendationLetter1.name}</p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Recommendation Letter 2 (Max 2MB, PDF)
              </Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('recommendationLetter2', e.target.files)}
              />
              {data.recommendationLetter2 && (
                <p className="text-sm text-green-600 mt-1">✓ {data.recommendationLetter2.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Optional Documents</h4>
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Portfolio (For creative programs, Max 10MB, PDF/ZIP)
            </Label>
            <Input
              type="file"
              accept=".pdf,.zip"
              onChange={(e) => handleFileChange('portfolio', e.target.files)}
            />
            {data.portfolio && (
              <p className="text-sm text-green-600 mt-1">✓ {data.portfolio.name}</p>
            )}
          </div>

          {(programType === 'graduate' || programType === 'doctoral') && (
            <div>
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Research Proposal (For graduate programs, Max 3MB, PDF)
              </Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('researchProposal', e.target.files)}
              />
              {data.researchProposal && (
                <p className="text-sm text-green-600 mt-1">✓ {data.researchProposal.name}</p>
              )}
            </div>
          )}

          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Financial Support Documents (Max 5MB, PDF)
            </Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('financialDocuments', e.target.files)}
            />
            {data.financialDocuments && (
              <p className="text-sm text-green-600 mt-1">✓ {data.financialDocuments.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Additional Information
const AdditionalInfoStep: React.FC<{ data: AdditionalInfo; setData: (data: AdditionalInfo) => void }> = ({ data, setData }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>Extracurricular Activities/Achievements</Label>
        <Textarea
          value={data.extracurriculars}
          onChange={(e) => setData({ ...data, extracurriculars: e.target.value })}
          placeholder="List your activities, leadership roles, awards, and achievements..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <Label>Work Experience (if any)</Label>
        <Textarea
          value={data.workExperience}
          onChange={(e) => setData({ ...data, workExperience: e.target.value })}
          placeholder="Describe your relevant work experience, internships, or volunteer work..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <Label>Special Needs or Accommodations Required</Label>
        <Textarea
          value={data.specialNeeds}
          onChange={(e) => setData({ ...data, specialNeeds: e.target.value })}
          placeholder="Please describe any accommodations you may need..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <div>
          <Label className="font-semibold">Criminal Background Declaration *</Label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="criminal_no"
                name="criminal"
                checked={!data.criminalBackground}
                onChange={() => setData({ ...data, criminalBackground: false, criminalExplanation: '' })}
              />
              <Label htmlFor="criminal_no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="criminal_yes"
                name="criminal"
                checked={data.criminalBackground}
                onChange={() => setData({ ...data, criminalBackground: true })}
              />
              <Label htmlFor="criminal_yes">Yes</Label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Have you ever been convicted of a criminal offense?
          </p>
        </div>

        {data.criminalBackground && (
          <div>
            <Label>Please provide an explanation *</Label>
            <Textarea
              value={data.criminalExplanation}
              onChange={(e) => setData({ ...data, criminalExplanation: e.target.value })}
              placeholder="Please provide details..."
              className="min-h-[80px]"
              required
            />
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => setData({ ...data, termsAccepted: checked as boolean })}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            I accept the <a href="/terms-conditions" className="text-primary underline" target="_blank">Terms & Conditions</a> of NSCU *
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={data.privacyAccepted}
            onCheckedChange={(checked) => setData({ ...data, privacyAccepted: checked as boolean })}
          />
          <Label htmlFor="privacy" className="text-sm leading-relaxed">
            I consent to the collection and processing of my personal data in accordance with the <a href="/privacy-policy" className="text-primary underline" target="_blank">Privacy Policy</a> (GDPR compliant) *
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketing"
            checked={data.marketingOptIn}
            onCheckedChange={(checked) => setData({ ...data, marketingOptIn: checked as boolean })}
          />
          <Label htmlFor="marketing" className="text-sm leading-relaxed">
            I would like to receive marketing communications about programs, events, and updates from NSCU (Optional)
          </Label>
        </div>
      </div>
    </div>
  );
};

// Step 6: Payment
const PaymentStep: React.FC<{ data: PaymentInfo; setData: (data: PaymentInfo) => void }> = ({ data, setData }) => {
  const applicationFee = {
    USD: 75,
    EUR: 70,
    GBP: 60,
    INR: 6250,
    NGN: 115000,
    CNY: 540,
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Application Fee</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(applicationFee).map(([currency, amount]) => (
            <div key={currency} className="text-center p-2 bg-background rounded">
              <div className="text-lg font-bold">{currency} {amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Payment Method *</Label>
        <Select value={data.paymentMethod} onValueChange={(v) => setData({ ...data, paymentMethod: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="flutterwave">Flutterwave (Africa)</SelectItem>
            <SelectItem value="razorpay">Razorpay (Asia)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.paymentMethod === 'bank_transfer' && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold">Bank Transfer Details</h4>
          <p className="text-sm">Bank Name: First National Bank</p>
          <p className="text-sm">Account Name: NSCU Admissions</p>
          <p className="text-sm">Account Number: 1234567890</p>
          <p className="text-sm">SWIFT/BIC: FNBKUS44</p>
          <p className="text-sm">Reference: Your Full Name + Application</p>
        </div>
      )}

      <div>
        <Label>Transaction Reference Number</Label>
        <Input
          value={data.transactionReference}
          onChange={(e) => setData({ ...data, transactionReference: e.target.value })}
          placeholder="Enter your transaction/confirmation number"
        />
      </div>

      {data.paymentMethod === 'bank_transfer' && (
        <div>
          <Label className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Payment Receipt (Max 2MB, PDF/JPG)
          </Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setData({ ...data, paymentReceipt: e.target.files?.[0] || null })}
          />
          {data.paymentReceipt && (
            <p className="text-sm text-green-600 mt-1">✓ {data.paymentReceipt.name}</p>
          )}
        </div>
      )}

      <div className="bg-primary/10 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">What happens next?</h4>
        <ul className="text-sm space-y-1">
          <li>• You will receive a confirmation email with your application number</li>
          <li>• Expected processing time: 2-4 weeks</li>
          <li>• You can track your application status in the portal</li>
          <li>• Our admissions team may contact you for additional documents</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiStageApplicationForm;
