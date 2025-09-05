import PageLayout from '@/components/PageLayout';

const CareerNetworking = () => {
  return (
    <PageLayout 
      title="Career Networking" 
      description="Connect with NSCU alumni for career opportunities and mentorship"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Networking Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Alumni Mentorship</h3>
                <p className="text-gray-600 mb-4">
                  Connect with experienced alumni who can provide career guidance, 
                  industry insights, and professional development support.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>One-on-one mentoring</li>
                  <li>Industry-specific matching</li>
                  <li>Career guidance</li>
                  <li>Professional development</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Networking Events</h3>
                <p className="text-gray-600 mb-4">
                  Attend regional and industry-specific networking events to meet 
                  fellow alumni and expand your professional network.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Regional meetups</li>
                  <li>Industry mixers</li>
                  <li>Career fairs</li>
                  <li>Professional workshops</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Online Networking</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">NSCU Alumni Network</h3>
              <p className="mb-4">
                Join our exclusive online platform to connect with thousands of NSCU alumni worldwide.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Join Network
              </button>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default CareerNetworking;