import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DynamicAdmissionsBanner from '@/components/DynamicAdmissionsBanner';

const newsItems = [
  {
    title: "Fall 2026 Admissions Now Open - Apply by January 5th",
    excerpt: "NSCU Belize is accepting applications for Fall 2026 programs. Early admission available with enhanced scholarship opportunities for qualified candidates.",
    date: "December 15, 2025",
    category: "Admissions",
    image: "photo-1523050854058-8df90110c9f1"
  },
  {
    title: "New AI and Data Science Program Launches January 2026",
    excerpt: "Cutting-edge curriculum designed with industry partners to prepare students for tomorrow's digital economy and emerging technologies.",
    date: "December 12, 2025",
    category: "Academic Programs",
    image: "photo-1518770660439-4636190af475"
  },
  {
    title: "Campus Expansion Project Completes Phase One",
    excerpt: "State-of-the-art learning facilities and research labs now open, featuring advanced technology and collaborative spaces for student success.",
    date: "December 8, 2025",
    category: "Campus News",
    image: "photo-1581090464777-f3220bbe1b8b"
  }
];

const events = [
  {
    title: "Fall 2026 Admission Information Session",
    date: "December 20, 2025",
    time: "6:00 PM - 7:30 PM",
    location: "Main Campus Auditorium"
  },
  {
    title: "Application Deadline Reminder - Fall 2026",
    date: "January 5, 2026",
    time: "11:59 PM",
    location: "Online Application Portal"
  },
  {
    title: "Fall 2026 Semester Begins",
    date: "January 15, 2026",
    time: "8:00 AM",
    location: "All Campus Locations"
  },
  {
    title: "New Student Orientation - Fall 2026",
    date: "January 13, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Student Center"
  }
];

const NewsEvents = () => {
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
              <Button variant="outline" className="border-uw-purple text-uw-purple hover:bg-uw-purple hover:text-white">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {newsItems.map((item, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="w-full md:w-48 h-48 md:h-auto bg-cover bg-center rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/${item.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80)`
                      }}
                    />
                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-uw-purple/10 text-uw-purple">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-uw-purple leading-tight">
                          {item.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">{item.excerpt}</p>
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
              {events.map((event, index) => (
                <Card key={index} className="border-l-4 border-l-uw-gold border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-uw-purple mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="text-uw-purple font-medium">{event.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-6 bg-uw-purple hover:bg-uw-dark text-white">
              View Full Calendar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;
