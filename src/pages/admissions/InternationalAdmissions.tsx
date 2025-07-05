
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, FileText, Award } from 'lucide-react';

const InternationalAdmissions = () => {
  const countries = [
    { name: "China", students: 450 },
    { name: "India", students: 380 },
    { name: "South Korea", students: 220 },
    { name: "Saudi Arabia", students: 185 },
    { name: "Brazil", students: 160 },
    { name: "Nigeria", students: 145 }
  ];

  const requirements = [
    { 
      category: "English Proficiency", 
      tests: ["IELTS 6.5", "TOEFL 80", "Duolingo 110"], 
      required: true 
    },
    { 
      category: "Academic Records", 
      tests: ["Official Transcripts", "WES Evaluation"], 
      required: true 
    },
    { 
      category: "Standardized Tests", 
      tests: ["SAT/ACT (Undergrad)", "GRE/GMAT (Grad)"], 
      required: false 
    },
    { 
      category: "Financial Documentation", 
      tests: ["Bank Statements", "Sponsor Affidavit"], 
      required: true 
    }
  ];

  return (
    <PageLayout 
      title="International Admissions" 
      description="Join our global community of scholars from around the world"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Global Excellence</h2>
            <p className="text-gray-600 mb-4">
              NSCU welcomes international students from around the world. Our diverse community 
              of global scholars enriches the academic experience for all students and contributes 
              to groundbreaking research and innovation.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">1,540</div>
                <div className="text-sm">International Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">85</div>
                <div className="text-sm">Countries Represented</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Global Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Consistently ranked among top universities for international student satisfaction
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">SEVIS Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Authorized to enroll F-1 and J-1 international students
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Countries */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">International Student Body</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{country.name}</CardTitle>
                  <CardDescription>Students enrolled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-uw-purple">{country.students}</span>
                    <p className="text-sm text-gray-600">current students</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admission Requirements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Admission Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {requirements.map((req, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {req.category}
                    {req.required && <Badge variant="destructive">Required</Badge>}
                    {!req.required && <Badge variant="secondary">Optional</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {req.tests.map((test, testIndex) => (
                      <div key={testIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-uw-purple rounded-full mr-3"></div>
                        <span className="text-sm">{test}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Services */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">International Student Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Visa Support</h3>
              <p className="text-sm text-gray-600">I-20 and DS-2019 processing assistance</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Orientation Program</h3>
              <p className="text-sm text-gray-600">Comprehensive arrival and academic orientation</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Cultural Programs</h3>
              <p className="text-sm text-gray-600">Events celebrating diversity and culture</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default InternationalAdmissions;
