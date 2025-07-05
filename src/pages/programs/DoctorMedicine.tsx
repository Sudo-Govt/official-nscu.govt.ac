
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Clock, BookOpen, GraduationCap } from 'lucide-react';

const DoctorMedicine = () => {
  const courseStructure = {
    year1: [
      { code: "ANAT 501", title: "Gross Anatomy", credits: 8, contact: "6-0-6", description: "Comprehensive study of human anatomy through dissection and imaging" },
      { code: "HIST 501", title: "Histology", credits: 4, contact: "3-0-3", description: "Microscopic anatomy of tissues and organs" },
      { code: "EMBR 501", title: "Embryology", credits: 3, contact: "3-0-0", description: "Human development from conception to birth" },
      { code: "PHYS 501", title: "Medical Physiology", credits: 6, contact: "6-0-0", description: "Function of human organ systems in health and disease" },
      { code: "BIOC 501", title: "Medical Biochemistry", credits: 5, contact: "5-0-0", description: "Biochemical processes, metabolism, molecular medicine" },
      { code: "NEUR 501", title: "Neuroscience", credits: 4, contact: "4-0-0", description: "Structure and function of nervous system" },
      { code: "GENE 501", title: "Medical Genetics", credits: 2, contact: "2-0-0", description: "Principles of genetics, genetic disorders, counseling" }
    ],
    year2: [
      { code: "PATH 601", title: "General Pathology", credits: 6, contact: "4-0-6", description: "Disease mechanisms, tissue changes, laboratory diagnosis" },
      { code: "MICR 601", title: "Medical Microbiology", credits: 5, contact: "4-0-3", description: "Infectious diseases, antimicrobial therapy, immunology" },
      { code: "PHAR 601", title: "Pharmacology", credits: 6, contact: "6-0-0", description: "Drug mechanisms, therapeutic applications, toxicology" },
      { code: "PATH 602", title: "Systemic Pathology", credits: 5, contact: "4-0-3", description: "Pathology of organ systems, clinical correlations" },
      { code: "IMMU 601", title: "Immunology", credits: 3, contact: "3-0-0", description: "Immune system function, autoimmunity, transplantation" },
      { code: "EPID 601", title: "Epidemiology", credits: 2, contact: "2-0-0", description: "Disease patterns, public health, preventive medicine" },
      { code: "USMLE", title: "USMLE Step 1 Preparation", credits: 0, contact: "0-0-0", description: "Comprehensive review and examination preparation" }
    ],
    year3: [
      { code: "CLRK 701", title: "Internal Medicine Clerkship", credits: 8, contact: "0-0-40", description: "Patient care in internal medicine settings" },
      { code: "CLRK 702", title: "Surgery Clerkship", credits: 8, contact: "0-0-40", description: "Surgical procedures, pre/post-operative care" },
      { code: "CLRK 703", title: "Pediatrics Clerkship", credits: 6, contact: "0-0-30", description: "Medical care of infants, children, adolescents" },
      { code: "CLRK 704", title: "Obstetrics & Gynecology", credits: 6, contact: "0-0-30", description: "Women's healthcare, pregnancy, delivery" },
      { code: "CLRK 705", title: "Psychiatry Clerkship", credits: 6, contact: "0-0-30", description: "Mental health assessment and treatment" },
      { code: "CLRK 706", title: "Family Medicine", credits: 6, contact: "0-0-30", description: "Primary care, preventive medicine, community health" },
      { code: "CLRK 707", title: "Emergency Medicine", credits: 4, contact: "0-0-20", description: "Acute care, trauma management, critical decisions" }
    ],
    year4: [
      { code: "ELEC 801", title: "Advanced Electives", credits: 16, contact: "Variable", description: "Specialized rotations in chosen medical fields" },
      { code: "ELEC 802", title: "Sub-Internship", credits: 8, contact: "0-0-40", description: "Acting internship in specialty of choice" },
      { code: "ELEC 803", title: "Research Elective", credits: 4, contact: "0-0-20", description: "Clinical or basic science research project" },
      { code: "CAPS 801", title: "Capstone Course", credits: 2, contact: "2-0-0", description: "Medical professionalism, healthcare systems" },
      { code: "USMLE2", title: "USMLE Step 2 Preparation", credits: 0, contact: "0-0-0", description: "Clinical skills and knowledge assessment" },
      { code: "RESID 801", title: "Residency Preparation", credits: 2, contact: "2-0-0", description: "Match process, interview skills, specialty preparation" }
    ]
  };

  const clinicalRotations = [
    { specialty: "Internal Medicine", duration: "8 weeks", description: "Adult medical conditions, diagnostic reasoning" },
    { specialty: "Surgery", duration: "8 weeks", description: "Surgical procedures, operating room experience" },
    { specialty: "Pediatrics", duration: "6 weeks", description: "Child and adolescent healthcare" },
    { specialty: "Obstetrics & Gynecology", duration: "6 weeks", description: "Women's health, maternal-fetal medicine" },
    { specialty: "Psychiatry", duration: "6 weeks", description: "Mental health disorders, therapeutic interventions" },
    { specialty: "Family Medicine", duration: "6 weeks", description: "Primary care across all age groups" },
    { specialty: "Emergency Medicine", duration: "4 weeks", description: "Acute care and emergency procedures" },
    { specialty: "Radiology", duration: "2 weeks", description: "Medical imaging interpretation" }
  ];

  const admissionRequirements = [
    "Bachelor's degree from accredited institution",
    "Minimum 3.5 GPA in undergraduate coursework",
    "MCAT score of 510+ (recommended 515+)",
    "Prerequisite courses: Biology, Chemistry, Organic Chemistry, Physics, Mathematics, English",
    "Clinical experience (volunteering, shadowing, research)",
    "Leadership experience and community service",
    "Strong letters of recommendation",
    "Personal statement demonstrating commitment to medicine",
    "Interview (MMI format)"
  ];

  return (
    <PageLayout 
      title="Doctor of Medicine (MD)" 
      description="Comprehensive 4-year medical program training future physicians"
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
                <p className="text-xs text-muted-foreground">Pre-clinical + Clinical</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">160</div>
                <p className="text-xs text-muted-foreground">Credit Hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Degree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">MD</div>
                <p className="text-xs text-muted-foreground">LCME Accredited</p>
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
            <TabsTrigger value="residency">Residency</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Medical Curriculum</h3>
              
              {/* Years 1-2: Pre-clinical */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Years 1-2: Pre-Clinical Sciences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Foundation in basic medical sciences, human anatomy, physiology, pathology, and pharmacology.
                    Preparation for USMLE Step 1 examination.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Year 1 Courses</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Gross Anatomy & Histology</li>
                        <li>• Medical Physiology</li>
                        <li>• Medical Biochemistry</li>
                        <li>• Neuroscience</li>
                        <li>• Medical Genetics</li>
                        <li>• Embryology</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Year 2 Courses</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• General & Systemic Pathology</li>
                        <li>• Medical Microbiology</li>
                        <li>• Pharmacology</li>
                        <li>• Immunology</li>
                        <li>• Epidemiology</li>
                        <li>• USMLE Step 1 Prep</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Years 3-4: Clinical */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Years 3-4: Clinical Rotations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Hands-on patient care experience across core medical specialties and elective rotations.
                    Preparation for USMLE Step 2 and residency applications.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Year 3: Core Clerkships</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Internal Medicine (8 weeks)</li>
                        <li>• Surgery (8 weeks)</li>
                        <li>• Pediatrics (6 weeks)</li>
                        <li>• OB/GYN (6 weeks)</li>
                        <li>• Psychiatry (6 weeks)</li>
                        <li>• Family Medicine (6 weeks)</li>
                        <li>• Emergency Medicine (4 weeks)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Year 4: Electives & Preparation</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Advanced Electives (16 weeks)</li>
                        <li>• Sub-Internship (8 weeks)</li>
                        <li>• Research Elective (4 weeks)</li>
                        <li>• Capstone Course</li>
                        <li>• USMLE Step 2 Prep</li>
                        <li>• Residency Preparation</li>
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
                <CardTitle>Clinical Rotations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicalRotations.map((rotation, index) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{rotation.duration}</Badge>
                          <span className="font-semibold">{rotation.specialty}</span>
                        </div>
                        <p className="text-sm text-gray-600">{rotation.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                    <div className="text-2xl font-bold">72</div>
                    <div className="text-sm">Weeks Clinical Training</div>
                  </div>
                  <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm">Clinical Sites</div>
                  </div>
                  <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                    <div className="text-2xl font-bold">1:4</div>
                    <div className="text-sm">Faculty:Student Ratio</div>
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

          <TabsContent value="residency">
            <Card>
              <CardHeader>
                <CardTitle>Residency Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Match Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Overall Match Rate:</span>
                        <span className="font-bold">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>First Choice Match:</span>
                        <span className="font-bold">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>USMLE Step 1 Pass Rate:</span>
                        <span className="font-bold">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>USMLE Step 2 Pass Rate:</span>
                        <span className="font-bold">99%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Top Residency Specialties</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Internal Medicine (25%)</li>
                      <li>• Family Medicine (15%)</li>
                      <li>• Surgery (12%)</li>
                      <li>• Pediatrics (10%)</li>
                      <li>• Emergency Medicine (8%)</li>
                      <li>• Psychiatry (7%)</li>
                      <li>• Other Specialties (23%)</li>
                    </ul>
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
                    <span>Tuition Fee (per year)</span>
                    <span className="font-bold">$55,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Training Fees</span>
                    <span className="font-bold">$8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Equipment & Supplies</span>
                    <span className="font-bold">$3,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USMLE Examination Fees</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$1,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Program Cost</span>
                    <span>$277,000</span>
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

export default DoctorMedicine;
