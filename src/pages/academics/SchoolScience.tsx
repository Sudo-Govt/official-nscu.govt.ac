
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Microscope, Calculator, Atom, FlaskConical, Dna, TreePine, Brain } from 'lucide-react';

const SchoolScience = () => {
  const departments = [
    { name: "Biology", students: 850, majors: 8, research: "$4.2M", faculty: 45 },
    { name: "Chemistry", students: 420, majors: 5, research: "$3.8M", faculty: 32 },
    { name: "Physics", students: 280, majors: 4, research: "$5.1M", faculty: 28 },
    { name: "Mathematics", students: 380, majors: 6, research: "$2.1M", faculty: 35 },
    { name: "Computer Science", students: 640, majors: 5, research: "$6.2M", faculty: 35 },
    { name: "Environmental Science", students: 320, majors: 3, research: "$2.9M", faculty: 22 },
    { name: "Psychology", students: 920, majors: 4, research: "$2.8M", faculty: 38 },
    { name: "Statistics", students: 195, majors: 3, research: "$1.4M", faculty: 18 },
    { name: "Geology", students: 165, majors: 2, research: "$1.8M", faculty: 16 },
    { name: "Astronomy", students: 125, majors: 2, research: "$2.2M", faculty: 12 },
    { name: "Biochemistry", students: 240, majors: 3, research: "$2.6M", faculty: 20 },
    { name: "Neuroscience", students: 185, majors: 2, research: "$3.1M", faculty: 16 }
  ];

  const researchCenters = [
    { name: "Center for Molecular Biology", focus: "Genomics & Proteomics", funding: "$8.5M" },
    { name: "Materials Science Institute", focus: "Nanotechnology Research", funding: "$12.2M" },
    { name: "Behavioral Research Center", focus: "Cognitive Psychology", funding: "$4.6M" },
    { name: "Environmental Research Station", focus: "Climate Change Studies", funding: "$6.1M" },
    { name: "Observatory & Planetarium", focus: "Astrophysics Research", funding: "$3.4M" },
    { name: "Computational Science Lab", focus: "High-Performance Computing", funding: "$5.8M" },
    { name: "Quantum Research Institute", focus: "Quantum Computing & Physics", funding: "$7.2M" },
    { name: "Biomedical Engineering Center", focus: "Medical Device Innovation", funding: "$4.9M" }
  ];

  const programs = [
    { name: "Pre-Medical Track", type: "Undergraduate", students: 380, acceptance: "85%" },
    { name: "Pre-Dental Track", type: "Undergraduate", students: 120, acceptance: "82%" },
    { name: "Research Scholars", type: "Undergraduate", students: 180, funded: "100%" },
    { name: "Computational Science", type: "Graduate", students: 95, placement: "98%" },
    { name: "Data Science Certificate", type: "All Levels", students: 240, industry: "94%" },
    { name: "Environmental Field Studies", type: "Undergraduate", students: 85, hands_on: "100%" }
  ];

  return (
    <PageLayout 
      title="School of Science" 
      description="Advancing scientific discovery through rigorous research and innovative education"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">4,720</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">12</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">45+</div>
              <div className="text-sm text-gray-600">Degree Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">$42M</div>
              <div className="text-sm text-gray-600">Research Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Scientific Discovery</h2>
            <p className="text-gray-600 mb-6">
              The School of Science is at the forefront of scientific research and education, 
              offering comprehensive programs across the natural sciences, mathematics, and 
              computational sciences. Our faculty and students engage in cutting-edge research 
              that addresses society's most pressing challenges.
            </p>
            <p className="text-gray-600 mb-6">
              From fundamental research in physics and chemistry to applied work in environmental 
              science and computer science, our programs prepare students for careers in research, 
              industry, healthcare, and education while fostering the analytical thinking and 
              problem-solving skills essential for scientific innovation.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm">Graduate School Acceptance</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">12:1</div>
                <div className="text-sm">Student-Faculty Ratio</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <FlaskConical className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">State-of-the-Art Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Modern research facilities with cutting-edge equipment and instrumentation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calculator className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Computational Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  High-performance computing clusters and advanced data analysis capabilities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TreePine className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Field Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Field stations and outdoor laboratories for environmental and geological studies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Departments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-semibold">{dept.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Programs:</span>
                      <span className="font-semibold">{dept.majors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Research:</span>
                      <span className="font-semibold">{dept.research}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Faculty:</span>
                      <span className="font-semibold">{dept.faculty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research Centers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Research Centers & Institutes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchCenters.map((center, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{center.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">{center.focus}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Funding:</span>
                    <Badge variant="outline" className="text-xs">{center.funding}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Special Programs & Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Participants:</span>
                      <span className="font-semibold">{program.students}</span>
                    </div>
                    {program.acceptance && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate:</span>
                        <span className="font-semibold text-green-600">{program.acceptance}</span>
                      </div>
                    )}
                    {program.funded && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Funded:</span>
                        <span className="font-semibold text-green-600">{program.funded}</span>
                      </div>
                    )}
                    {program.placement && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Placement:</span>
                        <span className="font-semibold text-green-600">{program.placement}</span>
                      </div>
                    )}
                    {program.industry && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Industry Rate:</span>
                        <span className="font-semibold text-green-600">{program.industry}</span>
                      </div>
                    )}
                    {program.hands_on && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Field Work:</span>
                        <span className="font-semibold text-green-600">{program.hands_on}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Success */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Scientific Achievement</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <Dna className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Papers</h3>
              <p className="text-2xl font-bold text-uw-purple">850+</p>
              <p className="text-sm text-gray-600">Published annually</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patents</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">In past 3 years</p>
            </div>
            <div className="text-center">
              <Atom className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Lab Courses</h3>
              <p className="text-2xl font-bold text-uw-purple">120+</p>
              <p className="text-sm text-gray-600">Hands-on experiences</p>
            </div>
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Projects</h3>
              <p className="text-2xl font-bold text-uw-purple">580+</p>
              <p className="text-sm text-gray-600">Undergraduate research</p>
            </div>
            <div className="text-center">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Industry Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">85+</p>
              <p className="text-sm text-gray-600">Active collaborations</p>
            </div>
          </div>
        </div>

        {/* Alumni Impact */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">18,500+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">Leading scientific innovation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-lg">Nobel Laureates</div>
              <p className="text-sm opacity-90 mt-2">Among faculty and alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$135K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolScience;
