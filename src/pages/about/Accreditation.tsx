
import PageLayout from '@/components/PageLayout';
import { Award, CheckCircle, FileText, Calendar } from 'lucide-react';

const accreditations = [
  {
    organization: "Middle States Commission on Higher Education (MSCHE)",
    type: "Institutional Accreditation",
    status: "Accredited",
    nextReview: "2029",
    description: "Comprehensive institutional accreditation covering all degree programs and operations"
  },
  {
    organization: "AACSB International",
    type: "Business School Accreditation",
    status: "Accredited",
    nextReview: "2026",
    description: "Premier business school accreditation for undergraduate and graduate business programs"
  },
  {
    organization: "ABET",
    type: "Engineering Accreditation",
    status: "Accredited",
    nextReview: "2027",
    description: "Engineering programs accredited by the Accreditation Board for Engineering and Technology"
  },
  {
    organization: "LCME",
    type: "Medical School Accreditation",
    status: "Accredited",
    nextReview: "2028",
    description: "Liaison Committee on Medical Education accreditation for Doctor of Medicine program"
  },
  {
    organization: "ABA",
    type: "Law School Accreditation",
    status: "Accredited",
    nextReview: "2025",
    description: "American Bar Association accreditation for Juris Doctor program"
  },
  {
    organization: "CCNE",
    type: "Nursing Accreditation",
    status: "Accredited",
    nextReview: "2026",
    description: "Commission on Collegiate Nursing Education accreditation for nursing programs"
  },
  {
    organization: "GCHEA",
    type: "Global Higher Education Accreditation",
    status: "Accredited",
    nextReview: "2027",
    description: "Global Commission for Higher Education Accreditation providing international recognition"
  }
];

const qualityAssurance = [
  {
    title: "Academic Excellence",
    items: [
      "Rigorous curriculum standards",
      "Faculty qualification requirements",
      "Student learning outcomes assessment",
      "Continuous program improvement"
    ]
  },
  {
    title: "Research Integrity",
    items: [
      "IRB oversight for human subjects research",
      "Responsible conduct of research training",
      "Research data management policies",
      "Ethics and compliance monitoring"
    ]
  },
  {
    title: "Student Success",
    items: [
      "Comprehensive support services",
      "Academic advising programs",
      "Career development resources",
      "Graduation and employment tracking"
    ]
  }
];

