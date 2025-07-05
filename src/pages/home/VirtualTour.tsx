
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Play, Map, Camera, Navigation } from 'lucide-react';

const tourLocations = [
  {
    name: "Main Campus",
    description: "Explore our historic main campus with beautiful Georgian architecture",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Library Complex",
    description: "State-of-the-art research libraries with over 3 million volumes",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Student Union",
    description: "The heart of campus life with dining, recreation, and meeting spaces",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Research Labs",
    description: "Cutting-edge facilities for groundbreaking research and innovation",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const VirtualTour = () => {
  return (
    <PageLayout 
      title="Virtual Campus Tour" 
      description="Explore NSCU-Delaware from anywhere in the world"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Main Virtual Tour Video */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-uw-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-uw-purple mb-2">360° Campus Tour</h3>
                <p className="text-gray-600 mb-4">Take an immersive virtual tour of our campus</p>
                <Button className="bg-uw-purple hover:bg-uw-purple/90">
                  Start Virtual Tour
                </Button>
              </div>
            </div>
          </div>

          {/* Tour Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Camera className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Photo Gallery</h3>
              <p className="text-gray-600 mb-4">Browse high-resolution photos of our campus</p>
              <Button variant="outline">View Gallery</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Map className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">Navigate our campus with our detailed map</p>
              <Button variant="outline">Explore Map</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Navigation className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Self-Guided Tour</h3>
              <p className="text-gray-600 mb-4">Download our mobile app for on-campus tours</p>
              <Button variant="outline">Get App</Button>
            </div>
          </div>

          {/* Featured Locations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Featured Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tourLocations.map((location, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={location.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-uw-purple mb-2">{location.name}</h3>
                    <p className="text-gray-600 mb-4">{location.description}</p>
                    <Button size="sm" className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark">
                      <Play className="h-4 w-4 mr-2" />
                      View Tour
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule In-Person Visit */}
          <div className="bg-uw-purple rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Visit in Person?</h2>
            <p className="text-xl mb-6">
              Schedule a personalized campus tour with our admissions team
            </p>
            <Button size="lg" className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark">
              Schedule Campus Visit
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VirtualTour;
