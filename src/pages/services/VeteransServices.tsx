import PageLayout from '@/components/PageLayout';

const VeteransServices = () => {
  return (
    <PageLayout 
      title="Veterans Services" 
      description="Support and resources for veteran students at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Veteran Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">GI Bill Benefits</h3>
                <p className="text-gray-600 mb-4">
                  NSCU is approved for all GI Bill programs including Post-9/11 GI Bill, 
                  Montgomery GI Bill, and Yellow Ribbon Program.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Tuition coverage</li>
                  <li>Housing allowance</li>
                  <li>Book stipend</li>
                  <li>Yellow Ribbon funding</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Veteran Support</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive support services to help veterans succeed academically 
                  and personally.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Academic advising</li>
                  <li>Career counseling</li>
                  <li>Mental health support</li>
                  <li>Peer mentoring</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Student Organizations</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Student Veterans Association</h3>
              <p className="mb-4">
                Connect with fellow veteran students through our active SVA chapter.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Activities</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Social events</li>
                    <li>Service projects</li>
                    <li>Advocacy initiatives</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Networking opportunities</li>
                    <li>Leadership development</li>
                    <li>Community building</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact the Veterans Services Office</li>
                <li>Submit your DD-214 and VA eligibility letter</li>
                <li>Meet with a veteran advisor</li>
                <li>Complete benefit certification</li>
                <li>Register for classes</li>
              </ol>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default VeteransServices;