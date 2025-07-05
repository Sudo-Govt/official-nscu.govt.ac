import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Globe, Palette, Music, Pen, Languages, Theater, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolArts = () => {
  const departments = [
    { name: "English & Literature", students: 520, majors: 7, research: "$800K", faculty: 42, href: "/departments/english-literature" },
    { name: "History", students: 340, majors: 5, research: "$650K", faculty: 28, href: "/departments/history" },
    { name: "Philosophy", students: 150, majors: 2, research: "$200K", faculty: 15, href: "/departments/philosophy" },
    { name: "Political Science", students: 410, majors: 4, research: "$900K", faculty: 24, href: "/departments/political-science" },
    { name: "Foreign Languages", students: 180, majors: 8, research: "$350K", faculty: 20, href: "/departments/foreign-languages" },
    { name: "Art & Design", students: 380, majors: 6, research: "$400K", faculty: 25, href: "/departments/art-design" },
    { name: "Music", students: 220, majors: 4, research: "$300K", faculty: 18, href: "/departments/music" },
    { name: "Theater Arts", students: 185, majors: 3, research: "$250K", faculty: 16, href: "/departments/theater-arts" },
    { name: "Creative Writing", students: 140, majors: 2, research: "$180K", faculty: 12, href: "/departments/creative-writing" },
    { name: "Film Studies", students: 165, majors: 3, research: "$220K", faculty: 14, href: "/departments/film-studies" },
    { name: "Anthropology", students: 180, majors: 3, research: "$750K", faculty: 16, href: "/departments/anthropology" },
    { name: "Sociology", students: 290, majors: 3, research: "$1.2M", faculty: 22, href: "/departments/sociology" }
  ];

  const researchCenters = [
    { name: "Digital Humanities Lab", focus: "Technology & Literature", funding: "$1.8M" },
    { name: "Creative Writing Center", focus: "Literary Arts", funding: "$420K" },
    { name: "Archaeological Field School", focus: "Cultural Heritage", funding: "$950K" },
    { name: "Visual Arts Studio", focus: "Contemporary Art", funding: "$650K" },
    { name: "Music Performance Center", focus: "Classical & Contemporary Music", funding: "$580K" },
    { name: "Theater Research Lab", focus: "Performance Studies", funding: "$390K" },
    { name: "Language Learning Center", focus: "Multilingual Education", funding: "$720K" },
    { name: "Cultural Studies Institute", focus: "Social & Cultural Analysis", funding: "$840K" }
  ];

  const programs = [
    { name: "Pre-Law Track", type: "Undergraduate", students: 240, acceptance: "78%" },
    { name: "Honors Program", type: "Undergraduate", students: 220, gpa: "3.8+" },
    { name: "Study Abroad", type: "All Levels", students: 285, countries: "25+" },
    { name: "Creative Arts Fellowship", type: "Graduate", students: 45, funded: "100%" },
    { name: "Museum Studies", type: "Graduate", students: 35, placement: "95%" },
    { name: "Digital Media Production", type: "All Levels", students: 160, industry: "90%" }
  ];

  return (
    <PageLayout 
      title="School of Arts" 
      description="Nurturing creativity, critical thinking, and cultural understanding through humanities and fine arts"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">3,160</div>
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
              <div className="text-3xl font-bold text-uw-purple">50+</div>
              <div className="text-sm text-gray-600">Degree Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Palette className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">$6.3M</div>
              <div className="text-sm text-gray-600">Research Funding</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Arts & Humanities</h2>
            <p className="text-gray-600 mb-6">
              The School of Arts is dedicated to fostering creativity, critical thinking, and cultural 
              understanding through comprehensive programs in the humanities and fine arts. Our faculty 
              and students explore human expression, cultural heritage, and artistic innovation across 
              diverse mediums and traditions.
            </p>
            <p className="text-gray-600 mb-6">
              From classical literature to contemporary digital media, from ancient history to modern 
              political thought, our programs prepare students for careers in education, creative 
              industries, public service, and beyond while cultivating the analytical and 
              communication skills essential for success in any field.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm">Graduate Success Rate</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">14:1</div>
                <div className="text-sm">Student-Faculty Ratio</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Perspectives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Study abroad programs and international partnerships across 25+ countries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Theater className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Creative Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  State-of-the-art studios, theaters, and performance spaces for artistic expression
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Languages className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Language Diversity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Programs in 12+ languages with immersive learning opportunities
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
              <Link key={index} to={dept.href}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-uw-purple hover:text-uw-gold transition-colors">{dept.name}</CardTitle>
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
              </Link>
            ))}
          </div>
        </div>

        {/* Research Centers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Research Centers & Creative Labs</h2>
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
                    {program.industry && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Industry Rate:</span>
                        <span className="font-semibold text-green-600">{program.industry}</span>
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
          <h2 className="text-3xl font-bold mb-6">Creative & Academic Excellence</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <Pen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-2xl font-bold text-uw-purple">350+</p>
              <p className="text-sm text-gray-600">Student works published</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Creative Awards</h3>
              <p className="text-2xl font-bold text-uw-purple">125</p>
              <p className="text-sm text-gray-600">In past 3 years</p>
            </div>
            <div className="text-center">
              <Theater className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Performances</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">Annual productions</p>
            </div>
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Exhibitions</h3>
              <p className="text-2xl font-bold text-uw-purple">30+</p>
              <p className="text-sm text-gray-600">Student art shows</p>
            </div>
            <div className="text-center">
              <Languages className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Languages</h3>
              <p className="text-2xl font-bold text-uw-purple">12</p>
              <p className="text-sm text-gray-600">Languages offered</p>
            </div>
          </div>
        </div>

        {/* Alumni Impact */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12,000+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">In creative and academic fields</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-lg">Pulitzer Winners</div>
              <p className="text-sm opacity-90 mt-2">Among faculty and alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$95K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolArts;
