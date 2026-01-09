import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Building2, TrendingUp, Globe, Award, Clock } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const affiliationSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number must be less than 20 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  institutionType: z.string().trim().min(3, 'Please specify the type of institution').max(200, 'Institution type must be less than 200 characters'),
  startDate: z.string().trim().min(1, 'Please select an expected start date')
});

const NSCUAffiliation = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    institutionType: '',
    startDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validated = affiliationSchema.parse(formData);

      // Store in database
      const { error } = await supabase
        .from('affiliation_requests')
        .insert({
          full_name: validated.fullName,
          phone: validated.phone,
          email: validated.email,
          location: validated.location,
          institution_type: validated.institutionType,
          expected_start_date: validated.startDate,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Application Submitted',
        description: 'Thank you for your interest in NSCU Affiliation. Our team will contact you shortly.'
      });

      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        location: '',
        institutionType: '',
        startDate: ''
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit application. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'High-earning education business with low investment and strong annual returns.',
    'Minimum infrastructure requirements with maximum growth opportunity.',
    'Complete academic support: curriculum, exams, documentation, degrees.',
    'Global brand and 1897 legacy for instant credibility.',
    'Start admissions within 30–45 days.',
    'Hassle-free LMS/ERP-enabled operations.',
    'Wide range of UG, PG, diploma, and professional programs.',
    'Dedicated business support and marketing assistance.',
    'Multiple revenue streams: admissions, courses, collaborations.',
    'Globally valid qualifications accepted by major employers.',
    'WES & Immigration-friendly diploma framework.',
    'Fast-track and flexible learning models for working professionals.'
  ];

  return (
    <PageLayout
      title="NSCU Affiliation Program"
      description="Partner with a historic university established in 1897 and launch your own world-class institution"
    >
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Since 1897</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Start Your Own College – NSCU Global Affiliation Program
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Partner with a historic university established in 1897 in Belize City and launch your own world-class institution.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <Building2 className="mr-2 h-5 w-5" />
              Apply for Affiliation
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-foreground">
                  Established in 1897 in Belize City, NSCU has grown from a pioneering institution into a global force in higher education. With unmatched expertise in AI, Quantum Computing, Space Science, and Medical Innovation, NSCU is now expanding its academic reign across continents. We are building the next generation of colleges, research centers, and future-ready institutions—and we invite visionary leaders, educators, and entrepreneurs to join us in shaping the world&apos;s most powerful education movement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with NSCU?</h2>
              <p className="text-xl text-muted-foreground">
                Build a thriving education business with proven systems and global credibility
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>High Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Low investment with strong annual returns and multiple revenue streams
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Quick Launch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start admissions within 30–45 days with complete academic support
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Global Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    1897 legacy with WES & Immigration-friendly credentials
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application-form" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Apply for NSCU Affiliation</h2>
              <p className="text-muted-foreground">
                Take the first step towards launching your own world-class institution
              </p>
            </div>

            {submitted ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your application! Our team will review your submission and contact you within 48 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">City / Country *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., New York, USA"
                        required
                      />
                      {errors.location && (
                        <p className="text-sm text-destructive">{errors.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institutionType">Type of Institution You Want to Start *</Label>
                      <Input
                        id="institutionType"
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleChange}
                        placeholder="e.g., Liberal Arts College, Technical Institute"
                        required
                      />
                      {errors.institutionType && (
                        <p className="text-sm text-destructive">{errors.institutionType}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Expected Start Date *</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="month"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                      {errors.startDate && (
                        <p className="text-sm text-destructive">{errors.startDate}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Apply for NSCU Affiliation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NSCUAffiliation;
