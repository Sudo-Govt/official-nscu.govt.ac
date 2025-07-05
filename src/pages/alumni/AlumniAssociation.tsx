
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Award, Globe } from 'lucide-react';

const AlumniAssociation = () => {
  return (
    <PageLayout 
      title="Alumni Association" 
      description="Connecting Wolfpack alumni worldwide for life"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Wolfpack for Life</h2>
            <p className="text-gray-600 mb-4">
              The NSCU Alumni Association connects our 185,000+ graduates worldwide, providing 
              networking opportunities, professional development, and ways to give back to the 
              university that shaped their futures.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">185K+</div>
                <div className="text-sm">Living Alumni</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">50</div>
                <div className="text-sm">States & Countries</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Alumni Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  45 active chapters across the United States and internationally
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Heart className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Annual Giving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  $12.5M contributed annually by alumni supporters
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Alumni Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Distinguished Alumni</h3>
              <p className="text-2xl font-bold text-uw-purple">25</p>
              <p className="text-sm text-gray-600">honored annually</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Mentorship Program</h3>
              <p className="text-2xl font-bold text-uw-purple">2,500</p>
              <p className="text-sm text-gray-600">active mentors</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Global Network</h3>
              <p className="text-2xl font-bold text-uw-purple">85</p>
              <p className="text-sm text-gray-600">countries represented</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Volunteer Hours</h3>
              <p className="text-2xl font-bold text-uw-purple">45K</p>
              <p className="text-sm text-gray-600">contributed annually</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AlumniAssociation;
