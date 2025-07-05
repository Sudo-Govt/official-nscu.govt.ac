
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, BookOpen, GraduationCap } from 'lucide-react';

const CollegeVeterinaryMedicine = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "ANAT 501", title: "Veterinary Anatomy I", credits: 6, contact: "4-0-6", description: "Gross anatomy of domestic animals, musculoskeletal system" },
        { code: "PHYS 501", title: "Veterinary Physiology I", credits: 4, contact: "4-0-0", description: "Cellular physiology, cardiovascular, respiratory systems" },
        { code: "BIOC 501", title: "Veterinary Biochemistry", credits: 4, contact: "4-0-0", description: "Metabolic pathways, enzyme kinetics, molecular biology" },
        { code: "HIST 501", title: "Veterinary Histology", credits: 3, contact: "2-0-3", description: "Microscopic anatomy, tissue structure and function" },
        { code: "PROF 501", title: "Professional Development I", credits: 1, contact: "1-0-0", description: "Veterinary ethics, communication, practice management" }
      ],
      spring: [
        { code: "ANAT 502", title: "Veterinary Anatomy II", credits: 6, contact: "4-0-6", description: "Neuroanatomy, visceral anatomy, reproductive anatomy" },
        { code: "PHYS 502", title: "Veterinary Physiology II", credits: 4, contact: "4-0-0", description: "Digestive, urinary, endocrine, reproductive physiology" },
        { code: "IMMN 501", title: "Veterinary Immunology", credits: 3, contact: "3-0-0", description: "Immune system function, vaccines, hypersensitivity" },
        { code: "GNET 501", title: "Veterinary Genetics", credits: 2, contact: "2-0-0", description: "Inheritance patterns, population genetics, genomics" },
        { code: "ANES 501", title: "Animal Behavior & Welfare", credits: 2, contact: "1-0-3", description: "Ethology, animal welfare assessment, handling" },
        { code: "PROF 502", title: "Professional Development II", credits: 1, contact: "1-0-0", description: "Client communication, veterinary law, economics" }
      ]
    },
    year2: {
      fall: [
        { code: "PATH 601", title: "General Pathology", credits: 5, contact: "3-0-6", description: "Disease mechanisms, inflammation, neoplasia, necropsy" },
        { code: "MICR 601", title: "Veterinary Microbiology", credits: 4, contact: "3-0-3", description: "Bacterial, viral, fungal pathogens of animals" },
        { code: "PHAR 601", title: "Veterinary Pharmacology I", credits: 4, contact: "4-0-0", description: "Drug mechanisms, pharmacokinetics, toxicology" },
        { code: "NUTR 601", title: "Animal Nutrition", credits: 3, contact: "3-0-0", description: "Nutritional requirements, feed analysis, diet formulation" },
        { code: "EPID 601", title: "Veterinary Epidemiology", credits: 2, contact: "2-0-0", description: "Disease prevention, outbreak investigation, surveillance" }
      ],
      spring: [
        { code: "PATH 602", title: "Systemic Pathology", credits: 5, contact: "3-0-6", description: "Organ system pathology, diagnostic pathology" },
        { code: "PHAR 602", title: "Veterinary Pharmacology II", credits: 3, contact: "3-0-0", description: "Therapeutic applications, drug interactions" },
        { code: "PARA 601", title: "Veterinary Parasitology", credits: 3, contact: "2-0-3", description: "Internal and external parasites, life cycles, control" },
        { code: "REPR 601", title: "Theriogenology", credits: 3, contact: "2-0-3", description: "Reproduction, breeding, obstetrics, neonatology" },
        { code: "RADI 601", title: "Veterinary Radiology", credits: 3, contact: "1-0-6", description: "Diagnostic imaging, radiographic interpretation" },
        { code: "LAB 601", title: "Clinical Pathology", credits: 2, contact: "1-0-3", description: "Laboratory diagnostics, hematology, serum chemistry" }
      ]
    },
    year3: {
      fall: [
        { code: "MED 701", title: "Small Animal Medicine", credits: 4, contact: "3-0-3", description: "Internal medicine of dogs and cats, diagnostics" },
        { code: "SURG 701", title: "Small Animal Surgery", credits: 4, contact: "2-0-6", description: "Surgical principles, soft tissue and orthopedic surgery" },
        { code: "LARG 701", title: "Large Animal Medicine", credits: 4, contact: "3-0-3", description: "Bovine, equine, swine medicine and management" },
        { code: "EMER 701", title: "Emergency & Critical Care", credits: 3, contact: "2-0-3", description: "Emergency medicine, intensive care, trauma" },
        { code: "DERM 701", title: "Veterinary Dermatology", credits: 2, contact: "1-0-3", description: "Skin diseases, allergies, dermatopathology" }
      ],
      spring: [
        { code: "OPHTH 701", title: "Veterinary Ophthalmology", credits: 2, contact: "1-0-3", description: "Eye diseases, diagnostic techniques, surgery" },
        { code: "CARD 701", title: "Veterinary Cardiology", credits: 2, contact: "1-0-3", description: "Heart disease diagnosis and treatment" },
        { code: "NEURO 701", title: "Veterinary Neurology", credits: 2, contact: "1-0-3", description: "Neurological diseases, diagnostics, treatment" },
        { code: "EXOT 701", title: "Exotic Animal Medicine", credits: 3, contact: "2-0-3", description: "Birds, reptiles, small mammals, zoo animals" },
        { code: "PREV 701", title: "Preventive Medicine", credits: 3, contact: "3-0-0", description: "Herd health, vaccination programs, biosecurity" },
        { code: "PRAC 701", title: "Practice Management", credits: 2, contact: "2-0-0", description: "Business skills, client relations, leadership" }
      ]
    },
    year4: {
      clinical: [
        { code: "CLIN 801", title: "Small Animal Clinic", credits: 8, contact: "0-0-24", description: "Clinical rotations in small animal medicine and surgery" },
        { code: "CLIN 802", title: "Large Animal Clinic", credits: 6, contact: "0-0-18", description: "Farm animal and equine clinical experience" },
        { code: "CLIN 803", title: "Emergency Clinic", credits: 4, contact: "0-0-12", description: "24-hour emergency and critical care" },
        { code: "CLIN 804", title: "Diagnostic Services", credits: 4, contact: "0-0-12", description: "Pathology, radiology, laboratory medicine" },
        { code: "CLIN 805", title: "Elective Rotations", credits: 8, contact: "0-0-24", description: "Specialized areas: cardiology, oncology, behavior" },
        { code: "CLIN 806", title: "Externship", credits: 4, contact: "0-0-12", description: "Off-campus clinical experience" }
      ]
    }
  };

  const admissionRequirements = [
    "Bachelor's degree with minimum 3.5 GPA",
    "Prerequisite courses: Biology, Chemistry, Physics, Mathematics",
    "GRE scores (minimum 310 combined verbal and quantitative)",
    "Minimum 500 hours of veterinary experience",
    "Animal handling experience (200+ hours)",
    "Three letters of recommendation (including one from veterinarian)",
    "Personal statement and interview"
  ];

  const careerOpportunities = [
    "Small Animal Veterinarian", "Large Animal Veterinarian", "Emergency Veterinarian",
    "Veterinary Specialist", "Research Scientist", "Public Health Veterinarian",
    "Wildlife Veterinarian", "Zoo Veterinarian", "Laboratory Animal Veterinarian",
    "Veterinary Pathologist", "Food Safety Inspector", "Pharmaceutical Researcher"
  ];

  return (
    <PageLayout 
      title="College of Veterinary Medicine - Doctor of Veterinary Medicine (DVM)" 
      description="Comprehensive 4-year professional program preparing veterinarians for clinical practice and research"
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
              <div className="text-2xl font-bold">150</div>
              <p className="text-xs text-muted-foreground">Credit Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">DVM</div>
              <p className="text-xs text-muted-foreground">AVMA Accredited</p>
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
              <h3 className="text-2xl font-bold">DVM Curriculum Structure</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    First Year - Fall Semester
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
                  <CardTitle>First Year - Spring Semester</CardTitle>
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
                  <CardTitle>Clinical Years (3-4)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Years 3-4 focus on clinical education with hands-on experience in the veterinary 
                    teaching hospital, including rotations in small animal medicine/surgery, large animal 
                    medicine, emergency care, and specialized services.
                  </p>
                  <div className="grid gap-2">
                    {courseStructure.year4.clinical.slice(0, 3).map((rotation, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">{rotation.title}</span>
                        <Badge variant="outline">{rotation.credits} Credits</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>DVM Admission Requirements</CardTitle>
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
                <CardTitle>Veterinary Career Opportunities</CardTitle>
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
                <CardTitle>DVM Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$32,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Rotation Fee</span>
                    <span className="font-bold">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Laboratory Fee</span>
                    <span className="font-bold">$3,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$73,000</span>
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

export default CollegeVeterinaryMedicine;
