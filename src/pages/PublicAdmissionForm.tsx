import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [courseType, setCourseType] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
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

  const [documents, setDocuments] = useState({
    photoId: null as File | null,
    addressProof: null as File | null,
    dobProof: null as File | null,
    citizenshipProof: null as File | null,
    passport: null as File | null,
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

  const handleFileChange = (docType: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [docType]: file }));
  };

  const uploadDocument = async (file: File, docType: string, appNumber: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${appNumber}/${docType}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('application-documents')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const generateApplicationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `APP${year}${random}`;
  };

  const getCurrentYear = () => new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory documents
    if (!documents.photoId) {
      toast({
        title: "Missing Document",
        description: "Photo ID is mandatory",
        variant: "destructive"
      });
      return;
    }
    
    if (!documents.dobProof) {
      toast({
        title: "Missing Document",
        description: "Proof of Date of Birth is mandatory",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    try {
      const appNumber = generateApplicationNumber();
      
      // Upload documents
      const photoIdUrl = await uploadDocument(documents.photoId, 'photo_id', appNumber);
      const dobProofUrl = await uploadDocument(documents.dobProof, 'dob_proof', appNumber);
      
      let addressProofUrl = null;
      let citizenshipProofUrl = null;
      let passportUrl = null;
      
      if (documents.addressProof) {
        addressProofUrl = await uploadDocument(documents.addressProof, 'address_proof', appNumber);
      }
      if (documents.citizenshipProof) {
        citizenshipProofUrl = await uploadDocument(documents.citizenshipProof, 'citizenship_proof', appNumber);
      }
      if (documents.passport) {
        passportUrl = await uploadDocument(documents.passport, 'passport', appNumber);
      }
      
      // Prepare application data
      const applicationData: any = {
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
        status: 'submitted',
        photo_id_url: photoIdUrl,
        dob_proof_url: dobProofUrl,
        address_proof_url: addressProofUrl,
        citizenship_proof_url: citizenshipProofUrl,
        passport_url: passportUrl,
      };
      
      // Only add previous education if not certificate course
      if (courseType !== 'certificate') {
        applicationData.previous_education = {
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
        };
      }

      const { data, error } = await supabase
        .from('student_applications')
        .insert([applicationData])
        .select();

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully!",
        description: `Your application number is: ${appNumber}`,
      });
      
      // Redirect to success page
      navigate('/admission-success');

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
                              <SelectItem value="loading" disabled>Loading courses...</SelectItem>
                            ) : courses.length === 0 ? (
                              <SelectItem value="no-courses" disabled>No courses available</SelectItem>
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

                  {/* Previous Education - Only for non-certificate courses */}
                  {courseType !== 'certificate' && (
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

                      {/* Bachelor's Degree (PG, PhD) */}
                      {(courseType === 'pg' || courseType === 'phd') && (
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
                   )}

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Document Upload</h3>
                    <p className="text-sm text-muted-foreground">Upload required documents. Maximum file size: 5MB per file.</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Photo ID * (Mandatory)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('photoId', e.target.files?.[0] || null)}
                          required
                          className="mt-2"
                        />
                        {documents.photoId && (
                          <p className="text-xs text-green-600 mt-1">✓ {documents.photoId.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Proof of Date of Birth * (Mandatory)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('dobProof', e.target.files?.[0] || null)}
                          required
                          className="mt-2"
                        />
                        {documents.dobProof && (
                          <p className="text-xs text-green-600 mt-1">✓ {documents.dobProof.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Address Proof (Optional)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('addressProof', e.target.files?.[0] || null)}
                          className="mt-2"
                        />
                        {documents.addressProof && (
                          <p className="text-xs text-green-600 mt-1">✓ {documents.addressProof.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Proof of Citizenship (Optional)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('citizenshipProof', e.target.files?.[0] || null)}
                          className="mt-2"
                        />
                        {documents.citizenshipProof && (
                          <p className="text-xs text-green-600 mt-1">✓ {documents.citizenshipProof.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Passport (Optional)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('passport', e.target.files?.[0] || null)}
                          className="mt-2"
                        />
                        {documents.passport && (
                          <p className="text-xs text-green-600 mt-1">✓ {documents.passport.name}</p>
                        )}
                      </div>
                    </div>
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
