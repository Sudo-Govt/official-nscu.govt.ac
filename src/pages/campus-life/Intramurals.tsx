import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Trophy, Users, Calendar, MapPin, Clock, Star } from 'lucide-react';

const IntramuralsSpecial = () => {
  useSEO({
    title: "Intramural Sports - Campus Recreation | NSCU Delaware",
    description: "Join intramural sports at NSCU Delaware. Competitive and recreational leagues for basketball, soccer, volleyball, flag football, and more campus activities.",
    keywords: "intramural sports, campus recreation, basketball, soccer, volleyball, flag football, student activities, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Intramural Sports" 
      description="Competitive fun and recreation for the entire campus community"
    >
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Trophy className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">15+ Sports</h3>
              <p className="text-gray-600">Variety of competitive activities</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">2,000+ Participants</h3>
              <p className="text-gray-600">Active student involvement</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Star className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">All Skill Levels</h3>
              <p className="text-gray-600">Recreational to competitive</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Sports Offered</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Fall Sports</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Flag Football</div>
                    <div>Soccer</div>
                    <div>Volleyball</div>
                    <div>Tennis</div>
                    <div>Cross Country</div>
                    <div>Ultimate Frisbee</div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Spring Sports</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Basketball</div>
                    <div>Softball</div>
                    <div>Badminton</div>
                    <div>Table Tennis</div>
                    <div>Golf</div>
                    <div>Racquetball</div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Year-Round</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Swimming</div>
                    <div>Rock Climbing</div>
                    <div>Bowling</div>
                    <div>Esports</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">How to Participate</h2>
              <div className="space-y-6">
                <div className="p-6 bg-uw-purple text-white rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Registration</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Create account on IMLeagues</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Form team or join existing team</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Pay registration fee ($25-50/sport)</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="bg-uw-gold text-uw-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span>Attend mandatory captain's meeting</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Season Schedule</h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Fall Registration:</strong> August 15 - September 15</p>
                    <p><strong>Fall Season:</strong> September - November</p>
                    <p><strong>Spring Registration:</strong> January 15 - February 15</p>
                    <p><strong>Spring Season:</strong> February - April</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Facilities</h3>
                  </div>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>• Recreation Center Gymnasium</p>
                    <p>• Outdoor Athletic Fields</p>
                    <p>• Tennis Courts</p>
                    <p>• Swimming Pool</p>
                    <p>• Fitness Center</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-6 w-6 text-uw-gold" />
                    <h3 className="text-xl font-semibold text-uw-purple">Game Times</h3>
                  </div>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>Monday - Thursday: 6:00 PM - 10:00 PM</p>
                    <p>Sunday: 12:00 PM - 6:00 PM</p>
                    <p>Playoffs: Weekends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Championship Winners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Trophy className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Basketball</h3>
                <p className="text-gray-600 text-sm">Hornets - 2024</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Trophy className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Flag Football</h3>
                <p className="text-gray-600 text-sm">Thunder - 2023</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Trophy className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Volleyball</h3>
                <p className="text-gray-600 text-sm">Spikers - 2024</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Trophy className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Soccer</h3>
                <p className="text-gray-600 text-sm">Galaxy FC - 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default IntramuralsSpecial;