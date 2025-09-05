import PageLayout from '@/components/PageLayout';

const Canvas = () => {
  return (
    <PageLayout 
      title="Canvas Learning Management System" 
      description="Access your online courses and learning materials"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-orange-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Access Canvas</h2>
            <p className="mb-4">
              Canvas is NSCU's learning management system where you'll find course materials, 
              submit assignments, and interact with instructors and classmates.
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700">
              Login to Canvas
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Canvas Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Course Management</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Access course materials</li>
                  <li>Submit assignments</li>
                  <li>View grades and feedback</li>
                  <li>Download lecture notes</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Communication Tools</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Discussion forums</li>
                  <li>Messaging system</li>
                  <li>Video conferences</li>
                  <li>Announcements</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Getting Help</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">Need help with Canvas? Our support team is here to assist you.</p>
              <div className="flex space-x-4">
                <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Canvas Help Guides
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Contact IT Support
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default Canvas;