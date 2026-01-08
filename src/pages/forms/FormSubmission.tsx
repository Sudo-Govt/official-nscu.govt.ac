import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormSection {
  name: string;
  type: string;
  label: string;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  access_level: string;
  icon: string | null;
  estimated_time: string | null;
  fields: FormSection[];
  required_documents: string[] | null;
}

const FormSubmission = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchForm = async () => {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('form_templates')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        
        // Check access level
        if (data.access_level !== 'public' && !user) {
          toast.error('Please login to access this form');
          navigate('/login');
          return;
        }

        // Parse fields if it's a string
        const parsedFields = typeof data.fields === 'string' 
          ? JSON.parse(data.fields) 
          : data.fields;
        
        setForm({ ...data, fields: parsedFields });

        // Pre-fill user data if logged in
        if (user) {
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching form:', error);
        toast.error('Form not found');
        navigate('/forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [slug, user, navigate]);

  const validateSection = (sectionIndex: number): boolean => {
    if (!form) return false;
    
    const section = form.fields[sectionIndex];
    const newErrors: Record<string, string> = {};
    
    section.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection) && form) {
      if (currentSection < form.fields.length - 1) {
        setCurrentSection(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!form || !validateSection(currentSection)) return;

    setSubmitting(true);
    try {
      // Generate a tracking number
      const trackingNum = `FRM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          form_id: form.id,
          user_id: user?.id || null,
          form_data: formData,
          submitted_at: new Date().toISOString(),
          status: 'pending',
          tracking_number: trackingNum
        } as any)
        .select('tracking_number')
        .single();

      if (error) throw error;

      setTrackingNumber(data.tracking_number);
      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
          </div>
        );
      
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
          </div>
        );
      
      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={4}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.name] || ''}
              onValueChange={(value) => handleInputChange(field.name, value)}
            >
              <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
          </div>
        );
      
      case 'checkbox':
        if (field.options) {
          return (
            <div key={field.name} className="space-y-3">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="space-y-2">
                {field.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.name}-${option}`}
                      checked={(formData[field.name] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const current = formData[field.name] || [];
                        const updated = checked
                          ? [...current, option]
                          : current.filter((o: string) => o !== option);
                        handleInputChange(field.name, updated);
                      }}
                    />
                    <Label htmlFor={`${field.name}-${option}`} className="font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="font-normal">
              {field.label}
            </Label>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </PageLayout>
    );
  }

  if (submitted) {
    return (
      <PageLayout title="Submission Successful" description="">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Form Submitted Successfully!</h1>
              <p className="text-muted-foreground mb-8">
                Your submission has been received. Please save your tracking number for reference.
              </p>
              
              <div className="bg-muted p-6 rounded-lg mb-8">
                <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
                <p className="text-2xl font-mono font-bold text-primary">{trackingNumber}</p>
              </div>

              <Alert className="mb-8 text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  A confirmation email has been sent to your email address with your tracking number and submission details.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href={`/forms/${slug}/receipt?tracking=${trackingNumber}`}>
                    Download Receipt
                  </a>
                </Button>
                <Button asChild>
                  <a href="/forms">
                    Return to Forms
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!form) {
    return (
      <PageLayout title="Form Not Found" description="">
        <div className="container mx-auto px-4 py-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/forms">Return to Forms Portal</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const currentSectionData = form.fields[currentSection];
  const isLastSection = currentSection === form.fields.length - 1;
  const totalSections = form.fields.length;

  return (
    <PageLayout title={form.title} description={form.description || ''}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Link */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/forms')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>

        {/* Form Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">{form.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  {form.estimated_time && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {form.estimated_time}
                    </span>
                  )}
                  <span>Step {currentSection + 1} of {totalSections}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {form.fields.map((section, index) => (
              <div
                key={section.name}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  index <= currentSection
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            {form.fields.map((section, index) => (
              <span key={section.name} className={index === currentSection ? 'text-primary font-medium' : ''}>
                {section.label}
              </span>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>{currentSectionData.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSectionData.fields.map(renderField)}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {isLastSection ? (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Required Documents */}
        {form.required_documents && form.required_documents.length > 0 && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Required Documents:</strong> {form.required_documents.join(', ')}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </PageLayout>
  );
};

export default FormSubmission;
