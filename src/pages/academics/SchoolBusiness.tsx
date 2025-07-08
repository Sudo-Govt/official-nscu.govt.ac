
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Building, Users, Globe, Calculator, Briefcase, PieChart, DollarSign, BarChart3, Target, Award, BookOpen } from 'lucide-react';

const SchoolBusiness = () => {
  const programs = [
    { 
      name: "Master of Business Administration (MBA)", 
      type: "Graduate", 
      duration: "2 Years", 
      credits: 60,
      ranking: "#45 Nationally",
      students: 320,
      concentrations: ["Finance", "Marketing", "Operations", "Strategy", "Entrepreneurship", "International Business"],
      admissionReq: "GMAT 580+, 3.0 GPA, 2 years work experience",
      avgSalary: "$95,000",
      jobPlacement: "96%"
    },
    { 
      name: "Bachelor of Business Administration", 
      type: "Undergraduate", 
      duration: "4 Years",
      credits: 120,
      students: 1200,
      concentrations: ["General Business", "International Business", "Operations Management"],
      coreSubjects: ["Management", "Marketing", "Finance", "Operations", "Business Law", "Ethics"],
      admissionReq: "3.5 GPA, SAT 1200+",
      avgSalary: "$58,000",
      jobPlacement: "92%"
    },
    { 
      name: "Bachelor of Science in Finance", 
      type: "Undergraduate", 
      duration: "4 Years",
      credits: 120,
      students: 680,
      concentrations: ["Corporate Finance", "Investment Management", "Financial Planning", "Risk Management"],
      coreSubjects: ["Financial Analysis", "Portfolio Management", "Derivatives", "Corporate Finance", "International Finance"],
      certifications: ["CFA Level 1 Prep", "FRM Preparation"],
      admissionReq: "3.3 GPA, Strong Math Background",
      avgSalary: "$65,000",
      jobPlacement: "94%"
    },
    { 
      name: "Bachelor of Science in Marketing", 
      type: "Undergraduate", 
      duration: "4 Years",
      credits: 120,
      students: 550,
      concentrations: ["Digital Marketing", "Brand Management", "Consumer Behavior", "Sales Management"],
      coreSubjects: ["Market Research", "Consumer Psychology", "Digital Analytics", "Brand Strategy", "Sales Techniques"],
      certifications: ["Google Analytics", "Facebook Blueprint", "HubSpot Content Marketing"],
      admissionReq: "3.2 GPA, Creative Portfolio Recommended",
      avgSalary: "$52,000",
      jobPlacement: "91%"
    },
    { 
      name: "Bachelor of Science in Management", 
      type: "Undergraduate", 
      duration: "4 Years",
      credits: 120,
      students: 480,
      concentrations: ["Human Resources", "Operations Management", "Project Management", "Organizational Leadership"],
      coreSubjects: ["Organizational Behavior", "Strategic Management", "Operations Research", "Leadership Theory"],
      certifications: ["PMP Preparation", "SHRM-CP Prep", "Lean Six Sigma Green Belt"],
      admissionReq: "3.2 GPA, Leadership Experience Preferred",
      avgSalary: "$55,000",
      jobPlacement: "89%"
    },
    { 
      name: "Bachelor of Science in Accounting", 
      type: "Undergraduate", 
      duration: "4 Years",
      credits: 120,
      students: 720,
      concentrations: ["Public Accounting", "Management Accounting", "Tax Accounting", "Forensic Accounting"],
      coreSubjects: ["Financial Accounting", "Cost Accounting", "Auditing", "Tax Law", "Business Law", "Advanced Accounting"],
      certifications: ["CPA Exam Preparation", "CMA Preparation"],
      admissionReq: "3.4 GPA, Strong Analytical Skills",
      avgSalary: "$60,000",
      jobPlacement: "95%"
    }
  ];

  const facultyHighlights = [
    { name: "Dr. Michael Henderson", specialty: "Corporate Finance", credentials: "CFA, Former Goldman Sachs VP", awards: "Outstanding Teacher Award 2023" },
    { name: "Dr. Sarah Kim", specialty: "Marketing Strategy", credentials: "Former P&G Brand Manager", awards: "Research Excellence Award" },
    { name: "Dr. Robert Johnson", specialty: "Operations Management", credentials: "Six Sigma Black Belt", awards: "Industry Partnership Award" },
    { name: "Dr. Maria Gonzalez", specialty: "International Business", credentials: "Former McKinsey Consultant", awards: "Best Paper Award - Academy of Management" },
    { name: "Dr. David Chen", specialty: "Entrepreneurship", credentials: "Serial Entrepreneur, 3 Successful Exits", awards: "Innovation in Teaching Award" },
    { name: "Dr. Jennifer Wilson", specialty: "Accounting & Finance", credentials: "CPA, Former KPMG Partner", awards: "Excellence in Professional Service" }
  ];

  const careerOutcomes = [
    { company: "Goldman Sachs", positions: "Investment Banking Analyst", hires: 12, avgSalary: "$85,000" },
    { company: "McKinsey & Company", positions: "Business Analyst", hires: 8, avgSalary: "$95,000" },
    { company: "Procter & Gamble", positions: "Brand Manager", hires: 15, avgSalary: "$72,000" },
    { company: "JPMorgan Chase", positions: "Financial Analyst", hires: 18, avgSalary: "$68,000" },
    { company: "Amazon", positions: "Operations Manager", hires: 22, avgSalary: "$75,000" },
    { company: "Deloitte", positions: "Consultant", hires: 25, avgSalary: "$70,000" }
  ];

  const courseSample = {
    course: "Strategic Management (MGT 485)",
    credits: 3,
    prerequisites: "MGT 301, MKT 301, FIN 301",
    description: "Capstone course integrating all business functions through strategic analysis, formulation, and implementation.",
    learningOutcomes: [
      "Analyze industry and competitive environments",
      "Formulate and evaluate strategic alternatives",
      "Develop implementation plans for strategic initiatives",
      "Apply strategic frameworks to real business cases"
    ],
    topics: [
      "Strategic Analysis Tools (SWOT, Porter's Five Forces)",
      "Competitive Advantage and Business Models",
      "Corporate Strategy and Diversification",
      "International Strategy and Global Competition",
      "Strategy Implementation and Change Management",
      "Strategic Leadership and Organizational Culture"
    ],
    assessment: "30% Case Analysis, 25% Strategic Plan Project, 25% Final Exam, 20% Class Participation",
    textbooks: [
      "Thompson, Strickland & Gamble - Crafting & Executing Strategy",
      "Porter, Michael - Competitive Strategy",
      "Harvard Business Review Strategy Collection"
    ]
  };

  return (
    <PageLayout 
      title="School of Business" 
      description="Preparing future business leaders with innovative programs and real-world experience"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Business Excellence</h2>
            <p className="text-gray-600 mb-4">
              The School of Business at NSCU is AACSB accredited and recognized for its innovative 
              curriculum, experienced faculty, and strong industry connections. Our programs blend 
              theoretical knowledge with practical application to prepare students for successful careers.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">3,630</div>
                <div className="text-sm">Business Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm">Employment Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Building className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">AACSB Accredited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Top 5% of business schools worldwide with AACSB accreditation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Study abroad programs in 25+ countries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Programs</h2>
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Program Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum Details</TabsTrigger>
              <TabsTrigger value="outcomes">Career Outcomes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((program, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-uw-purple">{program.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {program.type} • {program.duration} • {program.credits} Credits
                        {program.ranking && <Badge variant="secondary">{program.ranking}</Badge>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Students:</span>
                            <span className="font-semibold ml-2">{program.students}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Job Placement:</span>
                            <span className="font-semibold ml-2 text-green-600">{program.jobPlacement}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Avg Starting Salary:</span>
                          <span className="font-semibold ml-2 text-uw-purple">{program.avgSalary}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Concentrations:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {program.concentrations.map((conc, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{conc}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <span className="text-sm text-gray-600">Admission Requirements:</span>
                          <p className="text-xs text-gray-500 mt-1">{program.admissionReq}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Course: Strategic Management</CardTitle>
                  <CardDescription>Capstone course demonstrating our rigorous curriculum approach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Course Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Course Code:</span> {courseSample.course}</div>
                          <div><span className="font-medium">Credits:</span> {courseSample.credits}</div>
                          <div><span className="font-medium">Prerequisites:</span> {courseSample.prerequisites}</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{courseSample.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                        <ul className="text-sm space-y-1">
                          {courseSample.learningOutcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-uw-purple mr-2">•</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Course Topics</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {courseSample.topics.map((topic, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <Target className="h-3 w-3 mr-2 text-uw-purple" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Assessment Methods</h4>
                        <p className="text-sm text-gray-600">{courseSample.assessment}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Required Textbooks</h4>
                        <ul className="text-sm space-y-1">
                          {courseSample.textbooks.map((book, i) => (
                            <li key={i} className="text-gray-600">• {book}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Employer Partnerships</CardTitle>
                    <CardDescription>Where our graduates start their careers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Annual Hires</TableHead>
                          <TableHead>Avg Starting Salary</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {careerOutcomes.map((outcome, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{outcome.company}</TableCell>
                            <TableCell>{outcome.positions}</TableCell>
                            <TableCell>{outcome.hires}</TableCell>
                            <TableCell className="text-green-600 font-semibold">{outcome.avgSalary}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
                      <div className="text-2xl font-bold text-uw-purple">$68,500</div>
                      <div className="text-sm text-gray-600">Average Starting Salary</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
                      <div className="text-2xl font-bold text-uw-purple">92%</div>
                      <div className="text-sm text-gray-600">Employment Rate within 6 months</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
                      <div className="text-2xl font-bold text-uw-purple">85%</div>
                      <div className="text-sm text-gray-600">Alumni in Leadership Roles</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
                      <Briefcase className="h-4 w-4 mr-2 text-uw-purple mt-0.5" />
                      <span className="text-sm">{faculty.credentials}</span>
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

        {/* Career Success */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Career Success</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Average Starting Salary</h3>
              <p className="text-2xl font-bold text-uw-purple">$68,500</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Corporate Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">200+</p>
            </div>
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Fortune 500 Placements</h3>
              <p className="text-2xl font-bold text-uw-purple">35%</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolBusiness;
