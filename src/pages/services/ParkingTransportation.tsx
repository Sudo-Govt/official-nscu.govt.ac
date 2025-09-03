import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Car, Bus, MapPin, CreditCard, Clock, Info } from 'lucide-react';

const ParkingTransportation = () => {
  useSEO({
    title: "Parking & Transportation - Campus Services | NSCU Delaware",
    description: "Find parking permits, shuttle services, and transportation options at NSCU Delaware. Student, faculty, and visitor parking information and rates.",
    keywords: "campus parking, transportation, shuttle service, parking permits, visitor parking, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Parking & Transportation" 
      description="Convenient parking and transportation solutions for the campus community"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Car className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">5,000+ Spaces</h3>
              <p className="text-gray-600">Ample parking across campus</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Bus className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Free Shuttle</h3>
              <p className="text-gray-600">Campus-wide transportation service</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <MapPin className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">10 Locations</h3>
              <p className="text-gray-600">Convenient parking throughout campus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Parking Permits</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-uw-purple">Student Annual</h3>
                    <span className="text-uw-gold font-bold">$300/year</span>
                  </div>
                  <p className="text-gray-600">Access to all student parking areas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-uw-purple">Faculty/Staff</h3>
                    <span className="text-uw-gold font-bold">$400/year</span>
                  </div>
                  <p className="text-gray-600">Reserved spots closer to buildings</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-uw-purple">Commuter Pass</h3>
                    <span className="text-uw-gold font-bold">$150/semester</span>
                  </div>
                  <p className="text-gray-600">Perfect for part-time students</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-uw-purple">Visitor Parking</h3>
                    <span className="text-uw-gold font-bold">$5/day</span>
                  </div>
                  <p className="text-gray-600">Short-term parking for guests</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Transportation Services</h2>
              <div className="space-y-6">
                <div className="p-6 bg-uw-purple text-white rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Bus className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold">Campus Shuttle</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-uw-gold" />
                      <span>Runs every 15 minutes</span>
                    </div>
                    <p>Monday - Friday: 7:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <CreditCard className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Purchase Permits</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Buy parking permits online or in-person</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Online: MyNSCU Portal</p>
                    <p>• In-person: Student Services Building</p>
                    <p>• Payment plans available</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Info className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Important Notes</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Permits required Monday-Friday, 7 AM - 5 PM</p>
                    <p>• Free parking evenings and weekends</p>
                    <p>• Temporary permits available for special events</p>
                    <p>• Appeals can be submitted online within 10 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParkingTransportation;