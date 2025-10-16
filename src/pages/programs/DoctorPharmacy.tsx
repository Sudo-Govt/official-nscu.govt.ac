import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, Clock, BookOpen, GraduationCap } from 'lucide-react';

const DoctorPharmacy = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "PHRD 601", title: "Foundations of Patient Care", credits: 3, contact: "3-0-0", description: "Introduction to pharmaceutical care and patient assessment" },
        { code: "PHRD 611", title: "Advanced Pharmaceutics", credits: 4, contact: "3-0-3", description: "Drug delivery systems and formulation science" },
        { code: "PHRD 621", title: "Pharmacology & Medicinal Chemistry I", credits: 5, contact: "5-0-0", description: "Integrated drug action and design" },
        { code: "PHRD 631", title: "Pharmacy Practice Skills I", credits: 2, contact: "0-0-6", description: "Communication and dispensing skills laboratory" },
        { code: "PHRD 641", title: "Introductory Pharmacy Practice Experience", credits: 2, contact: "0-0-6", description: "Community and institutional pharmacy exposure" }
      ],
      spring: [
        { code: "PHRD 622", title: "Pharmacology & Medicinal Chemistry II", credits: 5, contact: "5-0-0", description: "Continuation of drug mechanisms and chemistry" },
        { code: "PHRD 632", title: "Pharmacy Practice Skills II", credits: 2, contact: "0-0-6", description: "Advanced patient counseling and care" },
        { code: "PHRD 651", title: "Pharmacokinetics & Biopharmaceutics", credits: 4, contact: "4-0-0", description: "Drug disposition and dosage regimen design" },
        { code: "PHRD 661", title: "Pharmacy Informatics", credits: 2, contact: "2-0-0", description: "Healthcare IT and clinical decision support" },
        { code: "PHRD 671", title: "Pharmaceutical Care Lab I", credits: 2, contact: "0-0-6", description: "Integrated patient care simulations" }
      ]
    },
    year2: {
      fall: [
        { code: "PHRD 701", title: "Pharmacotherapy I: Cardiology", credits: 4, contact: "4-0-0", description: "Evidence-based cardiovascular therapeutics" },
        { code: "PHRD 702", title: "Pharmacotherapy II: Endocrine", credits: 3, contact: "3-0-0", description: "Diabetes and endocrine disorders management" },
        { code: "PHRD 703", title: "Pharmacotherapy III: Respiratory", credits: 3, contact: "3-0-0", description: "Asthma, COPD, and pulmonary disease treatment" },
        { code: "PHRD 711", title: "Clinical Pharmacokinetics", credits: 3, contact: "3-0-0", description: "Therapeutic drug monitoring and dosing" },
        { code: "PHRD 721", title: "Pharmacy Practice Management", credits: 2, contact: "2-0-0", description: "Operations and financial management" }
      ],
      spring: [
        { code: "PHRD 704", title: "Pharmacotherapy IV: Infectious Diseases", credits: 4, contact: "4-0-0", description: "Antimicrobial therapy and stewardship" },
        { code: "PHRD 705", title: "Pharmacotherapy V: Neurology", credits: 3, contact: "3-0-0", description: "Neurological and psychiatric disorders" },
        { code: "PHRD 706", title: "Pharmacotherapy VI: GI & Hepatology", credits: 3, contact: "3-0-0", description: "Gastrointestinal and liver disease management" },
        { code: "PHRD 731", title: "Pharmacy Law & Regulatory Affairs", credits: 3, contact: "3-0-0", description: "Legal and regulatory framework" },
        { code: "PHRD 741", title: "Advanced Practice Experience I", credits: 4, contact: "0-0-12", description: "Community pharmacy advanced practice" }
      ]
    },
    year3: {
      fall: [
        { code: "PHRD 801", title: "Pharmacotherapy VII: Oncology", credits: 4, contact: "4-0-0", description: "Cancer chemotherapy and supportive care" },
        { code: "PHRD 802", title: "Pharmacotherapy VIII: Critical Care", credits: 3, contact: "3-0-0", description: "ICU and emergency medicine therapeutics" },
        { code: "PHRD 811", title: "Pharmacogenomics", credits: 2, contact: "2-0-0", description: "Genetic factors in drug therapy" },
        { code: "PHRD 821", title: "Advanced Pharmaceutical Care", credits: 3, contact: "3-0-0", description: "MTM and clinical pharmacy services" },
        { code: "PHRD 831", title: "Pharmacy Leadership & Advocacy", credits: 2, contact: "2-0-0", description: "Professional leadership development" }
      ],
      spring: [
        { code: "PHRD 851", title: "Advanced Practice Experience II", credits: 5, contact: "0-0-15", description: "Hospital pharmacy rotation" },
        { code: "PHRD 852", title: "Advanced Practice Experience III", credits: 5, contact: "0-0-15", description: "Ambulatory care rotation" },
        { code: "PHRD 853", title: "Advanced Practice Experience IV", credits: 5, contact: "0-0-15", description: "Specialized practice rotation" },
        { code: "PHRD 861", title: "Research Methods & Evidence-Based Practice", credits: 3, contact: "3-0-0", description: "Clinical research design and critical appraisal" }
      ]
    },
    year4: {
      fall: [
        { code: "PHRD 901", title: "Advanced Practice Experience V", credits: 6, contact: "0-0-18", description: "Elective specialty rotation" },
        { code: "PHRD 902", title: "Advanced Practice Experience VI", credits: 6, contact: "0-0-18", description: "Elective specialty rotation" },
        { code: "PHRD 911", title: "Professional Development Seminar", credits: 1, contact: "1-0-0", description: "Career planning and licensure preparation" }
      ],
      spring: [
        { code: "PHRD 903", title: "Advanced Practice Experience VII", credits: 6, contact: "0-0-18", description: "Elective advanced rotation" },
        { code: "PHRD 904", title: "Advanced Practice Experience VIII", credits: 6, contact: "0-0-18", description: "Capstone clinical experience" },
        { code: "PHRD 921", title: "Capstone Project", credits: 3, contact: "0-0-9", description: "Research or quality improvement project" }
      ]
    }
  };

  const admissionRequirements = [
    "Bachelor's degree with prerequisite coursework completed",
    "Minimum cumulative GPA of 3.0 (science GPA 3.0 required)",
    "PCAT scores or GRE (waived for qualified applicants)",
    "Prerequisite courses: Biology, Chemistry, Organic Chemistry, Biochemistry, Physics, Calculus, Statistics",
    "Personal statement demonstrating commitment to pharmacy",
    "Three letters of recommendation (one from healthcare professional)",
    "Healthcare or pharmacy experience (100+ hours preferred)",
    "Interview with faculty admissions committee",
    "Criminal background check and drug screening"
  ];

  const careerOpportunities = [
    "Clinical Pharmacist", "Hospital Pharmacy Director", "Ambulatory Care Pharmacist",
    "Critical Care Pharmacist", "Oncology Pharmacist", "Pharmacotherapy Specialist",
    "Pharmaceutical Industry", "Clinical Research Scientist", "Academia/Faculty",
    "Pharmacy Informaticist", "Managed Care Pharmacist", "Consultant Pharmacist"
  ];

  return (
    <PageLayout 
      title="Doctor of Pharmacy (PharmD)" 
      description="ACPE-accredited professional doctorate program preparing clinical pharmacy practitioners"
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
              <p className="text-xs text-muted-foreground">8 Semesters + 1440 Clinical Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">180</div>
              <p className="text-xs text-muted-foreground">Professional Program Credits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PharmD</div>
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
              <h3 className="text-2xl font-bold">PharmD Curriculum Structure</h3>
              
              {Object.entries(courseStructure).map(([year, semesters], yearIndex) => (
                <div key={year} className="space-y-4">
                  <h4 className="text-xl font-semibold">
                    Professional Year {yearIndex + 1} - {
                      yearIndex === 0 ? "Pharmaceutical Sciences" :
                      yearIndex === 1 ? "Pharmacotherapy Foundations" :
                      yearIndex === 2 ? "Advanced Clinical Practice" :
                      "Advanced Practice Experiences"
                    }
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
                <CardTitle>PharmD Admission Requirements</CardTitle>
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
                <CardTitle>PharmD Career Opportunities</CardTitle>
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
                <CardTitle>PharmD Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$22,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Rotation Fee (Years 3-4)</span>
                    <span className="font-bold">$3,000/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Laboratory & Technology Fee (per year)</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$750</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year (Years 1-2)</span>
                    <span>$45,500</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year (Years 3-4)</span>
                    <span>$48,500</span>
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

export default DoctorPharmacy;
