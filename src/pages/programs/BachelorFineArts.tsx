
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Clock, BookOpen, GraduationCap } from 'lucide-react';

const BachelorFineArts = () => {
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
      title="Bachelor of Fine Arts (BFA)" 
      description="Comprehensive 4-year studio art program developing technical skills and creative expression"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4 Years</div>
              <p className="text-xs text-muted-foreground">8 Semesters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">Credit Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">BFA</div>
              <p className="text-xs text-muted-foreground">NASAD Accredited</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">BFA Curriculum Structure</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Year 1 - Foundation Studies - Fall Semester
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.fall.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-P)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-uw-purple">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Year 1 - Foundation Studies - Spring Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.spring.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-P)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-uw-purple">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Years 2-4 - Advanced Studio & Specialization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced studio courses in chosen medium, art history electives, 
                    senior portfolio development, thesis exhibition, and professional 
                    preparation including internships and gallery experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>BFA Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {admissionRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-uw-purple rounded-full mt-2"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Fine Arts Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerOpportunities.map((career, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {career}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>BFA Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$12,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Studio/Materials Fee</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Review Fee</span>
                    <span className="font-bold">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$29,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BachelorFineArts;
