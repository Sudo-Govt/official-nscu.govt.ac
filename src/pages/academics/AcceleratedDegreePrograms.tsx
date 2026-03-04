import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seoSchemas';
import { Link } from 'react-router-dom';
import {
  Zap, Calendar, Globe, Briefcase, ArrowRightLeft, Layers, Crown, CheckCircle, GraduationCap, Clock, Award, BookOpen, Users, Star
} from 'lucide-react';
import acceleratedHero from '@/assets/accelerated-hero.jpg';
import acceleratedGraduation from '@/assets/accelerated-graduation.jpg';
import acceleratedExecutives from '@/assets/accelerated-executives.jpg';

const seoKeywords = "fast track degree, one year degree program, degree completion program, online bachelor degree fast, distance degree for working professionals, work experience degree program, credit transfer bachelor degree, accelerated bachelor degree, executive bachelor degree program";

const AcceleratedDegreePrograms = () => {
  useSEO({
    title: 'Accelerated Degree Programs',
    description: 'NSCU Accelerated Degree Programs for working professionals. Fast track degree, one year degree completion, credit transfer, work experience degree, and executive bachelor degree options.',
    keywords: seoKeywords,
    canonical: 'https://nscu.govt.ac/academics/accelerated-degree-programs',
    structuredData: [
      generateWebPageSchema({
        name: 'Accelerated Degree Programs',
        description: 'Flexible, legal accelerated degree programs designed for working professionals at NSCU.',
        url: '/academics/accelerated-degree-programs',
      }),
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Academics', url: '/academics/course-catalog' },
        { name: 'Accelerated Degree Programs', url: '/academics/accelerated-degree-programs' },
      ]),
    ],
  });

  return (
    <PageLayout
      title="Accelerated Degree Programs"
      description="Flexible, Legal, and Designed for Working Professionals"
    >
      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Hero Section with Image */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5" /> Accelerated Learning
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Turn Your Experience Into a <span className="text-primary">Recognized Degree</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At NSCU, we understand that time is one of the most valuable resources for working professionals. Our comprehensive suite of Accelerated Degree Programs recognizes what you already know, validates your prior learning, and allows you to complete a recognized bachelor's degree in significantly less time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our programs are fully legitimate, academically rigorous, and built around credit transfer, prior learning assessment, and structured examinations. Whether you are a seasoned professional, an entrepreneur, or someone whose college journey was interrupted — NSCU has a pathway for you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" asChild>
                <Link to="/admission-application">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Talk to Admissions</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={acceleratedHero} alt="Professional studying online for accelerated degree at NSCU" className="w-full h-full object-cover" loading="eager" />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: 'Complete In', value: '1 Year*', note: 'For qualifying students' },
            { icon: Globe, label: '100% Online', value: 'Remote', note: 'Study from anywhere' },
            { icon: Award, label: 'Accredited', value: 'GCHEA', note: 'Recognized qualification' },
            { icon: Users, label: 'Students', value: '85+', note: 'Countries worldwide' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center border-primary/10 hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-4">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm font-medium text-foreground/80">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.note}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Program Cards - Alternating Layout */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-3">Our Accelerated Pathways</h2>
            <p className="text-muted-foreground text-lg">Choose the program that best fits your background and goals</p>
          </div>

          {/* Fast Track */}
          <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[auto_1fr] items-stretch">
              <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <CardHeader>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl">Fast Track Degree Programs</CardTitle>
                    <Badge variant="secondary">Most Popular</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>If you have already mastered a subject through prior education, professional training, or real-world application, you should not be required to spend years re-learning material you already understand.</p>
                  <p>Through our Fast Track Degree Program, eligible students are granted advanced academic standing based on a thorough evaluation of their educational background, professional history, and demonstrated competencies. What traditionally takes three to four years can be completed in a fraction of that time — without cutting corners or compromising credibility.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline"><BookOpen className="h-3 w-3 mr-1" />Prior Learning Credit</Badge>
                    <Badge variant="outline"><Award className="h-3 w-3 mr-1" />Exam-Based Validation</Badge>
                    <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Shortened Timeline</Badge>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* One Year */}
          <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[auto_1fr] items-stretch">
              <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                <Calendar className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <CardHeader>
                  <CardTitle className="text-2xl">One Year Degree Completion Pathway</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>Life has a way of interrupting academic plans. Some students leave university to support their families, pursue a business opportunity, or respond to a career that simply could not wait. The One Year Degree Completion Pathway was designed specifically for you.</p>
                  <p>Students transfer their existing eligible credits into NSCU's academic system. An academic evaluation determines exactly what remaining requirements need to be fulfilled. The entire process is designed to be completed within approximately one year for qualifying students.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline"><ArrowRightLeft className="h-3 w-3 mr-1" />Credit Transfer</Badge>
                    <Badge variant="outline"><Calendar className="h-3 w-3 mr-1" />~12 Months</Badge>
                    <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Full Degree</Badge>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Distance Degree with Image */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="grid md:grid-cols-[auto_1fr] items-stretch h-full">
                <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                  <Globe className="h-10 w-10 text-primary-foreground" />
                </div>
                <div>
                  <CardHeader>
                    <CardTitle className="text-2xl">Distance Degree Programs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>For many professionals, returning to university is not a matter of willingness — it is a matter of logistics. NSCU's Distance Degree Programs remove those barriers entirely.</p>
                    <p>Access all course materials, complete assignments, interact with faculty, and sit for examinations entirely remotely — from wherever in the world you happen to be. No mandatory campus visits, no rigid schedules.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline"><Globe className="h-3 w-3 mr-1" />100% Online</Badge>
                      <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Self-Paced</Badge>
                      <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Faculty Support</Badge>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
            <div className="rounded-2xl overflow-hidden shadow-lg h-72 lg:h-full">
              <img src={acceleratedGraduation} alt="Working professional graduating with accelerated degree from NSCU" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Work Experience */}
          <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[auto_1fr] items-stretch">
              <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                <Briefcase className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <CardHeader>
                  <CardTitle className="text-2xl">Work Experience Degree Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>NSCU formally recognizes that professional experience is a legitimate and valuable form of learning. Submit a structured portfolio of your professional history for review by the university's academic evaluation committee.</p>
                  <p>Where a clear alignment is identified, students may be granted academic credit for prior experiential learning — significantly reducing remaining coursework. Every student must still pass university examinations, ensuring both flexibility and integrity.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline"><Briefcase className="h-3 w-3 mr-1" />Portfolio Review</Badge>
                    <Badge variant="outline"><Award className="h-3 w-3 mr-1" />Experiential Credit</Badge>
                    <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Exam Validated</Badge>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Credit Transfer */}
          <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[auto_1fr] items-stretch">
              <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                <ArrowRightLeft className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <CardHeader>
                  <CardTitle className="text-2xl">Credit Transfer Bachelor Degree</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>Many individuals have already studied at another college or university. Under the traditional model, this prior work is often ignored. NSCU takes a fundamentally different approach.</p>
                  <p>Through a detailed evaluation of previous academic transcripts, courses that meet our criteria are formally recognized. Students with two years of transferable credits may only need one to two additional semesters. Free preliminary transcript evaluation is available.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline"><ArrowRightLeft className="h-3 w-3 mr-1" />Transfer Credits</Badge>
                    <Badge variant="outline"><BookOpen className="h-3 w-3 mr-1" />Free Evaluation</Badge>
                    <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Shortened Path</Badge>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Accelerated Structure */}
          <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-[auto_1fr] items-stretch">
              <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                <Layers className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <CardHeader>
                  <CardTitle className="text-2xl">Accelerated Bachelor Degree Structure</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { step: '1', title: 'Eligibility Evaluation', desc: 'Review of educational background, professional history, and prior qualifications.' },
                      { step: '2', title: 'Credit Assessment', desc: 'Transfer credits evaluated and experiential learning assessed.' },
                      { step: '3', title: 'Coursework & Study', desc: 'Complete remaining courses via online platform at your pace.' },
                      { step: '4', title: 'Examinations & Degree', desc: 'Pass structured exams and receive your full bachelor\'s degree.' },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-sm font-bold">{item.step}</div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Executive Bachelor with Image */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg h-72 lg:h-full order-2 lg:order-1">
              <img src={acceleratedExecutives} alt="Executive professionals in academic seminar at NSCU" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow h-full order-1 lg:order-2">
              <div className="grid md:grid-cols-[auto_1fr] items-stretch h-full">
                <div className="bg-primary p-6 flex items-center justify-center md:w-20">
                  <Crown className="h-10 w-10 text-primary-foreground" />
                </div>
                <div>
                  <CardHeader>
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-2xl">Executive Bachelor Degree</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200"><Star className="h-3 w-3 mr-1" />Premium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>For professionals who have reached a senior level — managers, business owners, executives — this carefully structured program integrates academic theory with practical, applied knowledge.</p>
                    <p>Participants complete accelerated coursework and examinations while continuing their professional roles. Delivered entirely through flexible online channels with adjustable study pace.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline"><Crown className="h-3 w-3 mr-1" />Senior Professionals</Badge>
                      <Badge variant="outline"><Globe className="h-3 w-3 mr-1" />Flexible Schedule</Badge>
                      <Badge variant="outline"><Award className="h-3 w-3 mr-1" />Full Degree</Badge>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Why Choose NSCU */}
        <section className="bg-muted/30 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose NSCU?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">What sets NSCU apart is our commitment to combining genuine academic rigor with practical flexibility.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Flexible Structure', desc: 'Fits around your career and personal commitments' },
              { icon: Award, title: 'Prior Learning Recognition', desc: 'Your existing knowledge and experience counts' },
              { icon: ArrowRightLeft, title: 'Credit Transfer', desc: 'Previously completed academic work counts toward your degree' },
              { icon: BookOpen, title: 'Exam-Based Validation', desc: 'Every graduate demonstrates genuine subject competency' },
              { icon: Users, title: 'Professional Focus', desc: 'Designed for working professionals at every stage' },
              { icon: GraduationCap, title: 'Credible Qualification', desc: 'A degree you have genuinely earned through rigorous assessment' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-background shadow-sm">
                <item.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl bg-primary text-primary-foreground p-10 lg:p-16 space-y-6">
          <GraduationCap className="h-16 w-16 mx-auto opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold">Start Your Accelerated Degree Journey Today</h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/80 text-lg">
            Our admissions team will conduct a thorough evaluation of your academic and professional background, free of charge, and recommend the pathway that best fits your situation.
          </p>
          <p className="font-semibold text-lg">Your experience has value. Your time has value. At NSCU, we recognize both.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/admission-application">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
              <Link to="/contact">Contact Admissions</Link>
            </Button>
          </div>
        </section>

        {/* Hidden SEO keywords */}
        <div className="sr-only" aria-hidden="true">
          {seoKeywords}
        </div>
      </div>
    </PageLayout>
  );
};

export default AcceleratedDegreePrograms;
