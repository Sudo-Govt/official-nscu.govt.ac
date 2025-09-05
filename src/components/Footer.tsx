
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

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
                <li><a href="/academics/college-arts-sciences" className="hover:text-uw-gold transition-colors">College of Arts & Sciences</a></li>
                <li><a href="/academics/college-engineering" className="hover:text-uw-gold transition-colors">College of Engineering</a></li>
                <li><a href="/academics/school-business" className="hover:text-uw-gold transition-colors">School of Business</a></li>
                <li><a href="/academics/college-health-sciences" className="hover:text-uw-gold transition-colors">College of Health Sciences</a></li>
                <li><a href="/academics/school-medicine" className="hover:text-uw-gold transition-colors">School of Medicine</a></li>
                <li><a href="/academics/school-law" className="hover:text-uw-gold transition-colors">School of Law</a></li>
                <li><a href="/academics/college-education" className="hover:text-uw-gold transition-colors">College of Education</a></li>
                <li><a href="/academics/school-arts" className="hover:text-uw-gold transition-colors">Graduate School</a></li>
              </ul>
              <h4 className="font-semibold text-sm mb-2 mt-4">Academic Resources</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Course Catalog</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Libraries</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Writing Center</a></li>
              </ul>
            </div>
          </div>

          {/* Student Life & Admissions Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">Student Life</h3>
            <div className="space-y-2">
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Housing & Dining</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Health & Wellness</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Career Services</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Student Organizations</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Campus Recreation</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Arts & Culture</a></li>
              </ul>
              
              <h4 className="font-semibold text-sm mb-2 mt-4">Admissions</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Undergraduate Admissions</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Graduate Admissions</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">International Admissions</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Transfer Admissions</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Financial Aid</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Campus Tours</a></li>
              </ul>
            </div>
          </div>

          {/* Research & Alumni Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">Research & Alumni</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-2">Research</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Research Office</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Funding Opportunities</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Core Facilities</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Technology Transfer</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Undergraduate Research</a></li>
              </ul>
              
              <h4 className="font-semibold text-sm mb-2 mt-4">Alumni</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Alumni Association</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Alumni Benefits</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Career Networking</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Alumni Events</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Give Back</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Alumni Directory</a></li>
              </ul>
            </div>
          </div>

          {/* About & Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-uw-gold">About & Contact</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-2">About NSCU</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">History & Mission</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Leadership</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Accreditation</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Campus Map</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Diversity & Inclusion</a></li>
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
                <li><a href="#" className="hover:text-uw-gold transition-colors">MyNSCU Portal</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Canvas LMS</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Student Email</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Faculty Email</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">IT Help Desk</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Resources</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Student Handbook</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Academic Policies</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Campus Safety</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Emergency Info</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Title IX</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Services</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Parking & Transportation</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Disability Services</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Veterans Services</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">International Services</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Multicultural Affairs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Departments</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Computer Science</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Business Administration</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Engineering</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Health Sciences</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Liberal Arts</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">Campus Life</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">Student Organizations</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Greek Life</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Intramural Sports</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Fitness Centers</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Dining Options</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3 text-uw-gold">News & Events</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li><a href="#" className="hover:text-uw-gold transition-colors">University News</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Events Calendar</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Press Releases</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Lecture Series</a></li>
                <li><a href="#" className="hover:text-uw-gold transition-colors">Commencement</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* University Info & Social */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">New States Continental University - Delaware</h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                A world-class public research university committed to educating diverse 
                leaders and expanding the boundaries of human knowledge. NSCU-Delaware 
                serves as a beacon of academic excellence, innovation, and community 
                engagement in the First State and beyond.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-300 hover:text-uw-gold cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-300 hover:text-uw-gold cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-300 hover:text-uw-gold cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-300 hover:text-uw-gold cursor-pointer transition-colors" />
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
            © 2024 New States Continental University - Delaware. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Terms of Use</a>
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Accessibility</a>
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Non-Discrimination</a>
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">FERPA</a>
            <a href="#" className="text-gray-300 hover:text-uw-gold text-sm transition-colors">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
