
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Users, Award } from 'lucide-react';

const GiveBack = () => {
  return (
    <PageLayout 
      title="Give Back" 
      description="Support the next generation of Wolfpack leaders"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Make an Impact</h2>
            <p className="text-gray-600 mb-4">
              Your generosity helps NSCU continue its mission of excellence in education, 
              research, and service. Whether through financial gifts, volunteer time, or 
              mentorship, your support makes a lasting difference.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">$45M</div>
                <div className="text-sm">Raised This Year</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">35%</div>
                <div className="text-sm">Alumni Participation</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Heart className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Student Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  2,500+ students receive alumni-funded scholarships annually
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Research Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Alumni gifts fund cutting-edge research and innovation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Ways to Give</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Annual Fund</h3>
              <p className="text-sm text-gray-600">Support immediate university needs</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Endowed Scholarships</h3>
              <p className="text-sm text-gray-600">Create lasting student support</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Capital Projects</h3>
              <p className="text-sm text-gray-600">Fund new facilities and equipment</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Planned Giving</h3>
              <p className="text-sm text-gray-600">Leave a legacy through estate planning</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GiveBack;
