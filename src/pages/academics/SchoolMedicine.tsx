
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Stethoscope, Users, Award, BookOpen, Heart, Brain, Microscope, Activity, GraduationCap, Clock } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { generateEducationalOrgDeptSchema, generateBreadcrumbSchema, generateCourseSchema } from '@/lib/seoSchemas';

const SchoolMedicine = () => {
  const programs = [
    { 
      name: "Doctor of Medicine (MD)", 
      type: "Professional Degree", 
      students: 680, 
      ranking: "#42 Research",
      duration: "4 Years",
      description: "Comprehensive medical education preparing students for residency training and clinical practice",
      admissionStats: {
        applicants: 12500,
        accepted: 170,
        acceptanceRate: "1.4%",
        avgMCAT: 515,
        avgGPA: 3.8
      },
      curriculum: {
        years: [
          {
            year: "Year 1 & 2",
            focus: "Pre-Clinical Sciences",
            courses: ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology", "Immunology"],
            assessment: "USMLE Step 1"
          },
          {
            year: "Year 3",
            focus: "Core Clinical Rotations",
            courses: ["Internal Medicine", "Surgery", "Pediatrics", "Obstetrics/Gynecology", "Psychiatry", "Family Medicine"],
            assessment: "USMLE Step 2 CK"
          },
          {
            year: "Year 4",
            focus: "Elective Rotations",
            courses: ["Subspecialty Electives", "Research", "Acting Internships", "International Rotations"],
            assessment: "USMLE Step 2 CS"
          }
        ]
      }
    },
    { 
      name: "MD/PhD Program", 
      type: "Dual Degree", 
      students: 28, 
      duration: "7-8 years",
      description: "Combined degree for physician-scientists pursuing careers in research and clinical practice",
      funding: "Full tuition coverage + stipend",
      researchAreas: ["Cancer Biology", "Neuroscience", "Immunology", "Cardiovascular Research", "Genetics"]
    },
    { 
      name: "MD/MPH Program", 
      type: "Dual Degree", 
      students: 35, 
      duration: "5 years",
      description: "Combining medical training with public health expertise for population health leadership",
      concentrations: ["Epidemiology", "Health Policy", "Global Health", "Environmental Health"]
    },
    { 
      name: "MD/MBA Program", 
      type: "Dual Degree", 
      students: 22, 
      duration: "5 years",
      description: "Preparing physician leaders for healthcare administration and healthcare business",
      partnerships: ["Wharton School", "Kellogg School of Management"]
    }
  ];

  const residencies = [
    { 
      name: "Internal Medicine", 
      positions: 45, 
      match_rate: "98%",
      duration: "3 years",
      fellowships: ["Cardiology", "Gastroenterology", "Oncology", "Endocrinology", "Pulmonology"],
      description: "Comprehensive training in adult medicine with subspecialty pathways"
    },
    { 
      name: "General Surgery", 
      positions: 28, 
      match_rate: "96%",
      duration: "5 years",
      fellowships: ["Trauma Surgery", "Cardiac Surgery", "Plastic Surgery", "Vascular Surgery"],
      description: "Advanced surgical training with state-of-the-art simulation labs"
    },
    { 
      name: "Pediatrics", 
      positions: 32, 
      match_rate: "100%",
      duration: "3 years",
      fellowships: ["Pediatric Cardiology", "Neonatology", "Pediatric Oncology", "Child Development"],
      description: "Training in care of infants, children, and adolescents"
    },
    { 
      name: "Emergency Medicine", 
      positions: 24, 
      match_rate: "94%",
      duration: "3-4 years",
      fellowships: ["Critical Care", "Sports Medicine", "Toxicology", "Disaster Medicine"],
      description: "Fast-paced training in acute care and emergency procedures"
    },
    { 
      name: "Orthopedic Surgery", 
      positions: 12, 
      match_rate: "92%",
      duration: "5 years",
      fellowships: ["Sports Medicine", "Spine Surgery", "Joint Replacement", "Trauma"],
      description: "Specialized training in musculoskeletal system surgery"
    },
    { 
      name: "Anesthesiology", 
      positions: 18, 
      match_rate: "97%",
      duration: "4 years",
      fellowships: ["Cardiac Anesthesia", "Pediatric Anesthesia", "Pain Management", "Critical Care"],
      description: "Training in perioperative care and pain management"
    }
  ];

  const facultyHighlights = [
    { name: "Dr. Sarah Mitchell", specialty: "Cardiothoracic Surgery", credentials: "Harvard MD, Johns Hopkins Residency", research: "Minimally Invasive Heart Surgery", awards: "Top Doctor Award 2023" },
    { name: "Dr. Robert Chang", specialty: "Neurology", credentials: "Stanford MD/PhD", research: "Alzheimer's Disease Treatment", awards: "NIH Early Career Award" },
    { name: "Dr. Maria Rodriguez", specialty: "Pediatric Oncology", credentials: "Yale MD, CHOP Fellowship", research: "Childhood Leukemia", awards: "St. Jude Research Award" },
    { name: "Dr. James Thompson", specialty: "Emergency Medicine", credentials: "UCSF MD, Trauma Certification", research: "Emergency Protocols", awards: "Excellence in Teaching Award" },
    { name: "Dr. Lisa Wang", specialty: "Internal Medicine", credentials: "Mayo Clinic MD", research: "Precision Medicine", awards: "Clinical Excellence Award" },
    { name: "Dr. Michael Adams", specialty: "Anesthesiology", credentials: "Duke MD, Critical Care Fellowship", research: "Pain Management Innovation", awards: "Patient Safety Award" }
  ];

  const clinicalSites = [
    { name: "NSCU Medical Center", type: "Primary Teaching Hospital", beds: 850, services: "All Major Specialties", trauma: "Level 1 Trauma Center" },
    { name: "Children's Hospital of NSCU", type: "Pediatric Specialty", beds: 400, services: "Pediatric Subspecialties", ranking: "#15 Children's Hospital Nationally" },
    { name: "Veterans Affairs Medical Center", type: "Federal Partnership", beds: 300, services: "Veterans Care", specialty: "PTSD Treatment Center" },
    { name: "Regional Cancer Institute", type: "Specialty Care", beds: 200, services: "Oncology & Hematology", certification: "NCI Comprehensive Cancer Center" },
    { name: "Community Health Network", type: "Primary Care", clinics: 25, services: "Family Medicine, Urgent Care", population: "Underserved Communities" }
  ];

  const researchHighlights = {
    funding: "$85M",
    trials: 240,
    publications: 1850,
    patents: 45,
    centers: [
      { name: "Cancer Research Institute", focus: "Translational Oncology", funding: "$25M" },
      { name: "Neuroscience Center", focus: "Brain Disorders", funding: "$18M" },
      { name: "Cardiovascular Research Lab", focus: "Heart Disease", funding: "$15M" },
      { name: "Infectious Disease Unit", focus: "Antimicrobial Resistance", funding: "$12M" },
      { name: "Regenerative Medicine Lab", focus: "Stem Cell Therapy", funding: "$10M" }
    ]
  };

  useSEO({
    title: "School of Medicine - MD Program | NSCU Medical School | GCHEA Accredited",
    description: "NSCU School of Medicine offers MD, MD/PhD, MD/MPH, and MD/MBA programs. LCME accredited medical education with 96% USMLE Step 1 pass rate and top residency placements.",
    keywords: "NSCU School of Medicine, MD program NSCU, medical school GCHEA accredited, LCME accredited medical school, MD/PhD dual degree, USMLE preparation, medical residency training, clinical rotations",
    canonical: "https://nscu.govt.ac/academics/school-medicine",
    structuredData: [
      generateEducationalOrgDeptSchema({
        name: "School of Medicine",
        description: "NSCU School of Medicine trains compassionate physicians through innovative medical education and groundbreaking research",
        url: "/academics/school-medicine"
      }),
      generateCourseSchema({
        name: "Doctor of Medicine (MD)",
        description: "Comprehensive 4-year medical education program preparing students for residency training and clinical practice",
        provider: "New States Continental University - School of Medicine",
        url: "/academics/school-medicine"
      }),
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Academics", url: "/academics/school-medicine" },
        { name: "School of Medicine", url: "/academics/school-medicine" }
      ])
    ]
  });

  return (
    <PageLayout 
      title="School of Medicine" 
      description="Training tomorrow's physicians through innovative medical education and groundbreaking research"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Medical Excellence</h2>
            <p className="text-gray-600 mb-4">
              The NSCU School of Medicine is committed to training compassionate, competent physicians 
              who will serve their communities with distinction. Our innovative curriculum integrates 
              cutting-edge medical science with hands-on clinical experience from day one.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">765</div>
                <div className="text-sm">Medical Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm">USMLE Step 1 Pass Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Stethoscope className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Clinical Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Early clinical exposure with 200+ clinical rotation sites nationwide
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">LCME Accredited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Full accreditation by the Liaison Committee on Medical Education
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Degree Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Degree Programs</h2>
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Program Overview</TabsTrigger>
              <TabsTrigger value="curriculum">MD Curriculum</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((program, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-uw-purple">{program.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {program.type} • {program.duration}
                        {program.ranking && <Badge variant="secondary">{program.ranking}</Badge>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{program.description}</p>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Students:</span>
                          <span className="font-semibold">{program.students}</span>
                        </div>
                        {program.funding && (
                          <div className="text-sm">
                            <span className="text-gray-600">Funding:</span>
                            <span className="font-semibold ml-2 text-green-600">{program.funding}</span>
                          </div>
                        )}
                        {program.researchAreas && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Research Areas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {program.researchAreas.map((area, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {program.concentrations && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Concentrations:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {program.concentrations.map((conc, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{conc}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>MD Program Curriculum</CardTitle>
                  <CardDescription>4-year comprehensive medical education program</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {programs[0].curriculum?.years.map((year, index) => (
                      <AccordionItem key={index} value={`year-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-uw-purple" />
                            <div>
                              <div className="font-semibold">{year.year}</div>
                              <div className="text-sm text-gray-600">{year.focus}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Core Courses:</h4>
                              <div className="grid md:grid-cols-2 gap-2">
                                {year.courses.map((course, i) => (
                                  <div key={i} className="flex items-center text-sm">
                                    <BookOpen className="h-3 w-3 mr-2 text-uw-purple" />
                                    {course}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Assessment:</h4>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-2 text-uw-gold" />
                                <span className="text-sm">{year.assessment}</span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admissions">
              <Card>
                <CardHeader>
                  <CardTitle>MD Program Admissions Statistics</CardTitle>
                  <CardDescription>Highly competitive admission process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">2024 Admission Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Applicants:</span>
                          <span className="font-semibold">{programs[0].admissionStats?.applicants.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Students Accepted:</span>
                          <span className="font-semibold">{programs[0].admissionStats?.accepted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceptance Rate:</span>
                          <span className="font-semibold text-red-600">{programs[0].admissionStats?.acceptanceRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average MCAT:</span>
                          <span className="font-semibold">{programs[0].admissionStats?.avgMCAT}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average GPA:</span>
                          <span className="font-semibold">{programs[0].admissionStats?.avgGPA}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">USMLE Performance</h4>
                      <div className="space-y-3">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-700">96%</div>
                          <div className="text-sm text-gray-600">Step 1 Pass Rate</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">98%</div>
                          <div className="text-sm text-gray-600">Step 2 CK Pass Rate</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-700">94%</div>
                          <div className="text-sm text-gray-600">Residency Match Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Residency Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Residency Programs</h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {residencies.map((residency, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-uw-purple">{residency.name}</CardTitle>
                  <CardDescription>{residency.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{residency.positions}</div>
                        <div className="text-xs text-gray-600">Positions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{residency.match_rate}</div>
                        <div className="text-xs text-gray-600">Match Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{residency.duration}</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Fellowship Opportunities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {residency.fellowships.map((fellowship, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{fellowship}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Training Sites */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Clinical Training Sites</h2>
          <div className="grid md:grid-cols-1 gap-4">
            {clinicalSites.map((site, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <CardDescription>{site.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <div className="font-semibold">{site.beds ? `${site.beds} beds` : `${site.clinics} clinics`}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Services:</span>
                      <div className="font-semibold">{site.services}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Specialty:</span>
                      <div className="font-semibold">{site.trauma || site.ranking || site.specialty || site.population}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Recognition:</span>
                      <div className="font-semibold">{site.certification || "LCME Approved"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Distinguished Faculty */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Distinguished Faculty</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyHighlights.map((faculty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{faculty.name}</CardTitle>
                  <CardDescription>{faculty.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <GraduationCap className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                      <span className="text-sm">{faculty.credentials}</span>
                    </div>
                    <div className="flex items-start">
                      <Microscope className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                      <span className="text-sm">{faculty.research}</span>
                    </div>
                    <div className="flex items-start">
                      <Award className="h-4 w-4 mr-2 text-uw-gold mt-0.5" />
                      <span className="text-sm font-medium">{faculty.awards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research & Innovation */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Research & Innovation</h2>
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Funding</h3>
              <p className="text-2xl font-bold text-uw-purple">{researchHighlights.funding}</p>
              <p className="text-sm text-gray-600">Annual expenditures</p>
            </div>
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Clinical Trials</h3>
              <p className="text-2xl font-bold text-uw-purple">{researchHighlights.trials}+</p>
              <p className="text-sm text-gray-600">Active studies</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-2xl font-bold text-uw-purple">{researchHighlights.publications}</p>
              <p className="text-sm text-gray-600">Per year</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patents</h3>
              <p className="text-2xl font-bold text-uw-purple">{researchHighlights.patents}</p>
              <p className="text-sm text-gray-600">Filed annually</p>
            </div>
            <div className="text-center">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">NIH Ranking</h3>
              <p className="text-2xl font-bold text-uw-purple">#38</p>
              <p className="text-sm text-gray-600">National funding rank</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Research Centers of Excellence</h3>
            <div className="grid md:grid-cols-1 gap-4">
              {researchHighlights.centers.map((center, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{center.name}</h4>
                        <p className="text-sm text-gray-600">{center.focus}</p>
                      </div>
                      <Badge variant="outline">{center.funding}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Student Success & Outcomes */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Student Success & Outcomes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">96%</div>
              <div className="text-lg">USMLE Step 1 Pass Rate</div>
              <p className="text-sm opacity-90 mt-2">Above national average</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-lg">Residency Match Rate</div>
              <p className="text-sm opacity-90 mt-2">2024 Match Results</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">78%</div>
              <div className="text-lg">Specialty Match Rate</div>
              <p className="text-sm opacity-90 mt-2">Competitive specialties</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$280K</div>
              <div className="text-lg">Average Physician Salary</div>
              <p className="text-sm opacity-90 mt-2">Post-residency earnings</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolMedicine;
