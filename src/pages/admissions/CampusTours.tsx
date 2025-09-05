import PageLayout from '@/components/PageLayout';

const CampusTours = () => {
  return (
    <PageLayout 
      title="Campus Tours" 
      description="Explore NSCU's beautiful campus through guided tours"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Tour Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Guided Tours</h3>
                <p className="text-gray-600 mb-4">
                  Join our student ambassadors for comprehensive campus tours showcasing 
                  academic buildings, residence halls, and student facilities.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Daily tours at 10am, 1pm, 3pm</li>
                  <li>90-minute duration</li>
                  <li>Led by current students</li>
                  <li>Registration required</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Self-Guided Tours</h3>
                <p className="text-gray-600 mb-4">
                  Explore at your own pace with our mobile app featuring interactive 
                  maps and audio guides.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Available 24/7</li>
                  <li>Mobile app guided</li>
                  <li>Audio commentary</li>
                  <li>No registration needed</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Schedule Your Visit</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="mb-4">Ready to visit NSCU? Schedule your campus tour today!</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Schedule Tour
              </button>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default CampusTours;