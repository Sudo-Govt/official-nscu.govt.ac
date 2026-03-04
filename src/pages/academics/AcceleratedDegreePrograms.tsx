import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSEO } from '@/hooks/useSEO';
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seoSchemas';
import { Link } from 'react-router-dom';
import {
  Zap, Calendar, Globe, Briefcase, ArrowRightLeft, Layers, Crown, CheckCircle, GraduationCap
} from 'lucide-react';

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
        {/* Intro */}
        <section className="max-w-4xl mx-auto space-y-4 text-muted-foreground">
          <p>
            At New States Continental University (NSCU), we understand that time is one of the most valuable resources for working professionals. Many individuals have already invested years into building their careers, accumulating industry knowledge, completing professional training, and in some cases, pursuing partial college education. Yet without a formal degree to show for it, career advancement can feel unnecessarily restricted.
          </p>
          <p>
            That is why NSCU has developed a comprehensive suite of Accelerated Degree Programs — academic pathways specifically structured to recognize what you already know, validate your prior learning, and allow you to complete a recognized bachelor's degree in significantly less time than traditional university programs require.
          </p>
          <p>
            Our accelerated programs are fully legitimate, academically rigorous, and built around a proper framework of credit transfer, prior learning assessment, and structured examinations. You will not simply be handed a degree — you will earn it, through a process that respects both your existing knowledge and the standards of higher education.
          </p>
          <p>
            Whether you are a seasoned professional, an entrepreneur, a manager, or someone whose college journey was interrupted years ago, NSCU has an accelerated pathway designed with your circumstances in mind.
          </p>
        </section>

        <Separator />

        {/* Fast Track */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Zap className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Fast Track Degree Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>The Fast Track Degree Program at NSCU is one of the most sought-after accelerated academic options available to working professionals and experienced individuals today. It is built on a simple but powerful premise: if you have already mastered a subject through prior education, professional training, or real-world application, you should not be required to spend years re-learning material you already understand.</p>
              <p>Through our Fast Track Degree Program, eligible students are granted advanced academic standing based on a thorough evaluation of their educational background, professional history, and demonstrated competencies. Rather than sitting through introductory courses in fields where they are already proficient, students can validate their existing knowledge through examinations and academic assessments — and move directly into completing only the coursework that remains.</p>
              <p>The result is a dramatically shorter path to earning a bachelor's degree. What traditionally takes three to four years of full-time study can, for the right candidate, be completed in a fraction of that time — without cutting corners, without bypassing academic standards, and without compromising the credibility of the final qualification.</p>
              <p>This program is ideal for individuals who have professional certifications or diplomas, those who have completed some college education without finishing their degree, experienced workers who have spent years in a specific field, and anyone who is ready and motivated to pursue academic recognition of their knowledge through a structured, examination-based process.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* One Year Degree */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Calendar className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">One Year Degree Completion Pathway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>NSCU's One Year Degree Program is one of the most powerful options available for professionals who are close to having a degree — but not quite there. Life has a way of interrupting academic plans. Some students leave university to support their families, pursue a business opportunity, or respond to a career opportunity that simply could not wait. Others completed diplomas, professional qualifications, or certificate programs that never translated into a full bachelor's degree.</p>
              <p>If any of this sounds familiar, the One Year Degree Completion Pathway was designed specifically for you.</p>
              <p>This program is open to individuals who have accumulated previous college credits from accredited institutions, hold professional qualifications or advanced vocational certifications, have years of relevant work experience in their chosen field, or previously enrolled in a degree program that they were unable to finish.</p>
              <p>Through NSCU's Degree Completion Program, students transfer their existing eligible credits into the university's academic system. From there, an academic evaluation determines exactly what remaining requirements need to be fulfilled. Students then complete those remaining courses through structured assessments, written assignments, and formal examinations — demonstrating that they have genuinely mastered the subject matter.</p>
              <p>The entire process is designed to be completed within approximately one year for qualifying students, making this one of the fastest legitimate routes to earning a full bachelor's degree available anywhere. The academic integrity of the program is never compromised. Students are assessed thoroughly and must meet NSCU's academic standards to receive their qualification.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Distance Degree */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Globe className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Distance Degree Programs for Working Professionals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>For many professionals, returning to university is not a matter of willingness — it is a matter of logistics. A demanding career schedule, family responsibilities, geographic distance from campus, and the general pace of adult life make traditional full-time, on-campus education simply impractical.</p>
              <p>NSCU's Distance Degree Programs for Working Professionals were created to remove those barriers entirely.</p>
              <p>Through our online learning platform, students can access all course materials, complete assignments, interact with faculty, and sit for examinations entirely remotely — from wherever in the world they happen to be. There are no mandatory campus visits, no rigid class schedules, and no requirement to put your career on hold.</p>
              <p>Key features of the Distance Degree Program include flexible online learning modules that can be accessed at any time, an examination-based academic evaluation system that ensures subject competency is genuinely tested, dedicated academic support from qualified faculty members who guide students through the curriculum, and a self-paced study environment that allows professionals to manage their studies around their existing commitments.</p>
              <p>This online bachelor degree fast track model is particularly well-suited to individuals who travel frequently for work, professionals based in regions without easy access to universities, managers and executives who cannot commit to fixed class schedules, and anyone who values the ability to learn on their own terms without sacrificing the quality or credibility of their degree.</p>
              <p>At NSCU, distance learning is not a lesser alternative to campus education — it is a fully developed academic model with the same standards, the same examinations, and the same recognized qualification at the finish line.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Work Experience */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Briefcase className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Work Experience Degree Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>One of the most distinctive aspects of NSCU's academic offering is our formal recognition that professional experience is a legitimate and valuable form of learning. Decades of research in adult education have confirmed what most working professionals already know instinctively: the skills, knowledge, and competencies acquired through years of real-world work are often equivalent to — and in some cases, more advanced than — what is taught in a traditional classroom setting.</p>
              <p>NSCU honors this reality through its Work Experience Degree Programs. Under this framework, eligible students may submit a structured portfolio of their professional history for review by the university's academic evaluation committee. This committee assesses the nature of the work performed, the level of expertise demonstrated, and the degree to which that experience aligns with the academic outcomes of specific courses or subject areas.</p>
              <p>Where a clear alignment is identified, students may be granted academic credit for their prior experiential learning. This can significantly reduce the number of courses that need to be completed before the degree is awarded.</p>
              <p>However, it is important to be clear about one fundamental requirement: academic credit for work experience does not mean skipping examinations. Every student enrolled in a Work Experience Degree Program at NSCU must still sit and pass university examinations in their subject areas. This requirement exists to ensure that the final qualification represents genuine academic competency — not simply years of employment. The combination of experiential credit recognition and rigorous examination ensures both flexibility and integrity in equal measure.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Credit Transfer */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ArrowRightLeft className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Credit Transfer Bachelor Degree Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Many individuals who come to NSCU have already studied at another college or university at some point in their lives. They may have completed one or two years of a degree, earned associate's qualifications, or studied subjects that are directly relevant to the bachelor's degree they now wish to pursue.</p>
              <p>Under the traditional university model, this prior academic work is often ignored or given minimal recognition, forcing students to start from scratch regardless of what they have already completed. NSCU takes a fundamentally different approach.</p>
              <p>Through our Credit Transfer Bachelor Degree Program, NSCU conducts a detailed evaluation of a student's previous academic transcripts. Courses that meet NSCU's credit transfer criteria are formally recognized within the degree framework, and students receive official transfer credits for that prior work. Only the remaining required courses — those not covered by the transferred credits — need to be completed before the degree is awarded.</p>
              <p>This system can dramatically shorten the time it takes to finish a bachelor's degree without any reduction in academic quality. Students who come in with two years of transferable credits, for example, may only need to complete the equivalent of one to two semesters of additional coursework. The process is transparent, fair, and governed by NSCU's established credit evaluation policies, ensuring consistency and credibility throughout.</p>
              <p>If you have studied before and are unsure whether your credits qualify for transfer, NSCU's admissions team is available to conduct a free preliminary evaluation of your transcripts and advise you on your eligibility.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Accelerated Structure */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Layers className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Accelerated Bachelor Degree Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>The Accelerated Bachelor Degree Program at NSCU follows a clear, transparent, and step-by-step academic structure. Every student who enrolls goes through the same foundational process, ensuring fairness, consistency, and academic integrity across the board.</p>
              <p>The pathway begins with an academic eligibility evaluation, during which NSCU's admissions and academic teams review the student's educational background, professional history, and any prior qualifications to determine which program best fits their situation and how much advanced standing they may be eligible for.</p>
              <p>Following this evaluation, eligible students proceed to the credit transfer or prior learning assessment stage. Here, previous academic transcripts are reviewed for transferable credits, and professional experience portfolios are assessed where applicable. The outcome of this stage determines exactly which academic requirements remain to be fulfilled.</p>
              <p>Students then enroll in their remaining courses. These courses are delivered through NSCU's online learning platform and are designed to be completed at a pace that suits the student's personal and professional commitments. Full academic support is available throughout this stage.</p>
              <p>Upon completing the coursework, students sit for structured examinations and submit required assignments. These assessments are the primary mechanism through which academic competency is formally verified. No student receives a degree without successfully completing this stage.</p>
              <p>Finally, upon passing all required assessments and fulfilling all remaining academic obligations, the student is awarded their full bachelor's degree — a recognized qualification that reflects genuine academic achievement.</p>
              <p>The accelerated nature of this process stems entirely from the recognition of prior learning. The academic standards applied at every stage remain identical to those of NSCU's standard programs.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Executive Bachelor */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Crown className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Executive Bachelor Degree Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>For professionals who have reached a senior level in their careers — managers, business owners, executives, and specialists with decades of experience — the journey back to formal education can sometimes feel at odds with the role they already occupy in the professional world. The Executive Bachelor Degree Program at NSCU was designed to bridge that gap.</p>
              <p>This program is not simply an accelerated academic pathway. It is a carefully structured educational experience that integrates recognized academic theory with the practical, applied knowledge that experienced professionals bring to the table. The curriculum is designed to acknowledge and engage with the real-world expertise of its participants, rather than treating them as students who are new to the professional world.</p>
              <p>The Executive Bachelor Degree Program is particularly suitable for entrepreneurs who have built businesses without formal academic credentials, mid-career professionals seeking to formalize and elevate their qualifications, business executives who want a recognized degree to complement their industry standing, and individuals in any field who are ready to receive formal academic recognition for the depth of expertise they have developed over their careers.</p>
              <p>Participants in the Executive Program complete accelerated coursework and examinations while continuing their professional roles without interruption. The program is delivered entirely through flexible online channels, and the pace of study can be adjusted to suit the demands of a senior professional's schedule. The end result is a full bachelor's degree that carries the weight of genuine academic achievement — and reflects the combination of professional experience and formal learning that defines the modern executive.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Why Choose NSCU */}
        <section>
          <Card className="bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-3">
              <CheckCircle className="h-8 w-8 text-uw-purple shrink-0" />
              <CardTitle className="text-2xl">Why Choose an Accelerated Degree at NSCU?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>There are many universities and online programs that claim to offer fast, flexible education. What sets NSCU apart is its commitment to combining genuine academic rigor with the kind of practical flexibility that working professionals actually need.</p>
              <p>NSCU's accelerated degree programs offer a flexible learning structure that fits around your existing career and personal commitments, not the other way around. They provide formal recognition of prior education and experience — meaning the knowledge you have already worked hard to acquire is not ignored or discarded. They offer credit transfer opportunities that allow previously completed academic work to count toward your degree. They rely on examination-based academic validation to ensure that every graduate has genuinely demonstrated subject competency. They are structured with working professionals in mind at every stage, from enrollment to graduation. And they offer a faster pathway to a bachelor's degree that does not require you to sacrifice the quality or credibility of the qualification you receive.</p>
              <p>When you graduate from an NSCU accelerated program, you graduate with a degree that you have genuinely earned — through assessments, examinations, and the hard work of learning. The speed of the program comes from the recognition of what you already know. The rigor of the program comes from NSCU's commitment to maintaining standards that make the qualification meaningful.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* CTA */}
        <section className="text-center space-y-6 py-8">
          <GraduationCap className="h-16 w-16 mx-auto text-uw-purple" />
          <h2 className="text-3xl font-bold">Start Your Accelerated Degree Journey Today</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>If you have prior education, professional experience, incomplete college studies, or any combination of the above, an Accelerated Degree Program at NSCU can help you turn what you have already achieved into a recognized bachelor's degree — faster than you may think is possible.</p>
            <p>The process begins with a simple conversation. Our admissions team will conduct a thorough evaluation of your academic and professional background, free of charge, and recommend the specific pathway that best fits your situation. Whether that is the Fast Track Degree Program, the One Year Degree Completion Pathway, the Work Experience Degree Program, the Credit Transfer Bachelor Degree, or the Executive Bachelor Degree Program, we will identify the most efficient and appropriate route to your qualification.</p>
            <p className="font-semibold text-foreground">Your experience has value. Your time has value. At NSCU, we have built a university that recognizes both.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/fast-track-admission">Apply Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Admissions</Link>
            </Button>
          </div>
        </section>

        {/* Hidden SEO keywords */}
        <div className="sr-only" aria-hidden="true">
          fast track degree, one year degree program, degree completion program, online bachelor degree fast, distance degree for working professionals, work experience degree program, credit transfer bachelor degree, accelerated bachelor degree, executive bachelor degree program
        </div>
      </div>
    </PageLayout>
  );
};

export default AcceleratedDegreePrograms;
