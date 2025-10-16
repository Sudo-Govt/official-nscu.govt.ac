import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, Clock, BookOpen, GraduationCap } from 'lucide-react';

const MasterPharmacy = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "MPHM 601", title: "Advanced Pharmaceutical Sciences", credits: 4, contact: "4-0-0", description: "Current topics in pharmaceutical sciences research" },
        { code: "MPHM 611", title: "Research Methodology & Biostatistics", credits: 3, contact: "3-0-0", description: "Design and analysis of pharmaceutical research" },
        { code: "MPHM 621", title: "Advanced Pharmacology", credits: 4, contact: "4-0-0", description: "Molecular mechanisms of drug action" },
        { code: "MPHM 631", title: "Pharmaceutical Analysis", credits: 3, contact: "2-0-3", description: "Advanced analytical techniques and instrumentation" },
        { code: "MPHM 641", title: "Elective I", credits: 3, contact: "3-0-0", description: "Specialized area based on research interest" }
      ],
      spring: [
        { code: "MPHM 622", title: "Advanced Pharmaceutics", credits: 4, contact: "3-0-3", description: "Novel drug delivery systems and formulation" },
        { code: "MPHM 651", title: "Pharmacokinetics & Drug Metabolism", credits: 3, contact: "3-0-0", description: "Advanced ADME principles and modeling" },
        { code: "MPHM 661", title: "Molecular Biology & Biotechnology", credits: 3, contact: "2-0-3", description: "Biopharmaceuticals and gene therapy" },
        { code: "MPHM 671", title: "Regulatory Affairs & Quality Assurance", credits: 2, contact: "2-0-0", description: "FDA regulations and GMP compliance" },
        { code: "MPHM 681", title: "Research Seminar I", credits: 1, contact: "1-0-0", description: "Literature review and research presentations" },
        { code: "MPHM 691", title: "Thesis Research I", credits: 3, contact: "0-0-9", description: "Initial thesis project development" }
      ]
    },
    year2: {
      fall: [
        { code: "MPHM 701", title: "Advanced Topics in Medicinal Chemistry", credits: 3, contact: "3-0-0", description: "Drug design and structure-activity relationships" },
        { code: "MPHM 711", title: "Clinical Trials & Drug Development", credits: 3, contact: "3-0-0", description: "Phase I-IV trials and regulatory approval" },
        { code: "MPHM 721", title: "Pharmacoepidemiology & Outcomes Research", credits: 3, contact: "3-0-0", description: "Population-based drug safety and effectiveness" },
        { code: "MPHM 731", title: "Elective II", credits: 3, contact: "3-0-0", description: "Advanced specialized topic" },
        { code: "MPHM 782", title: "Research Seminar II", credits: 1, contact: "1-0-0", description: "Thesis progress presentations" },
        { code: "MPHM 792", title: "Thesis Research II", credits: 4, contact: "0-0-12", description: "Data collection and analysis" }
      ],
      spring: [
        { code: "MPHM 793", title: "Thesis Research III", credits: 6, contact: "0-0-18", description: "Completion of research project" },
        { code: "MPHM 799", title: "Master's Thesis Defense", credits: 3, contact: "0-0-9", description: "Thesis writing and oral defense" }
      ]
    }
  };

  const specializationTracks = [
    {
      name: "Pharmaceutical Sciences",
      description: "Focus on drug discovery, design, and development",
      courses: ["Advanced Medicinal Chemistry", "Drug Design & QSAR", "Computational Pharmaceutics"]
    },
    {
      name: "Pharmacology & Toxicology",
      description: "Study of drug effects and safety assessment",
      courses: ["Molecular Pharmacology", "Toxicology Principles", "Neuropharmacology"]
    },
    {
      name: "Clinical Pharmacy",
      description: "Advanced clinical practice and patient care",
      courses: ["Pharmacotherapy Specialization", "Clinical Research", "Evidence-Based Medicine"]
    },
    {
      name: "Pharmaceutical Analysis",
      description: "Analytical chemistry and quality control",
      courses: ["Chromatography Techniques", "Spectroscopy", "Pharmaceutical Quality Control"]
    },
    {
      name: "Industrial Pharmacy",
      description: "Manufacturing and pharmaceutical industry",
      courses: ["GMP & Validation", "Scale-Up Technology", "Pharmaceutical Operations"]
    }
  ];

  const admissionRequirements = [
    "Bachelor of Pharmacy (BPharm) or PharmD degree",
    "Minimum GPA of 3.0 on 4.0 scale",
    "GRE scores (preferred but may be waived)",
    "Three letters of recommendation from academic or professional references",
    "Statement of purpose outlining research interests and career goals",
    "CV/Resume demonstrating relevant experience",
    "Interview with program faculty (for selected candidates)",
    "English proficiency (TOEFL/IELTS for international students)"
  ];

  const careerOpportunities = [
    "Pharmaceutical Research Scientist", "Drug Development Specialist",
    "Regulatory Affairs Manager", "Quality Assurance Director",
    "Clinical Research Coordinator", "Medical Affairs Specialist",
    "Academia & Teaching", "Pharmaceutical Consultant",
    "Formulation Scientist", "Pharmacology Researcher"
  ];

  return (
    <PageLayout 
      title="Master of Pharmacy (MPharm)" 
      description="Advanced research-focused pharmacy degree with specialization tracks"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 Years</div>
              <p className="text-xs text-muted-foreground">4 Semesters + Thesis Research</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Credit Hours Including Thesis</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MPharm</div>
              <p className="text-xs text-muted-foreground">GCHEA Accredited</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="specialization">Specializations</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MPharm Curriculum Structure</h3>
              
              {Object.entries(courseStructure).map(([year, semesters], yearIndex) => (
                <div key={year} className="space-y-4">
                  <h4 className="text-xl font-semibold">
                    Year {yearIndex + 1} - {yearIndex === 0 ? "Coursework & Research Foundations" : "Research & Thesis"}
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

          <TabsContent value="specialization">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MPharm Specialization Tracks</h3>
              <p className="text-muted-foreground">
                Students select a specialization track that aligns with their research interests and career goals.
              </p>
              
              <div className="grid gap-4">
                {specializationTracks.map((track, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{track.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{track.description}</p>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Sample Elective Courses:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {track.courses.map((course, idx) => (
                            <li key={idx}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>MPharm Admission Requirements</CardTitle>
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
                <CardTitle>MPharm Career Opportunities</CardTitle>
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
                <CardTitle>MPharm Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Research & Laboratory Fee (per year)</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thesis Binding & Publication</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$600</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$22,500</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    * Research assistantships and scholarships available for qualified students
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MasterPharmacy;
