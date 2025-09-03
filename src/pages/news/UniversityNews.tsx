import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Calendar, User, ChevronRight, Award, Users, BookOpen } from 'lucide-react';

const UniversityNews = () => {
  useSEO({
    title: "University News - Latest Updates | NSCU Delaware",
    description: "Stay updated with the latest news from NSCU Delaware. Campus announcements, achievements, events, and important university updates.",
    keywords: "university news, campus news, NSCU Delaware news, announcements, achievements, events"
  });

  const newsArticles = [
    {
      id: 1,
      title: "NSCU Delaware Receives $2.5M Research Grant for Renewable Energy Initiative",
      excerpt: "The National Science Foundation awards major funding to advance solar energy research and sustainable technology development.",
      date: "2024-08-15",
      author: "Communications Office",
      category: "Research",
      image: "/placeholder-news-1.jpg"
    },
    {
      id: 2,
      title: "New Medical School Building Opens with State-of-the-Art Facilities",
      excerpt: "The $45 million facility features advanced simulation labs, research centers, and collaborative learning spaces for medical students.",
      date: "2024-08-12",
      author: "University Relations",
      category: "Campus",
      image: "/placeholder-news-2.jpg"
    },
    {
      id: 3,
      title: "NSCU Students Win National Engineering Competition",
      excerpt: "Engineering team takes first place at the National Collegiate Design Competition with innovative water purification system.",
      date: "2024-08-10",
      author: "Engineering Department",
      category: "Academics",
      image: "/placeholder-news-3.jpg"
    }
  ];

  return (
    <PageLayout 
      title="University News" 
      description="Stay informed with the latest updates from NSCU Delaware"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Award className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Recent Awards</h3>
              <p className="text-gray-600">Recognition and achievements</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Campus Events</h3>
              <p className="text-gray-600">Upcoming activities and programs</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Academic News</h3>
              <p className="text-gray-600">Educational initiatives and updates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-uw-purple mb-8">Latest News</h2>
              <div className="space-y-8">
                {newsArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-uw-gold text-uw-dark px-3 py-1 rounded-full text-sm font-semibold">
                          {article.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(article.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-uw-purple mb-3 hover:text-uw-gold transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <button className="flex items-center text-uw-purple hover:text-uw-gold transition-colors font-semibold">
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button className="bg-uw-purple text-white px-8 py-3 rounded-lg hover:bg-uw-dark transition-colors font-semibold">
                  Load More Articles
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-uw-purple mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-600 hover:text-uw-gold transition-colors">
                      • Campus Calendar
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-uw-gold transition-colors">
                      • Press Releases
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-uw-gold transition-colors">
                      • Faculty Spotlights
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-uw-gold transition-colors">
                      • Student Achievements
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-uw-gold transition-colors">
                      • Alumni News
                    </a>
                  </div>
                </div>

                <div className="bg-uw-purple text-white rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
                  <p className="mb-4">Subscribe to our newsletter for weekly updates</p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-3 py-2 rounded text-gray-900"
                    />
                    <button className="w-full bg-uw-gold text-uw-dark py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-uw-purple mb-4">Media Contact</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Communications Office</strong></p>
                    <p>Phone: (302) 857-6060</p>
                    <p>Email: news@nscu.edu</p>
                    <p>Office: Administration Building, Room 210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UniversityNews;