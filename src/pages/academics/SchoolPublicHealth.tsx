
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, BookOpen, GraduationCap } from 'lucide-react';

const SchoolPublicHealth = () => {
  const courseStructure = {
    year1: {
      fall: [
        { code: "PH 501", title: "Foundations of Public Health", credits: 3, contact: "3-0-0", description: "History, philosophy, and core functions of public health" },
        { code: "BIOS 501", title: "Biostatistics I", credits: 4, contact: "3-0-3", description: "Statistical methods, hypothesis testing, data analysis" },
        { code: "EPI 501", title: "Epidemiology I", credits: 4, contact: "3-0-3", description: "Disease causation, study designs, measures of association" },
        { code: "ENVH 501", title: "Environmental Health", credits: 3, contact: "3-0-0", description: "Environmental hazards, risk assessment, policy" },
        { code: "HPM 501", title: "Health Systems & Policy", credits: 3, contact: "3-0-0", description: "Healthcare delivery, financing, policy analysis" }
      ],
      spring: [
        { code: "BIOS 502", title: "Biostatistics II", credits: 3, contact: "3-0-0", description: "Advanced statistical methods, regression analysis" },
        { code: "EPI 502", title: "Epidemiology II", credits: 3, contact: "3-0-0", description: "Advanced study designs, bias, confounding" },
        { code: "SOCB 501", title: "Social & Behavioral Health", credits: 3, contact: "3-0-0", description: "Health behavior theories, intervention design" },
        { code: "GH 501", title: "Global Health", credits: 3, contact: "3-0-0", description: "International health issues, development, disparities" },
        { code: "PH 502", title: "Public Health Ethics", credits: 2, contact: "2-0-0", description: "Ethical frameworks, professional responsibility" }
      ]
    },
    year2: {
      fall: [
        { code: "PH 601", title: "Applied Practice Experience", credits: 3, contact: "0-0-9", description: "Supervised field work in public health setting" },
        { code: "CONC 601", title: "Concentration Course I", credits: 3, contact: "3-0-0", description: "Specialized area: Epidemiology, Biostatistics, or HPM" },
        { code: "CONC 602", title: "Concentration Course II", credits: 3, contact: "3-0-0", description: "Advanced concentration coursework" },
        { code: "PH 603", title: "Public Health Communication", credits: 2, contact: "2-0-0", description: "Health communication, media relations, advocacy" },
        { code: "ELEC 601", title: "Elective I", credits: 3, contact: "3-0-0", description: "Choose from specialized topics" }
      ],
      spring: [
        { code: "PH 701", title: "Integrative Learning Experience", credits: 3, contact: "1-0-6", description: "Capstone project or thesis" },
        { code: "CONC 701", title: "Concentration Course III", credits: 3, contact: "3-0-0", description: "Advanced specialization" },
        { code: "PH 702", title: "Leadership in Public Health", credits: 2, contact: "2-0-0", description: "Management, team building, change leadership" },
        { code: "ELEC 701", title: "Elective II", credits: 3, contact: "3-0-0", description: "Research methods or policy analysis" },
        { code: "PH 703", title: "Professional Development", credits: 1, contact: "1-0-0", description: "Career planning, job search, networking" }
      ]
    }
  };

  const concentrations = [
    {
      name: "Epidemiology",
      description: "Study of disease patterns, outbreak investigation, causal inference",
      courses: ["Advanced Epidemiology", "Infectious Disease Epidemiology", "Chronic Disease Epidemiology"]
    },
    {
      name: "Biostatistics", 
      description: "Statistical methods for health data, study design, data management",
      courses: ["Survival Analysis", "Longitudinal Data Analysis", "Clinical Trials"]
    },
    {
      name: "Health Policy & Management",
      description: "Healthcare systems, policy analysis, organizational leadership", 
      courses: ["Health Economics", "Quality Improvement", "Strategic Planning"]
    },
    {
      name: "Environmental Health",
      description: "Environmental hazards, occupational health, toxicology",
      courses: ["Air Quality", "Water Safety", "Chemical Risk Assessment"]
    }
  ];

  const admissionRequirements = [
    "Bachelor's degree from accredited institution (minimum 3.0 GPA)",
    "GRE scores (minimum 300 combined verbal and quantitative)",
    "Statement of purpose outlining career goals",
    "Three letters of recommendation",
    "Public health or health-related experience preferred",
    "English proficiency (TOEFL 90+ for international students)"
  ];

  const careerOpportunities = [
    "Epidemiologist", "Public Health Analyst", "Health Program Manager",
    "Biostatistician", "Environmental Health Specialist", "Health Policy Analyst",
    "Community Health Director", "Global Health Consultant", "Research Scientist",
    "Health Education Specialist", "Healthcare Quality Manager", "Disease Surveillance Officer"
  ];

  return (
    <PageLayout 
      title="School of Public Health - Master of Public Health (MPH)" 
      description="Preparing public health leaders to address population health challenges through evidence-based practice"
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
              <p className="text-xs text-muted-foreground">4 Semesters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Credit Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <CardTitle className="text-sm font-medium">Degree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MPH</div>
              <p className="text-xs text-muted-foreground">CEPH Accredited</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="concentrations">Concentrations</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MPH Core Curriculum</h3>
              
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
                  <CardTitle>Second Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    The second year focuses on concentration-specific coursework, applied practice experience 
                    in a public health setting, and an integrative capstone project demonstrating mastery 
                    of public health competencies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="concentrations">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">MPH Concentration Areas</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {concentrations.map((conc, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{conc.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{conc.description}</p>
                      <div>
                        <h4 className="font-semibold mb-2">Sample Courses:</h4>
                        <ul className="space-y-1">
                          {conc.courses.map((course, idx) => (
                            <li key={idx} className="text-sm text-gray-600">• {course}</li>
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
                <CardTitle>MPH Admission Requirements</CardTitle>
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
                <CardTitle>Public Health Career Opportunities</CardTitle>
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
                <CardTitle>MPH Program Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$18,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applied Practice Fee</span>
                    <span className="font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology Fee</span>
                    <span className="font-bold">$800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$750</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$38,550</span>
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

export default SchoolPublicHealth;
