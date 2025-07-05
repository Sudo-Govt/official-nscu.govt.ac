
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, Users, Award } from 'lucide-react';

const Dining = () => {
  const diningLocations = [
    { name: "Heritage Commons", type: "All-You-Care-To-Eat", hours: "7am-10pm", capacity: 850 },
    { name: "Innovation Food Court", type: "Retail Dining", hours: "10am-11pm", options: 8 },
    { name: "Scholars Café", type: "Coffee & Light Fare", hours: "6am-12am", study_friendly: true },
    { name: "Student Union Grill", type: "Casual Dining", hours: "11am-9pm", popular: "Burgers" }
  ];

  return (
    <PageLayout 
      title="Campus Dining" 
      description="Delicious, nutritious dining options to fuel your success"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Exceptional Dining</h2>
            <p className="text-gray-600 mb-4">
              NSCU dining services offer diverse, high-quality food options that cater to all 
              dietary preferences and restrictions. From all-you-care-to-eat dining halls to 
              specialty restaurants, we have something for everyone.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm">Dining Locations</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm">Menu Items Daily</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Utensils className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Farm-to-Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  35% of ingredients sourced from local farms within 150 miles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Award className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Zero waste goal with comprehensive recycling and composting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Dining Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diningLocations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <CardDescription>{location.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-uw-purple" />
                      {location.hours}
                    </div>
                    {location.capacity && (
                      <Badge variant="secondary">{location.capacity} seats</Badge>
                    )}
                    {location.options && (
                      <Badge variant="secondary">{location.options} options</Badge>
                    )}
                    {location.study_friendly && (
                      <Badge variant="outline">Study Friendly</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Dining Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Unlimited Plan</h3>
              <p className="text-2xl font-bold text-uw-purple">$2,850</p>
              <p className="text-sm text-gray-600">per semester</p>
            </div>
            <div className="text-center">
              <Utensils className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Block Plans</h3>
              <p className="text-2xl font-bold text-uw-purple">$1,950</p>
              <p className="text-sm text-gray-600">175 meals/semester</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Dining Dollars</h3>
              <p className="text-2xl font-bold text-uw-purple">Flexible</p>
              <p className="text-sm text-gray-600">add to any plan</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dining;
