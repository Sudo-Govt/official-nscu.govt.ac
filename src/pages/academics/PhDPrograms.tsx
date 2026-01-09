import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GraduationCap, BookOpen, Globe, Award, Users, CheckCircle2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(2, 'Please enter your country'),
  research_interest: z.string().min(10, 'Please describe your research interest'),
  expected_start: z.string().min(1, 'Please select an expected start date'),
});

type FormData = z.infer<typeof formSchema>;

const PhDPrograms = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from('phd_applications').insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          country: data.country,
          research_interest: data.research_interest,
          expected_start: data.expected_start,
        },
      ]);

      if (error) throw error;

      toast.success('Application submitted successfully! We will contact you soon.');
      reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <PageLayout
      title="PhD Programs at NSCU"
      description="Join a historic American university and advance your expertise through world-class doctoral research"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              Start Your Doctoral Journey
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Partner with a historic university established in 1897 in Belize City and launch your research career with world-class mentorship
            </p>
            <Button size="lg" className="gap-2" asChild>
              <a href="#apply">
                <GraduationCap className="w-5 h-5" />
                Apply for PhD Program
              </a>
            </Button>
          </div>
        </section>

        {/* Introduction */}
        <section className="mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Award className="w-8 h-8 text-primary" />
                About NSCU PhD Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed">
                Established in 1897 in Belize City, NSCU has grown from a pioneering institution into a global force in higher education. 
                With unmatched expertise in AI, Quantum Computing, Space Science, and Medical Innovation, NSCU is now expanding its 
                academic reach across continents. We are building the next generation of research centers and future-ready institutions—and 
                we invite visionary scholars, researchers, and innovators to join us in shaping the world's most powerful education movement.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                Our PhD programs are accredited by the <strong>Global Commission for Higher Education Accreditations (GCHEA)</strong> in 
                Geneva, Switzerland, and the <strong>Ministry of Education, Culture, Science, & Technology</strong> in Belize, ensuring 
                international recognition and academic excellence.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Program Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose NSCU for Your PhD?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Recognition",
                description: "Internationally accredited degrees accepted by employers and institutions worldwide"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "World-Class Faculty",
                description: "Learn from distinguished scholars and industry experts with global expertise"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Flexible Learning",
                description: "Choose from online, hybrid, on-campus, or offshore study options"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Research Excellence",
                description: "Focus on original research with publication and conference support"
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Custom Specializations",
                description: "Tailored programs aligned with your unique career goals and interests"
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: "Proven Track Record",
                description: "Over 130 years of educating leaders and advancing knowledge"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="text-primary mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Program Benefits */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">PhD Program Benefits</CardTitle>
              <CardDescription>Comprehensive advantages for doctoral candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Academic Excellence
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Research-focused curriculum with advanced methodologies</li>
                    <li>• Publication support in peer-reviewed journals</li>
                    <li>• Access to digital library with 1M+ resources</li>
                    <li>• Conference funding and presentation opportunities</li>
                    <li>• Collaboration with international research institutes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Career Advancement
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Globally recognized doctoral degree</li>
                    <li>• Career opportunities in academia and industry</li>
                    <li>• Global alumni network across 50+ countries</li>
                    <li>• Leadership development and professional skills</li>
                    <li>• Lifetime access to university resources</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Research Areas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Fields of Study</h2>
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="business">
                  <AccordionTrigger className="text-lg font-semibold">
                    Business & Management
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium mb-2">Strategic Leadership:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Strategic Management & Innovation</li>
                          <li>• Entrepreneurship & Digital Transformation</li>
                          <li>• International Business Strategy</li>
                          <li>• Organizational Leadership & Change</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Specialized Areas:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Financial Technology & Analytics</li>
                          <li>• Sustainable Business Models</li>
                          <li>• Corporate Governance & Ethics</li>
                          <li>• Supply Chain & Operations Research</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="engineering">
                  <AccordionTrigger className="text-lg font-semibold">
                    Engineering & Technology
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium mb-2">Computing & AI:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Artificial Intelligence & Machine Learning</li>
                          <li>• Quantum Computing & Cryptography</li>
                          <li>• Cybersecurity & Data Science</li>
                          <li>• Cloud Computing & IoT</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Engineering:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Sustainable Energy Systems</li>
                          <li>• Robotics & Automation</li>
                          <li>• Nanotechnology & Materials Science</li>
                          <li>• Biomedical Engineering</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="health">
                  <AccordionTrigger className="text-lg font-semibold">
                    Health Sciences & Medicine
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium mb-2">Medical Sciences:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Clinical Research & Translational Medicine</li>
                          <li>• Genomics & Precision Medicine</li>
                          <li>• Neuroscience & Brain Research</li>
                          <li>• Pharmaceutical Sciences</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Public Health:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Epidemiology & Disease Prevention</li>
                          <li>• Global Health Policy</li>
                          <li>• Healthcare Management</li>
                          <li>• Environmental Health</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="social">
                  <AccordionTrigger className="text-lg font-semibold">
                    Social Sciences & Humanities
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium mb-2">Education & Psychology:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Educational Technology & Innovation</li>
                          <li>• Curriculum Design & Pedagogy</li>
                          <li>• Clinical Psychology</li>
                          <li>• Cognitive Science</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Social Studies:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Sociology & Social Policy</li>
                          <li>• Political Science & Governance</li>
                          <li>• Communication & Media Studies</li>
                          <li>• International Relations</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sciences">
                  <AccordionTrigger className="text-lg font-semibold">
                    Natural Sciences & Space
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium mb-2">Life Sciences:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Molecular Biology & Genetics</li>
                          <li>• Biotechnology & Bioinformatics</li>
                          <li>• Marine Biology & Oceanography</li>
                          <li>• Environmental Science</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Physical Sciences:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Space Science & Astrophysics</li>
                          <li>• Quantum Physics</li>
                          <li>• Chemistry & Materials Science</li>
                          <li>• Climate Science</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Can't find your area? We offer custom research programs across 25 departments with 50+ specialized fields.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Program Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Program Structure</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Full-Time:</strong> 3–5 years</li>
                  <li><strong>Part-Time:</strong> 5–7 years</li>
                  <li>Flexible scheduling for working professionals</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 100% Online</li>
                  <li>• Hybrid (Online + Residency)</li>
                  <li>• On-Campus</li>
                  <li>• Offshore Partner Colleges</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Total:</strong> 60–72 credits</li>
                  <li><strong>Coursework:</strong> 18–24 credits</li>
                  <li><strong>Dissertation:</strong> 36–48 credits</li>
                  <li>Prior credit transfer available</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Admission Requirements */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Admission Requirements</CardTitle>
              <CardDescription>Eligibility criteria for PhD programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Academic Qualifications</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Master's degree with minimum GPA of 3.0/4.0 (or 60% equivalent)</li>
                    <li>• Exceptional bachelor's degree holders may be considered</li>
                    <li>• Transcripts from all previous institutions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Required Documents</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Statement of Purpose (1,000–1,500 words)</li>
                    <li>• Research Proposal (2,000–3,000 words)</li>
                    <li>• Two to three Letters of Recommendation</li>
                    <li>• CV/Resume with academic and professional history</li>
                    <li>• English Proficiency: TOEFL (80+), IELTS (6.5+), or PTE (55+)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Application Deadlines</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Fall Intake:</strong> April 15</li>
                    <li>• <strong>Spring Intake:</strong> October 15</li>
                    <li>• <strong>Rolling Admissions:</strong> Available for online programs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Application Form */}
        <section id="apply" className="mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl">Apply for PhD Program</CardTitle>
              <CardDescription>Submit your interest and our admissions team will contact you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input {...register('full_name')} placeholder="John Doe" />
                    {errors.full_name && (
                      <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input {...register('email')} type="email" placeholder="john@example.com" />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input {...register('phone')} placeholder="+1 234 567 8900" />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <Input {...register('country')} placeholder="United States" />
                    {errors.country && (
                      <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Research Interest *</label>
                  <Textarea
                    {...register('research_interest')}
                    placeholder="Briefly describe your research interests and career goals..."
                    rows={4}
                  />
                  {errors.research_interest && (
                    <p className="text-sm text-destructive mt-1">{errors.research_interest.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Start Date *</label>
                  <Input {...register('expected_start')} type="month" />
                  {errors.expected_start && (
                    <p className="text-sm text-destructive mt-1">{errors.expected_start.message}</p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">NSCU Admissions Office</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Email:</strong> admissions@nscu.govt.ac</li>
                    <li><strong>Phone:</strong> +501-223-1234</li>
                    <li><strong>Website:</strong> <a href="https://en.nscu.govt.ac" className="text-primary hover:underline">en.nscu.govt.ac</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Office Hours</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM (EST)</li>
                    <li><strong>Response Time:</strong> Within 48 hours</li>
                    <li><strong>Virtual Consultations:</strong> Available by appointment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default PhDPrograms;
