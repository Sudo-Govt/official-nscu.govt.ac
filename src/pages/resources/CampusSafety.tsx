import PageLayout from '@/components/PageLayout';

const CampusSafety = () => {
  return (
    <PageLayout 
      title="Campus Safety" 
      description="Safety information and resources for the NSCU community"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white px-4 py-2 rounded font-bold">
                EMERGENCY: 911
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded">
                Campus Safety: (302) 857-6111
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Safety Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Campus Security</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>24/7 security patrol</li>
                  <li>Emergency response</li>
                  <li>Building security</li>
                  <li>Incident reporting</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Safety Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Safety escort service</li>
                  <li>Emergency notification system</li>
                  <li>Safety education workshops</li>
                  <li>Crime prevention programs</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Safety Resources</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Blue Light Phones</h4>
                  <p className="text-sm text-gray-600">Emergency phones located across campus</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety App</h4>
                  <p className="text-sm text-gray-600">Download NSCU Safe for mobile safety features</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Annual Report</h4>
                  <p className="text-sm text-gray-600">View our annual security and fire safety report</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default CampusSafety;