
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
                      <h3 className="text-xl font-bold text-uw-purple mb-2">{accred.organization}</h3>
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
