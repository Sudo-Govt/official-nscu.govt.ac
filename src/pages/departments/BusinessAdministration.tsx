import PageLayout from '@/components/PageLayout';

const BusinessAdministration = () => {
  return (
    <PageLayout 
      title="Business Administration Department" 
      description="Prepare for business leadership with comprehensive business education"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Department Overview</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Department of Business Administration prepares students to be innovative 
                leaders in the global business environment through rigorous academic programs, 
                experiential learning, and strong industry partnerships.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">500+</h3>
                  <p className="text-sm text-gray-600">Business Students</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">25</h3>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">95%</h3>
                  <p className="text-sm text-gray-600">Employment Rate</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Academic Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Undergraduate Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Bachelor of Business Administration</li>
                  <li>Business Analytics</li>
                  <li>Entrepreneurship</li>
                  <li>International Business</li>
                  <li>Marketing</li>
                  <li>Finance</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Graduate Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Master of Business Administration (MBA)</li>
                  <li>Executive MBA</li>
                  <li>Master of Science in Finance</li>
                  <li>Master of Marketing</li>
                  <li>Certificate Programs</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Faculty Excellence</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Our distinguished faculty combine academic excellence with real-world experience.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Research Focus Areas</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Digital Marketing</li>
                    <li>Sustainable Business</li>
                    <li>Financial Technology</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Industry Connections</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Fortune 500 consulting</li>
                    <li>Startup advisory boards</li>
                    <li>Professional associations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessAdministration;