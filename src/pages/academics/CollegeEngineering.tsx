
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cog, Cpu, Zap, Wrench } from 'lucide-react';

const CollegeEngineering = () => {
  const departments = [
    { name: "Mechanical Engineering", students: 680, accreditation: "ABET" },
    { name: "Electrical Engineering", students: 720, accreditation: "ABET" },
    { name: "Computer Engineering", students: 890, accreditation: "ABET" },
    { name: "Civil Engineering", students: 540, accreditation: "ABET" },
    { name: "Chemical Engineering", students: 420, accreditation: "ABET" },
    { name: "Aerospace Engineering", students: 380, accreditation: "ABET" }
  ];

  const researchCenters = [
    "Advanced Materials Research Center",
    "Robotics and Automation Lab",
    "Renewable Energy Institute",
    "Cybersecurity Research Center",
    "Biomedical Engineering Lab",
    "Transportation Research Institute"
  ];

  return (
    <PageLayout 
      title="College of Engineering" 
      description="Innovating solutions for tomorrow's challenges through cutting-edge engineering education"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Engineering Excellence</h2>
            <p className="text-gray-600 mb-4">
              The College of Engineering at NSCU is recognized nationally for its innovative programs, 
              cutting-edge research, and industry partnerships. Our graduates are leaders in technology, 
              entrepreneurship, and engineering practice.
            </p>
            <p className="text-gray-600 mb-6">
              With state-of-the-art laboratories, world-class faculty, and strong industry connections, 
              we prepare students to tackle the engineering challenges of the 21st century.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">3,630</div>
                <div className="text-sm">Engineering Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Job Placement Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Cog className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">ABET Accreditation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">
                  All engineering programs are ABET accredited
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Zap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Funding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$25M</div>
                <p className="text-xs text-muted-foreground">
                  Annual research expenditures across all departments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Engineering Departments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription>ABET Accredited Program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students:</span>
                      <span className="font-semibold">{dept.students}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dept.accreditation} Accredited
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research Centers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Research & Innovation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Research Centers</h3>
              <div className="space-y-2">
                {researchCenters.map((center, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Cpu className="h-5 w-5 mr-3 text-uw-purple" />
                    <span>{center}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Innovation Highlights</h3>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-uw-purple bg-gray-50">
                  <h4 className="font-semibold">Industry Partnerships</h4>
                  <p className="text-sm text-gray-600">Collaborations with 150+ companies including Fortune 500 corporations</p>
                </div>
                <div className="p-4 border-l-4 border-uw-gold bg-gray-50">
                  <h4 className="font-semibold">Startup Incubator</h4>
                  <p className="text-sm text-gray-600">25+ student and faculty startups launched in the past 5 years</p>
                </div>
                <div className="p-4 border-l-4 border-uw-purple bg-gray-50">
                  <h4 className="font-semibold">Patent Portfolio</h4>
                  <p className="text-sm text-gray-600">Over 200 patents filed by faculty and students</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">World-Class Facilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Wrench className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Maker Spaces</h3>
              <p className="text-sm text-gray-600">Advanced prototyping and fabrication facilities</p>
            </div>
            <div className="text-center">
              <Cpu className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Computing Labs</h3>
              <p className="text-sm text-gray-600">High-performance computing clusters and specialized software</p>
            </div>
            <div className="text-center">
              <Cog className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Testing Labs</h3>
              <p className="text-sm text-gray-600">Materials testing and quality assurance facilities</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Clean Rooms</h3>
              <p className="text-sm text-gray-600">Semiconductor and nanotechnology research spaces</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CollegeEngineering;
