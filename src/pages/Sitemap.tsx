import PageLayout from '@/components/PageLayout';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const siteStructure = {
    'Home': [
      { title: 'Welcome Message', path: '/home/welcome' },
      { title: 'Fast Facts', path: '/home/fast-facts' },
      { title: 'Virtual Tour', path: '/home/virtual-tour' },
      { title: 'News Ticker', path: '/home/news' },
      { title: 'Emergency Alerts', path: '/home/emergency' }
    ],
    'About': [
      { title: 'History & Mission', path: '/about/history-mission' },
      { title: 'Leadership', path: '/about/leadership' },
      { title: 'Accreditation', path: '/about/accreditation' },
      { title: 'Campus Map', path: '/about/campus-map' },
      { title: 'Sustainability', path: '/about/sustainability' },
      { title: 'Diversity & Inclusion', path: '/about/diversity-inclusion' }
    ],
    'Academics': [
      { title: 'College of Arts & Sciences', path: '/academics/college-arts-sciences' },
      { title: 'School of Arts', path: '/academics/school-arts' },
      { title: 'School of Science', path: '/academics/school-science' },
      { title: 'College of Engineering', path: '/academics/college-engineering' },
      { title: 'School of Business', path: '/academics/school-business' },
      { title: 'College of Health Sciences', path: '/academics/college-health-sciences' },
      { title: 'School of Medicine', path: '/academics/school-medicine' },
      { title: 'School of Law', path: '/academics/school-law' },
      { title: 'College of Education', path: '/academics/college-education' },
      { title: 'School of Public Health', path: '/academics/school-public-health' },
      { title: 'School of Social Work', path: '/academics/school-social-work' },
      { title: 'College of Veterinary Medicine', path: '/academics/college-veterinary-medicine' },
      { title: 'Course Catalog', path: '/academics/course-catalog' },
      { title: 'Academic Calendar', path: '/academics/academic-calendar' }
    ],
    'Admissions': [
      { title: 'Undergraduate Admissions', path: '/admissions/undergraduate' },
      { title: 'Graduate Admissions', path: '/admissions/graduate' },
      { title: 'International Admissions', path: '/admissions/international' },
      { title: 'Transfer Admissions', path: '/admissions/transfer' },
      { title: 'Financial Aid', path: '/admissions/financial-aid' },
      { title: 'Campus Tours', path: '/admissions/tours' },
      { title: 'Apply Now', path: '/admissions/apply' }
    ],
    'Student Life': [
      { title: 'Housing & Dining', path: '/student-life/housing' },
      { title: 'Dining', path: '/student-life/dining' },
      { title: 'Health & Wellness', path: '/student-life/health-wellness' },
      { title: 'Career Services', path: '/student-life/career-services' },
      { title: 'Student Organizations', path: '/student-life/organizations' },
      { title: 'Campus Recreation', path: '/student-life/recreation' },
      { title: 'Arts & Culture', path: '/student-life/artsculture' }
    ],
    'Research': [
      { title: 'Research Office', path: '/research/office' },
      { title: 'Undergraduate Research', path: '/research/undergraduate' },
      { title: 'Funding Opportunities', path: '/research/funding' },
      { title: 'Core Facilities', path: '/research/core-facilities' },
      { title: 'Technology Transfer', path: '/research/technology-transfer' }
    ],
    'Alumni': [
      { title: 'Alumni Association', path: '/alumni/association' },
      { title: 'Alumni Benefits', path: '/alumni/benefits' },
      { title: 'Alumni Events', path: '/alumni/events' },
      { title: 'Career Networking', path: '/alumni/career-networking' },
      { title: 'Give Back', path: '/alumni/give-back' }
    ],
    'Campus Life': [
      { title: 'Greek Life', path: '/campus-life/greek-life' },
      { title: 'Intramurals', path: '/campus-life/intramurals' }
    ],
    'Services': [
      { title: 'Libraries', path: '/services/libraries' },
      { title: 'Writing Center', path: '/services/writing-center' },
      { title: 'IT Help Desk', path: '/services/it-help-desk' },
      { title: 'Parking & Transportation', path: '/services/parking-transportation' },
      { title: 'Disability Services', path: '/services/disability-services' }
    ],
    'Portal': [
      { title: 'MyNSCU', path: '/portal/mynscu' }
    ]
  };

  return (
    <PageLayout 
      title="Site Map" 
      description="Complete navigation guide to all NSCU Delaware USA website pages and resources"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(siteStructure).map(([section, pages]) => (
              <div key={section} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-uw-purple mb-4">{section}</h2>
                <ul className="space-y-2">
                  {pages.map((page, index) => (
                    <li key={index}>
                      <Link 
                        to={page.path} 
                        className="text-gray-600 hover:text-uw-purple transition-colors text-sm"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-uw-purple mb-4">Quick Access</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link 
                to="/login" 
                className="bg-uw-purple text-white px-4 py-2 rounded text-center hover:bg-uw-purple/90 transition-colors"
              >
                Student Login
              </Link>
              <Link 
                to="/dashboard" 
                className="bg-uw-gold text-uw-purple px-4 py-2 rounded text-center hover:bg-uw-gold/90 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/admissions/apply" 
                className="bg-green-600 text-white px-4 py-2 rounded text-center hover:bg-green-700 transition-colors"
              >
                Apply Now
              </Link>
              <Link 
                to="/admissions/tours" 
                className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition-colors"
              >
                Schedule Tour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Sitemap;