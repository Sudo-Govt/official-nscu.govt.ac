
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, Users, Award, Globe, Dna, Leaf, Heart, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

const Biology = () => {
  const facultyHighlights = [
    { name: "Dr. Jennifer Liu", specialty: "Molecular Biology", awards: "NIH Early Career Award" },
    { name: "Dr. Carlos Martinez", specialty: "Marine Biology", awards: "National Science Foundation Fellow" },
    { name: "Dr. Amanda Foster", specialty: "Genetics", awards: "Pew Scholar in Biomedical Sciences" },
    { name: "Dr. David Park", specialty: "Ecology", awards: "MacArthur Fellow" }
  ];

  const programs = [
    { name: "Bachelor of Science in Biology", students: 650, duration: "4 years", href: "/programs/bachelor-science-biology" },
    { name: "Bachelor of Science in Marine Biology", students: 120, duration: "4 years", href: "/programs/bachelor-science-marine-biology" },
    { name: "Bachelor of Science in Genetics", students: 80, duration: "4 years", href: "/programs/bachelor-science-genetics" },
    { name: "Master of Science in Biology", students: 85, duration: "2 years", href: "/programs/master-science-biology" },
    { name: "Doctor of Philosophy in Biology", students: 95, duration: "5-7 years", href: "/programs/phd-biology" },
    { name: "Pre-Med Track", students: 200, duration: "4 years", href: "/programs/pre-med-track" }
  ];

  const researchAreas = [
    "Molecular Biology",
    "Cell Biology",
    "Genetics",
    "Ecology",
    "Marine Biology",
    "Microbiology",
    "Biotechnology",
    "Conservation Biology"
  ];

  return (
    <PageLayout 
      title="Department of Biology" 
      description="Exploring life from molecules to ecosystems"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Department Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Biological Sciences</h2>
            <p className="text-gray-600 mb-6">
              The Department of Biology is at the forefront of biological research and education, 
              offering comprehensive programs that span from molecular biology to ecosystem ecology. 
              Our world-class faculty and state-of-the-art facilities provide students with 
              unparalleled opportunities for discovery and learning.
            </p>
            <p className="text-gray-600 mb-6">
              With strong emphasis on both theoretical knowledge and hands-on research experience, 
              our programs prepare students for careers in medicine, research, biotechnology, 
              environmental science, and education.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">850</div>
                <div className="text-sm">Total Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">45</div>
                <div className="text-sm">Faculty Members</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Microscope className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  State-of-the-art labs with cutting-edge equipment and technology
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Dna className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Genomics Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Advanced DNA sequencing and bioinformatics capabilities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Leaf className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Field Stations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Multiple research stations for ecological and marine studies
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
                  <Bug className="h-8 w-8 mx-auto mb-2 text-uw-purple" />
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
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Medical School</h3>
              <p className="text-2xl font-bold text-uw-purple">95%</p>
              <p className="text-sm text-gray-600">Acceptance rate</p>
            </div>
            <div className="text-center">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Projects</h3>
              <p className="text-2xl font-bold text-uw-purple">320</p>
              <p className="text-sm text-gray-600">Undergraduate projects</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-2xl font-bold text-uw-purple">180</p>
              <p className="text-sm text-gray-600">Student co-authored</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Internships</h3>
              <p className="text-2xl font-bold text-uw-purple">75%</p>
              <p className="text-sm text-gray-600">Complete internships</p>
            </div>
          </div>
        </div>

        {/* Alumni Success */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-lg">Living Alumni</div>
              <p className="text-sm opacity-90 mt-2">In medicine, research, and biotechnology</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">250</div>
              <div className="text-lg">MDs and PhDs</div>
              <p className="text-sm opacity-90 mt-2">Graduated in past 5 years</p>
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

export default Biology;
