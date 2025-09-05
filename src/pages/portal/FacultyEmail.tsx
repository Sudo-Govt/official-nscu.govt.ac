import PageLayout from '@/components/PageLayout';

const FacultyEmail = () => {
  return (
    <PageLayout 
      title="Faculty Email" 
      description="Access your NSCU faculty email account"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Faculty Email Access</h2>
            <p className="mb-4">
              Access your official NSCU faculty email account with enhanced features 
              for academic and administrative communication.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Access Faculty Email
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Faculty Email Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Enhanced Services</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>100GB storage space</li>
                  <li>Advanced security features</li>
                  <li>Shared calendars</li>
                  <li>Distribution lists</li>
                  <li>Large file sharing</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Academic Integration</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Course roster integration</li>
                  <li>Student communication tools</li>
                  <li>Grade notification system</li>
                  <li>Meeting scheduling</li>
                  <li>Research collaboration</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Support Resources</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Faculty-specific IT support and training resources are available.
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Faculty IT Support
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Email Training
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default FacultyEmail;