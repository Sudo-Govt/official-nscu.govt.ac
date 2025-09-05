import PageLayout from '@/components/PageLayout';

const UndergraduateResearch = () => {
  return (
    <PageLayout 
      title="Undergraduate Research" 
      description="Research opportunities for undergraduate students at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Research Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Summer Research Program</h3>
                <p className="text-gray-600 mb-4">
                  Intensive 10-week summer research experience with faculty mentorship 
                  and research stipends.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>$4,000 research stipend</li>
                  <li>Faculty mentorship</li>
                  <li>Research presentation</li>
                  <li>Housing provided</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Academic Year Research</h3>
                <p className="text-gray-600 mb-4">
                  Participate in ongoing research projects during the academic year 
                  for course credit or volunteer experience.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Course credit available</li>
                  <li>Flexible scheduling</li>
                  <li>Multiple departments</li>
                  <li>Skills development</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How to Get Started</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Complete the undergraduate research application</li>
                <li>Meet with faculty in your area of interest</li>
                <li>Attend research orientation session</li>
                <li>Begin your research project</li>
              </ol>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default UndergraduateResearch;