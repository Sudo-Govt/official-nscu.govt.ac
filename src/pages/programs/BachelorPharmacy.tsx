import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, Clock, BookOpen, GraduationCap } from 'lucide-react';

const BachelorPharmacy = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "PHAR 101", title: "Introduction to Pharmacy Practice", credits: 3, contact: "3-0-0", description: "Overview of pharmacy profession, ethics, and healthcare systems" },
        { code: "CHEM 111", title: "General Chemistry I", credits: 4, contact: "3-0-3", description: "Fundamental principles of chemistry with laboratory" },
        { code: "BIOL 121", title: "Human Anatomy & Physiology I", credits: 4, contact: "3-0-3", description: "Structure and function of human body systems" },
        { code: "MATH 141", title: "Calculus for Life Sciences", credits: 3, contact: "3-0-0", description: "Calculus applications in pharmaceutical sciences" },
        { code: "ENGL 101", title: "English Composition", credits: 3, contact: "3-0-0", description: "Academic writing and communication skills" }
      ],
      spring: [
        { code: "PHAR 102", title: "Pharmaceutical Calculations", credits: 3, contact: "3-0-0", description: "Mathematical applications in pharmacy practice" },
        { code: "CHEM 112", title: "General Chemistry II", credits: 4, contact: "3-0-3", description: "Continuation of general chemistry principles" },
        { code: "BIOL 122", title: "Human Anatomy & Physiology II", credits: 4, contact: "3-0-3", description: "Continuation of body systems study" },
        { code: "PHYS 201", title: "Physics for Life Sciences", credits: 3, contact: "3-0-0", description: "Physics principles in pharmaceutical applications" },
        { code: "COMM 201", title: "Health Communication", credits: 3, contact: "3-0-0", description: "Effective communication in healthcare settings" }
      ]
    },
    year2: {
      fall: [
        { code: "PHAR 201", title: "Biochemistry for Pharmacists", credits: 4, contact: "3-0-3", description: "Biochemical basis of drug action and metabolism" },
        { code: "PHAR 211", title: "Pharmaceutical Organic Chemistry", credits: 4, contact: "3-0-3", description: "Organic chemistry in drug design and synthesis" },
        { code: "PHAR 221", title: "Pharmaceutics I", credits: 3, contact: "2-0-3", description: "Drug formulation and delivery systems" },
        { code: "MICR 301", title: "Microbiology for Pharmacists", credits: 4, contact: "3-0-3", description: "Microorganisms and antimicrobial therapy" },
        { code: "STAT 301", title: "Biostatistics", credits: 3, contact: "3-0-0", description: "Statistical methods in pharmaceutical research" }
      ],
      spring: [
        { code: "PHAR 222", title: "Pharmaceutics II", credits: 3, contact: "2-0-3", description: "Advanced drug delivery and biopharmaceutics" },
        { code: "PHAR 231", title: "Pharmacology I", credits: 4, contact: "4-0-0", description: "Mechanisms of drug action on body systems" },
        { code: "PHAR 241", title: "Medicinal Chemistry I", credits: 3, contact: "3-0-0", description: "Structure-activity relationships of drugs" },
        { code: "IMMN 401", title: "Immunology", credits: 3, contact: "3-0-0", description: "Immune system and immunopharmacology" },
        { code: "PHAR 251", title: "Pharmacy Practice Lab I", credits: 2, contact: "0-0-6", description: "Introduction to patient care skills" }
      ]
    },
    year3: {
      fall: [
        { code: "PHAR 332", title: "Pharmacology II", credits: 4, contact: "4-0-0", description: "Advanced pharmacology and therapeutics" },
        { code: "PHAR 342", title: "Medicinal Chemistry II", credits: 3, contact: "3-0-0", description: "Advanced drug design and development" },
        { code: "PHAR 351", title: "Pathophysiology", credits: 4, contact: "4-0-0", description: "Disease mechanisms and progression" },
        { code: "PHAR 361", title: "Pharmacokinetics", credits: 3, contact: "3-0-0", description: "Drug absorption, distribution, metabolism, excretion" },
        { code: "PHAR 371", title: "Community Pharmacy Practice", credits: 3, contact: "2-0-3", description: "Retail pharmacy operations and patient counseling" }
      ],
      spring: [
        { code: "PHAR 382", title: "Pharmacotherapy I", credits: 4, contact: "4-0-0", description: "Evidence-based treatment of common diseases" },
        { code: "PHAR 391", title: "Pharmacy Law & Ethics", credits: 3, contact: "3-0-0", description: "Legal and ethical aspects of pharmacy practice" },
        { code: "PHAR 401", title: "Clinical Pharmacokinetics", credits: 3, contact: "3-0-0", description: "Individualized drug dosing and monitoring" },
        { code: "PHAR 411", title: "Compounding & Dispensing", credits: 3, contact: "1-0-6", description: "Preparation and dispensing of medications" },
        { code: "PHAR 421", title: "Drug Information & Literature", credits: 2, contact: "2-0-0", description: "Evidence-based drug information retrieval" }
      ]
    },
    year4: {
      fall: [
        { code: "PHAR 483", title: "Pharmacotherapy II", credits: 4, contact: "4-0-0", description: "Advanced therapeutic management" },
        { code: "PHAR 491", title: "Pharmacy Management", credits: 3, contact: "3-0-0", description: "Business aspects of pharmacy practice" },
        { code: "PHAR 501", title: "Clinical Pharmacy Practice", credits: 3, contact: "2-0-3", description: "Patient-centered pharmaceutical care" },
        { code: "PHAR 511", title: "Pharmacoepidemiology", credits: 2, contact: "2-0-0", description: "Drug utilization and safety surveillance" },
        { code: "PHAR 521", title: "Special Populations", credits: 3, contact: "3-0-0", description: "Pediatric, geriatric, pregnancy pharmacotherapy" }
      ],
      spring: [
        { code: "PHAR 531", title: "Advanced Practice Experience I", credits: 5, contact: "0-0-15", description: "Community pharmacy clinical rotation" },
        { code: "PHAR 532", title: "Advanced Practice Experience II", credits: 5, contact: "0-0-15", description: "Hospital pharmacy clinical rotation" },
        { code: "PHAR 533", title: "Advanced Practice Experience III", credits: 5, contact: "0-0-15", description: "Specialized practice area rotation" },
        { code: "PHAR 599", title: "Capstone Research Project", credits: 3, contact: "0-0-9", description: "Independent research and presentation" }
      ]
    }
  };

  const admissionRequirements = [
    "High school diploma or equivalent with strong science background",
    "Minimum GPA of 3.0 on 4.0 scale",
    "Completed prerequisite courses: Biology, Chemistry, Mathematics, Physics",
    "SAT/ACT scores or equivalent standardized test",
    "Personal statement explaining interest in pharmacy",
    "Two letters of recommendation (preferably from science teachers)",
    "Interview with admissions committee",
    "Healthcare exposure or volunteer experience (preferred)"
  ];

  const careerOpportunities = [
    "Community Pharmacist", "Hospital Pharmacist", "Clinical Pharmacist",
    "Pharmaceutical Research Scientist", "Regulatory Affairs Specialist",
    "Pharmaceutical Industry", "Nuclear Pharmacist", "Pharmacy Manager",
    "Drug Information Specialist", "Academia/Teaching"
  ];

  return (
    <PageLayout 
      title="Bachelor of Pharmacy (BPharm)" 
      description="ACPE-accredited 4-year comprehensive pharmacy program preparing graduates for professional practice"
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
              <p className="text-xs text-muted-foreground">8 Semesters + Clinical Rotations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">140</div>
              <p className="text-xs text-muted-foreground">Credit Hours + 1200 Practice Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">BPharm</div>
              <p className="text-xs text-muted-foreground">ACPE & GCHEA Accredited</p>
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
              <h3 className="text-2xl font-bold">BPharm Curriculum Structure</h3>
              
              {Object.entries(courseStructure).map(([year, semesters], yearIndex) => (
                <div key={year} className="space-y-4">
                  <h4 className="text-xl font-semibold capitalize">
                    Year {yearIndex + 1} - {yearIndex === 0 ? "Foundation" : yearIndex === 3 ? "Advanced Practice" : "Professional Development"}
                  </h4>
                  
                  {Object.entries(semesters).map(([semester, courses]) => (
                    <Card key={semester}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5" />
                          {semester === 'fall' ? 'Fall Semester' : 'Spring Semester'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {courses.map((course, index) => (
                            <div key={index} className="flex justify-between items-start p-4 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{course.code}</Badge>
                                  <span className="font-semibold">{course.title}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Contact Hours: {course.contact} (L-T-P)
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">{course.credits}</div>
                                <div className="text-xs text-muted-foreground">Credits</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>BPharm Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {admissionRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
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
                <CardTitle>Pharmacy Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerOpportunities.map((career, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
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
                <CardTitle>BPharm Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Laboratory & Materials Fee (per year)</span>
                    <span className="font-bold">$1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Rotation Fee (Year 4)</span>
                    <span className="font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year (Years 1-3)</span>
                    <span>$18,200</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total for Year 4</span>
                    <span>$20,200</span>
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

export default BachelorPharmacy;
