
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Palette, Clock, BookOpen, GraduationCap, Download, FileText, Award } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const BachelorFineArts = () => {
  useSEO({
    title: "Bachelor of Fine Arts (BFA) Program - NASAD Accredited | NSCU Belize",
    description: "Earn your BFA from NSCU Belize. NASAD-accredited Bachelor of Fine Arts program with studio concentrations in painting, sculpture, digital art. Apply by January 5th, 2026.",
    keywords: "Bachelor Fine Arts NSCU Belize, BFA degree program Belize, NASAD accredited art program, studio art painting sculpture digital, art admissions 2026",
    canonical: "https://newstatesuniversity.lovable.app/programs/bachelor-fine-arts",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Bachelor of Fine Arts",
      "description": "Comprehensive 4-year studio art program with multiple concentrations",
      "provider": {
        "@type": "University",
        "name": "New States Continental University",
        "url": "https://newstatesuniversity.lovable.app"
      },
      "educationalCredentialAwarded": "Bachelor of Fine Arts",
      "teaches": ["Drawing", "Painting", "Sculpture", "Digital Art", "Art History"],
      "totalTime": "P4Y",
      "courseMode": "on-campus",
      "applicationDeadline": "2026-01-05",
      "startDate": "2026-01-15"
    }
  });

  const programOverview = {
    name: "Bachelor of Fine Arts",
    duration: "4 Years, 8 Semesters",
    totalCredits: 120,
    structure: ["Foundation Art Courses", "Studio Concentrations", "Art History", "Senior Exhibition"],
    assessment: "75% Portfolio Assessment, 15% Art History Exams, 10% Studio Participation"
  };
  const semesters = [
    {
      id: "sem1",
      title: "Semester I - Foundation",
      totalCredits: 15,
      contactHours: 400,
      courses: [
        {
          name: "Drawing Fundamentals",
          code: "ART101",
          credits: 3,
          contactHours: 120,
          breakdown: ["30 Lectures", "90 Studio"],
          topics: ["Basic Drawing Techniques", "Line and Form", "Perspective", "Composition", "Observational Drawing"],
          referenceBooks: ["Drawing on the Right Side of the Brain by Betty Edwards", "Ways of Seeing by John Berger"],
          learningOutcomes: ["Master basic drawing skills", "Understand spatial relationships", "Develop observational abilities"],
          assessment: "80% Portfolio, 15% Critiques, 5% Sketchbook"
        },
        {
          name: "Design Principles",
          code: "ART102", 
          credits: 3,
          contactHours: 120,
          breakdown: ["30 Lectures", "90 Studio"],
          topics: ["Elements of Design", "Principles of Composition", "Color Theory", "Visual Communication", "Typography Basics"],
          referenceBooks: ["Interaction of Color by Josef Albers", "Design Elements by Timothy Samara"],
          learningOutcomes: ["Apply design principles", "Use color effectively", "Create visual compositions"],
          assessment: "75% Projects, 20% Process Documentation, 5% Participation"
        },
        {
          name: "Art History Survey I",
          code: "ART103",
          credits: 3,
          contactHours: 90,
          breakdown: ["90 Lectures"],
          topics: ["Ancient Art", "Medieval Art", "Renaissance", "Baroque", "Art Historical Methods"],
          referenceBooks: ["Gardner's Art Through the Ages by Kleiner", "Ways of Seeing by John Berger"],
          learningOutcomes: ["Understand art historical contexts", "Analyze artworks critically", "Apply art historical methods"],
          assessment: "60% Exams, 30% Research Papers, 10% Participation"
        },
        {
          name: "Sculpture Basics",
          code: "ART104",
          credits: 3,
          contactHours: 120,
          breakdown: ["30 Lectures", "90 Studio"],
          topics: ["3D Design Principles", "Clay Modeling", "Additive/Subtractive Methods", "Basic Casting", "Installation Concepts"],
          referenceBooks: ["The Art of Sculpture by Herbert Read", "A Sculptor's Handbook by Jack Rich"],
          learningOutcomes: ["Create three-dimensional works", "Understand sculptural processes", "Explore spatial concepts"],
          assessment: "85% Portfolio, 10% Process Documentation, 5% Critiques"
        },
        {
          name: "Digital Art Foundations",
          code: "ART105",
          credits: 3,
          contactHours: 120,
          breakdown: ["45 Lectures", "75 Computer Lab"],
          topics: ["Adobe Creative Suite", "Digital Image Manipulation", "Vector Graphics", "Digital Photography", "Web Design Basics"],
          referenceBooks: ["Adobe Photoshop Classroom in a Book", "The Non-Designer's Design Book by Robin Williams"],
          learningOutcomes: ["Use digital art tools", "Create digital compositions", "Understand digital workflows"],
          assessment: "70% Digital Portfolio, 25% Technical Skills Tests, 5% Participation"
        }
      ]
    }
  ];

  const courseStructure = {
    year1: {
      fall: [
        { code: "ART 101", title: "Drawing Fundamentals", credits: 3, contact: "1-0-6", description: "Basic drawing techniques, line, form, perspective, composition" },
        { code: "ART 102", title: "Design Principles", credits: 3, contact: "1-0-6", description: "Elements and principles of design, color theory, visual communication" },
        { code: "ART 103", title: "Art History Survey I", credits: 3, contact: "3-0-0", description: "Ancient through medieval art history and cultural contexts" },
        { code: "ART 104", title: "Sculpture Basics", credits: 3, contact: "1-0-6", description: "Three-dimensional design, clay modeling, basic sculpture techniques" },
        { code: "ENGL 101", title: "College Writing", credits: 3, contact: "3-0-0", description: "Academic writing, research methods, critical thinking" },
        { code: "MATH 105", title: "Mathematics for Artists", credits: 3, contact: "3-0-0", description: "Geometry, proportions, mathematical concepts in art" }
      ],
      spring: [
        { code: "ART 105", title: "Painting Fundamentals", credits: 3, contact: "1-0-6", description: "Acrylic and oil painting techniques, color mixing, composition" },
        { code: "ART 106", title: "Digital Art Basics", credits: 3, contact: "1-0-6", description: "Adobe Creative Suite, digital design principles" },
        { code: "ART 107", title: "Art History Survey II", credits: 3, contact: "3-0-0", description: "Renaissance through contemporary art movements" },
        { code: "ART 108", title: "Printmaking Introduction", credits: 3, contact: "1-0-6", description: "Relief, intaglio, and screen printing techniques" },
        { code: "PHIL 201", title: "Aesthetics & Art Theory", credits: 3, contact: "3-0-0", description: "Philosophy of art, beauty, aesthetic experience" },
        { code: "PSYC 101", title: "General Psychology", credits: 3, contact: "3-0-0", description: "Introduction to psychological principles and human behavior" }
      ]
    },
    year2: {
      fall: [
        { code: "ART 201", title: "Advanced Drawing", credits: 3, contact: "1-0-6", description: "Figure drawing, advanced techniques, experimental media" },
        { code: "ART 202", title: "Intermediate Painting", credits: 3, contact: "1-0-6", description: "Advanced painting techniques, personal style development" },
        { code: "ART 203", title: "Contemporary Art Issues", credits: 3, contact: "3-0-0", description: "Current art world trends, critical analysis, art criticism" },
        { code: "ART 204", title: "Photography I", credits: 3, contact: "1-0-6", description: "Camera techniques, darkroom processes, composition" },
        { code: "ART 205", title: "Ceramics I", credits: 3, contact: "1-0-6", description: "Wheel throwing, hand building, glazing techniques" },
        { code: "ENG 201", title: "Creative Writing", credits: 3, contact: "3-0-0", description: "Creative expression through writing, artist statements" }
      ],
      spring: [
        { code: "ART 206", title: "Mixed Media Art", credits: 3, contact: "1-0-6", description: "Experimental techniques, collage, assemblage, installation" },
        { code: "ART 207", title: "Art Business & Marketing", credits: 3, contact: "3-0-0", description: "Gallery representation, portfolio development, selling art" },
        { code: "ART 208", title: "Illustration Techniques", credits: 3, contact: "1-0-6", description: "Commercial illustration, book illustration, digital techniques" },
        { code: "ART 209", title: "Art Education Methods", credits: 3, contact: "2-0-3", description: "Teaching art to diverse populations, curriculum development" },
        { code: "HIST 301", title: "Cultural Studies", credits: 3, contact: "3-0-0", description: "Art in cultural context, cross-cultural perspectives" },
        { code: "SOC 201", title: "Sociology of Art", credits: 3, contact: "3-0-0", description: "Art's role in society, social movements, cultural expression" }
      ]
    }
  };

  const admissionRequirements = [
    "High School Diploma with minimum 3.0 GPA",
    "Portfolio submission (15-20 pieces of original artwork)",
    "Artist statement (500 words)",
    "Two letters of recommendation (preferably from art teachers)",
    "SAT/ACT scores (optional for portfolio-based admission)",
    "Interview (may be required for borderline applicants)"
  ];

  const careerOpportunities = [
    "Professional Artist", "Art Teacher", "Gallery Curator", "Art Therapist",
    "Graphic Designer", "Illustrator", "Museum Educator", "Art Critic",
    "Arts Administrator", "Freelance Artist", "Art Director", "Set Designer"
  ];

  return (
    <PageLayout 
      title="Bachelor of Fine Arts (BFA) - NASAD Accredited Art Program | NSCU Belize" 
      description="Comprehensive 4-year BFA program developing technical skills and creative expression through studio practice, art history, and professional preparation."
    >
      <div className="container mx-auto px-4 py-12">
        {/* Program Overview Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>BFA Program Overview</span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download BFA Handbook (PDF)
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Program Details</h3>
                  <div className="space-y-2">
                    <div><strong>Program Name:</strong> {programOverview.name}</div>
                    <div><strong>Duration:</strong> {programOverview.duration}</div>
                    <div><strong>Total Credits:</strong> {programOverview.totalCredits}</div>
                    <div><strong>Assessment:</strong> {programOverview.assessment}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Program Structure</h3>
                  <ul className="space-y-1">
                    {programOverview.structure.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Palette className="w-4 h-4 text-uw-purple mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester Navigation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Semester-wise Curriculum</h2>
          <Tabs defaultValue="sem1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {semesters.map((semester, index) => (
                <TabsTrigger key={semester.id} value={semester.id}>
                  Sem {index + 1}
                </TabsTrigger>
              ))}
              <TabsTrigger value="sem2">Sem II</TabsTrigger>
              <TabsTrigger value="sem3">Sem III</TabsTrigger>
              <TabsTrigger value="sem4">Sem IV</TabsTrigger>
              <TabsTrigger value="sem5">Sem V</TabsTrigger>
              <TabsTrigger value="sem6">Sem VI</TabsTrigger>
              <TabsTrigger value="sem7">Sem VII</TabsTrigger>
              <TabsTrigger value="sem8">Sem VIII</TabsTrigger>
            </TabsList>

            {semesters.map((semester) => (
              <TabsContent key={semester.id} value={semester.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      {semester.title}
                    </CardTitle>
                    <CardDescription>
                      Total Credits: {semester.totalCredits} | Contact Hours: {semester.contactHours}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {semester.courses.map((course, courseIndex) => (
                        <AccordionItem key={courseIndex} value={`course-${courseIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex justify-between items-center w-full pr-4">
                              <span>{course.name} ({course.code})</span>
                              <Badge variant="outline">{course.credits} Credits</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                              <div>
                                <h4 className="font-semibold mb-2">Course Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div><strong>Course Code:</strong> {course.code}</div>
                                  <div><strong>Credits:</strong> {course.credits}</div>
                                  <div><strong>Contact Hours:</strong> {course.contactHours}</div>
                                  <div><strong>Breakdown:</strong> {course.breakdown.join(", ")}</div>
                                  <div><strong>Assessment:</strong> {course.assessment}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Topics Covered</h4>
                                <ul className="text-sm space-y-1">
                                  {course.topics.map((topic, topicIndex) => (
                                    <li key={topicIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-uw-purple rounded-full mr-2 mt-2"></span>
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Reference Books</h4>
                                <ul className="text-sm space-y-1">
                                  {course.referenceBooks.map((book, bookIndex) => (
                                    <li key={bookIndex} className="flex items-start">
                                      <FileText className="w-3 h-3 mr-2 mt-1 text-uw-purple" />
                                      {book}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                                <ul className="text-sm space-y-1">
                                  {course.learningOutcomes.map((outcome, outcomeIndex) => (
                                    <li key={outcomeIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2"></span>
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            {/* Placeholder content for other semesters */}
            {["sem2", "sem3", "sem4", "sem5", "sem6", "sem7", "sem8"].map((semId, index) => (
              <TabsContent key={semId} value={semId} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Semester {index + 2}</CardTitle>
                    <CardDescription>Advanced studio courses and specialized concentrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Semester {index + 2} focuses on {index < 2 ? 'intermediate' : index < 4 ? 'advanced' : 'senior-level'} studio work 
                      with increasing emphasis on personal artistic development and professional preparation.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Studio Concentrations</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Advanced Painting Techniques</li>
                          <li>• Sculpture & Installation</li>
                          <li>• Digital Media & Photography</li>
                          <li>• Printmaking & Mixed Media</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Supporting Courses</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Art History Electives</li>
                          <li>• Professional Practices</li>
                          <li>• Gallery & Museum Studies</li>
                          <li>• Critique & Analysis Methods</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Studio Concentrations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Studio Concentrations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Painting", description: "Traditional and contemporary painting techniques, color theory, composition" },
              { name: "Sculpture", description: "Three-dimensional art, installation, public art, mixed media" },
              { name: "Digital Media", description: "Digital photography, video art, interactive media, web design" },
              { name: "Printmaking", description: "Lithography, etching, screen printing, relief printing" },
              { name: "Drawing", description: "Advanced drawing techniques, illustration, concept art" },
              { name: "Mixed Media", description: "Experimental techniques, collage, assemblage, new materials" }
            ].map((concentration, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{concentration.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{concentration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Prospects */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Career Prospects & Alumni Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Career Paths</h4>
                  <ul className="space-y-2">
                    {[
                      "Professional Artist", "Gallery Curator", "Art Director", "Art Teacher",
                      "Museum Educator", "Graphic Designer", "Illustrator", "Art Therapist"
                    ].map((career, index) => (
                      <li key={index} className="flex items-center">
                        <Palette className="w-4 h-4 text-uw-purple mr-2" />
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Program Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Employment Rate:</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Graduate School Acceptance:</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Starting Salary:</span>
                      <span className="font-bold">$42,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apply Now Section */}
        <div className="bg-uw-purple text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Future?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join our community of artists and begin your creative journey with our comprehensive BFA program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-uw-purple hover:bg-gray-100">
              Apply Now - Fall 2026
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-uw-purple">
              Schedule Portfolio Review
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Application deadline: January 5th, 2026 | Classes start: January 15th, 2026
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default BachelorFineArts;
