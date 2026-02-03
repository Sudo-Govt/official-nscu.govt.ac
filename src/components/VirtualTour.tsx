
import { MapPin, Camera, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tourStops = [
  {
    title: "Historic Main Quad",
    description: "The heart of campus featuring beautiful architecture and gathering spaces.",
    image: "photo-1541339907198-e08756dedf3f",
    duration: "5 min",
    highlights: ["Cherry Blossom Trees", "Student Commons", "Historic Bell Tower"]
  },
  {
    title: "State-of-the-Art Libraries",
    description: "Modern learning spaces with advanced technology and collaborative areas.",
    image: "photo-1481627834876-b7833e8f5570",
    duration: "7 min",
    highlights: ["24/7 Study Spaces", "Digital Archives", "Research Centers"]
  },
  {
    title: "Innovation Labs",
    description: "Cutting-edge research facilities and maker spaces for hands-on learning.",
    image: "photo-1581092160562-40aa08e78837",
    duration: "8 min",
    highlights: ["3D Printing Lab", "AI Research Center", "Startup Incubator"]
  },
  {
    title: "Student Life Centers",
    description: "Vibrant spaces for dining, recreation, and community building.",
    image: "photo-1497366811353-6870744d04b2",
    duration: "6 min",
    highlights: ["Fitness Center", "Cultural Center", "Student Organizations Hub"]
  }
];

const VirtualTour = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Explore Our Campus
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a virtual journey through our beautiful campus and discover the spaces 
            where learning, research, and community come together.
          </p>
        </div>

        {/* Featured Virtual Tour Video */}
        <div className="mb-12">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div 
              className="h-96 bg-cover bg-center relative"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`
              }}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-4">360° Campus Experience</h3>
                  <p className="text-xl mb-6">Immerse yourself in campus life from anywhere</p>
                  <Button size="lg" className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark">
                    Start Virtual Tour
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tour Stops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {tourStops.map((stop, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div 
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/${stop.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80)`
                }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-uw-purple">{stop.title}</CardTitle>
                  <div className="flex items-center text-uw-gold text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    {stop.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{stop.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-uw-purple">Tour Highlights:</p>
                  <div className="flex flex-wrap gap-2">
                    {stop.highlights.map((highlight, idx) => (
                      <span key={idx} className="text-xs bg-uw-purple/10 text-uw-purple px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campus Stats */}
        <div className="bg-uw-purple/5 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <MapPin className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-uw-purple">850</div>
              <div className="text-gray-600">Acres</div>
            </div>
            <div>
              <Users className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-uw-purple">180+</div>
              <div className="text-gray-600">Buildings</div>
            </div>
            <div>
              <Camera className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-uw-purple">25+</div>
              <div className="text-gray-600">Tour Stops</div>
            </div>
            <div>
              <Clock className="h-8 w-8 text-uw-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-uw-purple">45</div>
              <div className="text-gray-600">Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
