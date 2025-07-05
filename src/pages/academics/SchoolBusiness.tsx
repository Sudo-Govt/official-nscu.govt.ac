
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Building, Users, Globe } from 'lucide-react';

const SchoolBusiness = () => {
  const programs = [
    { name: "MBA Program", type: "Graduate", ranking: "#45 Nationally" },
    { name: "Business Administration", type: "Undergraduate", students: 1200 },
    { name: "Finance", type: "Undergraduate", students: 680 },
    { name: "Marketing", type: "Undergraduate", students: 550 },
    { name: "Management", type: "Undergraduate", students: 480 },
    { name: "Accounting", type: "Undergraduate", students: 720 }
  ];

  return (
    <PageLayout 
      title="School of Business" 
      description="Preparing future business leaders with innovative programs and real-world experience"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Business Excellence</h2>
            <p className="text-gray-600 mb-4">
              The School of Business at NSCU is AACSB accredited and recognized for its innovative 
              curriculum, experienced faculty, and strong industry connections. Our programs blend 
              theoretical knowledge with practical application to prepare students for successful careers.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">3,630</div>
                <div className="text-sm">Business Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm">Employment Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Building className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">AACSB Accredited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Top 5% of business schools worldwide with AACSB accreditation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Study abroad programs in 25+ countries
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
                  <CardDescription>{program.type} Program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {program.ranking && (
                      <Badge variant="secondary">{program.ranking}</Badge>
                    )}
                    {program.students && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Students:</span>
                        <span className="font-semibold">{program.students}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Success */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Career Success</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Average Starting Salary</h3>
              <p className="text-2xl font-bold text-uw-purple">$68,500</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Corporate Partners</h3>
              <p className="text-2xl font-bold text-uw-purple">200+</p>
            </div>
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Fortune 500 Placements</h3>
              <p className="text-2xl font-bold text-uw-purple">35%</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolBusiness;
