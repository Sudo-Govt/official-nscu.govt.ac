import PageLayout from '@/components/PageLayout';

const ArtsCulture = () => {
  return (
    <PageLayout 
      title="Arts & Culture" 
      description="Explore the vibrant arts and cultural scene at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Cultural Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Performing Arts</h3>
                <p className="text-gray-600 mb-4">
                  Experience world-class performances by students and guest artists in our 
                  state-of-the-art theaters and concert halls.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Theater Productions</li>
                  <li>Musical Concerts</li>
                  <li>Dance Performances</li>
                  <li>Opera & Vocal Events</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Visual Arts</h3>
                <p className="text-gray-600 mb-4">
                  Discover creativity through our galleries, studios, and public art 
                  installations across campus.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Art Galleries</li>
                  <li>Student Exhibitions</li>
                  <li>Sculpture Gardens</li>
                  <li>Digital Media Labs</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cultural Centers</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Arts Center</h4>
                  <p className="text-sm text-gray-600">Main hub for all artistic activities</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cultural Events</h4>
                  <p className="text-sm text-gray-600">Year-round programming and festivals</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Student Groups</h4>
                  <p className="text-sm text-gray-600">Join arts-focused organizations</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default ArtsCulture;