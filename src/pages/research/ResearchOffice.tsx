
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, Users, Award, DollarSign } from 'lucide-react';

const ResearchOffice = () => {
  return (
    <PageLayout 
      title="Office of Research" 
      description="Advancing knowledge through innovative research and scholarly activity"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Research Excellence</h2>
            <p className="text-gray-600 mb-4">
              The Office of Research supports faculty and student researchers in pursuing 
              groundbreaking discoveries that address global challenges. From basic science 
              to applied research, we foster innovation across all disciplines.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">$125M</div>
                <div className="text-sm">Annual Research Volume</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">450+</div>
                <div className="text-sm">Active Research Projects</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Microscope className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  18 specialized research centers and institutes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">National Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  R1 Carnegie Classification for highest research activity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Research Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Federal Funding</h3>
              <p className="text-2xl font-bold text-uw-purple">$78M</p>
              <p className="text-sm text-gray-600">NSF, NIH, DOE grants</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Student Researchers</h3>
              <p className="text-2xl font-bold text-uw-purple">1,200</p>
              <p className="text-sm text-gray-600">undergrad & graduate</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-2xl font-bold text-uw-purple">2,850</p>
              <p className="text-sm text-gray-600">peer-reviewed annually</p>
            </div>
            <div className="text-center">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Patents</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">filed annually</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResearchOffice;
