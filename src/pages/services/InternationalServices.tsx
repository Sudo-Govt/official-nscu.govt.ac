import PageLayout from '@/components/PageLayout';

const InternationalServices = () => {
  return (
    <PageLayout 
      title="International Services" 
      description="Support for international students and scholars at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Student Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Immigration Support</h3>
                <p className="text-gray-600 mb-4">
                  Guidance on maintaining your immigration status while studying at NSCU.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>F-1 and J-1 visa assistance</li>
                  <li>CPT and OPT applications</li>
                  <li>Travel document guidance</li>
                  <li>Status maintenance</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Academic Support</h3>
                <p className="text-gray-600 mb-4">
                  Academic resources to help international students succeed.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>English language support</li>
                  <li>Academic advising</li>
                  <li>Study skills workshops</li>
                  <li>Tutoring services</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cultural Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Orientation Program</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive orientation for new international students.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Cultural Events</h3>
                <p className="text-sm text-gray-600">
                  Celebrate diversity through cultural programming.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Global Community</h3>
                <p className="text-sm text-gray-600">
                  Connect with students from around the world.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Office Location</h3>
                  <p className="text-gray-600">Student Services Building, Room 150</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Info</h3>
                  <p className="text-gray-600">Phone: (302) 857-6300</p>
                  <p className="text-gray-600">Email: international@nscu.edu</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default InternationalServices;