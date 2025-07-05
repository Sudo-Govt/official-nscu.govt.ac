
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Globe, Microscope, Palette, Calculator, Languages } from 'lucide-react';

const CollegeArtsSciences = () => {
  const departments = [
    { name: "Biology", students: 850, majors: 8, research: "$4.2M", faculty: 45 },
    { name: "Chemistry", students: 420, majors: 5, research: "$3.8M", faculty: 32 },
    { name: "Physics", students: 280, majors: 4, research: "$5.1M", faculty: 28 },
    { name: "Mathematics", students: 380, majors: 6, research: "$2.1M", faculty: 35 },
    { name: "English", students: 520, majors: 7, research: "$800K", faculty: 42 },
    { name: "History", students: 340, majors: 5, research: "$650K", faculty: 28 },
    { name: "Psychology", students: 920, majors: 4, research: "$2.8M", faculty: 38 },
    { name: "Sociology", students: 290, majors: 3, research: "$1.2M", faculty: 22 },
    { name: "Art & Design", students: 380, majors: 6, research: "$400K", faculty: 25 },
    { name: "Music", students: 220, majors: 4, research: "$300K", faculty: 18 },
    { name: "Philosophy", students: 150, majors: 2, research: "$200K", faculty: 15 },
    { name: "Political Science", students: 410, majors: 4, research: "$900K", faculty: 24 },
    { name: "Foreign Languages", students: 180, majors: 8, research: "$350K", faculty: 20 },
    { name: "Computer Science", students: 640, majors: 5, research: "$6.2M", faculty: 35 },
    { name: "Environmental Science", students: 320, majors: 3, research: "$2.9M", faculty: 22 },
    { name: "Anthropology", students: 180, majors: 3, research: "$750K", faculty: 16 }
  ];

  const researchCenters = [
    { name: "Center for Molecular Biology", focus: "Genomics & Proteomics", funding: "$8.5M" },
    { name: "Materials Science Institute", focus: "Nanotechnology Research", funding: "$12.2M" },
    { name: "Digital Humanities Lab", focus: "Technology & Literature", funding: "$1.8M" },
    { name: "Behavioral Research Center", focus: "Cognitive Psychology", funding: "$4.6M" },
    { name: "Environmental Research Station", focus: "Climate Change Studies", funding: "$6.1M" },
    { name: "Observatory & Planetarium", focus: "Astrophysics Research", funding: "$3.4M" },
    { name: "Archaeological Field School", focus: "Cultural Heritage", funding: "$950K" },
    { name: "Creative Writing Center", focus: "Literary Arts", funding: "$420K" }
  ];

  const programs = [
    { name: "Pre-Medical Track", type: "Undergraduate", students: 380, acceptance: "85%" },
    { name: "Pre-Law Track", type: "Undergraduate", students: 240, acceptance: "78%" },
    { name: "Honors Program", type: "Undergraduate", students: 450, gpa: "3.8+" },
    { name: "Study Abroad", type: "All Levels", students: 520, countries: "35+" },
    { name: "Research Scholars", type: "Undergraduate", students: 180, funded: "100%" },
    { name: "Internship Program", type: "All Levels", students: 680, placement: "92%" }
  ];

  return (
    <PageLayout 
      title="College of Arts & Sciences" 
      description="The heart of liberal education - fostering critical thinking, creativity, and discovery"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">6,510</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">16</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">75+</div>
              <div className="text-sm text-gray-600">Degree Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">$32M</div>
              <div className="text-sm text-gray-600">Research Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Liberal Arts</h2>
            <p className="text-gray-600 mb-6">
              The College of Arts & Sciences is the largest and most diverse college at NSCU, 
              serving as the intellectual heart of the university. Our 16 departments offer 
              comprehensive undergraduate and graduate programs that combine rigorous academic 
              training with hands-on research opportunities.
            </p>
            <p className="text-gray-600 mb-6">
              From the natural sciences to the humanities, from social sciences to creative arts, 
              our faculty and students explore the fundamental questions that shape our understanding 
              of the world. We prepare graduates who think critically, communicate effectively, 
              and contribute meaningfully to society.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm">Graduate School Acceptance</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">15:1</div>
                <div className="text-sm">Student-Faculty Ratio</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Study abroad programs in 35+ countries with faculty-led expeditions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Palette className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Creative Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Award-winning arts programs with state-of-the-art studios and performance spaces
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calculator className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">STEM Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Cutting-edge research facilities and industry partnerships in STEM fields
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
                    {program.gpa && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min GPA:</span>
                        <span className="font-semibold">{program.gpa}</span>
                      </div>
                    )}
                    {program.countries && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Countries:</span>
                        <span className="font-semibold">{program.countries}</span>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Success */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Student Success Outcomes</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <Languages className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Graduate School</h3>
              <p className="text-2xl font-bold text-uw-purple">94%</p>
              <p className="text-sm text-gray-600">Acceptance rate</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">National Awards</h3>
              <p className="text-2xl font-bold text-uw-purple">28</p>
              <p className="text-sm text-gray-600">In past 5 years</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Study Abroad</h3>
              <p className="text-2xl font-bold text-uw-purple">35%</p>
              <p className="text-sm text-gray-600">Students participate</p>
            </div>
            <div className="text-center">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Projects</h3>
              <p className="text-2xl font-bold text-uw-purple">450+</p>
              <p className="text-sm text-gray-600">Undergraduate projects</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Employment</h3>
              <p className="text-2xl font-bold text-uw-purple">96%</p>
              <p className="text-sm text-gray-600">Within 6 months</p>
            </div>
          </div>
        </div>

        {/* Alumni Impact */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">Making impact worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-lg">Nobel Laureates</div>
              <p className="text-sm opacity-90 mt-2">Among faculty and alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$125K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CollegeArtsSciences;
