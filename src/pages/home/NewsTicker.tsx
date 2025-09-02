
import PageLayout from '@/components/PageLayout';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const newsItems = [
  {
    title: "NSCU-Delaware Receives $50M Grant for Climate Research",
    excerpt: "The university's Environmental Science department has been awarded a major federal grant to study climate adaptation strategies.",
    date: "December 15, 2024",
    author: "University Communications",
    category: "Research"
  },
  {
    title: "New Engineering Building Opens for Spring Semester",
    excerpt: "The state-of-the-art facility features advanced laboratories and collaborative learning spaces for students.",
    date: "December 12, 2024",
    author: "Campus News",
    category: "Campus"
  },
  {
    title: "NSCU Students Win National Innovation Competition",
    excerpt: "A team of computer science students took first place in the nationwide technology innovation challenge.",
    date: "December 10, 2024",
    author: "Student Affairs",
    category: "Students"
  },
  {
    title: "Distinguished Alumni to Deliver Commencement Address",
    excerpt: "Nobel Prize winner and NSCU alumna Dr. Maria Rodriguez will speak at the spring graduation ceremony.",
    date: "December 8, 2024",
    author: "Alumni Relations",
    category: "Alumni"
  },
  {
    title: "University Announces New Scholarship Program",
    excerpt: "The First-Generation Success Scholarship will provide full tuition support for eligible students.",
    date: "December 5, 2024",
    author: "Financial Aid",
    category: "Admissions"
  }
];

const NewsTicker = () => {
  return (
    <PageLayout 
      title="University News" 
      description="Stay informed with the latest news and updates from NSCU-Delaware"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Breaking News Banner */}
          <div className="bg-uw-gold text-uw-dark p-4 rounded-lg mb-8">
            <div className="flex items-center">
              <span className="font-bold mr-4">BREAKING:</span>
              <span className="flex-1">NSCU-Delaware ranked #10 among public universities in latest US News rankings</span>
              <Button size="sm" variant="outline" className="ml-4">
                Read More
              </Button>
            </div>
          </div>

          {/* Featured News */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="NSCU University Campus News - Students Learning in Modern Academic Environment"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">December 15, 2024</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>University Communications</span>
                  </div>
                  <h2 className="text-2xl font-bold text-uw-purple mb-3">
                    NSCU-Delaware Receives $50M Grant for Climate Research
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The university's Environmental Science department has been awarded a major federal grant 
                    to study climate adaptation strategies. This groundbreaking research will focus on 
                    developing innovative solutions for coastal communities facing rising sea levels.
                  </p>
                  <Button className="bg-uw-purple hover:bg-uw-purple/90">
                    Read Full Story
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-uw-purple">Latest Updates</h3>
              {newsItems.slice(1, 4).map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="text-xs text-uw-gold font-semibold mb-1">{item.category}</div>
                  <h4 className="font-bold text-uw-purple mb-2 text-sm">{item.title}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All News Items */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-8">Recent News</h2>
            <div className="space-y-6">
              {newsItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="bg-uw-gold text-uw-dark px-2 py-1 rounded text-xs font-semibold mr-3">
                          {item.category}
                        </span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-4">{item.date}</span>
                        <User className="h-4 w-4 mr-1" />
                        <span>{item.author}</span>
                      </div>
                      <h3 className="text-xl font-bold text-uw-purple mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.excerpt}</p>
                    </div>
                    <Button variant="outline" className="ml-6">
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-uw-purple rounded-lg p-8 text-center text-white mt-12">
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-xl mb-6">
              Subscribe to our newsletter for the latest university news and updates
            </p>
            <div className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-2 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-uw-gold text-gray-900"
              />
              <Button className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsTicker;
