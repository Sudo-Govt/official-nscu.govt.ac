
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Users, Wifi, Car } from 'lucide-react';

const Housing = () => {
  const residenceHalls = [
    { name: "Heritage Hall", type: "Traditional", capacity: 450, year: "Freshmen" },
    { name: "Innovation Tower", type: "Suite-Style", capacity: 380, year: "All Years" },
    { name: "Scholars Village", type: "Apartment", capacity: 320, year: "Upperclassmen" },
    { name: "Greek Life Housing", type: "Chapter Houses", capacity: 280, year: "Members" }
  ];

  return (
    <PageLayout 
      title="Campus Housing" 
      description="Your home away from home - comfortable, convenient, and community-focused"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Living on Campus</h2>
            <p className="text-gray-600 mb-4">
              NSCU offers diverse housing options designed to enhance your college experience. 
              From traditional residence halls to modern apartment-style living, we provide 
              safe, comfortable, and engaging communities.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">1,430</div>
                <div className="text-sm">Housing Capacity</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Home className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Housing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Traditional halls, suites, apartments, and theme communities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Wifi className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  High-speed WiFi, study lounges, fitness centers, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Housing Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Residence Halls</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {residenceHalls.map((hall, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{hall.name}</CardTitle>
                  <CardDescription>{hall.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="font-semibold">{hall.capacity}</span>
                    </div>
                    <Badge variant="outline">{hall.year}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Campus Living Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Wifi className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">High-Speed Internet</h3>
              <p className="text-sm text-gray-600">Gigabit WiFi in all buildings</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Community Spaces</h3>
              <p className="text-sm text-gray-600">Lounges, study rooms, and game areas</p>
            </div>
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Parking</h3>
              <p className="text-sm text-gray-600">Convenient parking for residents</p>
            </div>
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">24/7 Security</h3>
              <p className="text-sm text-gray-600">Safe and secure living environment</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Housing;
