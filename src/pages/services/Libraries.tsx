import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Book, Search, Clock, MapPin, Users, Computer } from 'lucide-react';

const Libraries = () => {
  useSEO({
    title: "University Libraries - NSCU Delaware",
    description: "Explore NSCU Delaware's extensive library system with millions of books, digital resources, study spaces, and research support services for students and faculty.",
    keywords: "NSCU libraries, university library, research resources, study spaces, digital collections, academic databases"
  });

  return (
    <PageLayout 
      title="University Libraries" 
      description="Your gateway to knowledge, research, and academic excellence"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Book className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">2.5M+ Books</h3>
              <p className="text-gray-600">Extensive collection spanning all academic disciplines</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Computer className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Digital Resources</h3>
              <p className="text-gray-600">Access to academic databases and e-journals</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Research Support</h3>
              <p className="text-gray-600">Expert librarians to guide your research</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Library Locations</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Main Library</h3>
                    <p className="text-gray-600">University Center, Open 24/7 during finals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Science & Engineering Library</h3>
                    <p className="text-gray-600">Engineering Building, Floor 2</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Health Sciences Library</h3>
                    <p className="text-gray-600">Medical Campus, Building A</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Services</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-uw-gold" />
                  <span>Research consultations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Book className="h-5 w-5 text-uw-gold" />
                  <span>Interlibrary loan services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Computer className="h-5 w-5 text-uw-gold" />
                  <span>Technology support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-uw-gold" />
                  <span>Extended hours during exams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Libraries;