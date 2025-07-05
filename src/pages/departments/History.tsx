
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Globe, Clock, Map, Archive, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
  const facultyHighlights = [
    { name: "Dr. Elizabeth Warren", specialty: "American Civil War", awards: "Bancroft Prize Winner" },
    { name: "Dr. Ahmed Hassan", specialty: "Medieval Islamic History", awards: "MacArthur Fellow" },
    { name: "Dr. Maria Gonzalez", specialty: "Latin American History", awards: "OAS Distinguished Scholar" },
    { name: "Dr. Robert Kim", specialty: "East Asian History", awards: "Guggenheim Fellowship" }
  ];

  const programs = [
    { name: "Bachelor of Arts in History", students: 240, duration: "4 years", href: "/programs/bachelor-arts-history" },
    { name: "Master of Arts in History", students: 65, duration: "2 years", href: "/programs/master-arts-history" },
    { name: "Doctor of Philosophy in History", students: 35, duration: "5-7 years", href: "/programs/phd-history" },
    { name: "Certificate in Public History", students: 45, duration: "1 year", href: "/programs/certificate-public-history" },
    { name: "Certificate in Digital History", students: 28, duration: "1 year", href: "/programs/certificate-digital-history" }
  ];

  const researchAreas = [
    "Ancient Civilizations",
    "Medieval Studies",
    "American History",
    "European History",
    "World History",
    "Public History",
    "Digital History",
    "Military History"
  ];

  return (
    <PageLayout 
      title="Department of History" 
      description="Understanding the past to illuminate the present and future"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Department Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Historical Studies</h2>
            <p className="text-gray-600 mb-6">
              The Department of History offers comprehensive programs that explore human 
              civilization from ancient times to the present day. Our distinguished faculty 
              and innovative curriculum provide students with the analytical skills and 
              historical knowledge necessary for success in academia, public service, and beyond.
            </p>
            <p className="text-gray-600 mb-6">
              With strengths in both traditional historical scholarship and cutting-edge 
              digital history methods, our department prepares students to understand and 
              interpret the complexities of the human experience across cultures and time periods.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">340</div>
                <div className="text-sm">Total Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm">Faculty Members</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Clock className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Chronological Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  From ancient civilizations to contemporary global history
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Map className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Research and teaching spanning all continents and cultures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Archive className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Archive Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Partnerships with major archives and historical societies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Degree Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Degree Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Link key={index} to={program.href}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg text-uw-purple hover:text-uw-gold transition-colors">{program.name}</CardTitle>
                    <CardDescription>Duration: {program.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Students:</span>
                      <Badge variant="outline">{program.students}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Faculty Highlights */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Distinguished Faculty</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {facultyHighlights.map((faculty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{faculty.name}</CardTitle>
                  <CardDescription>{faculty.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-uw-gold" />
                    <span className="text-sm font-medium">{faculty.awards}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Research Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchAreas.map((area, index) => (
              <Card key={index} className="text-center p-4">
                <CardContent className="pt-0">
                  <Compass className="h-8 w-8 mx-auto mb-2 text-uw-purple" />
                  <p className="text-sm font-medium">{area}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Success */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Student Achievements</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Projects</h3>
              <p className="text-2xl font-bold text-uw-purple">85</p>
              <p className="text-sm text-gray-600">Undergraduate projects</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Study Abroad</h3>
              <p className="text-2xl font-bold text-uw-purple">40%</p>
              <p className="text-sm text-gray-600">Students participate</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Graduate School</h3>
              <p className="text-2xl font-bold text-uw-purple">88%</p>
              <p className="text-sm text-gray-600">Acceptance rate</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Honors Students</h3>
              <p className="text-2xl font-bold text-uw-purple">65</p>
              <p className="text-sm text-gray-600">Phi Beta Kappa</p>
            </div>
          </div>
        </div>

        {/* Alumni Success */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4,800+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">In education, government, and research</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-lg">Museum Directors</div>
              <p className="text-sm opacity-90 mt-2">Leading major institutions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$82K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default History;
