
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

const AcademicCalendar = () => {
  const fallSemester = [
    { date: "August 21", event: "Classes Begin", type: "start" },
    { date: "August 28", event: "Last Day to Add/Drop", type: "deadline" },
    { date: "September 4", event: "Labor Day - No Classes", type: "holiday" },
    { date: "October 9-10", event: "Fall Break", type: "break" },
    { date: "November 11", event: "Veterans Day - No Classes", type: "holiday" },
    { date: "November 25-29", event: "Thanksgiving Break", type: "break" },
    { date: "December 9", event: "Last Day of Classes", type: "end" },
    { date: "December 10-11", event: "Study Days", type: "study" },
    { date: "December 12-18", event: "Final Examinations", type: "exam" },
    { date: "December 20", event: "Commencement", type: "ceremony" }
  ];

  const springSemester = [
    { date: "January 15", event: "Classes Begin", type: "start" },
    { date: "January 22", event: "Last Day to Add/Drop", type: "deadline" },
    { date: "February 19", event: "Presidents Day - No Classes", type: "holiday" },
    { date: "March 10-17", event: "Spring Break", type: "break" },
    { date: "April 28", event: "Last Day of Classes", type: "end" },
    { date: "April 29-30", event: "Study Days", type: "study" },
    { date: "May 1-7", event: "Final Examinations", type: "exam" },
    { date: "May 11", event: "Commencement", type: "ceremony" }
  ];

  const summerSessions = [
    { session: "Summer I", dates: "May 21 - June 28", weeks: 6 },
    { session: "Summer II", dates: "July 8 - August 16", weeks: 6 },
    { session: "Full Summer", dates: "May 21 - August 16", weeks: 12 }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "start": return "bg-green-100 text-green-800";
      case "end": return "bg-red-100 text-red-800";
      case "deadline": return "bg-orange-100 text-orange-800";
      case "holiday": return "bg-blue-100 text-blue-800";
      case "break": return "bg-purple-100 text-purple-800";
      case "study": return "bg-yellow-100 text-yellow-800";
      case "exam": return "bg-red-100 text-red-800";
      case "ceremony": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout 
      title="Academic Calendar" 
      description="Important dates and deadlines for the 2024-2025 academic year"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Academic Year 2024-2025
              </CardTitle>
              <CardDescription>
                Key dates and deadlines for students, faculty, and staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-sm">Weeks of Instruction</div>
                </div>
                <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm">Summer Sessions</div>
                </div>
                <div className="text-center p-4 bg-gray-100 text-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm">Credit Hour Limit</div>
                </div>
                <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm">Commencements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fall Semester */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-uw-purple" />
            Fall Semester 2024
          </h2>
          <div className="space-y-3">
            {fallSemester.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-uw-purple min-w-[100px]">
                        {item.date}
                      </div>
                      <div className="text-gray-800">
                        {item.event}
                      </div>
                    </div>
                    <Badge className={getEventColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Spring Semester */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-uw-purple" />
            Spring Semester 2025
          </h2>
          <div className="space-y-3">
            {springSemester.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-uw-purple min-w-[100px]">
                        {item.date}
                      </div>
                      <div className="text-gray-800">
                        {item.event}
                      </div>
                    </div>
                    <Badge className={getEventColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summer Sessions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Clock className="h-8 w-8 mr-3 text-uw-purple" />
            Summer Sessions 2025
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {summerSessions.map((session, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{session.session}</CardTitle>
                  <CardDescription>{session.dates}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-uw-purple">{session.weeks}</span>
                    <p className="text-sm text-gray-600">weeks</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notices */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-amber-800">
            <AlertCircle className="h-6 w-6 mr-2" />
            Important Notes
          </h2>
          <div className="space-y-3 text-amber-800">
            <p>• Registration dates vary by class level and academic standing</p>
            <p>• Final exam schedules are published 4 weeks before exam period</p>
            <p>• Holiday closures may affect administrative services</p>
            <p>• Summer session dates may vary by program - check with your advisor</p>
            <p>• Graduation application deadlines are strictly enforced</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AcademicCalendar;
