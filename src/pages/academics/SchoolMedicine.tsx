
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Users, Award, BookOpen } from 'lucide-react';

const SchoolMedicine = () => {
  const programs = [
    { name: "Doctor of Medicine", type: "MD", students: 680, ranking: "#42 Research" },
    { name: "MD/PhD Program", type: "Dual Degree", students: 28, duration: "7-8 years" },
    { name: "MD/MPH Program", type: "Dual Degree", students: 35, duration: "5 years" },
    { name: "MD/MBA Program", type: "Dual Degree", students: 22, duration: "5 years" }
  ];

  const residencies = [
    { name: "Internal Medicine", positions: 45, match_rate: "98%" },
    { name: "Surgery", positions: 28, match_rate: "96%" },
    { name: "Pediatrics", positions: 32, match_rate: "100%" },
    { name: "Emergency Medicine", positions: 24, match_rate: "94%" },
    { name: "Orthopedic Surgery", positions: 12, match_rate: "92%" },
    { name: "Anesthesiology", positions: 18, match_rate: "97%" }
  ];

  return (
    <PageLayout 
      title="School of Medicine" 
      description="Training tomorrow's physicians through innovative medical education and groundbreaking research"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Medical Excellence</h2>
            <p className="text-gray-600 mb-4">
              The NSCU School of Medicine is committed to training compassionate, competent physicians 
              who will serve their communities with distinction. Our innovative curriculum integrates 
              cutting-edge medical science with hands-on clinical experience from day one.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">765</div>
                <div className="text-sm">Medical Students</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm">USMLE Step 1 Pass Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Stethoscope className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Clinical Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Early clinical exposure with 200+ clinical rotation sites nationwide
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">LCME Accredited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Full accreditation by the Liaison Committee on Medical Education
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Degree Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Degree Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {program.duration && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="font-semibold">{program.duration}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Residency Programs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Residency Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residencies.map((residency, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{residency.name}</CardTitle>
                  <CardDescription>Residency Program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Positions:</span>
                      <span className="font-semibold">{residency.positions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Match Rate:</span>
                      <span className="font-semibold text-green-600">{residency.match_rate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Research & Innovation */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Research & Innovation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Research Funding</h3>
              <p className="text-2xl font-bold text-uw-purple">$85M</p>
              <p className="text-sm text-gray-600">Annual research expenditures</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Clinical Trials</h3>
              <p className="text-2xl font-bold text-uw-purple">240+</p>
              <p className="text-sm text-gray-600">Active clinical research studies</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">NIH Funding</h3>
              <p className="text-2xl font-bold text-uw-purple">#38</p>
              <p className="text-sm text-gray-600">National ranking for NIH funding</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolMedicine;
