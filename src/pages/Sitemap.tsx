import PageLayout from '@/components/PageLayout';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

const Sitemap = () => {
  useSEO({
    title: 'Site Map | NSCU',
    description: 'Complete navigation guide to all NSCU New States Continental University website pages, programs, departments, and resources.',
    keywords: 'NSCU sitemap, university pages, NSCU navigation, site map',
    canonical: 'https://nscu.govt.ac/sitemap',
  });

  const siteStructure: Record<string, Array<{ title: string; path: string }>> = {
    'Home': [
      { title: 'Welcome Message', path: '/home/welcome' },
      { title: 'Fast Facts', path: '/home/fast-facts' },
      { title: 'Virtual Tour', path: '/home/virtual-tour' },
      { title: 'News', path: '/home/news' },
      { title: 'Emergency Alerts', path: '/home/emergency' },
    ],
    'About': [
      { title: 'History & Mission', path: '/about/history-mission' },
      { title: 'Leadership', path: '/about/leadership' },
      { title: 'Accreditation', path: '/about/accreditation' },
      { title: 'Campus Map', path: '/about/campus-map' },
      { title: 'Sustainability', path: '/about/sustainability' },
      { title: 'Diversity & Inclusion', path: '/about/diversity-inclusion' },
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
      { title: 'PhD Programs', path: '/academics/phd-programs' },
      { title: 'Course Catalog', path: '/academics/course-catalog' },
      { title: 'Academic Calendar', path: '/academics/academic-calendar' },
    ],
    'Departments': [
      { title: 'English Literature', path: '/departments/english-literature' },
      { title: 'History', path: '/departments/history' },
      { title: 'Biology', path: '/departments/biology' },
      { title: 'Computer Science', path: '/departments/computer-science' },
      { title: 'Business Administration', path: '/departments/business-administration' },
      { title: 'Engineering', path: '/departments/engineering' },
      { title: 'Health Sciences', path: '/departments/health-sciences' },
      { title: 'Liberal Arts', path: '/departments/liberal-arts' },
    ],
    'Admissions': [
      { title: 'Undergraduate', path: '/admissions/undergraduate' },
      { title: 'Graduate', path: '/admissions/graduate' },
      { title: 'International', path: '/admissions/international' },
      { title: 'Transfer', path: '/admissions/transfer' },
      { title: 'Financial Aid', path: '/admissions/financial-aid' },
      { title: 'Campus Tours', path: '/admissions/tours' },
      { title: 'Apply Now', path: '/apply' },
      { title: 'Fast Track Admission', path: '/apply/fast-track' },
    ],
    'Student Life': [
      { title: 'Housing', path: '/student-life/housing' },
      { title: 'Dining', path: '/student-life/dining' },
      { title: 'Health & Wellness', path: '/student-life/health-wellness' },
      { title: 'Career Services', path: '/student-life/career-services' },
      { title: 'Student Organizations', path: '/student-life/organizations' },
      { title: 'Campus Recreation', path: '/student-life/recreation' },
      { title: 'Arts & Culture', path: '/student-life/artsculture' },
    ],
    'Campus Life': [
      { title: 'Fitness Centers', path: '/campus-life/fitness-centers' },
      { title: 'Greek Life', path: '/campus-life/greek-life' },
      { title: 'Intramurals', path: '/campus-life/intramurals' },
    ],
    'Research': [
      { title: 'Research Office', path: '/research/office' },
      { title: 'Undergraduate Research', path: '/research/undergraduate' },
      { title: 'Funding Opportunities', path: '/research/funding' },
      { title: 'Core Facilities', path: '/research/core-facilities' },
      { title: 'Technology Transfer', path: '/research/technology-transfer' },
      { title: 'Research Centers', path: '/research/centers' },
    ],
    'Alumni': [
      { title: 'Alumni Association', path: '/alumni/association' },
      { title: 'Alumni Benefits', path: '/alumni/benefits' },
      { title: 'Alumni Events', path: '/alumni/events' },
      { title: 'Career Networking', path: '/alumni/career-networking' },
      { title: 'Give Back', path: '/alumni/give-back' },
      { title: 'Alumni Directory', path: '/alumni/directory' },
    ],
    'Colleges & Global Campus': [
      { title: 'Full-Fledged Colleges', path: '/colleges/full-fledged' },
      { title: 'Offshore Colleges', path: '/colleges/offshore' },
      { title: 'Study Centers', path: '/colleges/study-centers' },
      { title: 'NSCU Affiliation', path: '/affiliation/nscu-affiliation' },
    ],
    'International': [
      { title: 'International Programs', path: '/international/programs' },
      { title: 'Collaborations', path: '/international/collaborations' },
    ],
    'Services': [
      { title: 'Libraries', path: '/services/libraries' },
      { title: 'Writing Center', path: '/services/writing-center' },
      { title: 'IT Help Desk', path: '/services/it-help-desk' },
      { title: 'Parking & Transportation', path: '/services/parking-transportation' },
      { title: 'Disability Services', path: '/services/disability-services' },
      { title: 'International Services', path: '/services/international' },
      { title: 'Multicultural Affairs', path: '/services/multicultural-affairs' },
      { title: 'Veterans Services', path: '/services/veterans' },
    ],
    'Resources': [
      { title: 'Student Handbook', path: '/resources/student-handbook' },
      { title: 'Academic Policies', path: '/resources/academic-policies' },
      { title: 'Campus Safety', path: '/resources/campus-safety' },
      { title: 'Emergency Info', path: '/resources/emergency-info' },
      { title: 'Title IX', path: '/resources/title-ix' },
    ],
    'News & Events': [
      { title: 'University News', path: '/news/university-news' },
      { title: 'Press Releases', path: '/news/press-releases' },
      { title: 'Events Calendar', path: '/events/calendar' },
    ],
    'Other': [
      { title: 'Athletics', path: '/athletics' },
      { title: 'Campus Facilities', path: '/campus/facilities' },
      { title: 'Faculty Directory', path: '/faculty/directory' },
      { title: 'Course Catalog', path: '/courses' },
      { title: 'Careers', path: '/careers' },
      { title: 'Contact Us', path: '/contact' },
      { title: 'Forms Portal', path: '/forms' },
    ],
    'Transparency': [
      { title: 'Transparency Portal', path: '/transparency' },
      { title: 'Annual Reports', path: '/transparency/annual-reports' },
      { title: 'Financial Statements', path: '/transparency/financial-statements' },
      { title: 'Accreditation Compliance', path: '/transparency/accreditation' },
    ],
    'Legal': [
      { title: 'Privacy Policy', path: '/legal/privacy-policy' },
      { title: 'Terms of Use', path: '/legal/terms-of-use' },
      { title: 'Terms & Conditions', path: '/legal/terms-conditions' },
      { title: 'Payment Policy', path: '/legal/payment-policy' },
      { title: 'Refund Policy', path: '/legal/refund-policy' },
      { title: 'Disclaimer', path: '/legal/disclaimer' },
      { title: 'Grievance', path: '/legal/grievance' },
      { title: 'Shipping Policy', path: '/legal/shipping-policy' },
    ],
  };

  return (
    <PageLayout 
      title="Site Map" 
      description="Complete navigation guide to all NSCU website pages and resources"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(siteStructure).map(([section, pages]) => (
              <div key={section} className="bg-card p-6 rounded-lg shadow-md border">
                <h2 className="text-xl font-bold text-primary mb-4">{section}</h2>
                <ul className="space-y-2">
                  {pages.map((page, index) => (
                    <li key={index}>
                      <Link 
                        to={page.path} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Quick Access</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded text-center hover:opacity-90 transition-opacity">
                Student Login
              </Link>
              <Link to="/courses" className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-center hover:opacity-90 transition-opacity">
                Browse Courses
              </Link>
              <Link to="/apply" className="bg-accent text-accent-foreground px-4 py-2 rounded text-center hover:opacity-90 transition-opacity">
                Apply Now
              </Link>
              <Link to="/contact" className="bg-muted-foreground text-background px-4 py-2 rounded text-center hover:opacity-90 transition-opacity">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Sitemap;
