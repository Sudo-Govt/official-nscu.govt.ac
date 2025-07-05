
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Shield, BookOpen, Award, Globe, HandHeart, Home } from 'lucide-react';

const SchoolSocialWork = () => {
  const programs = [
    { name: "Master of Social Work", type: "MSW", students: 350, specialization: "Clinical Practice", duration: "2 years" },
    { name: "Bachelor of Social Work", type: "BSW", students: 280, specialization: "Generalist Practice", duration: "4 years" },
    { name: "PhD in Social Work", type: "PhD", students: 45, specialization: "Research & Policy", duration: "5 years" },
    { name: "Advanced Standing MSW", type: "MSW", students: 120, specialization: "Advanced Clinical", duration: "1 year" },
    { name: "School Social Work", type: "Certificate", students: 85, specialization: "Educational Settings", duration: "1 year" },
    { name: "Addiction Counseling", type: "Certificate", students: 75, specialization: "Substance Abuse", duration: "1 year" }
  ];

  const practiceAreas = [
    { area: "Mental Health", placements: 45, description: "Clinical treatment and therapy" },
    { area: "Child Welfare", placements: 38, description: "Family preservation and protection" },
    { area: "Healthcare", placements: 32, description: "Medical social work practice" },
    { area: "School Systems", placements: 28, description: "Educational support services" },
    { area: "Community Development", placements: 25, description: "Neighborhood empowerment" },
    { area: "Aging Services", placements: 22, description: "Geriatric care coordination" },
    { area: "Criminal Justice", placements: 18, description: "Rehabilitation and reentry" },
    { area: "Substance Abuse", placements: 20, description: "Addiction treatment programs" }
  ];

  return (
    <PageLayout 
      title="School of Social Work" 
      description="Empowering social change through education, research, and community service"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">955</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">98%</div>
              <div className="text-sm text-gray-600">Employment Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">#12</div>
              <div className="text-sm text-gray-600">National Ranking</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <HandHeart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <div className="text-3xl font-bold text-uw-purple">180</div>
              <div className="text-sm text-gray-600">Field Placements</div>
            </CardContent>
          </Card>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Social Justice in Action</h2>
            <p className="text-gray-600 mb-6">
              The School of Social Work at NSCU is committed to advancing social justice, human rights, 
              and social change. Our programs are designed to prepare competent, ethical professionals 
              who can address complex social problems and promote well-being for individuals, families, 
              and communities.
            </p>
            <p className="text-gray-600 mb-6">
              With CSWE accreditation and a strong commitment to diversity, equity, and inclusion, 
              we provide students with the knowledge, skills, and values necessary to become effective 
              social work practitioners, researchers, and leaders.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-uw-purple mr-3" />
                <span>CSWE Accredited Programs</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-uw-purple mr-3" />
                <span>International Field Opportunities</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-uw-purple mr-3" />
                <span>Evidence-Based Practice Focus</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Our students complete over 50,000 hours of community service annually through 
                  field education and volunteer opportunities.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-uw-light rounded">
                    <div className="font-bold text-uw-purple">50K+</div>
                    <div className="text-xs">Service Hours</div>
                  </div>
                  <div className="text-center p-3 bg-uw-light rounded">
                    <div className="font-bold text-uw-purple">85</div>
                    <div className="text-xs">Partner Agencies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Research Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Faculty and students engage in cutting-edge research addressing social inequities, 
                  mental health, child welfare, and community development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Academic Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.type} Program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Students:</span>
                      <span className="font-semibold">{program.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Focus:</span>
                      <span className="font-semibold text-sm">{program.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">{program.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Practice Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Field Practice Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{area.area}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Placements:</span>
                    <Badge variant="outline">{area.placements}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Field Education */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Field Education Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Agency Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">150+</p>
              <p className="text-sm text-gray-600">Community organizations</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Field Instructors</h3>
              <p className="text-2xl font-bold text-uw-purple">200+</p>
              <p className="text-sm text-gray-600">Experienced practitioners</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">International Sites</h3>
              <p className="text-2xl font-bold text-uw-purple">12</p>
              <p className="text-sm text-gray-600">Countries with placements</p>
            </div>
          </div>
        </div>

        {/* Alumni Success */}
        <div className="bg-uw-purple text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">8,500+</div>
              <div className="text-lg">Graduates</div>
              <p className="text-sm opacity-90">Making a difference worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">75%</div>
              <div className="text-lg">In Leadership</div>
              <p className="text-sm opacity-90">Executive or supervisory roles</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$68K</div>
              <div className="text-lg">Average Salary</div>
              <p className="text-sm opacity-90">Starting social worker salary</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-lg">Pass Rate</div>
              <p className="text-sm opacity-90">Social work licensing exam</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolSocialWork;
