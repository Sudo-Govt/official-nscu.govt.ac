
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-uw-dark text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Academics Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">Academics</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-2">Colleges & Schools</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/academics/college-arts-sciences" className="hover:text-uw-gold transition-colors">College of Arts & Sciences</Link></li>
                <li><Link to="/academics/college-engineering" className="hover:text-uw-gold transition-colors">College of Engineering</Link></li>
                <li><Link to="/academics/school-business" className="hover:text-uw-gold transition-colors">School of Business</Link></li>
                <li><Link to="/academics/college-health-sciences" className="hover:text-uw-gold transition-colors">College of Health Sciences</Link></li>
                <li><Link to="/academics/school-medicine" className="hover:text-uw-gold transition-colors">School of Medicine</Link></li>
                <li><Link to="/academics/school-law" className="hover:text-uw-gold transition-colors">School of Law</Link></li>
                <li><Link to="/academics/college-education" className="hover:text-uw-gold transition-colors">College of Education</Link></li>
                <li><Link to="/academics/school-arts" className="hover:text-uw-gold transition-colors">Graduate School</Link></li>
              </ul>
              <h4 className="font-semibold text-sm mb-2 mt-4">Academic Resources</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/academics/course-catalog" className="hover:text-uw-gold transition-colors">Course Catalog</Link></li>
                <li><Link to="/academics/academic-calendar" className="hover:text-uw-gold transition-colors">Academic Calendar</Link></li>
                <li><Link to="/services/libraries" className="hover:text-uw-gold transition-colors">Libraries</Link></li>
                <li><Link to="/services/writing-center" className="hover:text-uw-gold transition-colors">Writing Center</Link></li>
              </ul>
            </div>
          </div>

          {/* Student Life & Admissions Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">Student Life</h3>
            <div className="space-y-2">
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/student-life/housing" className="hover:text-uw-gold transition-colors">Housing & Dining</Link></li>
                <li><Link to="/student-life/health-wellness" className="hover:text-uw-gold transition-colors">Health & Wellness</Link></li>
                <li><Link to="/student-life/career-services" className="hover:text-uw-gold transition-colors">Career Services</Link></li>
                <li><Link to="/student-life/organizations" className="hover:text-uw-gold transition-colors">Student Organizations</Link></li>
                <li><Link to="/student-life/recreation" className="hover:text-uw-gold transition-colors">Campus Recreation</Link></li>
                <li><Link to="/student-life/artsculture" className="hover:text-uw-gold transition-colors">Arts & Culture</Link></li>
              </ul>
              
              <h4 className="font-semibold text-sm mb-2 mt-4">Admissions</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/admissions/undergraduate" className="hover:text-uw-gold transition-colors">Undergraduate Admissions</Link></li>
                <li><Link to="/admissions/graduate" className="hover:text-uw-gold transition-colors">Graduate Admissions</Link></li>
                <li><Link to="/admissions/international" className="hover:text-uw-gold transition-colors">International Admissions</Link></li>
                <li><Link to="/admissions/transfer" className="hover:text-uw-gold transition-colors">Transfer Admissions</Link></li>
                <li><Link to="/admissions/financial-aid" className="hover:text-uw-gold transition-colors">Financial Aid</Link></li>
                <li><Link to="/admissions/tours" className="hover:text-uw-gold transition-colors">Campus Tours</Link></li>
              </ul>
            </div>
          </div>

          {/* Research & Alumni Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">Research & Alumni</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-2">Research</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/research/office" className="hover:text-uw-gold transition-colors">Research Office</Link></li>
                <li><Link to="/research/funding" className="hover:text-uw-gold transition-colors">Funding Opportunities</Link></li>
                <li><Link to="/research/core-facilities" className="hover:text-uw-gold transition-colors">Core Facilities</Link></li>
                <li><Link to="/research/technology-transfer" className="hover:text-uw-gold transition-colors">Technology Transfer</Link></li>
                <li><Link to="/research/undergraduate" className="hover:text-uw-gold transition-colors">Undergraduate Research</Link></li>
              </ul>
              
              <h4 className="font-semibold text-sm mb-2 mt-4">Alumni</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/alumni/association" className="hover:text-uw-gold transition-colors">Alumni Association</Link></li>
                <li><Link to="/alumni/benefits" className="hover:text-uw-gold transition-colors">Alumni Benefits</Link></li>
                <li><Link to="/alumni/career-networking" className="hover:text-uw-gold transition-colors">Career Networking</Link></li>
                <li><Link to="/alumni/events" className="hover:text-uw-gold transition-colors">Alumni Events</Link></li>
                <li><Link to="/alumni/give-back" className="hover:text-uw-gold transition-colors">Give Back</Link></li>
                <li><Link to="/alumni/association" className="hover:text-uw-gold transition-colors">Alumni Directory</Link></li>
              </ul>
            </div>
          </div>

          {/* About & Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">About & Contact</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-2">About NSCU Delaware USA</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><Link to="/about/history-mission" className="hover:text-uw-gold transition-colors">History & Mission</Link></li>
                <li><Link to="/about/leadership" className="hover:text-uw-gold transition-colors">Leadership</Link></li>
                <li><Link to="/about/accreditation" className="hover:text-uw-gold transition-colors">Accreditation</Link></li>
                <li><Link to="/about/campus-map" className="hover:text-uw-gold transition-colors">Campus Map</Link></li>
                <li><Link to="/about/sustainability" className="hover:text-uw-gold transition-colors">Sustainability</Link></li>
                <li><Link to="/about/diversity-inclusion" className="hover:text-uw-gold transition-colors">Diversity & Inclusion</Link></li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-uw-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">100 University Plaza<br />Dover, DE 19901</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-uw-gold flex-shrink-0" />
                    <span className="text-sm text-gray-300">(302) 857-6060</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-uw-gold flex-shrink-0" />
                    <span className="text-sm text-gray-300">info@nscu.govt.ac</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 text-uw-gold flex-shrink-0" />
                    <a href="https://linkedin.com/company/nscu-us" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-uw-gold transition-colors">NSCU on LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Links Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Quick Links</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/login" className="hover:text-uw-gold transition-colors">MyNSCU Portal</Link></li>
                <li><Link to="/login" className="hover:text-uw-gold transition-colors">Canvas LMS</Link></li>
                <li><Link to="/login" className="hover:text-uw-gold transition-colors">Student Email</Link></li>
                <li><Link to="/login" className="hover:text-uw-gold transition-colors">Faculty Email</Link></li>
                <li><Link to="/services/it-help-desk" className="hover:text-uw-gold transition-colors">IT Help Desk</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Important Links</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="https://www.moecst.gov.bz/" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">Ministry of Education (Belize)</a></li>
                <li><a href="https://www.moecst.gov.bz/resources/" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">MoECST Resources</a></li>
                <li><a href="https://www.moecst.gov.bz/education-services/teacher-services/teacher-learning-institute/" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">Teacher Learning Institute</a></li>
                <li><a href="https://501academy.edu.bz/" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">501 Academy Belize</a></li>
                <li><a href="https://gchea.org" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">GCHEA</a></li>
                <li><a href="https://ub.edu.bz/" target="_blank" rel="noopener noreferrer" className="hover:text-uw-gold transition-colors">University of Belize</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Resources</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/resources/student-handbook" className="hover:text-uw-gold transition-colors">Student Handbook</Link></li>
                <li><Link to="/resources/academic-policies" className="hover:text-uw-gold transition-colors">Academic Policies</Link></li>
                <li><Link to="/home/emergency" className="hover:text-uw-gold transition-colors">Campus Safety</Link></li>
                <li><Link to="/home/emergency" className="hover:text-uw-gold transition-colors">Emergency Info</Link></li>
                <li><Link to="/resources/academic-policies" className="hover:text-uw-gold transition-colors">Title IX</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Services</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/services/parking-transportation" className="hover:text-uw-gold transition-colors">Parking & Transportation</Link></li>
                <li><Link to="/services/disability-services" className="hover:text-uw-gold transition-colors">Disability Services</Link></li>
                <li><Link to="/student-life/organizations" className="hover:text-uw-gold transition-colors">Veterans Services</Link></li>
                <li><Link to="/admissions/international" className="hover:text-uw-gold transition-colors">International Services</Link></li>
                <li><Link to="/student-life/organizations" className="hover:text-uw-gold transition-colors">Multicultural Affairs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Departments</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/departments/computer-science" className="hover:text-uw-gold transition-colors">Computer Science</Link></li>
                <li><Link to="/academics/school-business" className="hover:text-uw-gold transition-colors">Business Administration</Link></li>
                <li><Link to="/academics/college-engineering" className="hover:text-uw-gold transition-colors">Engineering</Link></li>
                <li><Link to="/academics/college-health-sciences" className="hover:text-uw-gold transition-colors">Health Sciences</Link></li>
                <li><Link to="/academics/school-arts" className="hover:text-uw-gold transition-colors">Liberal Arts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Campus Life</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/student-life/organizations" className="hover:text-uw-gold transition-colors">Student Organizations</Link></li>
                <li><Link to="/campus-life/greek-life" className="hover:text-uw-gold transition-colors">Greek Life</Link></li>
                <li><Link to="/campus-life/intramurals" className="hover:text-uw-gold transition-colors">Intramural Sports</Link></li>
                <li><Link to="/student-life/recreation" className="hover:text-uw-gold transition-colors">Fitness Centers</Link></li>
                <li><Link to="/student-life/dining" className="hover:text-uw-gold transition-colors">Dining Options</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">News & Events</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><Link to="/news/university-news" className="hover:text-uw-gold transition-colors">University News</Link></li>
                <li><Link to="/academics/academic-calendar" className="hover:text-uw-gold transition-colors">Events Calendar</Link></li>
                <li><Link to="/news/university-news" className="hover:text-uw-gold transition-colors">Press Releases</Link></li>
                <li><Link to="/news/university-news" className="hover:text-uw-gold transition-colors">Lecture Series</Link></li>
                <li><Link to="/news/university-news" className="hover:text-uw-gold transition-colors">Commencement</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* University Info & Social */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">The New States Continental University Delaware USA</h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                The New States Continental University Delaware USA serves as the Delaware headquarters 
                for NSCU's global operations. A world-class research university committed to educating 
                diverse leaders and expanding the boundaries of human knowledge. NSCU Delaware USA 
                serves as a beacon of academic excellence, innovation, and community engagement.
              </p>
              <div className="flex space-x-4">
                <a href="https://linkedin.com/company/nscu-us" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 text-gray-300 hover:text-uw-gold cursor-pointer transition-colors" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Stay Connected</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Subscribe to our newsletter for the latest updates</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l border-0 focus:outline-none focus:ring-2 focus:ring-uw-gold text-xs"
                  />
                  <button className="px-4 py-2 bg-uw-gold text-uw-dark rounded-r hover:bg-yellow-500 transition-colors text-xs font-semibold">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 The New States Continental University Delaware USA. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-0">
            <Link to="/legal/privacy-policy" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Privacy Policy</Link>
            <Link to="/legal/terms-of-use" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Terms of Use</Link>
            <Link to="/legal/terms-disclaimer" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Terms & Disclaimer</Link>
            <Link to="/about/diversity-inclusion" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Accessibility</Link>
            <Link to="/about/diversity-inclusion" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Non-Discrimination</Link>
            <Link to="/resources/academic-policies" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">FERPA</Link>
            <Link to="/" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
