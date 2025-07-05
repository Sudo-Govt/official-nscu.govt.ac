
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, BookOpen, GraduationCap } from 'lucide-react';

const MasterBusinessAdministration = () => {
  const courseStructure = {
    semester1: [
      { code: "MBA 501", title: "Managerial Economics", credits: 3, contact: "3-0-0", description: "Microeconomic theory, market structures, pricing strategies, demand analysis" },
      { code: "MBA 502", title: "Financial Accounting", credits: 3, contact: "3-0-0", description: "Financial statements, accounting principles, ratio analysis, cash flow" },
      { code: "MBA 503", title: "Organizational Behavior", credits: 3, contact: "3-0-0", description: "Individual and group behavior, leadership, motivation, organizational culture" },
      { code: "MBA 504", title: "Quantitative Methods", credits: 3, contact: "3-0-0", description: "Statistical analysis, decision theory, operations research, forecasting" },
      { code: "MBA 505", title: "Marketing Management", credits: 3, contact: "3-0-0", description: "Marketing strategy, consumer behavior, product management, brand positioning" }
    ],
    semester2: [
      { code: "MBA 506", title: "Operations Management", credits: 3, contact: "3-0-0", description: "Process design, quality management, supply chain, project management" },
      { code: "MBA 507", title: "Corporate Finance", credits: 3, contact: "3-0-0", description: "Capital budgeting, cost of capital, dividend policy, financial planning" },
      { code: "MBA 508", title: "Strategic Management", credits: 3, contact: "3-0-0", description: "Competitive strategy, industry analysis, strategic planning, implementation" },
      { code: "MBA 509", title: "Human Resource Management", credits: 3, contact: "3-0-0", description: "Talent acquisition, performance management, compensation, labor relations" },
      { code: "MBA 510", title: "Business Ethics & Law", credits: 3, contact: "3-0-0", description: "Corporate governance, business law, ethical decision making, compliance" }
    ],
    semester3: [
      { code: "MBA 601", title: "International Business", credits: 3, contact: "3-0-0", description: "Global markets, cross-cultural management, international trade, FDI" },
      { code: "MBA 602", title: "Digital Marketing", credits: 3, contact: "3-0-0", description: "Social media marketing, SEO/SEM, analytics, e-commerce strategies" },
      { code: "MBA 603", title: "Financial Markets", credits: 3, contact: "3-0-0", description: "Investment analysis, portfolio management, derivatives, risk management" },
      { code: "MBA 604", title: "Innovation Management", credits: 3, contact: "3-0-0", description: "Innovation process, technology management, R&D, entrepreneurship" },
      { code: "MBA 605", title: "Elective I", credits: 3, contact: "3-0-0", description: "Choose from specialization tracks: Finance, Marketing, Operations, HR" }
    ],
    semester4: [
      { code: "MBA 606", title: "Business Consulting", credits: 3, contact: "1-0-6", description: "Real client projects, problem solving, presentation skills, consulting methodology" },
      { code: "MBA 607", title: "Leadership & Change", credits: 3, contact: "3-0-0", description: "Leadership styles, change management, team building, conflict resolution" },
      { code: "MBA 608", title: "Elective II", credits: 3, contact: "3-0-0", description: "Advanced specialization course in chosen track" },
      { code: "MBA 699", title: "Capstone Project", credits: 6, contact: "0-0-18", description: "Independent research project or business plan development" }
    ]
  };

  const specializationTracks = [
    { name: "Finance", courses: ["Investment Banking", "Private Equity", "Risk Management", "Financial Modeling"] },
    { name: "Marketing", courses: ["Brand Management", "Consumer Analytics", "Sales Management", "Retail Marketing"] },
    { name: "Operations", courses: ["Supply Chain Analytics", "Lean Six Sigma", "Quality Management", "Logistics"] },
    { name: "Human Resources", courses: ["Talent Management", "Organizational Development", "Compensation Design", "Labor Relations"] },
    { name: "Technology Management", courses: ["IT Strategy", "Data Analytics", "Digital Transformation", "Cybersecurity Management"] }
  ];

  const admissionRequirements = [
    "Bachelor's degree from an accredited institution",
    "Minimum 3.0 GPA in undergraduate studies",
    "GMAT score of 550+ or GRE equivalent",
    "2+ years of work experience preferred",
    "Statement of purpose and career goals",
    "Two professional recommendation letters",
    "English proficiency (TOEFL 100+ for international students)"
  ];

  return (
    <PageLayout 
      title="Master of Business Administration (MBA)" 
      description="Comprehensive 2-year MBA program designed for aspiring business leaders"
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
                <div className="text-2xl font-bold">60</div>
                <p className="text-xs text-muted-foreground">Credit Hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Degree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">MBA</div>
                <p className="text-xs text-muted-foreground">AACSB Accredited</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Structure */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="specializations">Tracks</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Course Structure</h3>
              
              {/* Semester 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Semester 1 (Foundation Courses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.semester1.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
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

              {/* Semester 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Semester 2 (Core Courses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {courseStructure.semester2.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
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

              {/* Semesters 3 & 4 */}
              <Card>
                <CardHeader>
                  <CardTitle>Semesters 3 & 4 (Specialization & Capstone)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Final semesters focus on specialization tracks, advanced electives, consulting projects, 
                    and a comprehensive capstone project that integrates all learning outcomes.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Semester 3</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• International Business</li>
                        <li>• Digital Marketing</li>
                        <li>• Financial Markets</li>
                        <li>• Innovation Management</li>
                        <li>• Elective I</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Semester 4</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Business Consulting</li>
                        <li>• Leadership & Change</li>
                        <li>• Elective II</li>
                        <li>• Capstone Project</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specializations">
            <Card>
              <CardHeader>
                <CardTitle>Specialization Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {specializationTracks.map((track, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3">{track.name}</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {track.courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-uw-purple rounded-full"></div>
                            <span className="text-sm">{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                <CardTitle>Career Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Top Employers</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Goldman Sachs</li>
                      <li>• McKinsey & Company</li>
                      <li>• Google</li>
                      <li>• Amazon</li>
                      <li>• Microsoft</li>
                      <li>• JPMorgan Chase</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Average Outcomes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Starting Salary:</span>
                        <span className="font-bold">$95,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employment Rate:</span>
                        <span className="font-bold">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3-Year Salary:</span>
                        <span className="font-bold">$125,000</span>
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
                    <span className="font-bold">$25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Case Study Materials</span>
                    <span className="font-bold">$1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology Fee</span>
                    <span className="font-bold">$800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$1,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Program Cost</span>
                    <span>$105,600</span>
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

export default MasterBusinessAdministration;
