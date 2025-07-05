
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Globe, Pen, Book, GraduationCap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const EnglishLiterature = () => {
  const facultyHighlights = [
    { name: "Dr. Margaret Thompson", specialty: "Victorian Literature", awards: "Pulitzer Prize Nominee" },
    { name: "Dr. James Rodriguez", specialty: "Contemporary Fiction", awards: "National Book Award Winner" },
    { name: "Dr. Sarah Chen", specialty: "Comparative Literature", awards: "Fulbright Scholar" },
    { name: "Dr. Michael Brown", specialty: "Poetry & Creative Writing", awards: "Poet Laureate" }
  ];

  const programs = [
    { name: "Bachelor of Arts in English", students: 320, duration: "4 years", href: "/programs/bachelor-arts-english" },
    { name: "Master of Fine Arts in Creative Writing", students: 85, duration: "2 years", href: "/programs/mfa-creative-writing" },
    { name: "Master of Arts in Literature", students: 65, duration: "2 years", href: "/programs/master-arts-literature" },
    { name: "Doctor of Philosophy in English", students: 45, duration: "5-7 years", href: "/programs/phd-english" },
    { name: "Certificate in Technical Writing", students: 120, duration: "1 year", href: "/programs/certificate-technical-writing" },
    { name: "Certificate in Literary Translation", students: 35, duration: "1 year", href: "/programs/certificate-literary-translation" }
  ];

  const researchAreas = [
    "Victorian and Edwardian Literature",
    "Modern and Contemporary Fiction",
    "Poetry and Poetics",
    "Comparative Literature",
    "Digital Humanities",
    "Literary Theory and Criticism",
    "Creative Writing",
    "Technical and Professional Writing"
  ];

  return (
    <PageLayout 
      title="Department of English & Literature" 
      description="Exploring the power of language, literature, and creative expression"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Department Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Literary Studies</h2>
            <p className="text-gray-600 mb-6">
              The Department of English & Literature is home to renowned scholars and award-winning 
              writers who are dedicated to the study and creation of literature. Our programs 
              combine rigorous academic training with creative practice, preparing students for 
              careers in education, publishing, writing, and beyond.
            </p>
            <p className="text-gray-600 mb-6">
              With a focus on both traditional literary scholarship and innovative approaches 
              to digital humanities, our department offers comprehensive programs that explore 
              literature from multiple perspectives and time periods.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">520</div>
                <div className="text-sm">Total Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm">Faculty Members</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  8 major research areas from Victorian literature to digital humanities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Pen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Creative Writing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  MFA program ranked among top 25 in the nation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Perspectives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Study abroad programs and international literary exchanges
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
                    <Star className="h-4 w-4 mr-2 text-uw-gold" />
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
                  <Book className="h-8 w-8 mx-auto mb-2 text-uw-purple" />
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
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-2xl font-bold text-uw-purple">150+</p>
              <p className="text-sm text-gray-600">Student works published</p>
            </div>
            <div className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Graduate School</h3>
              <p className="text-2xl font-bold text-uw-purple">95%</p>
              <p className="text-sm text-gray-600">Acceptance rate</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Employment</h3>
              <p className="text-2xl font-bold text-uw-purple">92%</p>
              <p className="text-sm text-gray-600">Within 6 months</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Awards</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">In past 3 years</p>
            </div>
          </div>
        </div>

        {/* Alumni Success */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5,200+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">In literary and academic fields</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-lg">Pulitzer Winners</div>
              <p className="text-sm opacity-90 mt-2">Among faculty and alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$75K</div>
              <div className="text-lg">Average Mid-Career Salary</div>
              <p className="text-sm opacity-90 mt-2">10 years post-graduation</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EnglishLiterature;
