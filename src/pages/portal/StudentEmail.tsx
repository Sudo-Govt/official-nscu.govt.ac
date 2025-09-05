import PageLayout from '@/components/PageLayout';

const StudentEmail = () => {
  return (
    <PageLayout 
      title="Student Email" 
      description="Access your NSCU student email account"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Student Email Access</h2>
            <p className="mb-4">
              Access your official NSCU student email account. All important university 
              communications will be sent to your student email.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Access Student Email
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Email Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Email Format</h3>
                <p className="text-gray-600 mb-4">
                  Your student email address follows this format:
                </p>
                <code className="bg-gray-100 px-3 py-2 rounded block">
                  firstname.lastname@student.nscu.edu
                </code>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Storage & Features</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>50GB storage space</li>
                  <li>Microsoft Office 365 integration</li>
                  <li>Calendar and contacts sync</li>
                  <li>Mobile app access</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Email Setup</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Mobile and Desktop Setup</h3>
              <p className="mb-4">
                Configure your student email on your devices for easy access.
              </p>
              <div className="flex space-x-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  iOS Setup Guide
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Android Setup Guide
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Outlook Setup
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default StudentEmail;