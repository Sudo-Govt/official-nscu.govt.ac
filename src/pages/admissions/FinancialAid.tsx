
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Award, Calendar } from 'lucide-react';

const FinancialAid = () => {
  return (
    <PageLayout 
      title="Financial Aid" 
      description="Making higher education affordable through comprehensive financial assistance"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Affordable Education</h2>
            <p className="text-gray-600 mb-4">
              NSCU is committed to making quality education accessible to all students. Our 
              comprehensive financial aid program includes scholarships, grants, work-study 
              opportunities, and low-interest loans to help you achieve your educational goals.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">$85M</div>
                <div className="text-sm">Aid Awarded Annually</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">78%</div>
                <div className="text-sm">Students Receive Aid</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <DollarSign className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Average Aid Package</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  $15,200 average financial aid per student
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Merit Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Renewable scholarships up to full tuition available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Financial Aid Options</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Scholarships</h3>
              <p className="text-2xl font-bold text-uw-purple">$25M</p>
              <p className="text-sm text-gray-600">awarded annually</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Federal Grants</h3>
              <p className="text-2xl font-bold text-uw-purple">$18M</p>
              <p className="text-sm text-gray-600">Pell and SEOG grants</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Work-Study</h3>
              <p className="text-2xl font-bold text-uw-purple">1,200</p>
              <p className="text-sm text-gray-600">student positions</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Student Loans</h3>
              <p className="text-2xl font-bold text-uw-purple">3.73%</p>
              <p className="text-sm text-gray-600">average interest rate</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FinancialAid;