const Accreditation = () => {
  return (
    <PageLayout 
      title="Accreditation & Quality Assurance" 
      description="Our commitment to maintaining the highest academic and institutional standards"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-uw-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-uw-purple mb-4">Accreditation Overview</h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto">
                NSCU-Delaware maintains accreditation from multiple recognized agencies, ensuring our 
                academic programs meet the highest national standards for quality and excellence.
              </p>
            </div>
          </div>

          {/* Accreditation Details */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Current Accreditations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accreditations.map((accred, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      {accred.organization === "GCHEA" ? (
                        <a 
                          href="https://gchea.org" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xl font-bold text-uw-purple mb-2 hover:text-uw-gold transition-colors inline-flex items-center"
                        >
                          {accred.organization}
                          <span className="ml-2">🔗</span>
                        </a>
                      ) : (
                        <h3 className="text-xl font-bold text-uw-purple mb-2">{accred.organization}</h3>
                      )}
                      <div className="flex items-center mb-2">
                        <span className="bg-uw-gold text-uw-dark px-3 py-1 rounded-full text-sm font-semibold mr-3">
                          {accred.type}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {accred.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{accred.description}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Next Review: {accred.nextReview}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Assurance */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Quality Assurance Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {qualityAssurance.map((area, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-uw-purple mb-4 text-center">{area.title}</h3>
                  <ul className="space-y-3">
                    {area.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="bg-uw-gold rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility & Recognition Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Student Eligibility & School Certificate Recognition</h2>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-uw-purple mb-4">International Qualifications Accepted</h3>
              <p className="text-gray-700 mb-4">
                NSCU accepts WISE Certification from{' '}
                <a 
                  href="https://wise.weqsc.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-uw-gold hover:underline font-semibold"
                >
                  Wise.weqsc.org
                </a>
                {' '}and any course directly approved by{' '}
                <a 
                  href="https://weqsc.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-uw-gold hover:underline font-semibold"
                >
                  WEQSC
                </a>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">United States</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.ged.com" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      GED Testing Service
                    </a>
                  </li>
                  <li>
                    <a href="https://www.collegeboard.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      College Board (High School Diploma)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.state.gov/education-and-culture/" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      US State Department Recognized Programs
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">United Kingdom</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.gov.uk/government/organisations/ofqual" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Ofqual (A-Levels, GCSEs)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aqa.org.uk" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      AQA (Assessment & Qualifications Alliance)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cambridgeinternational.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Cambridge International Examinations
                    </a>
                  </li>
                  <li>
                    <a href="https://www.edexcel.com" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Pearson Edexcel
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">Europe</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.ibo.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      International Baccalaureate (IB)
                    </a>
                  </li>
                  <li>
                    <a href="https://ec.europa.eu/education/" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      European Baccalaureate
                    </a>
                  </li>
                  <li>
                    <a href="https://www.abitur.de" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      German Abitur
                    </a>
                  </li>
                  <li>
                    <a href="https://www.education.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      French Baccalauréat
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">Asia</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.cbse.gov.in" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      CBSE (India)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cisce.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      ICSE/ISC (India)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.seab.gov.sg" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Singapore-Cambridge GCE
                    </a>
                  </li>
                  <li>
                    <a href="https://www.hkeaa.edu.hk" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      HKDSE (Hong Kong)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">China</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="http://en.moe.gov.cn" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Gaokao (National College Entrance Exam)
                    </a>
                  </li>
                  <li>
                    <a href="http://www.neea.edu.cn" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      NEEA (National Education Examinations Authority)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">Africa</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.waec.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      WAEC (West African Examinations Council)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.education.gov.za" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      NSC (South African National Senior Certificate)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.knec.ac.ke" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      KCSE (Kenya Certificate of Secondary Education)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">International Programs</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://wise.weqsc.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      WISE Certification (WEQSC)
                    </a>
                  </li>
                  <li>
                    <a href="https://weqsc.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      WEQSC Approved Courses
                    </a>
                  </li>
                  <li>
                    <a href="https://www.ibo.org" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      IB Diploma Programme
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">Middle East</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.moe.gov.ae" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      UAE Ministry of Education
                    </a>
                  </li>
                  <li>
                    <a href="https://www.moe.gov.sa" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      Saudi Ministry of Education
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold text-uw-purple mb-3">Australia & Pacific</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.vcaa.vic.edu.au" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      VCE (Victorian Certificate of Education)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nzqa.govt.nz" target="_blank" rel="noopener noreferrer" className="text-uw-gold hover:underline">
                      NCEA (New Zealand)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compliance Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-uw-purple mb-6 text-center">Compliance & Reporting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Annual Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <span className="font-semibold">Institutional Assessment Report 2024</span>
                      <p className="text-sm text-gray-600">Comprehensive review of academic programs and services</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <span className="font-semibold">Student Outcomes Report 2024</span>
                      <p className="text-sm text-gray-600">Graduation rates, employment, and satisfaction data</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-uw-gold mr-3" />
                    <div>
                      <span className="font-semibold">Financial Transparency Report 2024</span>
                      <p className="text-sm text-gray-600">Detailed financial information and accountability</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-uw-purple mb-4">Regulatory Compliance</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Title IX Compliance Program</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">ADA Accessibility Standards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">FERPA Privacy Protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Clery Act Safety Reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Financial Aid Compliance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Research Ethics Oversight</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Accreditation;
