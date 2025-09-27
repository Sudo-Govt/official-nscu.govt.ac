import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Phone, Car, Wifi, Coffee, Book, Dumbbell, Utensils, Home, Microscope, Users } from 'lucide-react';

const CampusFacilities = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const facilities = [
    {
      id: 1,
      name: 'William H. Mitchell Library',
      category: 'Academic',
      icon: Book,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      description: 'Main university library with extensive research collections, study spaces, and digital resources.',
      location: 'Central Campus, 123 Library Lane',
      hours: {
        'Monday-Thursday': '7:00 AM - 12:00 AM',
        'Friday': '7:00 AM - 10:00 PM',
        'Saturday': '9:00 AM - 10:00 PM',
        'Sunday': '10:00 AM - 12:00 AM'
      },
      contact: '(302) 555-0150',
      capacity: 2500,
      features: [
        '24/7 Study Areas',
        'Research Collections',
        'Computer Labs',
        'Group Study Rooms',
        'Archives & Special Collections',
        'Café & Quiet Zones',
        'Printing Services',
        'Interlibrary Loans'
      ],
      services: [
        'Research Assistance',
        'Citation Help',
        'Technology Support',
        'Study Space Reservations'
      ]
    },
    {
      id: 2,
      name: 'Student Recreation Center',
      category: 'Recreation',
      icon: Dumbbell,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      description: 'State-of-the-art fitness and recreation facility for all students, faculty, and staff.',
      location: 'South Campus, 456 Recreation Drive',
      hours: {
        'Monday-Friday': '5:00 AM - 11:00 PM',
        'Saturday': '7:00 AM - 10:00 PM',
        'Sunday': '8:00 AM - 10:00 PM'
      },
      contact: '(302) 555-0151',
      capacity: 1200,
      features: [
        'Olympic-Size Pool',
        'Rock Climbing Wall',
        'Basketball Courts',
        'Racquetball Courts',
        'Cardio Equipment',
        'Weight Training Area',
        'Group Fitness Studio',
        'Locker Rooms'
      ],
      services: [
        'Personal Training',
        'Group Fitness Classes',
        'Equipment Rental',
        'Swim Lessons'
      ]
    },
    {
      id: 3,
      name: 'Hawks Dining Hall',
      category: 'Dining',
      icon: Utensils,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop',
      description: 'Main dining facility featuring diverse cuisine options and sustainable dining practices.',
      location: 'Central Campus, 789 Dining Commons',
      hours: {
        'Monday-Friday': '7:00 AM - 10:00 PM',
        'Saturday-Sunday': '8:00 AM - 9:00 PM'
      },
      contact: '(302) 555-0152',
      capacity: 800,
      features: [
        'Multiple Food Stations',
        'Vegetarian & Vegan Options',
        'Halal & Kosher Meals',
        'Grab & Go Station',
        'Fresh Salad Bar',
        'Pizza & Grill',
        'International Cuisine',
        'Dessert Station'
      ],
      services: [
        'Meal Plans',
        'Catering Services',
        'Nutrition Information',
        'Special Events'
      ]
    },
    {
      id: 4,
      name: 'Hawks Residence Hall',
      category: 'Housing',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop',
      description: 'Modern residence hall providing comfortable living spaces and community amenities.',
      location: 'North Campus, 321 Residence Way',
      hours: {
        'Daily': '24/7 Access for Residents'
      },
      contact: '(302) 555-0153',
      capacity: 600,
      features: [
        'Single & Double Rooms',
        'Suite-Style Living',
        'Common Areas',
        'Study Lounges',
        'Laundry Facilities',
        'Kitchen Access',
        'High-Speed Internet',
        'Air Conditioning'
      ],
      services: [
        'Resident Advisors',
        'Maintenance Services',
        'Security Services',
        'Community Programming'
      ]
    },
    {
      id: 5,
      name: 'Science Research Complex',
      category: 'Academic',
      icon: Microscope,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop',
      description: 'Advanced research facility housing cutting-edge laboratories and equipment.',
      location: 'East Campus, 654 Innovation Boulevard',
      hours: {
        'Monday-Friday': '6:00 AM - 11:00 PM',
        'Saturday': '8:00 AM - 8:00 PM',
        'Sunday': 'By Card Access Only'
      },
      contact: '(302) 555-0154',
      capacity: 400,
      features: [
        'Clean Room Facilities',
        'Electron Microscopy',
        'NMR Spectroscopy',
        'Cell Culture Labs',
        'Chemical Storage',
        'Fume Hoods',
        'Specialized Equipment',
        'Safety Systems'
      ],
      services: [
        'Equipment Training',
        'Research Support',
        'Safety Protocols',
        'Technical Assistance'
      ]
    },
    {
      id: 6,
      name: 'Student Union Building',
      category: 'Student Life',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
      description: 'Central hub for student activities, dining, and campus services.',
      location: 'Central Campus, 987 Student Plaza',
      hours: {
        'Monday-Thursday': '6:00 AM - 12:00 AM',
        'Friday': '6:00 AM - 2:00 AM',
        'Saturday': '8:00 AM - 2:00 AM',
        'Sunday': '8:00 AM - 12:00 AM'
      },
      contact: '(302) 555-0155',
      capacity: 1500,
      features: [
        'Food Court',
        'Student Organizations Offices',
        'Meeting Rooms',
        'Event Spaces',
        'Bookstore',
        'Game Room',
        'Lounge Areas',
        'Information Desk'
      ],
      services: [
        'Event Planning',
        'Student Services',
        'Campus Information',
        'Organization Support'
      ]
    }
  ];

  const categories = ['all', 'Academic', 'Recreation', 'Dining', 'Housing', 'Student Life'];

  const filteredFacilities = selectedCategory === 'all' 
    ? facilities 
    : facilities.filter(facility => facility.category === selectedCategory);

  const getCategoryStats = () => {
    const stats = categories.slice(1).map(category => ({
      name: category,
      count: facilities.filter(f => f.category === category).length
    }));
    return stats;
  };

  return (
    <PageLayout 
      title="Campus Facilities" 
      description="Explore our world-class facilities and services across the NSCU campus"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-uw-purple mb-4">Campus Facilities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive campus facilities designed to support your academic, personal, and professional growth at NSCU.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-uw-purple">{facilities.length}</div>
              <div className="text-xs text-gray-600">Total Facilities</div>
            </CardContent>
          </Card>
          {getCategoryStats().map((stat) => (
            <Card key={stat.name} className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-uw-gold">{stat.count}</div>
                <div className="text-xs text-gray-600">{stat.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-uw-purple hover:bg-uw-dark" : "border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white"}
            >
              {category === 'all' ? 'All Facilities' : category}
            </Button>
          ))}
        </div>

        {/* Campus Map Call-to-Action */}
        <Card className="mb-8 bg-gradient-to-r from-uw-purple to-uw-dark text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Interactive Campus Map</h3>
                <p className="text-uw-gold">Find directions, parking, and facility locations with our interactive map.</p>
              </div>
              <Button variant="secondary" size="lg" className="mt-4 md:mt-0">
                <MapPin className="mr-2 h-4 w-4" />
                View Campus Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFacilities.map((facility) => {
            const IconComponent = facility.icon;
            return (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${facility.image})` }}>
                  <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-1">{facility.name}</h3>
                      <Badge variant="secondary" className="bg-uw-gold text-uw-dark">
                        {facility.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{facility.description}</p>
                  
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="hours">Hours</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-uw-purple flex-shrink-0" />
                          <span className="text-sm text-gray-600">{facility.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm text-gray-600">{facility.contact}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-uw-purple" />
                          <span className="text-sm text-gray-600">Capacity: {facility.capacity.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <h4 className="font-semibold text-uw-purple mb-2">Services:</h4>
                          <div className="space-y-1">
                            {facility.services.map((service, index) => (
                              <div key={index} className="text-sm text-gray-600">• {service}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features">
                      <div className="grid grid-cols-1 gap-2">
                        {facility.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                            <IconComponent className="h-4 w-4 mr-2 text-uw-purple flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="hours">
                      <div className="space-y-3">
                        {Object.entries(facility.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-uw-purple">{day}:</span>
                            <span className="text-gray-600 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="mr-1 h-3 w-3" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-uw-purple text-center mb-8">Additional Campus Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Car className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Parking Services</h3>
                <p className="text-sm text-gray-600 mb-4">Multiple parking lots and garages across campus with permit and visitor options.</p>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Wifi className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Wi-Fi & Technology</h3>
                <p className="text-sm text-gray-600 mb-4">Campus-wide wireless network and technology support services available 24/7.</p>
                <Button variant="outline" size="sm">IT Support</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Coffee className="h-12 w-12 text-uw-purple mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Cafés & Markets</h3>
                <p className="text-sm text-gray-600 mb-4">Convenient dining options and markets located throughout campus buildings.</p>
                <Button variant="outline" size="sm">Find Locations</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CampusFacilities;