
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Award, BookOpen } from 'lucide-react';

const CollegeHealthSciences = () => {
  const programs = [
    { name: "Nursing", type: "BSN/MSN/DNP", students: 1450, ranking: "#28 Nationally" },
    { name: "Physical Therapy", type: "DPT", students: 180, ranking: "#15 Nationally" },
    { name: "Occupational Therapy", type: "MSOT", students: 120, ranking: "#22 Nationally" },
    { name: "Public Health", type: "MPH/DrPH", students: 380, ranking: "#35 Nationally" },
    { name: "Health Administration", type: "MHA", students: 220, students_employed: "96%" },
    { name: "Speech-Language Pathology", type: "MS-SLP", students: 85, ranking: "#18 Nationally" }
  ];

  return (
    <PageLayout 
      title="College of Health Sciences" 
      description="Advancing health and wellness through innovative education, research, and community service"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Excellence in Health Education</h2>
            <p className="text-gray-600 mb-4">
              The College of Health Sciences at NSCU is dedicated to preparing healthcare professionals 
              who will lead in their fields and make meaningful contributions to health and wellness. 
              Our programs combine rigorous academic preparation with extensive clinical experience.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">2,435</div>
                <div className="text-sm">Health Sciences Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm">NCLEX Pass Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Heart className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Clinical Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  150+ clinical sites including major medical centers and community health organizations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Accreditations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  All programs fully accredited by respective professional organizations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Academic Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {program.ranking && (
                      <Badge variant="secondary">{program.ranking}</Badge>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students:</span>
                      <span className="font-semibold">{program.students}</span>
                    </div>
                    {program.students_employed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Employment:</span>
                        <span className="font-semibold">{program.students_employed}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Excellence */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Clinical Excellence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Clinical Hours</h3>
              <p className="text-2xl font-bold text-uw-purple">50,000+</p>
              <p className="text-sm text-gray-600">Annual clinical hours completed</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Simulation Labs</h3>
              <p className="text-2xl font-bold text-uw-purple">12</p>
              <p className="text-sm text-gray-600">State-of-the-art simulation facilities</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patient Care</h3>
              <p className="text-2xl font-bold text-uw-purple">1M+</p>
              <p className="text-sm text-gray-600">Lives impacted by our graduates</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CollegeHealthSciences;
