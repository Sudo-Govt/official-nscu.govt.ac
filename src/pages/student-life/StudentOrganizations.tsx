
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Heart, BookOpen } from 'lucide-react';

const StudentOrganizations = () => {
  return (
    <PageLayout 
      title="Student Organizations" 
      description="Get involved and make lifelong connections through campus organizations"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <p className="text-gray-600 mb-4">
              With over 350 student organizations, there's something for everyone at NSCU. From 
              academic clubs to recreational groups, Greek life to volunteer organizations, 
              you'll find your community and develop leadership skills.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">350+</div>
                <div className="text-sm">Student Organizations</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm">Students Involved</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Leadership Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Leadership training programs and officer development workshops
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Heart className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Community Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  25,000+ hours of community service annually by student organizations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Organization Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Academic</h3>
              <p className="text-2xl font-bold text-uw-purple">85</p>
              <p className="text-sm text-gray-600">Honor societies & professional clubs</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Greek Life</h3>
              <p className="text-2xl font-bold text-uw-purple">42</p>
              <p className="text-sm text-gray-600">Fraternities & sororities</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Service</h3>
              <p className="text-2xl font-bold text-uw-purple">65</p>
              <p className="text-sm text-gray-600">Community service organizations</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Special Interest</h3>
              <p className="text-2xl font-bold text-uw-purple">158</p>
              <p className="text-sm text-gray-600">Recreational & hobby groups</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentOrganizations;
