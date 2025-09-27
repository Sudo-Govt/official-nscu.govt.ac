import { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DynamicAdmissionsBanner from '@/components/DynamicAdmissionsBanner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  target_audience: string;
  created_at: string;
  expires_at?: string;
}

interface AcademicEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  event_type: string;
  is_important?: boolean;
}

const NewsEvents = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData, eventsData] = await Promise.all([
          supabase
            .from('announcements')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('academic_calendar')
            .select('*')
            .gte('start_date', new Date().toISOString().split('T')[0])
            .order('start_date', { ascending: true })
            .limit(4)
        ]);

        if (announcementsData.error) throw announcementsData.error;
        if (eventsData.error) throw eventsData.error;

        setAnnouncements(announcementsData.data || []);
        setEvents(eventsData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-uw-purple mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Dynamic Admissions Banner */}
        <div className="mb-12">
          <DynamicAdmissionsBanner variant="hero" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* News Section */}
          <div className="lg:col-span-2">
            {/* Admissions News Banner */}
            <div className="mb-8">
              <DynamicAdmissionsBanner variant="news" />
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-uw-purple">Latest News</h2>
              <Button 
                variant="outline" 
                className="border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white"
                onClick={() => navigate('/news/university-news')}
              >
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {announcements.map((item) => (
                <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="w-full md:w-48 h-48 md:h-auto bg-cover bg-center rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)`
                      }}
                    />
                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`${
                              item.priority === 'urgent' 
                                ? 'bg-red-100 text-red-700' 
                                : item.priority === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-uw-purple/10 text-uw-purple'
                            }`}
                          >
                            {item.target_audience === 'all' ? 'General' : item.target_audience}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-uw-purple leading-tight">
                          {item.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-uw-purple">Upcoming Events</h2>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className={`border-l-4 ${event.is_important ? 'border-l-red-500' : 'border-l-uw-gold'} border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-uw-purple flex-1">{event.title}</h4>
                      {event.is_important && (
                        <Badge variant="destructive" className="ml-2 text-xs">Important</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.start_date)}
                        {event.end_date && event.end_date !== event.start_date && (
                          <span> - {formatDate(event.end_date)}</span>
                        )}
                      </div>
                      <div className="text-uw-purple font-medium capitalize">{event.event_type}</div>
                      {event.description && (
                        <p className="text-gray-600 text-xs mt-2">{event.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              className="w-full mt-6 bg-uw-purple hover:bg-uw-dark text-white"
              onClick={() => navigate('/events/calendar')}
            >
              View Full Calendar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;