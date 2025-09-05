import PageLayout from '@/components/PageLayout';

const EventsCalendar = () => {
  return (
    <PageLayout 
      title="Events Calendar" 
      description="Discover upcoming events and activities at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-4">
                Stay connected with the vibrant campus community through our diverse calendar of events, 
                from academic lectures to cultural celebrations and student activities.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                View Full Calendar
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">Annual Research Symposium</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Academic</span>
                </div>
                <p className="text-gray-600 mb-2">March 15, 2024 • 9:00 AM - 5:00 PM</p>
                <p className="text-gray-700 mb-3">
                  Showcase of undergraduate and graduate student research across all disciplines.
                </p>
                <p className="text-sm text-gray-500">Location: Student Center Auditorium</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">Spring Career Fair</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Career</span>
                </div>
                <p className="text-gray-600 mb-2">March 22, 2024 • 10:00 AM - 4:00 PM</p>
                <p className="text-gray-700 mb-3">
                  Connect with over 100 employers for internships and full-time opportunities.
                </p>
                <p className="text-sm text-gray-500">Location: Recreation Center</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">International Festival</h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">Cultural</span>
                </div>
                <p className="text-gray-600 mb-2">April 5, 2024 • 6:00 PM - 9:00 PM</p>
                <p className="text-gray-700 mb-3">
                  Celebrate global diversity with food, music, and performances from around the world.
                </p>
                <p className="text-sm text-gray-500">Location: Campus Quad</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Event Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Academic Events</h3>
                <p className="text-sm text-gray-600">Lectures, conferences, and scholarly presentations</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Student Life</h3>
                <p className="text-sm text-gray-600">Social events, activities, and campus traditions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Athletics</h3>
                <p className="text-sm text-gray-600">Sports games, tournaments, and fitness events</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default EventsCalendar;