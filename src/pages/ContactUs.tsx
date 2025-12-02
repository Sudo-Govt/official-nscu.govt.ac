import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contactAcademicSchema, contactNonAcademicSchema } from "@/lib/validationSchemas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

type FlowType = 'academic' | 'non-academic' | null;

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "North Korea", "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
];

const ISD_CODES = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+61", country: "Australia" },
  { code: "+7", country: "Russia" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+27", country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
];

const NON_ACADEMIC_TOPICS = [
  "Partnership",
  "Get Affiliated",
  "Start NSCU Offshore College",
  "Become Our Admission Officer",
  "File a Complaint",
  "Media / PR Inquiry",
  "Donation / Sponsorship",
  "Careers / Hiring",
  "General Inquiry"
];

const ContactUs = () => {
  const [flow, setFlow] = useState<FlowType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, c: 0, d: 0 });

  // Generate captcha
  useEffect(() => {
    if (flow === 'non-academic') {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const c = Math.floor(Math.random() * 8) + 2;
      const d = Math.floor(Math.random() * (c - 1)) + 1;
      setCaptcha({ a, b, c, d });
    }
  }, [flow]);

  const academicForm = useForm<z.infer<typeof contactAcademicSchema>>({
    resolver: zodResolver(contactAcademicSchema),
    defaultValues: {
      fullName: "",
      isdCode: "+1",
      phone: "",
      email: "",
      country: "",
      type: undefined
    }
  });

  const nonAcademicForm = useForm<z.infer<typeof contactNonAcademicSchema>>({
    resolver: zodResolver(contactNonAcademicSchema),
    defaultValues: {
      fullName: "",
      email: "",
      isdCode: "+1",
      phone: "",
      message: "",
      topics: [],
      captchaSum: 0,
      captchaDiff: 0
    }
  });

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [messageLength, setMessageLength] = useState(0);

  const handleTopicToggle = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
    nonAcademicForm.setValue('topics', newTopics);
  };

  const onAcademicSubmit = async (data: z.infer<typeof contactAcademicSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          flow: 'academic',
          type: data.type,
          fullName: data.fullName,
          isdCode: data.isdCode,
          phone: data.phone,
          email: data.email,
          country: data.country
        }
      });

      if (error) throw error;

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'contact_submit_academic', {
          type: data.type,
          country: data.country
        });
      }

      setSubmitSuccess(true);
      academicForm.reset();
      toast.success(result.message || "Academic inquiry submitted successfully!");
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || "Could not submit. Please try again or contact support@nscu.edu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onNonAcademicSubmit = async (data: z.infer<typeof contactNonAcademicSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          flow: 'non-academic',
          topics: selectedTopics,
          fullName: data.fullName,
          email: data.email,
          isdCode: data.isdCode,
          phone: data.phone,
          message: data.message,
          captcha: {
            a: captcha.a,
            b: captcha.b,
            sumAnswer: data.captchaSum,
            c: captcha.c,
            d: captcha.d,
            diffAnswer: data.captchaDiff
          }
        }
      });

      if (error) throw error;

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'contact_submit_non_academic', {
          topics: selectedTopics,
          has_message: !!data.message
        });
      }

      setSubmitSuccess(true);
      nonAcademicForm.reset();
      setSelectedTopics([]);
      toast.success(result.message || "Non-academic inquiry submitted successfully!");
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || "Submission failed. Try again or contact support@nscu.edu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <PageLayout title="Contact NSCU" description="Get in touch with us">
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
              <p className="text-muted-foreground mb-6">
                {flow === 'academic' 
                  ? "Thanks — we received your academic inquiry. We'll respond within 3 business days."
                  : "Thank you. Your request is submitted — our team will reach out within 5 business days."}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => { setFlow(null); setSubmitSuccess(false); }}>
                  Submit Another Inquiry
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!flow) {
    return (
      <PageLayout title="Contact NSCU" description="Get in touch with us">
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact NSCU</h1>
              <p className="text-lg text-muted-foreground">
                Choose whether your inquiry is Academic or Non-Academic
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                onClick={() => setFlow('academic')}
              >
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Academic</h2>
                  <p className="text-muted-foreground mb-4">
                    For student, campus, or program related requests
                  </p>
                  <Button className="w-full">Select Academic</Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                onClick={() => setFlow('non-academic')}
              >
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Non-Academic</h2>
                  <p className="text-muted-foreground mb-4">
                    For partnerships, affiliation, complaints, and other requests
                  </p>
                  <Button className="w-full">Select Non-Academic</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={flow === 'academic' ? "Academic Inquiry" : "Non-Academic Inquiry"} 
      description="Contact form"
    >
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => { setFlow(null); academicForm.reset(); nonAcademicForm.reset(); }}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>

          <Card>
            <CardContent className="p-6 md:p-8">
              {flow === 'academic' ? (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Academic Inquiry</h2>
                  <p className="text-muted-foreground mb-6">
                    For student / campus / program related requests
                  </p>

                  <form onSubmit={academicForm.handleSubmit(onAcademicSubmit)} className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Campus Type *</Label>
                      <RadioGroup 
                        onValueChange={(value) => academicForm.setValue('type', value as any)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="On Campus" id="on-campus" />
                          <Label htmlFor="on-campus" className="cursor-pointer">On Campus</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Off Campus" id="off-campus" />
                          <Label htmlFor="off-campus" className="cursor-pointer">Off Campus</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Fast Track" id="fast-track" />
                          <Label htmlFor="fast-track" className="cursor-pointer">Fast Track</Label>
                        </div>
                      </RadioGroup>
                      {academicForm.formState.errors.type && (
                        <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.type.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="First Last"
                        {...academicForm.register('fullName')}
                        aria-invalid={!!academicForm.formState.errors.fullName}
                      />
                      {academicForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="isdCode">ISD Code *</Label>
                        <Select onValueChange={(value) => academicForm.setValue('isdCode', value)}>
                          <SelectTrigger id="isdCode">
                            <SelectValue placeholder="+1 USA" />
                          </SelectTrigger>
                          <SelectContent>
                            {ISD_CODES.map(({ code, country }) => (
                              <SelectItem key={code} value={code}>
                                {code} {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {academicForm.formState.errors.isdCode && (
                          <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.isdCode.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="9876543210"
                          {...academicForm.register('phone')}
                          aria-invalid={!!academicForm.formState.errors.phone}
                        />
                        {academicForm.formState.errors.phone && (
                          <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...academicForm.register('email')}
                        aria-invalid={!!academicForm.formState.errors.email}
                      />
                      {academicForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select onValueChange={(value) => academicForm.setValue('country', value)}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {academicForm.formState.errors.country && (
                        <p className="text-sm text-destructive mt-1">{academicForm.formState.errors.country.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Send Academic Inquiry'
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Non-Academic Inquiry</h2>
                  <p className="text-muted-foreground mb-6">
                    For partnerships, affiliation, admissions, complaints, and other non-academic requests
                  </p>

                  <form onSubmit={nonAcademicForm.handleSubmit(onNonAcademicSubmit)} className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Select Topic(s) *</Label>
                      <div className="space-y-2">
                        {NON_ACADEMIC_TOPICS.map((topic) => (
                          <div key={topic} className="flex items-center space-x-2">
                            <Checkbox
                              id={topic}
                              checked={selectedTopics.includes(topic)}
                              onCheckedChange={() => handleTopicToggle(topic)}
                            />
                            <Label htmlFor={topic} className="cursor-pointer">{topic}</Label>
                          </div>
                        ))}
                      </div>
                      {nonAcademicForm.formState.errors.topics && (
                        <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.topics.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fullName2">Full Name *</Label>
                      <Input
                        id="fullName2"
                        placeholder="Joe Thomas"
                        {...nonAcademicForm.register('fullName')}
                        aria-invalid={!!nonAcademicForm.formState.errors.fullName}
                      />
                      {nonAcademicForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email2">Email *</Label>
                      <Input
                        id="email2"
                        type="email"
                        placeholder="name@example.com"
                        {...nonAcademicForm.register('email')}
                        aria-invalid={!!nonAcademicForm.formState.errors.email}
                      />
                      {nonAcademicForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="isdCode2">ISD Code *</Label>
                        <Select onValueChange={(value) => nonAcademicForm.setValue('isdCode', value)}>
                          <SelectTrigger id="isdCode2">
                            <SelectValue placeholder="+1 USA" />
                          </SelectTrigger>
                          <SelectContent>
                            {ISD_CODES.map(({ code, country }) => (
                              <SelectItem key={code} value={code}>
                                {code} {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {nonAcademicForm.formState.errors.isdCode && (
                          <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.isdCode.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone2">Phone Number *</Label>
                        <Input
                          id="phone2"
                          placeholder="9876543210"
                          {...nonAcademicForm.register('phone')}
                          aria-invalid={!!nonAcademicForm.formState.errors.phone}
                        />
                        {nonAcademicForm.formState.errors.phone && (
                          <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your request (2500 characters max)..."
                        className="min-h-[120px]"
                        maxLength={2500}
                        {...nonAcademicForm.register('message')}
                        onChange={(e) => {
                          nonAcademicForm.register('message').onChange(e);
                          setMessageLength(e.target.value.length);
                        }}
                        aria-invalid={!!nonAcademicForm.formState.errors.message}
                      />
                      <p className="text-sm text-muted-foreground mt-1">{messageLength} / 2500</p>
                      {nonAcademicForm.formState.errors.message && (
                        <p className="text-sm text-destructive mt-1">{nonAcademicForm.formState.errors.message.message}</p>
                      )}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <Label className="mb-3 block">Math CAPTCHA *</Label>
                      <p className="text-sm text-muted-foreground mb-3" id="captcha-instructions">
                        Solve both questions to verify you're human
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="captchaSum">{captcha.a} + {captcha.b} = ?</Label>
                          <Input
                            id="captchaSum"
                            type="number"
                            {...nonAcademicForm.register('captchaSum', { valueAsNumber: true })}
                            aria-describedby="captcha-instructions"
                            aria-invalid={!!nonAcademicForm.formState.errors.captchaSum}
                          />
                        </div>
                        <div>
                          <Label htmlFor="captchaDiff">{captcha.c} - {captcha.d} = ?</Label>
                          <Input
                            id="captchaDiff"
                            type="number"
                            {...nonAcademicForm.register('captchaDiff', { valueAsNumber: true })}
                            aria-describedby="captcha-instructions"
                            aria-invalid={!!nonAcademicForm.formState.errors.captchaDiff}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Send Non-Academic Inquiry'
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactUs;