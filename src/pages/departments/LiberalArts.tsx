import PageLayout from '@/components/PageLayout';

const LiberalArts = () => {
  return (
    <PageLayout 
      title="Liberal Arts Department" 
      description="Explore the humanities and develop critical thinking skills"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Liberal Arts Education</h2>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Liberal Arts Department provides a comprehensive education that develops 
                critical thinking, communication skills, and cultural awareness. Our programs 
                prepare students for diverse careers and lifelong learning.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">700+</h3>
                  <p className="text-sm text-gray-600">Liberal Arts Students</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">45</h3>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">15</h3>
                  <p className="text-sm text-gray-600">Academic Programs</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Academic Disciplines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Humanities</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>English Literature</li>
                  <li>History</li>
                  <li>Philosophy</li>
                  <li>Religious Studies</li>
                  <li>Art History</li>
                  <li>Creative Writing</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Social Sciences</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Political Science</li>
                  <li>Sociology</li>
                  <li>Psychology</li>
                  <li>Anthropology</li>
                  <li>International Studies</li>
                  <li>Women's Studies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Experiential Learning</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Study Abroad</h3>
                <p className="text-sm text-gray-600">
                  Immersive cultural experiences in over 25 countries.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Internships</h3>
                <p className="text-sm text-gray-600">
                  Professional experience with museums, media, and nonprofits.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Research</h3>
                <p className="text-sm text-gray-600">
                  Independent research projects with faculty mentorship.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default LiberalArts;