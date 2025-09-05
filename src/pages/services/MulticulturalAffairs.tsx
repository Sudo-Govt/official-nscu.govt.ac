import PageLayout from '@/components/PageLayout';

const MulticulturalAffairs = () => {
  return (
    <PageLayout 
      title="Multicultural Affairs" 
      description="Promoting diversity, inclusion, and multicultural awareness at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-lg">
                The Office of Multicultural Affairs is committed to creating an inclusive campus 
                environment that celebrates diversity, promotes cross-cultural understanding, and 
                supports the success of all students, faculty, and staff.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Programs & Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Student Support</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Mentoring programs</li>
                  <li>Academic support services</li>
                  <li>Leadership development</li>
                  <li>Scholarship opportunities</li>
                  <li>Personal counseling</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Cultural Programming</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Heritage month celebrations</li>
                  <li>Cultural awareness workshops</li>
                  <li>Diversity conferences</li>
                  <li>Interfaith dialogue</li>
                  <li>International festivals</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cultural Centers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">African American Cultural Center</h3>
                <p className="text-sm text-gray-600">
                  Celebrating African American heritage and culture.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Latino Cultural Center</h3>
                <p className="text-sm text-gray-600">
                  Promoting Latino/Hispanic culture and traditions.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Asian Pacific Islander Center</h3>
                <p className="text-sm text-gray-600">
                  Honoring Asian Pacific Islander communities.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">Join us in creating a more inclusive campus community.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Student Organizations
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Volunteer Opportunities
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Cultural Events
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default MulticulturalAffairs;