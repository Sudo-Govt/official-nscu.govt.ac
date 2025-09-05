import PageLayout from '@/components/PageLayout';

const TitleIX = () => {
  return (
    <PageLayout 
      title="Title IX" 
      description="Title IX resources and reporting at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">What is Title IX?</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Title IX is a federal law that prohibits sex-based discrimination in education programs 
                and activities. NSCU is committed to providing an environment free from sex discrimination, 
                sexual harassment, and sexual violence.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Reporting Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Formal Reporting</h3>
                <p className="text-gray-600 mb-4">
                  File a formal complaint to initiate an investigation process.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Title IX Coordinator</li>
                  <li>Online reporting form</li>
                  <li>Campus Safety</li>
                  <li>Human Resources</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Confidential Resources</h3>
                <p className="text-gray-600 mb-4">
                  Speak with confidential resources for support without formal reporting.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Counseling Center</li>
                  <li>Health Services</li>
                  <li>Employee Assistance Program</li>
                  <li>Chaplains</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Support Services</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Crisis Support</h4>
                  <p className="text-sm text-gray-600">24/7 crisis counseling and support</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Academic Accommodations</h4>
                  <p className="text-sm text-gray-600">Support for academic continuity</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety Planning</h4>
                  <p className="text-sm text-gray-600">Personal safety planning assistance</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="font-semibold">Title IX Coordinator</h3>
                <p>Email: titleix@nscu.edu</p>
                <p>Phone: (302) 857-6200</p>
              </div>
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                File a Report
              </button>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default TitleIX;