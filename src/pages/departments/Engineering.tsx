import PageLayout from '@/components/PageLayout';

const Engineering = () => {
  return (
    <PageLayout 
      title="Engineering Department" 
      description="Innovative engineering education and research at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Engineering Excellence</h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Engineering Department at NSCU is dedicated to preparing the next generation 
                of engineers to solve complex global challenges through innovative design, 
                cutting-edge research, and hands-on experience.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">800+</h3>
                  <p className="text-sm text-gray-600">Engineering Students</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">40</h3>
                  <p className="text-sm text-gray-600">Faculty & Staff</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">98%</h3>
                  <p className="text-sm text-gray-600">Job Placement Rate</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Engineering Disciplines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Undergraduate Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Civil Engineering</li>
                  <li>Mechanical Engineering</li>
                  <li>Electrical Engineering</li>
                  <li>Computer Engineering</li>
                  <li>Chemical Engineering</li>
                  <li>Environmental Engineering</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Graduate Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Master of Engineering</li>
                  <li>Master of Science</li>
                  <li>Doctor of Philosophy (PhD)</li>
                  <li>Professional Engineering Certificate</li>
                  <li>Interdisciplinary Programs</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Research & Innovation</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Renewable Energy</h3>
                <p className="text-sm text-gray-600">
                  Advanced research in solar, wind, and sustainable energy systems.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Smart Infrastructure</h3>
                <p className="text-sm text-gray-600">
                  Developing intelligent transportation and urban systems.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Robotics & AI</h3>
                <p className="text-sm text-gray-600">
                  Cutting-edge robotics and artificial intelligence research.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default Engineering;