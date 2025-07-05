
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Calendar, FileText } from 'lucide-react';

const GraduateAdmissions = () => {
  const programs = [
    { name: "Master's Programs", count: 45, gre_required: "Most programs" },
    { name: "Doctoral Programs", count: 28, gre_required: "All programs" },
    { name: "Professional Programs", count: 12, gre_required: "Select programs" },
    { name: "Certificate Programs", count: 18, gre_required: "None" }
  ];

  const deadlines = [
    { program: "Fall PhD Programs", deadline: "December 1", funding: "Priority" },
    { program: "Fall Master's Programs", deadline: "February 1", funding: "Regular" },
    { program: "Spring Admission", deadline: "October 1", funding: "Limited" },
    { program: "Summer Admission", deadline: "March 1", funding: "Limited" }
  ];

  return (
    <PageLayout 
      title="Graduate Admissions" 
      description="Advance your career with graduate education at NSCU"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Graduate Education</h2>
            <p className="text-gray-600 mb-4">
              Take the next step in your academic and professional journey with graduate study at NSCU. 
              Our comprehensive graduate programs are designed to develop leaders, innovators, and scholars 
              in their respective fields.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">103</div>
                <div className="text-sm">Graduate Programs</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">4,200</div>
                <div className="text-sm">Graduate Students</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  High-impact research opportunities with world-class faculty
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Small Class Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Average graduate seminar size of 12 students
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Program Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Program Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.count} programs available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GRE:</span>
                      <Badge variant={program.gre_required === "All programs" ? "destructive" : 
                                   program.gre_required === "None" ? "secondary" : "default"}>
                        {program.gre_required}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Deadlines */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Application Deadlines</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deadlines.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{item.program}</CardTitle>
                  <CardDescription>Application Deadline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-uw-purple">{item.deadline}</div>
                    </div>
                    <Badge variant="outline" className="w-full justify-center">
                      {item.funding} Funding
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admission Requirements */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">General Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Bachelor's Degree</h3>
              <p className="text-sm text-gray-600">From regionally accredited institution</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">GPA Requirement</h3>
              <p className="text-sm text-gray-600">Minimum 3.0 overall GPA</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Letters of Recommendation</h3>
              <p className="text-sm text-gray-600">3 academic/professional references</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GraduateAdmissions;
