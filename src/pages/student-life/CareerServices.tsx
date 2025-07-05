
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Award, TrendingUp } from 'lucide-react';

const CareerServices = () => {
  return (
    <PageLayout 
      title="Career Services" 
      description="Launch your career with comprehensive professional development support"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Career Success</h2>
            <p className="text-gray-600 mb-4">
              Our Career Services team provides comprehensive support to help you explore career 
              options, develop professional skills, and connect with employers. From resume writing 
              to interview preparation, we're here to help you succeed.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm">Employment Rate</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">$58K</div>
                <div className="text-sm">Average Starting Salary</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Briefcase className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Industry Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Partnerships with 500+ employers across all industries
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Career Fairs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  6 major career fairs annually with 200+ participating employers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Career Services</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Career Counseling</h3>
              <p className="text-sm text-gray-600">One-on-one career guidance</p>
            </div>
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Internship Program</h3>
              <p className="text-sm text-gray-600">Hands-on work experience</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Job Placement</h3>
              <p className="text-sm text-gray-600">Career placement assistance</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Alumni Network</h3>
              <p className="text-sm text-gray-600">85,000+ professional connections</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CareerServices;
