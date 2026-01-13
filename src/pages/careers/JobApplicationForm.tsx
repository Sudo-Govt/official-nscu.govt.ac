import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, ArrowRight, User, GraduationCap, Briefcase, 
  Wrench, Clock, Upload, CheckCircle, Plus, Trash2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Education {
  level: string;
  course: string;
  institution: string;
  country: string;
  startYear: string;
  endYear: string;
  grade: string;
}

interface Experience {
  organization: string;
  industry: string;
  role: string;
  fromDate: string;
  toDate: string;
  responsibilities: string;
  managerName: string;
  reasonForLeaving: string;
}

interface Language {
  name: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

const JobApplicationForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobId, setJobId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    currentAddress: '',
    permanentAddress: '',
    phone: '',
    email: '',
    identificationNumber: '',
    technicalSkills: '',
    softwareTools: '',
    certifications: '',
    willingToRelocate: false,
    willingToTravel: false,
    preferredWorkMode: '',
    workingHoursAvailability: '',
  });

  const [education, setEducation] = useState<Education[]>([{
    level: '', course: '', institution: '', country: '', startYear: '', endYear: '', grade: ''
  }]);

  const [experience, setExperience] = useState<Experience[]>([{
    organization: '', industry: '', role: '', fromDate: '', toDate: '',
    responsibilities: '', managerName: '', reasonForLeaving: ''
  }]);

  const [languages, setLanguages] = useState<Language[]>([{ name: '', read: false, write: false, speak: false }]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (slug) fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    const { data, error } = await supabase
      .from('job_postings')
      .select('id, title')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      toast({ title: 'Job not found', variant: 'destructive' });
      navigate('/careers');
      return;
    }
    setJobId(data.id);
    setJobTitle(data.title);
  };

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    setEducation(prev => [...prev, { level: '', course: '', institution: '', country: '', startYear: '', endYear: '', grade: '' }]);
  };

  const removeEducation = (index: number) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setEducation(prev => prev.map((edu, i) => i === index ? { ...edu, [field]: value } : edu));
  };

  const addExperience = () => {
    setExperience(prev => [...prev, { organization: '', industry: '', role: '', fromDate: '', toDate: '', responsibilities: '', managerName: '', reasonForLeaving: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setExperience(prev => prev.map((exp, i) => i === index ? { ...exp, [field]: value } : exp));
  };

  const addLanguage = () => {
    setLanguages(prev => [...prev, { name: '', read: false, write: false, speak: false }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string | boolean) => {
    setLanguages(prev => prev.map((lang, i) => i === index ? { ...lang, [field]: value } : lang));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let resumePath = null;
      let resumeFilename = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        resumePath = uploadData.path;
        resumeFilename = resumeFile.name;
      }

      // Submit application
      const { error } = await supabase.from('job_applications').insert([{
        job_id: jobId,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender || null,
        nationality: formData.nationality,
        current_address: formData.currentAddress,
        permanent_address: formData.permanentAddress || null,
        phone: formData.phone,
        email: formData.email,
        identification_number: formData.identificationNumber || null,
        education: education as any,
        experience: experience as any,
        technical_skills: formData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
        software_tools: formData.softwareTools.split(',').map(s => s.trim()).filter(Boolean),
        languages_known: languages.filter(l => l.name) as any,
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
        willing_to_relocate: formData.willingToRelocate,
        willing_to_travel: formData.willingToTravel,
        preferred_work_mode: formData.preferredWorkMode || null,
        working_hours_availability: formData.workingHoursAvailability || null,
        resume_path: resumePath,
        resume_filename: resumeFilename,
      }]);

      if (error) throw error;

      toast({
        title: 'Application Submitted!',
        description: 'Thank you for applying. We will review your application and get back to you soon.',
      });
      navigate('/careers');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Your basic details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name (as per official ID) *</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="gender">Gender (Optional)</Label>
                <Select value={formData.gender} onValueChange={v => setFormData(p => ({ ...p, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="currentAddress">Current Residential Address *</Label>
                <Textarea id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="permanentAddress">Permanent Address (if different)</Label>
                <Textarea id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="phone">Contact Number (Mobile) *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="identificationNumber">Identification Number</Label>
                <Input id="identificationNumber" name="identificationNumber" value={formData.identificationNumber} onChange={handleInputChange} placeholder="Passport / National ID" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Educational Qualifications</h3>
                  <p className="text-sm text-muted-foreground">Your academic background</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-1" /> Add More
              </Button>
            </div>

            {education.map((edu, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  {index > 0 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Level *</Label>
                      <Select value={edu.level} onValueChange={v => updateEducation(index, 'level', v)}>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelor">Bachelor's</SelectItem>
                          <SelectItem value="master">Master's</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Course / Major *</Label>
                      <Input value={edu.course} onChange={e => updateEducation(index, 'course', e.target.value)} />
                    </div>
                    <div>
                      <Label>Institution / University *</Label>
                      <Input value={edu.institution} onChange={e => updateEducation(index, 'institution', e.target.value)} />
                    </div>
                    <div>
                      <Label>Country *</Label>
                      <Input value={edu.country} onChange={e => updateEducation(index, 'country', e.target.value)} />
                    </div>
                    <div>
                      <Label>Year of Commencement</Label>
                      <Input type="number" min="1950" max="2030" value={edu.startYear} onChange={e => updateEducation(index, 'startYear', e.target.value)} />
                    </div>
                    <div>
                      <Label>Year of Completion</Label>
                      <Input type="number" min="1950" max="2030" value={edu.endYear} onChange={e => updateEducation(index, 'endYear', e.target.value)} />
                    </div>
                    <div>
                      <Label>Grade / Percentage / CGPA</Label>
                      <Input value={edu.grade} onChange={e => updateEducation(index, 'grade', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Professional Experience</h3>
                  <p className="text-sm text-muted-foreground">Your work history</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-1" /> Add More
              </Button>
            </div>

            {experience.map((exp, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  {index > 0 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Organization Name</Label>
                      <Input value={exp.organization} onChange={e => updateExperience(index, 'organization', e.target.value)} />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input value={exp.industry} onChange={e => updateExperience(index, 'industry', e.target.value)} />
                    </div>
                    <div>
                      <Label>Job Title / Role</Label>
                      <Input value={exp.role} onChange={e => updateExperience(index, 'role', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>From</Label>
                        <Input type="date" value={exp.fromDate} onChange={e => updateExperience(index, 'fromDate', e.target.value)} />
                      </div>
                      <div>
                        <Label>To</Label>
                        <Input type="date" value={exp.toDate} onChange={e => updateExperience(index, 'toDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Key Responsibilities</Label>
                      <Textarea value={exp.responsibilities} onChange={e => updateExperience(index, 'responsibilities', e.target.value)} />
                    </div>
                    <div>
                      <Label>Reporting Manager Name & Designation</Label>
                      <Input value={exp.managerName} onChange={e => updateExperience(index, 'managerName', e.target.value)} />
                    </div>
                    <div>
                      <Label>Reason for Leaving</Label>
                      <Input value={exp.reasonForLeaving} onChange={e => updateExperience(index, 'reasonForLeaving', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Skills & Competencies</h3>
                <p className="text-sm text-muted-foreground">Your abilities and certifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="technicalSkills">Core / Technical Skills (comma-separated)</Label>
                <Textarea id="technicalSkills" name="technicalSkills" value={formData.technicalSkills} onChange={handleInputChange} placeholder="e.g., Project Management, Data Analysis, Teaching" />
              </div>
              <div>
                <Label htmlFor="softwareTools">Software / Tools Proficiency (comma-separated)</Label>
                <Textarea id="softwareTools" name="softwareTools" value={formData.softwareTools} onChange={handleInputChange} placeholder="e.g., Microsoft Office, SAP, Tableau" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Languages Known</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
                    <Plus className="h-4 w-4 mr-1" /> Add Language
                  </Button>
                </div>
                {languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-4 mb-3 p-3 border rounded-lg">
                    <Input className="w-32" placeholder="Language" value={lang.name} onChange={e => updateLanguage(index, 'name', e.target.value)} />
                    <div className="flex items-center gap-2">
                      <Checkbox id={`read-${index}`} checked={lang.read} onCheckedChange={v => updateLanguage(index, 'read', v as boolean)} />
                      <Label htmlFor={`read-${index}`} className="text-sm">Read</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`write-${index}`} checked={lang.write} onCheckedChange={v => updateLanguage(index, 'write', v as boolean)} />
                      <Label htmlFor={`write-${index}`} className="text-sm">Write</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`speak-${index}`} checked={lang.speak} onCheckedChange={v => updateLanguage(index, 'speak', v as boolean)} />
                      <Label htmlFor={`speak-${index}`} className="text-sm">Speak</Label>
                    </div>
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="certifications">Certifications or Licenses (comma-separated)</Label>
                <Textarea id="certifications" name="certifications" value={formData.certifications} onChange={handleInputChange} placeholder="e.g., PMP, CFA, Teaching License" />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Availability & Work Preferences</h3>
                <p className="text-sm text-muted-foreground">Your work preferences</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="willingToRelocate" checked={formData.willingToRelocate} onCheckedChange={v => setFormData(p => ({ ...p, willingToRelocate: v as boolean }))} />
                  <Label htmlFor="willingToRelocate">Willing to Relocate</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="willingToTravel" checked={formData.willingToTravel} onCheckedChange={v => setFormData(p => ({ ...p, willingToTravel: v as boolean }))} />
                  <Label htmlFor="willingToTravel">Willing to Travel</Label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Preferred Work Mode</Label>
                  <RadioGroup value={formData.preferredWorkMode} onValueChange={v => setFormData(p => ({ ...p, preferredWorkMode: v }))}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="on-site" id="onsite" />
                      <Label htmlFor="onsite">On-site</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <Label htmlFor="hybrid">Hybrid</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="remote" id="remote" />
                      <Label htmlFor="remote">Remote</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="workingHoursAvailability">Working Hours Availability</Label>
                <Input id="workingHoursAvailability" name="workingHoursAvailability" value={formData.workingHoursAvailability} onChange={handleInputChange} placeholder="e.g., 9 AM - 6 PM, Flexible" />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upload Resume</h3>
                <p className="text-sm text-muted-foreground">Attach your CV/Resume</p>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium">{resumeFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setResumeFile(null)}>Remove</Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2">Drag and drop your resume here, or</p>
                  <label htmlFor="resume-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => e.target.files?.[0] && setResumeFile(e.target.files[0])} />
                  <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX (Max 10MB)</p>
                </>
              )}
            </div>

            <Separator />

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Review Your Application</CardTitle>
                <CardDescription>Please verify all information before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><strong>Name:</strong> {formData.fullName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Nationality:</strong> {formData.nationality}</div>
                </div>
                <div><strong>Education:</strong> {education.filter(e => e.institution).length} qualification(s)</div>
                <div><strong>Experience:</strong> {experience.filter(e => e.organization).length} position(s)</div>
                <div><strong>Resume:</strong> {resumeFile ? resumeFile.name : 'Not uploaded'}</div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels = ['Personal', 'Education', 'Experience', 'Skills', 'Preferences', 'Resume'];

  return (
    <PageLayout title={`Apply for ${jobTitle}`}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to={`/careers/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Job Details
          </Link>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">Application Form</Badge>
              </div>
              <CardTitle className="text-2xl">Apply for: {jobTitle}</CardTitle>
              <CardDescription>Complete all steps to submit your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2">
                  {stepLabels.map((label, i) => (
                    <span key={i} className={`text-xs ${currentStep >= i + 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              {renderStep()}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={() => setCurrentStep(s => s + 1)}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting || !formData.fullName || !formData.email}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default JobApplicationForm;
