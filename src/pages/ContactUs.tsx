import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Users, Building2, Headphones, FileText, AlertCircle, Newspaper, GraduationCap, DollarSign, Shield, BookOpen, Globe } from "lucide-react";

const ContactUs = () => {
  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with New States Continental University - Delaware"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Get in Touch With Us</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                New States Continental University is committed to providing excellent support and service to all our students, 
                faculty, staff, and visitors. Find the right contact information for your needs below.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Main Helpline</h3>
                  <p className="text-sm text-muted-foreground mb-2">24/7 Support</p>
                  <a href="tel:+13028576060" className="text-primary hover:underline font-semibold">
                    +1 (302) 857-6060
                  </a>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">Response within 24hrs</p>
                  <a href="mailto:info@nscu.govt.ac" className="text-primary hover:underline font-semibold text-sm">
                    info@nscu.govt.ac
                  </a>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Office Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9 AM - 6 PM EST</p>
                  <p className="text-sm text-muted-foreground">Sat: 10 AM - 2 PM EST</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Emergency Line</h3>
                  <p className="text-sm text-muted-foreground mb-2">Campus Security</p>
                  <a href="tel:+13028579999" className="text-primary hover:underline font-semibold">
                    +1 (302) 857-9999
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Main Office Location */}
            <Card className="mb-12">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      Head Office & Main Campus
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">New States Continental University</p>
                          <p className="text-muted-foreground">100 University Plaza</p>
                          <p className="text-muted-foreground">Dover, Delaware 19901</p>
                          <p className="text-muted-foreground">United States of America</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Phone Numbers</p>
                          <p className="text-sm">Main Line: +1 (302) 857-6060</p>
                          <p className="text-sm">Toll Free: 1-800-NSCU-EDU</p>
                          <p className="text-sm">International: +1 (302) 857-6061</p>
                          <p className="text-sm">WhatsApp: +91-XXXXXXXXXX</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Email Addresses</p>
                          <p className="text-sm">General: info@nscu.govt.ac</p>
                          <p className="text-sm">Admissions: admissions@nscu.govt.ac</p>
                          <p className="text-sm">Support: support@nscu.govt.ac</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold mb-1">Website & Social Media</p>
                          <p className="text-sm">Website: www.nscu.govt.ac</p>
                          <p className="text-sm">LinkedIn: /company/nscu-delaware</p>
                          <p className="text-sm">Facebook: /NSCUDelaware</p>
                          <p className="text-sm">Twitter: @NSCUDelaware</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="font-bold mb-4">Campus Map & Directions</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Located in the heart of Dover, Delaware, our main campus is easily accessible by car and public transportation.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><strong>By Car:</strong> Exit 104 from DE-1, follow signs to University Plaza</p>
                      <p><strong>By Bus:</strong> DART Route 301 & 303 (University Stop)</p>
                      <p><strong>Parking:</strong> Visitor parking available in Lots A, B, and C</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Contacts */}
            <h2 className="text-3xl font-bold mb-6 text-center">Department Contacts</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Admissions Department */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <GraduationCap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Admissions Office</h3>
                      <p className="text-sm text-muted-foreground">Undergraduate & Graduate Admissions</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> admissions@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6100</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Application queries, program information, entrance requirements</p>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Affairs */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Academic Affairs</h3>
                      <p className="text-sm text-muted-foreground">Curriculum & Academic Support</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> academic.affairs@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6200</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Course registration, academic advising, transcript requests</p>
                  </div>
                </CardContent>
              </Card>

              {/* Finance Department */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Finance Office</h3>
                      <p className="text-sm text-muted-foreground">Payments & Financial Services</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> finance@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6300</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 4 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Fee payments, refunds, financial aid, scholarships</p>
                  </div>
                </CardContent>
              </Card>

              {/* Student Support Services */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Headphones className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Student Support</h3>
                      <p className="text-sm text-muted-foreground">General Student Assistance</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> support@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6400</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Sat, 9 AM - 6 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Technical support, account issues, general inquiries</p>
                  </div>
                </CardContent>
              </Card>

              {/* Grievance & Complaints */}
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Grievance Office</h3>
                      <p className="text-sm text-muted-foreground">Complaints & Redressal</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-amber-600" /><strong>Email:</strong> grievance@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-amber-600" /><strong>Phone:</strong> +1 (302) 857-6500</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-amber-600" /><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Student grievances, complaints, discrimination issues</p>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Department */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Legal Department</h3>
                      <p className="text-sm text-muted-foreground">Legal & Compliance</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> legal@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6600</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 4 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Legal matters, policy questions, document verification</p>
                  </div>
                </CardContent>
              </Card>

              {/* International Office */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">International Office</h3>
                      <p className="text-sm text-muted-foreground">International Student Services</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> international@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6700</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Visa support, international admissions, student exchange</p>
                  </div>
                </CardContent>
              </Card>

              {/* Library Services */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Library Services</h3>
                      <p className="text-sm text-muted-foreground">Academic Resources</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> library@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6800</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Sun, 8 AM - 10 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Library access, research assistance, digital resources</p>
                  </div>
                </CardContent>
              </Card>

              {/* Press & Media */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Newspaper className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Press & Media Relations</h3>
                      <p className="text-sm text-muted-foreground">Public Relations Office</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><Mail className="h-4 w-4 inline mr-2 text-primary" /><strong>Email:</strong> press@nscu.govt.ac</p>
                    <p><Phone className="h-4 w-4 inline mr-2 text-primary" /><strong>Phone:</strong> +1 (302) 857-6900</p>
                    <p><Clock className="h-4 w-4 inline mr-2 text-primary" /><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
                    <p className="pt-2 border-t"><strong>For:</strong> Media inquiries, press releases, event coverage</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Faculty & Staff Contact */}
            <Card className="mb-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Contact Faculty & Staff
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Faculty Directory</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      To contact specific faculty members, use the faculty directory or department contacts below:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">College of Arts & Sciences</p>
                        <p>Email: cas.faculty@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-7100</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">College of Engineering</p>
                        <p>Email: engineering.faculty@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-7200</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">School of Business</p>
                        <p>Email: business.faculty@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-7300</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">School of Medicine</p>
                        <p>Email: medicine.faculty@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-7400</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4">Administrative Staff</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For administrative assistance, contact the relevant department:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">Registrar's Office</p>
                        <p>Email: registrar@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-6150</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">IT Help Desk</p>
                        <p>Email: helpdesk@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-6450</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">Career Services</p>
                        <p>Email: careers@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-6550</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-semibold mb-1">Counseling Services</p>
                        <p>Email: counseling@nscu.govt.ac</p>
                        <p>Phone: +1 (302) 857-6650</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Email Addresses */}
            <Card className="mb-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  Complete Email Directory
                </h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">General Services</p>
                    <p>info@nscu.govt.ac</p>
                    <p>support@nscu.govt.ac</p>
                    <p>webmaster@nscu.govt.ac</p>
                    <p>feedback@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Academic Services</p>
                    <p>admissions@nscu.govt.ac</p>
                    <p>academic.affairs@nscu.govt.ac</p>
                    <p>academic.grievance@nscu.govt.ac</p>
                    <p>registrar@nscu.govt.ac</p>
                    <p>library@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Financial Services</p>
                    <p>finance@nscu.govt.ac</p>
                    <p>scholarships@nscu.govt.ac</p>
                    <p>financialaid@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Student Services</p>
                    <p>studentaffairs@nscu.govt.ac</p>
                    <p>counseling@nscu.govt.ac</p>
                    <p>careers@nscu.govt.ac</p>
                    <p>housing@nscu.govt.ac</p>
                    <p>international@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Specialized Services</p>
                    <p>grievance@nscu.govt.ac</p>
                    <p>safecampus@nscu.govt.ac</p>
                    <p>ombudsperson@nscu.govt.ac</p>
                    <p>advocacy@nscu.govt.ac</p>
                    <p>disability@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Legal & Press</p>
                    <p>legal@nscu.govt.ac</p>
                    <p>privacy@nscu.govt.ac</p>
                    <p>press@nscu.govt.ac</p>
                    <p>alumni@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Technical Support</p>
                    <p>helpdesk@nscu.govt.ac</p>
                    <p>itsupport@nscu.govt.ac</p>
                    <p>portal@nscu.govt.ac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary mb-3">Faculty Departments</p>
                    <p>cas.faculty@nscu.govt.ac</p>
                    <p>engineering.faculty@nscu.govt.ac</p>
                    <p>business.faculty@nscu.govt.ac</p>
                    <p>medicine.faculty@nscu.govt.ac</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visit Us */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Visit Us
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    We welcome prospective students, parents, and visitors to our campus. Schedule a campus tour or visit our offices during business hours.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-bold mb-3">Campus Tours</h3>
                      <p className="text-sm mb-3">Experience our state-of-the-art facilities and vibrant campus life.</p>
                      <p className="text-sm"><strong>Book a Tour:</strong> tours@nscu.govt.ac</p>
                      <p className="text-sm"><strong>Tour Hours:</strong> Mon-Fri, 10 AM - 3 PM</p>
                      <p className="text-sm"><strong>Walk-ins Welcome:</strong> Saturday mornings</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-bold mb-3">Visitor Information</h3>
                      <p className="text-sm mb-3">All visitors must check in at the Welcome Center.</p>
                      <p className="text-sm"><strong>Parking:</strong> Visitor lots A & B</p>
                      <p className="text-sm"><strong>ID Required:</strong> Photo ID for campus access</p>
                      <p className="text-sm"><strong>Accessibility:</strong> Wheelchair accessible campus</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactUs;
