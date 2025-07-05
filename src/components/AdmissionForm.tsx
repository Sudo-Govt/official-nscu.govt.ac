
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, User, Mail, Phone, GraduationCap } from 'lucide-react';

interface AdmissionFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  previousEducation: string;
  gpa: string;
  program: string;
  startTerm: string;
  personalStatement: string;
}

interface AdmissionFormProps {
  programName?: string;
  onSuccess?: () => void;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ programName, onSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formCode, setFormCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdmissionFormData>({
    defaultValues: {
      program: programName || '',
    }
  });

  const generateFormCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ADM-${timestamp}-${random}`;
  };

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const code = generateFormCode();
    setFormCode(code);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "Application Submitted Successfully!",
      description: `Your application code is: ${code}`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your interest in our program. We have received your application and will review it shortly.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Your Application Reference Code:</h3>
              <div className="text-2xl font-bold text-green-600 font-mono tracking-wider">
                {formCode}
              </div>
              <p className="text-sm text-green-700 mt-2">
                Please save this code for your records. You can use it to track your application status.
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• You will receive a confirmation email within 24 hours</p>
              <p>• Application review process typically takes 2-3 weeks</p>
              <p>• Check your email regularly for updates</p>
            </div>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormCode('');
                form.reset();
              }}
              variant="outline"
              className="mt-4"
            >
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          Admission Application Form
        </CardTitle>
        {programName && (
          <p className="text-sm text-gray-600">Applying for: <span className="font-semibold">{programName}</span></p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{ required: "Date of birth is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: "Please select gender" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="city"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="City name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  rules={{ required: "ZIP code is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="previousEducation"
                  rules={{ required: "Previous education is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Level of Education *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high-school">High School Diploma</SelectItem>
                          <SelectItem value="associate">Associate Degree</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gpa"
                  rules={{ required: "GPA is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA *</FormLabel>
                      <FormControl>
                        <Input placeholder="3.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="program"
                  rules={{ required: "Please select a program" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program of Interest *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bachelor of Arts in English">Bachelor of Arts in English</SelectItem>
                          <SelectItem value="Master of Arts in History">Master of Arts in History</SelectItem>
                          <SelectItem value="Master of Fine Arts in Creative Writing">Master of Fine Arts in Creative Writing</SelectItem>
                          <SelectItem value="Bachelor of Science in Biology">Bachelor of Science in Biology</SelectItem>
                          <SelectItem value="College of Engineering">College of Engineering</SelectItem>
                          <SelectItem value="School of Business">School of Business</SelectItem>
                          <SelectItem value="School of Medicine">School of Medicine</SelectItem>
                          <SelectItem value="School of Law">School of Law</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTerm"
                  rules={{ required: "Please select start term" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intended Start Term *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fall-2025">Fall 2025</SelectItem>
                          <SelectItem value="spring-2026">Spring 2026</SelectItem>
                          <SelectItem value="summer-2026">Summer 2026</SelectItem>
                          <SelectItem value="fall-2026">Fall 2026</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Personal Statement */}
            <div>
              <FormField
                control={form.control}
                name="personalStatement"
                rules={{ 
                  required: "Personal statement is required",
                  minLength: {
                    value: 100,
                    message: "Personal statement must be at least 100 characters"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Statement *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself, your academic interests, and why you want to join our program..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-uw-purple hover:bg-uw-purple/90" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdmissionForm;
