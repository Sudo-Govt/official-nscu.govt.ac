
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, Trophy, Activity } from 'lucide-react';

const CampusRecreation = () => {
  return (
    <PageLayout 
      title="Campus Recreation" 
      description="Stay active and healthy with our comprehensive recreation programs"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Stay Active</h2>
            <p className="text-gray-600 mb-4">
              Campus Recreation offers state-of-the-art fitness facilities, intramural sports, 
              group fitness classes, and outdoor adventures. Whether you're a fitness enthusiast 
              or just starting your wellness journey, we have something for you.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">120K</div>
                <div className="text-sm">sq ft Recreation Center</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">32</div>
                <div className="text-sm">Intramural Sports</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Dumbbell className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Fitness Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  200+ pieces of cardio and strength equipment
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Activity className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Group Fitness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  40+ classes weekly including yoga, spin, and dance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Recreation Programs</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Intramural Sports</h3>
              <p className="text-2xl font-bold text-uw-purple">4,500</p>
              <p className="text-sm text-gray-600">annual participants</p>
            </div>
            <div className="text-center">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Fitness Classes</h3>
              <p className="text-2xl font-bold text-uw-purple">850</p>
              <p className="text-sm text-gray-600">weekly attendance</p>
            </div>
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Outdoor Adventures</h3>
              <p className="text-2xl font-bold text-uw-purple">48</p>
              <p className="text-sm text-gray-600">trips annually</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Personal Training</h3>
              <p className="text-2xl font-bold text-uw-purple">15</p>
              <p className="text-sm text-gray-600">certified trainers</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CampusRecreation;
