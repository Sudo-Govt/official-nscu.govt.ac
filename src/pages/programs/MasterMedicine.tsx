import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Clock, BookOpen, GraduationCap } from 'lucide-react';

const MasterMedicine = () => {
  const specializationTracks = [
    {
      name: "Internal Medicine",
      duration: "3 years",
      description: "Comprehensive training in adult medicine and subspecialties",
      rotations: ["General Medicine", "Cardiology", "Gastroenterology", "Pulmonology", "Nephrology", "Endocrinology"]
    },
    {
      name: "Surgery",
      duration: "3 years",
      description: "Advanced surgical techniques and perioperative care",
      rotations: ["General Surgery", "Trauma Surgery", "Minimally Invasive Surgery", "Surgical Oncology", "Vascular Surgery"]
    },
    {
      name: "Pediatrics",
      duration: "3 years",
      description: "Specialized care for infants, children, and adolescents",
      rotations: ["General Pediatrics", "Neonatology", "Pediatric Cardiology", "Pediatric Emergency", "Developmental Pediatrics"]
    },
    {
      name: "Obstetrics & Gynecology",
      duration: "3 years",
      description: "Women's reproductive health and surgical care",
      rotations: ["Obstetrics", "Gynecology", "High-Risk Pregnancy", "Gynecologic Oncology", "Reproductive Endocrinology"]
    },
    {
      name: "Anesthesiology",
      duration: "3 years",
      description: "Perioperative medicine and pain management",
      rotations: ["General Anesthesia", "Regional Anesthesia", "Cardiac Anesthesia", "Pediatric Anesthesia", "Pain Medicine"]
    },
    {
      name: "Radiology",
      duration: "3 years",
      description: "Medical imaging and interventional procedures",
      rotations: ["Diagnostic Radiology", "CT/MRI", "Ultrasound", "Interventional Radiology", "Nuclear Medicine"]
    },
    {
      name: "Psychiatry",
      duration: "3 years",
      description: "Mental health diagnosis and treatment",
      rotations: ["Adult Psychiatry", "Child Psychiatry", "Addiction Medicine", "Geriatric Psychiatry", "Consultation-Liaison"]
    },
    {
      name: "Emergency Medicine",
      duration: "3 years",
      description: "Acute care and trauma management",
      rotations: ["Emergency Department", "Trauma", "Toxicology", "Critical Care", "Disaster Medicine"]
    }
  ];

  const admissionRequirements = [
    "MBBS or MD degree from recognized medical school",
    "Valid medical license or eligibility for licensure",
    "Minimum 2 years of clinical experience (preferred)",
    "USMLE Step 2 CK or equivalent examination scores",
    "Letters of recommendation from attending physicians",
    "Personal statement describing specialty interest and career goals",
    "CV detailing clinical experience, research, and publications",
    "Interview with program director and faculty",
    "Criminal background check and professional references"
  ];

  const programFeatures = [
    {
      title: "Clinical Excellence",
      description: "Hands-on training in university hospitals and affiliated medical centers with state-of-the-art facilities"
    },
    {
      title: "Research Opportunities",
      description: "Mandatory research component with thesis submission and publication support"
    },
    {
      title: "International Exposure",
      description: "Elective rotations in partner institutions across North America and Europe"
    },
    {
      title: "Expert Faculty",
      description: "Board-certified specialists and internationally recognized researchers as mentors"
    },
    {
      title: "Simulation Training",
      description: "Advanced simulation center for procedural skills and crisis management"
    },
    {
      title: "Board Preparation",
      description: "Comprehensive exam preparation for specialty board certification"
    }
  ];

  const careerPathways = [
    "Specialist Physician in Tertiary Hospitals",
    "Academic Medicine & Medical Education",
    "Clinical Research & Pharmaceutical Development",
    "Healthcare Administration & Leadership",
    "Private Specialty Practice",
    "International Medical Organizations (WHO, MSF)",
    "Telemedicine & Digital Health",
    "Medical Consulting & Expert Witness"
  ];

  return (
    <PageLayout 
      title="Master of Medicine (MMed)" 
      description="Postgraduate specialty training program for physicians seeking advanced clinical expertise"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Years</div>
              <p className="text-xs text-muted-foreground">Full-time Residency Training</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Clinical Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,000+</div>
              <p className="text-xs text-muted-foreground">Supervised Clinical Training</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MMed</div>
              <p className="text-xs text-muted-foreground">GCHEA & ACGME Recognized</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="specializations" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="features">Program Features</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="specializations">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MMed Specialty Training Programs</h3>
              <p className="text-muted-foreground">
                Choose from eight specialty tracks, each offering comprehensive clinical training, research experience, and preparation for board certification.
              </p>
              
              <div className="grid gap-4">
                {specializationTracks.map((track, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            {track.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{track.description}</p>
                        </div>
                        <Badge>{track.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">Core Clinical Rotations:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {track.rotations.map((rotation, idx) => (
                            <div key={idx} className="text-sm p-2 bg-muted rounded">
                              • {rotation}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MMed Program Features</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {programFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Program Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Year 1: Foundation</h4>
                    <p className="text-sm text-muted-foreground">
                      Core rotations in primary specialty, development of clinical skills, introduction to research methodology
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Year 2: Advancement</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced clinical responsibilities, subspecialty rotations, research project initiation, teaching junior residents
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Year 3: Mastery</h4>
                    <p className="text-sm text-muted-foreground">
                      Chief resident responsibilities, completion of thesis, board preparation, transition to independent practice
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>MMed Admission Requirements</CardTitle>
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
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Application Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <p>• Application Opening: <strong>June 1st</strong></p>
                    <p>• Application Deadline: <strong>September 30th</strong></p>
                    <p>• Interview Period: <strong>October - November</strong></p>
                    <p>• Match Results: <strong>December 15th</strong></p>
                    <p>• Program Start: <strong>July 1st (next year)</strong></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>MMed Career Pathways</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {careerPathways.map((career, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      {career}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold">Post-MMed Options</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Fellowship Training:</strong> 1-2 year subspecialty programs available in all specialties</p>
                    <p><strong>PhD Programs:</strong> Combined clinical and research training for academic careers</p>
                    <p><strong>International Practice:</strong> Degree recognized in 45+ countries including USA, Canada, UK, Australia</p>
                    <p><strong>Board Certification:</strong> Eligible for specialty board exams upon completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>MMed Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per year)</span>
                    <span className="font-bold">$35,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Training Fee (per year)</span>
                    <span className="font-bold">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Research & Thesis Support</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Malpractice Insurance</span>
                    <span className="font-bold">$1,500/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$1,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$44,000</span>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-2">Financial Support Available:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Monthly stipend: $2,500 - $3,500 (based on year of training)</li>
                      <li>• Health insurance coverage provided</li>
                      <li>• On-call meal allowances</li>
                      <li>• Conference travel grants</li>
                      <li>• Research funding support</li>
                    </ul>
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

export default MasterMedicine;
