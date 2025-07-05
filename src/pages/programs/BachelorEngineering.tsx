
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cog, Clock, BookOpen, GraduationCap } from 'lucide-react';

const BachelorEngineering = () => {
  const courseStructure = {
    semester1: [
      { code: "MATH 101", title: "Calculus I", credits: 4, contact: "4-0-0", description: "Limits, derivatives, applications of derivatives, basic integration" },
      { code: "PHYS 101", title: "Physics I (Mechanics)", credits: 4, contact: "3-0-3", description: "Kinematics, dynamics, work-energy theorem, rotational mechanics" },
      { code: "CHEM 101", title: "General Chemistry", credits: 3, contact: "3-0-0", description: "Atomic structure, chemical bonding, thermodynamics, kinetics" },
      { code: "ENG 101", title: "Engineering Graphics", credits: 3, contact: "1-0-6", description: "Technical drawing, CAD fundamentals, orthographic projections" },
      { code: "ENGL 101", title: "Technical Communication", credits: 3, contact: "3-0-0", description: "Technical writing, presentation skills, documentation" },
      { code: "CS 101", title: "Programming Fundamentals", credits: 3, contact: "2-0-3", description: "C programming, algorithms, data structures basics" }
    ],
    semester2: [
      { code: "MATH 102", title: "Calculus II", credits: 4, contact: "4-0-0", description: "Integration techniques, series, multivariable calculus introduction" },
      { code: "PHYS 102", title: "Physics II (Electricity & Magnetism)", credits: 4, contact: "3-0-3", description: "Electric fields, magnetic fields, electromagnetic induction" },
      { code: "MATH 201", title: "Differential Equations", credits: 3, contact: "3-0-0", description: "First-order ODEs, second-order linear ODEs, Laplace transforms" },
      { code: "ENG 102", title: "Engineering Mechanics - Statics", credits: 3, contact: "3-0-0", description: "Force systems, equilibrium, trusses, friction, centroids" },
      { code: "CHEM 102", title: "Chemistry Lab", credits: 1, contact: "0-0-3", description: "Laboratory experiments in general chemistry" },
      { code: "HIST 101", title: "World History", credits: 3, contact: "3-0-0", description: "Global historical perspectives and civilizations" }
    ],
    semester3: [
      { code: "MATH 301", title: "Linear Algebra", credits: 3, contact: "3-0-0", description: "Matrices, vector spaces, eigenvalues, linear transformations" },
      { code: "ENG 201", title: "Engineering Mechanics - Dynamics", credits: 3, contact: "3-0-0", description: "Kinematics and kinetics of particles and rigid bodies" },
      { code: "EE 201", title: "Circuit Analysis", credits: 4, contact: "3-0-3", description: "DC and AC circuits, network theorems, operational amplifiers" },
      { code: "MATL 201", title: "Materials Science", credits: 3, contact: "3-0-0", description: "Structure-property relationships, metals, ceramics, polymers" },
      { code: "STAT 201", title: "Engineering Statistics", credits: 3, contact: "3-0-0", description: "Probability, distributions, hypothesis testing, regression" },
      { code: "ECON 101", title: "Engineering Economics", credits: 3, contact: "3-0-0", description: "Time value of money, economic analysis of engineering projects" }
    ],
    semester4: [
      { code: "ME 201", title: "Thermodynamics", credits: 3, contact: "3-0-0", description: "Laws of thermodynamics, entropy, cycles, phase equilibrium" },
      { code: "ME 202", title: "Fluid Mechanics", credits: 3, contact: "3-0-0", description: "Fluid statics, conservation laws, viscous flow, turbulence" },
      { code: "EE 202", title: "Electronics", credits: 4, contact: "3-0-3", description: "Diodes, transistors, amplifiers, digital logic circuits" },
      { code: "CS 201", title: "Data Structures", credits: 3, contact: "2-0-3", description: "Arrays, linked lists, stacks, queues, trees, graphs" },
      { code: "ENG 301", title: "Engineering Design", credits: 3, contact: "1-0-6", description: "Design process, CAD/CAM, prototyping, project management" },
      { code: "PHIL 101", title: "Engineering Ethics", credits: 2, contact: "2-0-0", description: "Professional ethics, social responsibility, case studies" }
    ]
  };

  const admissionRequirements = [
    "High School Diploma with minimum 85% aggregate",
    "Strong background in Mathematics and Physics",
    "SAT score of 1200+ or equivalent standardized test",
    "English proficiency (TOEFL 80+ for international students)",
    "Personal statement and recommendation letters"
  ];

  const careerOpportunities = [
    "Design Engineer", "Project Manager", "Research & Development",
    "Quality Assurance Engineer", "Manufacturing Engineer", "Consulting Engineer",
    "Systems Analyst", "Technical Sales Engineer", "Patent Engineer"
  ];

  return (
    <PageLayout 
      title="Bachelor of Engineering" 
      description="Comprehensive 4-year engineering program preparing students for diverse engineering careers"
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
                <div className="text-2xl font-bold">B.Eng</div>
                <p className="text-xs text-muted-foreground">ABET Accredited</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Structure */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
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
                    <Cog className="h-5 w-5" />
                    Semester 1 (First Year)
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

              {/* Semester 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Semester 2 (First Year)
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

              {/* Continue with remaining semesters... */}
              <Card>
                <CardHeader>
                  <CardTitle>Remaining Semesters (3-8)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Semesters 3-8 include specialized courses in your chosen engineering discipline 
                    (Mechanical, Electrical, Computer, Civil, Chemical, or Aerospace), advanced mathematics, 
                    design projects, internships, and a capstone senior project.
                  </p>
                </CardContent>
              </Card>
            </div>
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
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee (per semester)</span>
                    <span className="font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$34,500</span>
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

export default BachelorEngineering;
