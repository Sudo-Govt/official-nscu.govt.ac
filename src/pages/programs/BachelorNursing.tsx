
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, BookOpen, GraduationCap } from 'lucide-react';

const BachelorNursing = () => {
  const courseStructure = {
    year1: [
      { code: "NURS 101", title: "Foundations of Nursing", credits: 4, contact: "3-0-3", description: "Introduction to nursing profession, healthcare systems, patient safety" },
      { code: "ANAT 201", title: "Human Anatomy", credits: 4, contact: "3-0-3", description: "Structure of human body systems, anatomical terminology" },
      { code: "PHYS 201", title: "Human Physiology", credits: 4, contact: "3-0-3", description: "Function of human body systems, homeostasis, pathophysiology" },
      { code: "CHEM 105", title: "Chemistry for Health Sciences", credits: 3, contact: "3-0-0", description: "Basic chemistry principles, biochemistry, pharmacology foundations" },
      { code: "PSYC 101", title: "General Psychology", credits: 3, contact: "3-0-0", description: "Human behavior, learning theories, developmental psychology" },
      { code: "ENGL 102", title: "Academic Writing", credits: 3, contact: "3-0-0", description: "Professional writing, research methods, documentation" },
      { code: "MATH 110", title: "Statistics for Health Sciences", credits: 3, contact: "3-0-0", description: "Descriptive statistics, probability, healthcare data analysis" },
      { code: "MICR 201", title: "Microbiology", credits: 4, contact: "3-0-3", description: "Microorganisms, infection control, laboratory techniques" }
    ],
    year2: [
      { code: "NURS 201", title: "Health Assessment", credits: 4, contact: "2-0-6", description: "Physical examination skills, health history, documentation" },
      { code: "NURS 202", title: "Pharmacology I", credits: 3, contact: "3-0-0", description: "Drug classifications, dosage calculations, medication administration" },
      { code: "NURS 203", title: "Pathophysiology", credits: 4, contact: "4-0-0", description: "Disease processes, clinical manifestations, diagnostic tests" },
      { code: "NURS 204", title: "Nursing Research", credits: 3, contact: "3-0-0", description: "Evidence-based practice, research methods, critical appraisal" },
      { code: "NUTR 201", title: "Nutrition", credits: 3, contact: "3-0-0", description: "Nutritional needs, therapeutic diets, nutritional assessment" },
      { code: "PSYC 205", title: "Developmental Psychology", credits: 3, contact: "3-0-0", description: "Human development across lifespan, family dynamics" },
      { code: "NURS 205", title: "Clinical Skills Lab", credits: 2, contact: "0-0-6", description: "Basic nursing skills, simulation exercises, competency testing" }
    ],
    year3: [
      { code: "NURS 301", title: "Adult Health Nursing I", credits: 6, contact: "4-0-6", description: "Medical-surgical nursing, acute care, clinical rotations" },
      { code: "NURS 302", title: "Maternal-Child Nursing", credits: 6, contact: "4-0-6", description: "Obstetric nursing, pediatric nursing, family-centered care" },
      { code: "NURS 303", title: "Pharmacology II", credits: 3, contact: "3-0-0", description: "Advanced pharmacology, drug interactions, special populations" },
      { code: "NURS 304", title: "Mental Health Nursing", credits: 5, contact: "3-0-6", description: "Psychiatric nursing, therapeutic communication, mental health disorders" },
      { code: "NURS 305", title: "Community Health Nursing", credits: 5, contact: "3-0-6", description: "Population health, preventive care, health promotion" },
      { code: "ETHC 301", title: "Healthcare Ethics", credits: 2, contact: "2-0-0", description: "Ethical principles, moral decision-making, professional standards" }
    ],
    year4: [
      { code: "NURS 401", title: "Adult Health Nursing II", credits: 6, contact: "4-0-6", description: "Critical care nursing, complex medical conditions, advanced skills" },
      { code: "NURS 402", title: "Leadership & Management", credits: 4, contact: "3-0-3", description: "Nursing leadership, healthcare management, quality improvement" },
      { code: "NURS 403", title: "Senior Practicum", credits: 6, contact: "1-0-15", description: "Preceptorship experience, comprehensive patient care, capstone project" },
      { code: "NURS 404", title: "Professional Issues", credits: 3, contact: "3-0-0", description: "Healthcare policy, legal issues, professional development" },
      { code: "NURS 405", title: "NCLEX Preparation", credits: 2, contact: "2-0-0", description: "Test-taking strategies, comprehensive review, practice examinations" }
    ]
  };

  const clinicalSites = [
    "University Medical Center",
    "Children's Hospital",
    "Regional Medical Center",
    "Community Health Centers",
    "Mental Health Facilities",
    "Long-term Care Facilities",
    "Home Health Agencies",
    "Public Health Departments"
  ];

  const admissionRequirements = [
    "High School Diploma with minimum 3.0 GPA",
    "Prerequisite courses: Chemistry, Biology, Algebra",
    "CNA certification preferred but not required",
    "Background check and drug screening",
    "Current CPR certification",
    "Health clearance and immunizations",
    "Personal interview and essay",
    "TEAS exam score of 65% or higher"
  ];

  return (
    <PageLayout 
      title="Bachelor of Science in Nursing (BSN)" 
      description="Comprehensive 4-year nursing program preparing compassionate and competent registered nurses"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Program Overview */}
        <div className="mb-8">
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
                <div className="text-2xl font-bold">BSN</div>
                <p className="text-xs text-muted-foreground">CCNE Accredited</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Structure */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Course Structure</h3>
              
              {/* Year 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Year 1 (Foundation Sciences)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year1.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-C)
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

              {/* Year 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Year 2 (Nursing Foundations)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.year2.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-C)
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

              {/* Years 3 & 4 Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Years 3 & 4 (Clinical Practice)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The final two years focus on hands-on clinical experience across various healthcare settings, 
                    advanced nursing concepts, and preparation for professional practice.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Year 3 Focus Areas</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Adult Health Nursing</li>
                        <li>• Maternal-Child Health</li>
                        <li>• Mental Health Nursing</li>
                        <li>• Community Health</li>
                        <li>• Advanced Pharmacology</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Year 4 Focus Areas</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Critical Care Nursing</li>
                        <li>• Leadership & Management</li>
                        <li>• Senior Practicum</li>
                        <li>• Professional Issues</li>
                        <li>• NCLEX Preparation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Clinical Sites</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {clinicalSites.map((site, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Heart className="h-4 w-4 text-uw-purple" />
                          <span className="text-sm">{site}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                      <div className="text-2xl font-bold">900+</div>
                      <div className="text-sm">Clinical Hours</div>
                    </div>
                    <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm">Clinical Rotations</div>
                    </div>
                    <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                      <div className="text-2xl font-bold">1:8</div>
                      <div className="text-sm">Faculty:Student Ratio</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
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
                <CardTitle>Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Career Paths</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Staff Nurse (Medical-Surgical, ICU, ER)</li>
                      <li>• Pediatric Nurse</li>
                      <li>• Obstetric Nurse</li>
                      <li>• Mental Health Nurse</li>
                      <li>• Community Health Nurse</li>
                      <li>• Nurse Manager/Supervisor</li>
                      <li>• Case Manager</li>
                      <li>• Nurse Educator</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Program Outcomes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>NCLEX Pass Rate:</span>
                        <span className="font-bold">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employment Rate:</span>
                        <span className="font-bold">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Starting Salary:</span>
                        <span className="font-bold">$65,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Job Placement (6 months):</span>
                        <span className="font-bold">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$12,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical/Lab Fees (per semester)</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nursing Kit & Supplies</span>
                    <span className="font-bold">$1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Background Check & Drug Screen</span>
                    <span className="font-bold">$150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$29,850</span>
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

export default BachelorNursing;
