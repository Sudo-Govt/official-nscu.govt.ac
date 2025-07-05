
import PageLayout from '@/components/PageLayout';
import { MapPin, Navigation, Phone, Clock, Car, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const campusBuildings = [
  {
    name: "Mitchell Hall",
    type: "Academic",
    description: "Main administrative building housing the President's office, Admissions, and Financial Aid",
    coordinates: "39.6781° N, 75.7504° W",
    features: ["Admissions Office", "Financial Aid", "President's Office", "Registrar"]
  },
  {
    name: "Pearson Hall",
    type: "Academic",
    description: "College of Engineering building with state-of-the-art laboratories and classrooms",
    coordinates: "39.6785° N, 75.7510° W",
    features: ["Engineering Labs", "Computer Science", "Robotics Center", "Student Lounge"]
  },
  {
    name: "Morris Library",
    type: "Library",
    description: "Main university library with extensive research collections and study spaces",
    coordinates: "39.6790° N, 75.7520° W",
    features: ["Research Collections", "Study Rooms", "Computer Lab", "Café"]
  },
  {
    name: "Carpenter Sports Building",
    type: "Recreation",
    description: "Athletic facility with gymnasium, fitness center, and indoor track",
    coordinates: "39.6775° N, 75.7530° W",
    features: ["Gymnasium", "Fitness Center", "Indoor Track", "Locker Rooms"]
  },
  {
    name: "Student Center",
    type: "Student Life",
    description: "Hub of campus life with dining, meeting spaces, and student services",
    coordinates: "39.6788° N, 75.7515° W",
    features: ["Dining Hall", "Bookstore", "Meeting Rooms", "Student Organizations"]
  },
  {
    name: "Christiana Towers",
    type: "Housing",
    description: "High-rise residence halls housing over 2,000 students",
    coordinates: "39.6795° N, 75.7525° W",
    features: ["Residence Halls", "Dining Facilities", "Study Lounges", "Recreation Areas"]
  }
];

const parkingAreas = [
  { name: "Lot 1 - Visitor Parking", spaces: 150, type: "Visitor", hourlyRate: "$2.00" },
  { name: "Lot 2 - Student Parking", spaces: 800, type: "Student", semesterRate: "$150" },
  { name: "Lot 3 - Faculty/Staff", spaces: 400, type: "Faculty/Staff", monthlyRate: "$45" },
  { name: "Garage A - Premium", spaces: 600, type: "Premium", dailyRate: "$8.00" }
];

const CampusMap = () => {
  return (
    <PageLayout 
      title="Campus Map & Directions" 
      description="Navigate our beautiful 2,500-acre campus with interactive maps and detailed directions"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Interactive Map Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Interactive Campus Map</h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-uw-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">Interactive Map</h3>
                <p className="text-gray-600 mb-4">Explore our campus with our interactive online map</p>
                <Button className="bg-uw-purple hover:bg-uw-purple/90">
                  Launch Interactive Map
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Navigation className="h-8 w-8 text-uw-gold mx-auto mb-2" />
                <h4 className="font-bold text-uw-purple mb-1">GPS Coordinates</h4>
                <p className="text-sm text-gray-600">39.6781° N, 75.7504° W</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-uw-gold mx-auto mb-2" />
                <h4 className="font-bold text-uw-purple mb-1">Campus Tours</h4>
                <p className="text-sm text-gray-600">Daily at 10am, 2pm, 4pm</p>
              </div>
              <div className="text-center">
                <Phone className="h-8 w-8 text-uw-gold mx-auto mb-2" />
                <h4 className="font-bold text-uw-purple mb-1">Visitor Information</h4>
                <p className="text-sm text-gray-600">(302) 857-1000</p>
              </div>
            </div>
          </div>

          {/* Campus Buildings */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Campus Buildings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campusBuildings.map((building, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-uw-purple">{building.name}</h3>
                    <span className="bg-uw-gold text-uw-dark px-2 py-1 rounded text-xs font-semibold">
                      {building.type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{building.description}</p>
                  <div className="text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {building.coordinates}
                  </div>
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {building.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <div className="bg-uw-gold rounded-full w-1.5 h-1.5 mt-2 mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parking Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Parking Information</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-uw-purple mb-4">Parking Areas</h3>
                  <div className="space-y-4">
                    {parkingAreas.map((lot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-uw-purple">{lot.name}</h4>
                          <span className="text-sm text-gray-600">{lot.spaces} spaces</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="bg-uw-gold text-uw-dark px-2 py-1 rounded text-xs font-semibold">
                            {lot.type}
                          </span>
                          <span className="text-sm font-semibold text-uw-purple">
                            {lot.hourlyRate || lot.dailyRate || lot.monthlyRate || lot.semesterRate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-uw-purple mb-4">Transportation Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Car className="h-6 w-6 text-uw-gold mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-uw-purple mb-1">Personal Vehicle</h4>
                        <p className="text-sm text-gray-600">Multiple parking lots available campus-wide. Permits required for most areas.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Bus className="h-6 w-6 text-uw-gold mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-uw-purple mb-1">Campus Shuttle</h4>
                        <p className="text-sm text-gray-600">Free shuttle service connecting all major campus areas. Runs every 15 minutes.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Navigation className="h-6 w-6 text-uw-gold mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-uw-purple mb-1">Public Transit</h4>
                        <p className="text-sm text-gray-600">DART bus routes serve campus with connections to Newark and Wilmington.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Directions to Campus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">From Major Cities</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">From Philadelphia (45 minutes)</h4>
                    <p className="text-sm text-gray-600">Take I-95 South to Route 896 South. Follow signs to University of Delaware campus.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">From Baltimore (1 hour)</h4>
                    <p className="text-sm text-gray-600">Take I-95 North to Route 896 North. Campus entrance on right after 2 miles.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">From Washington DC (2 hours)</h4>
                    <p className="text-sm text-gray-600">Take I-495 to I-95 North. Follow signs to Newark/University of Delaware.</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Airport Connections</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">Philadelphia International (PHL)</h4>
                    <p className="text-sm text-gray-600">40 minutes by car. Airport shuttle service available by reservation.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">BWI Baltimore (BWI)</h4>
                    <p className="text-sm text-gray-600">1 hour by car. Limited shuttle service during peak travel times.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-uw-purple mb-2">Newark Liberty (EWR)</h4>
                    <p className="text-sm text-gray-600">2 hours by car. Train connections available via Philadelphia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CampusMap;
