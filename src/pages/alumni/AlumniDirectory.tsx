import PageLayout from '@/components/PageLayout';

const AlumniDirectory = () => {
  return (
    <PageLayout 
      title="Alumni Directory" 
      description="Search and connect with NSCU alumni worldwide"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Search Alumni</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Enter name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <select className="w-full p-2 border rounded">
                    <option value="">Select year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">College/School</label>
                  <select className="w-full p-2 border rounded">
                    <option value="">Select college</option>
                    <option value="engineering">College of Engineering</option>
                    <option value="business">School of Business</option>
                    <option value="arts">College of Arts & Sciences</option>
                  </select>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Search Directory
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Directory Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">50,000+ Alumni</h3>
                <p className="text-sm text-gray-600">Connect with graduates worldwide</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Advanced Search</h3>
                <p className="text-sm text-gray-600">Find alumni by industry, location, and more</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Privacy Controls</h3>
                <p className="text-sm text-gray-600">Manage your profile visibility</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default AlumniDirectory;