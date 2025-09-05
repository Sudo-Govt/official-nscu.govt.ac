import PageLayout from '@/components/PageLayout';

const HealthSciences = () => {
  return (
    <PageLayout 
      title="Health Sciences Department" 
      description="Advancing health and wellness through education and research"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Health Sciences Education</h2>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Health Sciences Department is committed to training compassionate healthcare 
                professionals who will improve health outcomes and advance medical knowledge 
                through evidence-based practice and innovative research.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">600+</h3>
                  <p className="text-sm text-gray-600">Health Sciences Students</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">35</h3>
                  <p className="text-sm text-gray-600">Clinical Faculty</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">96%</h3>
                  <p className="text-sm text-gray-600">Licensure Pass Rate</p>
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
                  <li>Nursing (BSN)</li>
                  <li>Health Sciences</li>
                  <li>Pre-Health Professions</li>
                  <li>Public Health</li>
                  <li>Health Information Management</li>
                  <li>Exercise Science</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Graduate Programs</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Master of Science in Nursing</li>
                  <li>Master of Public Health</li>
                  <li>Doctor of Nursing Practice</li>
                  <li>Health Administration</li>
                  <li>Physician Assistant Studies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Clinical Partnerships</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                Our students gain real-world experience through partnerships with leading healthcare facilities.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Hospital Partners</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Delaware Medical Center</li>
                    <li>Regional Health System</li>
                    <li>Children's Hospital</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Community Health</h4>
                  <ul className="text-sm text-gray-600">
                    <li>Community clinics</li>
                    <li>Public health agencies</li>
                    <li>Rehabilitation centers</li>
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

export default HealthSciences;