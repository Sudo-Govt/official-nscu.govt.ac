import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, MapPin, Users, Clock, Medal, Star } from 'lucide-react';

const Athletics = () => {
  const [selectedSport, setSelectedSport] = useState('all');

  const sportsTeams = [
    { 
      name: 'Basketball', 
      division: 'NCAA Division II', 
      conference: 'Atlantic Conference',
      season: 'November - March',
      homeVenue: 'NSCU Arena',
      coachName: 'Coach Sarah Johnson',
      championships: ['2023 Conference Champions', '2021 Regional Champions'],
      roster: 15,
      nextGame: 'vs Delaware State - Dec 15, 2024',
      record: '12-3'
    },
    { 
      name: 'Football', 
      division: 'NCAA Division II', 
      conference: 'Eastern Football Conference',
      season: 'August - December',
      homeVenue: 'NSCU Stadium',
      coachName: 'Coach Michael Davis',
      championships: ['2022 Conference Champions'],
      roster: 85,
      nextGame: 'vs Morgan State - Nov 30, 2024',
      record: '8-2'
    },
    { 
      name: 'Soccer (Men)', 
      division: 'NCAA Division II', 
      conference: 'Mid-Atlantic Soccer Conference',
      season: 'August - November',
      homeVenue: 'NSCU Soccer Complex',
      coachName: 'Coach Roberto Silva',
      championships: ['2023 Tournament Runners-up'],
      roster: 28,
      nextGame: 'vs Towson - Dec 5, 2024',
      record: '10-4-2'
    },
    { 
      name: 'Soccer (Women)', 
      division: 'NCAA Division II', 
      conference: 'Mid-Atlantic Soccer Conference',
      season: 'August - November',
      homeVenue: 'NSCU Soccer Complex',
      coachName: 'Coach Maria Rodriguez',
      championships: ['2024 Conference Champions'],
      roster: 25,
      nextGame: 'vs Delaware - Dec 8, 2024',
      record: '14-1-1'
    },
    { 
      name: 'Track & Field', 
      division: 'NCAA Division II', 
      conference: 'Eastern Track Conference',
      season: 'Year-round',
      homeVenue: 'NSCU Track Complex',
      coachName: 'Coach Amanda Wilson',
      championships: ['2024 Indoor Champions', '2023 Outdoor Champions'],
      roster: 45,
      nextGame: 'Winter Championships - Jan 20, 2025',
      record: '1st Place Conference'
    },
    { 
      name: 'Volleyball (Women)', 
      division: 'NCAA Division II', 
      conference: 'Atlantic Volleyball Conference',
      season: 'August - December',
      homeVenue: 'NSCU Gymnasium',
      coachName: 'Coach Jennifer Lee',
      championships: ['2023 Conference Finals'],
      roster: 18,
      nextGame: 'vs Salisbury - Dec 12, 2024',
      record: '22-8'
    }
  ];

  const facilities = [
    {
      name: 'NSCU Arena',
      capacity: 8500,
      features: ['Basketball Court', 'Volleyball Court', 'Concessions', 'Premium Seating'],
      description: 'State-of-the-art indoor arena serving as home to basketball and volleyball teams.'
    },
    {
      name: 'NSCU Stadium',
      capacity: 15000,
      features: ['Football Field', 'Track', 'Press Box', 'Locker Rooms'],
      description: 'Multi-purpose stadium hosting football games and track & field events.'
    },
    {
      name: 'NSCU Soccer Complex',
      capacity: 3000,
      features: ['Natural Grass Field', 'Lighting', 'Bleacher Seating', 'Training Facilities'],
      description: 'Dedicated soccer facility for both men\'s and women\'s soccer teams.'
    },
    {
      name: 'Fitness & Recreation Center',
      capacity: 500,
      features: ['Weight Room', 'Cardio Equipment', 'Pool', 'Racquetball Courts'],
      description: 'Comprehensive fitness facility for student-athletes and general student body.'
    }
  ];

  const upcomingEvents = [
    { date: 'Nov 30, 2024', time: '7:00 PM', sport: 'Football', opponent: 'vs Morgan State', venue: 'NSCU Stadium' },
    { date: 'Dec 5, 2024', time: '6:00 PM', sport: 'Men\'s Soccer', opponent: 'vs Towson', venue: 'NSCU Soccer Complex' },
    { date: 'Dec 8, 2024', time: '4:00 PM', sport: 'Women\'s Soccer', opponent: 'vs Delaware', venue: 'NSCU Soccer Complex' },
    { date: 'Dec 12, 2024', time: '7:00 PM', sport: 'Volleyball', opponent: 'vs Salisbury', venue: 'NSCU Gymnasium' },
    { date: 'Dec 15, 2024', time: '8:00 PM', sport: 'Basketball', opponent: 'vs Delaware State', venue: 'NSCU Arena' },
    { date: 'Jan 20, 2025', time: '10:00 AM', sport: 'Track & Field', opponent: 'Winter Championships', venue: 'NSCU Track Complex' }
  ];

  return (
    <PageLayout 
      title="NSCU Athletics" 
      description="Home of the NSCU Hawks - NCAA Division II Athletics Excellence"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-uw-purple mb-4">NSCU Hawks Athletics</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Competing at the highest level of NCAA Division II athletics while maintaining our commitment to academic excellence and character development.
          </p>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="news">News & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsTeams.map((team, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-uw-purple">{team.name}</CardTitle>
                      <Badge variant="outline" className="border-uw-gold text-uw-gold">
                        {team.record}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{team.conference}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{team.season}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{team.homeVenue}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-uw-purple" />
                        <span>{team.coachName}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Trophy className="h-4 w-4 mr-2 text-uw-gold" />
                        <span>{team.championships[0]}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-uw-purple">Next Game:</p>
                        <p className="text-sm text-gray-600">{team.nextGame}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b bg-uw-purple text-white">
                <h2 className="text-2xl font-bold">Upcoming Games & Events</h2>
                <p className="text-uw-gold">Hawks Athletics Schedule</p>
              </div>
              <div className="divide-y">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-uw-purple">{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{event.sport}</div>
                        <div className="text-sm text-gray-600">{event.opponent}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-uw-purple">{event.venue}</div>
                      <Button size="sm" variant="outline" className="mt-1">Get Tickets</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-uw-purple flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {facility.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Capacity: {facility.capacity.toLocaleString()}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{facility.description}</p>
                    <div>
                      <h4 className="font-semibold text-uw-purple mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {facility.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-uw-purple">
                    <Star className="h-5 w-5 mr-2 text-uw-gold" />
                    Latest Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-uw-gold pl-4">
                      <h4 className="font-semibold">Women's Soccer Conference Champions</h4>
                      <p className="text-sm text-gray-600">Defeated top-seeded Delaware 2-1 in championship final</p>
                    </div>
                    <div className="border-l-4 border-uw-purple pl-4">
                      <h4 className="font-semibold">Track & Field Dominance</h4>
                      <p className="text-sm text-gray-600">Won both indoor and outdoor conference championships</p>
                    </div>
                    <div className="border-l-4 border-uw-gold pl-4">
                      <h4 className="font-semibold">Academic Excellence</h4>
                      <p className="text-sm text-gray-600">85% of student-athletes maintain 3.0+ GPA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-uw-purple">
                    <Medal className="h-5 w-5 mr-2 text-uw-gold" />
                    Season Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Win Percentage</span>
                      <span className="text-lg font-bold text-uw-purple">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conference Championships</span>
                      <span className="text-lg font-bold text-uw-gold">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Student-Athletes</span>
                      <span className="text-lg font-bold text-uw-purple">216</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Academic All-Conference</span>
                      <span className="text-lg font-bold text-uw-gold">42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Athletics;