import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, GraduationCap, Upload } from 'lucide-react';

interface Course {
  id: string;
  course_name: string;
  course_code: string;
  college: string;
  degree_type: string;
}

const PublicAdmissionForm = () => {
  const { toast } = useToast();
  const [courseType, setCourseType] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    address: '',
    
    // Academic Information
    courseId: '',
    admissionMonth: '',
    admissionYear: '',
    
    // Previous Education
    highSchoolName: '',
    highSchoolGrade: '',
    bachelorUniversity: '',
    bachelorDegree: '',
    bachelorGPA: '',
    masterUniversity: '',
    masterDegree: '',
    masterGPA: '',
    
    // Additional Information
    personalStatement: '',
    researchInterest: '',
    workExperience: '',
  });

  useEffect(() => {
    if (courseType) {
      fetchCoursesByType(courseType);
    }
  }, [courseType]);

  const fetchCoursesByType = async (type: string) => {
    setLoading(true);
    try {
      let degreeType = '';
      switch (type) {
        case 'ug':
          degreeType = 'Bachelor';
          break;
        case 'pg':
          degreeType = 'Master';
          break;
        case 'phd':
          degreeType = 'PhD';
          break;
        case 'certificate':
          degreeType = 'Certificate';
          break;
      }

      const { data, error } = await supabase
        .from('courses')
        .select('id, course_name, course_code, college, degree_type')
        .eq('is_active', true)
        .ilike('degree_type', `%${degreeType}%`)
        .order('course_name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateApplicationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `APP${year}${random}`;
  };

  const getCurrentYear = () => new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appNumber = generateApplicationNumber();
      
      // Prepare application data
      const applicationData = {
        application_number: appNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        nationality: formData.nationality,
        passport_number: formData.passportNumber,
        address: formData.address,
        course_id: formData.courseId,
        admission_month: parseInt(formData.admissionMonth),
        admission_year: parseInt(formData.admissionYear),
        previous_education: {
          highSchool: {
            name: formData.highSchoolName,
            grade: formData.highSchoolGrade
          },
          bachelor: courseType !== 'ug' ? {
            university: formData.bachelorUniversity,
            degree: formData.bachelorDegree,
            gpa: formData.bachelorGPA
          } : null,
          master: courseType === 'phd' ? {
            university: formData.masterUniversity,
            degree: formData.masterDegree,
            gpa: formData.masterGPA
          } : null
        },
        status: 'submitted',
      };

      const { data, error } = await supabase
        .from('student_applications')
        .insert([applicationData])
        .select();

      if (error) throw error;

      setApplicationNumber(appNumber);
      setIsSubmitted(true);
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application number is: ${appNumber}`,
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <PageLayout title="Application Submitted" description="Your application has been received">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h2>
                  <p className="text-muted-foreground mb-4">
                    Thank you for your interest in NSCU. We have received your application and will review it shortly.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your Application Number:</h3>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono tracking-wider">
                    {applicationNumber}
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Please save this number for your records. You can use it to track your application status.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• You will receive a confirmation email within 24 hours</p>
                  <p>• Application review typically takes 2-4 weeks</p>
                  <p>• Check your email regularly for updates</p>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setApplicationNumber('');
                    setCourseType('');
                    setFormData({
                      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
                      gender: '', nationality: '', passportNumber: '', address: '',
                      courseId: '', admissionMonth: '', admissionYear: '',
                      highSchoolName: '', highSchoolGrade: '', bachelorUniversity: '',
                      bachelorDegree: '', bachelorGPA: '', masterUniversity: '',
                      masterDegree: '', masterGPA: '', personalStatement: '',
                      researchInterest: '', workExperience: '',
                    });
                  }}
                  variant="outline"
                >
                  Submit Another Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Apply to NSCU" 
      description="Start your journey at North South Caribbean University"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Application Form</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Begin your application to NSCU. Select your program type and complete the form below.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Admission Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Course Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Select Program Type</h3>
                <div>
                  <Label>Program Type *</Label>
                  <Select value={courseType} onValueChange={setCourseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose program type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                      <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                      <SelectItem value="phd">PhD/Doctorate</SelectItem>
                      <SelectItem value="certificate">Certificate/Diploma/Short Term Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {courseType && (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name *</Label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Last Name *</Label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email Address *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Phone Number *</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nationality *</Label>
                        <Input
                          value={formData.nationality}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Passport Number</Label>
                        <Input
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address *</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Program Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Select Course *</Label>
                        <Select value={formData.courseId} onValueChange={(value) => handleInputChange('courseId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose course" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading ? (
                              <SelectItem value="" disabled>Loading courses...</SelectItem>
                            ) : courses.length === 0 ? (
                              <SelectItem value="" disabled>No courses available</SelectItem>
                            ) : (
                              courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.course_name} - {course.college}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Admission Intake *</Label>
                        <Select value={formData.admissionMonth} onValueChange={(value) => handleInputChange('admissionMonth', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intake" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">Fall Intake (August/September)</SelectItem>
                            <SelectItem value="1">Spring Intake (January)</SelectItem>
                            <SelectItem value="5">Summer Intake (May/June)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Admission Year *</Label>
                        <Select value={formData.admissionYear} onValueChange={(value) => handleInputChange('admissionYear', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 3 }, (_, i) => getCurrentYear() + i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Previous Education - High School (All) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Previous Education</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>High School Name *</Label>
                        <Input
                          value={formData.highSchoolName}
                          onChange={(e) => handleInputChange('highSchoolName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>High School Grade/GPA *</Label>
                        <Input
                          value={formData.highSchoolGrade}
                          onChange={(e) => handleInputChange('highSchoolGrade', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Bachelor's Degree (PG, PhD, Certificate) */}
                    {(courseType === 'pg' || courseType === 'phd' || courseType === 'certificate') && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="md:col-span-2">
                          <h4 className="font-medium mb-2">Bachelor's Degree</h4>
                        </div>
                        <div>
                          <Label>University Name *</Label>
                          <Input
                            value={formData.bachelorUniversity}
                            onChange={(e) => handleInputChange('bachelorUniversity', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Degree Title *</Label>
                          <Input
                            value={formData.bachelorDegree}
                            onChange={(e) => handleInputChange('bachelorDegree', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>GPA/Grade *</Label>
                          <Input
                            value={formData.bachelorGPA}
                            onChange={(e) => handleInputChange('bachelorGPA', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Master's Degree (PhD only) */}
                    {courseType === 'phd' && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="md:col-span-2">
                          <h4 className="font-medium mb-2">Master's Degree *</h4>
                        </div>
                        <div>
                          <Label>University Name *</Label>
                          <Input
                            value={formData.masterUniversity}
                            onChange={(e) => handleInputChange('masterUniversity', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Degree Title *</Label>
                          <Input
                            value={formData.masterDegree}
                            onChange={(e) => handleInputChange('masterDegree', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>GPA/Grade *</Label>
                          <Input
                            value={formData.masterGPA}
                            onChange={(e) => handleInputChange('masterGPA', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                    <div>
                      <Label>Personal Statement *</Label>
                      <Textarea
                        value={formData.personalStatement}
                        onChange={(e) => handleInputChange('personalStatement', e.target.value)}
                        placeholder="Tell us about yourself, your goals, and why you want to join NSCU..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    {/* Research Interest (PhD) */}
                    {courseType === 'phd' && (
                      <div>
                        <Label>Research Interest *</Label>
                        <Textarea
                          value={formData.researchInterest}
                          onChange={(e) => handleInputChange('researchInterest', e.target.value)}
                          placeholder="Describe your research interests and proposed research area..."
                          className="min-h-[100px]"
                          required
                        />
                      </div>
                    )}

                    {/* Work Experience (PG, PhD) */}
                    {(courseType === 'pg' || courseType === 'phd') && (
                      <div>
                        <Label>Work Experience {courseType === 'phd' ? '*' : '(Optional)'}</Label>
                        <Textarea
                          value={formData.workExperience}
                          onChange={(e) => handleInputChange('workExperience', e.target.value)}
                          placeholder="Describe your relevant work experience..."
                          className="min-h-[100px]"
                          required={courseType === 'phd'}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setCourseType('')}
                    >
                      Reset Form
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PublicAdmissionForm;
