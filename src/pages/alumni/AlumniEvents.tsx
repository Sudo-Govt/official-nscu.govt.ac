
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award, Heart } from 'lucide-react';

const AlumniEvents = () => {
  return (
    <PageLayout 
      title="Alumni Events" 
      description="Connect with fellow Wolfpack alumni at events throughout the year"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
            <p className="text-gray-600 mb-4">
              Join fellow alumni at exciting events throughout the year. From homecoming 
              celebrations to professional networking mixers, there are countless opportunities 
              to reconnect with classmates and make new connections.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm">Annual Events</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">25K</div>
                <div className="text-sm">Event Attendees</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Homecoming Weekend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Annual celebration bringing 15,000+ alumni back to campus
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Regional Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Local events hosted by 45 alumni chapters worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Event Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Reunions</h3>
              <p className="text-2xl font-bold text-uw-purple">35</p>
              <p className="text-sm text-gray-600">class reunions annually</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Networking</h3>
              <p className="text-2xl font-bold text-uw-purple">80</p>
              <p className="text-sm text-gray-600">professional mixers</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Awards Ceremonies</h3>
              <p className="text-2xl font-bold text-uw-purple">12</p>
              <p className="text-sm text-gray-600">recognition events</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Social Events</h3>
              <p className="text-2xl font-bold text-uw-purple">45</p>
              <p className="text-sm text-gray-600">casual gatherings</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AlumniEvents;
