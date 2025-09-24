import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import PageLayout from '../../components/PageLayout';

const TermsDisclaimer = () => {
  useSEO({
    title: "Terms & Disclaimer - NSCU Delaware USA",
    description: "Comprehensive terms and disclaimer for The New States Continental University Delaware USA (NSCU Delaware USA). Important information about degrees, accreditation, and institutional policies.",
    keywords: "NSCU Delaware USA terms, NSCU disclaimer, New States Continental University Delaware terms, university disclaimer, educational terms and conditions"
  });

  return (
    <PageLayout title="Terms & Disclaimer">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-8">Terms & Disclaimer</h1>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">NSCU – Delaware, USA Comprehensive Website Disclaimer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <div>
                <strong>Effective Date:</strong> 2nd January, 2016
              </div>
              <div>
                <strong>Last Updated:</strong> 18th February, 2025
              </div>
              <div>
                <strong>Version:</strong> 2.6
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Foreign Degree Issuance and Institutional Authority</h2>
            
            <h3 className="text-xl font-semibold mb-3">1.1 Institutional Structure and Global Operations</h3>
            <p className="mb-4">
              New States Continental University – Delaware, USA (NSCU – Delaware, USA) serves as the United States headquarters and primary administrative office of New States Continental University Belize (NSCU Belize). The parent institution, NSCU Belize, is the sole degree-granting authority for all academic credentials offered through this international educational network, which may include satellite offices, representative offices, or administrative centers in multiple countries.
            </p>

            <h3 className="text-xl font-semibold mb-3">1.2 Legal Authority and Regulatory Compliance</h3>
            <p className="mb-4">
              All academic and professional degrees, certificates, diplomas, postgraduate qualifications, and other educational credentials are legally issued exclusively under the authority of NSCU Belize, which maintains:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Official registration with the Ministry of Education, Culture, Science and Technology (MOECST) of Belize</li>
              <li>Accreditation by the Global Commission for Higher Education Accreditation (GCHEA)</li>
              <li>Full compliance with Belizean educational laws, regulations, and quality assurance standards</li>
              <li>Recognition under the legal framework of Belize as an authorized higher education institution</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">1.3 U.S. Operations and Jurisdictional Limitations</h3>
            <p className="mb-4">
              NSCU – Delaware, USA operates exclusively as an administrative, marketing, and student services office. It categorically does not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Issue degrees under United States federal or state educational authority</li>
              <li>Hold accreditation from any U.S. Department of Education recognized accrediting agency</li>
              <li>Operate as a degree-granting institution under Delaware state law or any other U.S. jurisdiction</li>
              <li>Provide educational services that would constitute operating as a university under U.S. law</li>
              <li>The designation "Delaware, USA" is used exclusively for corporate branding, administrative efficiency, and global market positioning</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">1.4 International Recognition Considerations</h3>
            <p className="mb-4">
              Students should be aware that foreign degrees may require additional steps for recognition in their home countries, including but not limited to credential evaluation services, equivalence determinations, or additional certification processes as determined by local educational authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Academic Programs and Global Equivalence</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Comprehensive Academic Program Categories</h3>
            <p className="mb-4">
              Academic programs encompass a broad range of disciplines including, but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Undergraduate Programs:</strong> Bachelor of Science (BSc), Bachelor of Arts (BA), Bachelor of Business Administration (BBA), Bachelor of Technology (BTech), Bachelor of Computer Applications (BCA)</li>
              <li><strong>Graduate Programs:</strong> Master of Science (MSc), Master of Arts (MA), Master of Business Administration (MBA), Master of Technology (MTech), Master of Computer Applications (MCA)</li>
              <li><strong>Doctoral Programs:</strong> Doctor of Philosophy (PhD), Doctor of Education (EdD), Doctor of Business Administration (DBA) in non-regulated academic fields</li>
              <li><strong>Professional Development:</strong> Certificate programs, diploma courses, continuing education, and executive education programs</li>
              <li><strong>Specialized Fields:</strong> Information Technology, Business Management, Liberal Arts, Social Sciences, Natural Sciences, and emerging interdisciplinary studies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Global Degree Equivalence and Recognition Framework</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Graduates may seek equivalence recognition from relevant national educational authorities, credential evaluation services, or professional recognition bodies in their respective countries</li>
              <li>Equivalence processes vary significantly between countries and may involve different criteria, documentation requirements, and processing timelines</li>
              <li>Common global recognition bodies include national education ministries, university consortiums, professional accreditation organizations, and credential evaluation services</li>
              <li>NSCU provides no guarantee, warranty, or assurance regarding equivalence approval outcomes, processing times, fees, or specific requirements imposed by third-party authorities</li>
              <li>Students bear complete responsibility for researching, initiating, completing, and financing all equivalence procedures</li>
              <li>Some countries may require additional examinations, coursework, or practical training beyond the NSCU degree for full recognition</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Employment and Continuing Education Acceptance</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Recognition of NSCU degrees for employment purposes varies by employer, industry, geographic region, and specific job requirements</li>
              <li>Some multinational corporations, government agencies, or educational institutions may have specific policies regarding foreign degree acceptance</li>
              <li>Students planning to pursue further education should verify degree acceptance requirements with prospective institutions before enrollment</li>
              <li>Professional career advancement may depend on additional certifications, work experience, or locally recognized qualifications beyond the NSCU degree</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.4 Credit Transfer and Academic Mobility</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Transfer of NSCU credits to other institutions is not guaranteed and depends entirely on receiving institution policies</li>
              <li>Academic transcript evaluation by third-party services may be required for credit transfer</li>
              <li>Students should maintain detailed academic records and course descriptions to facilitate future transfer processes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Professional and Regulated Programs</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 Extensive Professional Program Categories</h3>
            <p className="mb-4">Regulated professional programs span multiple disciplines:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Healthcare:</strong> Pharmacy (PharmD, B.Pharm, M.Pharm), Medicine (MBBS, MD, MS), Nursing (B.Sc Nursing, M.Sc Nursing), Dentistry, Physiotherapy, Occupational Therapy, Medical Laboratory Technology</li>
              <li><strong>Legal:</strong> Law (LLB, LLM, JD), Legal Studies, Paralegal Programs</li>
              <li><strong>Engineering and Technical:</strong> Architecture (B.Arch, M.Arch), Civil Engineering, Mechanical Engineering, Electrical Engineering, Software Engineering, and other engineering disciplines requiring professional licensure</li>
              <li><strong>Business and Finance:</strong> Accounting, Financial Planning, Banking, Insurance, Real Estate</li>
              <li><strong>Education:</strong> Teaching credentials, Educational Administration, Counseling</li>
              <li><strong>Other Regulated Fields:</strong> Psychology, Social Work, Veterinary Medicine, Aviation, Maritime Studies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Global Professional Practice Limitations and Requirements</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Completion of professional programs does not automatically grant legal authority to practice in any country, state, province, or jurisdiction worldwide</li>
              <li>Professional practice rights universally require separate licensure, registration, certification, or authorization from relevant regulatory bodies</li>
              <li>Each country maintains distinct professional licensing systems with unique requirements, examination processes, experience mandates, and continuing education obligations</li>
              <li>Students must independently research and comply with all professional registration requirements in their intended practice jurisdiction</li>
              <li>Licensing processes may include additional examinations, supervised practice periods, character assessments, and ongoing professional development requirements</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.3 Regional Professional Authority Examples</h3>
            <p className="mb-4">Professional regulation varies globally and may involve bodies such as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>North America:</strong> State licensing boards, provincial regulatory colleges, national certification organizations</li>
              <li><strong>Europe:</strong> Professional regulatory councils, EU recognition directives, national competency authorities</li>
              <li><strong>Asia-Pacific:</strong> Professional councils, ministry registrations, regional professional bodies</li>
              <li><strong>Africa:</strong> Professional regulatory authorities, continental recognition frameworks</li>
              <li><strong>Latin America:</strong> Professional colleges, national regulatory institutes, regional certification bodies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.4 Cross-Border Professional Mobility</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>International professional practice may require additional steps including mutual recognition agreements, international certification, or bilateral professional mobility treaties</li>
              <li>Some professions have established international standards and recognition frameworks</li>
              <li>Students should research international professional mobility options relevant to their career goals</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Branding, Marketing, and Geographic Designations</h2>
            
            <h3 className="text-xl font-semibold mb-3">4.1 Corporate Branding Strategy and Global Positioning</h3>
            <p className="mb-4">The designation "NSCU – Delaware, USA" reflects:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The strategic location of U.S. corporate headquarters for international business operations</li>
              <li>Marketing and branding initiatives designed for global market recognition and credibility</li>
              <li>Administrative coordination for North American and international student services</li>
              <li>Corporate structure optimization for international educational delivery</li>
              <li><strong>Critical Understanding:</strong> This designation does not indicate U.S. educational authority, accreditation, or degree-granting capability under U.S. law</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2 Academic Credential Legal Classification</h3>
            <p className="mb-4">All degrees, certificates, diplomas, and credentials issued remain:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Foreign qualifications under the educational classification systems of most countries</li>
              <li>Subject to foreign credential evaluation processes if used outside of Belize</li>
              <li>Governed exclusively by Belizean educational law, standards, and quality assurance frameworks</li>
              <li>Not automatically equivalent to domestically issued degrees in any country without formal evaluation and recognition processes</li>
              <li>Potentially requiring additional documentation, translation, or certification for official use</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.3 Global Market Positioning and Institutional Identity</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU's international presence is designed to serve a global student population through various administrative and support offices</li>
              <li>The institution's global branding strategy aims to facilitate international student access and support services</li>
              <li>Local office operations are limited to administration and student services, not degree issuance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Website Domain, Digital Presence, and Government Affiliation Disclaimer</h2>
            
            <h3 className="text-xl font-semibold mb-3">5.1 Domain Ownership and Digital Asset Control</h3>
            <p className="mb-4">The website domain nscu.govt.ac and all associated digital properties are:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Privately owned, operated, and controlled by NSCU as intellectual property assets</li>
              <li>Registered private domains with no governmental authority, endorsement, or official status</li>
              <li>Used exclusively for institutional branding, marketing, and educational service delivery</li>
              <li>Subject to private terms of use, privacy policies, and intellectual property rights</li>
              <li>Not affiliated with any governmental domain registry or official government web presence</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.2 Comprehensive Government Affiliation Disclaimer</h3>
            <p className="mb-4">NSCU – Delaware, USA, its parent institution NSCU Belize, and all associated entities are:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>NOT</strong> affiliated with, sponsored by, endorsed by, or connected to the Government of the United States at any level (federal, state, or local)</li>
              <li><strong>NOT</strong> affiliated with, sponsored by, endorsed by, or connected to the Government of Belize or any Belizean governmental agency</li>
              <li><strong>NOT</strong> affiliated with, sponsored by, endorsed by, or connected to any national, regional, or local government worldwide</li>
              <li><strong>NOT</strong> government institutions, agencies, departments, or official bodies of any country</li>
              <li><strong>NOT</strong> authorized to represent, speak for, or act on behalf of any governmental entity</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.3 Digital Design and User Interface Considerations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Any visual similarity, design elements, color schemes, or formatting that resembles government websites is implemented intentionally for professional branding and user experience optimization only</li>
              <li>Such design choices do not imply, suggest, or create any governmental authority, official status, endorsement, or legal standing</li>
              <li>The institution operates exclusively as a private educational entity under applicable commercial and educational law</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.4 Third-Party Digital Services and Integrations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU may utilize various third-party digital services, platforms, or integrations for website functionality, student services, or educational delivery</li>
              <li>Such partnerships do not imply endorsement by or affiliation with governmental entities</li>
              <li>Students should review privacy policies and terms of service for all integrated digital services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Student Rights, Responsibilities, and Consumer Protection</h2>
            
            <h3 className="text-xl font-semibold mb-3">6.1 Comprehensive Informed Consent Requirement</h3>
            <p className="mb-4">
              By accessing this website, submitting inquiries, downloading materials, participating in webinars, or enrolling in any program, prospective and current students explicitly acknowledge understanding of:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The foreign nature and international classification of all degrees issued</li>
              <li>Limitations on automatic professional practice rights in any jurisdiction</li>
              <li>The necessity for independent equivalence verification and recognition processes</li>
              <li>The private nature of the institution and its branding strategy</li>
              <li>Financial obligations, refund policies, and payment terms</li>
              <li>Academic policies, program requirements, and graduation standards</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.2 Enhanced Due Diligence and Research Responsibilities</h3>
            <p className="mb-4">Students bear primary responsibility for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Conducting thorough research regarding career and educational goals before enrollment</li>
              <li>Verifying degree acceptance and recognition requirements with intended employers, licensing boards, or further education institutions</li>
              <li>Understanding professional licensing, certification, and practice requirements in their intended jurisdiction</li>
              <li>Seeking independent educational counseling, career guidance, or legal advice as appropriate</li>
              <li>Maintaining accurate academic records and documentation for future use</li>
              <li>Staying informed about changes in professional regulations or recognition requirements</li>
              <li>Budgeting for potential additional costs related to credential evaluation, licensing, or equivalence processes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.3 Academic Integrity and Student Conduct</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Students must adhere to established academic integrity policies, honor codes, and ethical standards</li>
              <li>Violations of academic integrity may result in disciplinary action, program dismissal, or credential revocation</li>
              <li>Students are expected to maintain professional conduct in all interactions with faculty, staff, and fellow students</li>
              <li>Misrepresentation of NSCU credentials or institutional affiliation is prohibited</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">6.4 Financial Obligations and Consumer Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Detailed tuition, fees, and payment policies are governed by separate enrollment agreements and financial policies</li>
              <li>Students should carefully review all financial obligations before enrollment</li>
              <li>Refund policies, withdrawal procedures, and financial aid information are available in separate documentation</li>
              <li>Additional costs may include textbooks, technology fees, examination fees, credential evaluation services, and professional licensing expenses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Academic Quality, Accreditation, and Educational Standards</h2>
            
            <h3 className="text-xl font-semibold mb-3">7.1 Quality Assurance Framework</h3>
            <p className="mb-4">NSCU maintains academic quality through:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Adherence to Belizean higher education standards and regulations</li>
              <li>Faculty qualification requirements and ongoing professional development</li>
              <li>Curriculum review and update processes</li>
              <li>Student assessment and feedback mechanisms</li>
              <li>Regular institutional evaluation and improvement initiatives</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">7.2 Accreditation Transparency</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU Belize holds accreditation from GCHEA (Global Commission for Higher Education Accreditation)</li>
              <li>Students should research the recognition and acceptance of GCHEA accreditation in their intended jurisdiction</li>
              <li>Accreditation recognition varies globally, and students should verify acceptability for their specific purposes</li>
              <li>NSCU does not hold accreditation from regional or national accrediting bodies in the United States</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">7.3 Educational Delivery Methods</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Programs may be delivered through various modalities including online, hybrid, or traditional classroom formats</li>
              <li>Technology requirements, internet access, and digital literacy skills may be necessary for successful program completion</li>
              <li>Students should ensure they have appropriate technology and internet access for their chosen program format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability and Risk Disclosure</h2>
            
            <h3 className="text-xl font-semibold mb-3">8.1 Educational and Career Outcome Disclaimers</h3>
            <p className="mb-4">NSCU – Delaware, USA provides no warranty, guarantee, or assurance regarding:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Employment prospects, job placement, or career advancement upon graduation</li>
              <li>Acceptance of degrees by specific employers, industries, or geographic regions</li>
              <li>Success in professional licensing examinations, certification processes, or competency assessments</li>
              <li>Equivalence recognition approval by educational authorities or credential evaluation services</li>
              <li>Salary expectations, earning potential, or career progression outcomes</li>
              <li>Market demand for specific skills, qualifications, or professional services</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">8.2 Third-Party Decision Limitations</h3>
            <p className="mb-4">The institution accepts no responsibility, liability, or obligation for decisions made by:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Professional licensing boards, regulatory authorities, or certification bodies</li>
              <li>Educational equivalence authorities, credential evaluation services, or recognition bodies</li>
              <li>Employers, hiring managers, or human resources departments</li>
              <li>Other educational institutions, admissions committees, or academic departments</li>
              <li>Government agencies, regulatory bodies, or policy-making entities</li>
              <li>Immigration authorities regarding visa, work permit, or residency applications based on NSCU credentials</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">8.3 Financial and Economic Risk Disclosure</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Students invest tuition, time, and opportunity costs with inherent risks regarding return on investment</li>
              <li>Economic conditions, industry changes, or regulatory modifications may affect career prospects</li>
              <li>The institution provides no guarantee regarding job market conditions, salary levels, or professional opportunities</li>
              <li>Students should consider their financial situation and career goals carefully before enrollment</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">8.4 Technology and Digital Service Limitations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Online educational delivery depends on technology infrastructure, internet connectivity, and digital platforms</li>
              <li>Technical difficulties, system outages, or platform changes may occasionally affect educational access</li>
              <li>Students are responsible for maintaining appropriate technology and internet access for program participation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. International Student Services and Support</h2>
            
            <h3 className="text-xl font-semibold mb-3">9.1 Global Student Support Framework</h3>
            <p className="mb-4">NSCU provides various support services for its international student population:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Academic advising and program guidance</li>
              <li>Technical support for online learning platforms</li>
              <li>Administrative assistance for enrollment and graduation processes</li>
              <li>General information about credential recognition processes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">9.2 Visa and Immigration Disclaimer</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU does not provide immigration advice, visa assistance, or legal counsel regarding residency matters</li>
              <li>Students are solely responsible for understanding and complying with visa requirements in their country of residence</li>
              <li>Student visa eligibility varies by country and may not be available for all NSCU programs</li>
              <li>Students should consult qualified immigration professionals for visa and residency questions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">9.3 Cultural and Language Considerations</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Program instruction is primarily conducted in English, and students should possess adequate English language proficiency</li>
              <li>Cultural adaptation support may be limited, and students should be prepared for international educational environments</li>
              <li>Time zone differences may affect real-time interactions with faculty and support services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Intellectual Property and Content Rights</h2>
            
            <h3 className="text-xl font-semibold mb-3">10.1 Institutional Intellectual Property</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>All course materials, curricula, educational content, and institutional resources remain the intellectual property of NSCU</li>
              <li>Students receive limited licenses to use educational materials for personal academic purposes during enrollment</li>
              <li>Unauthorized reproduction, distribution, or commercial use of NSCU materials is prohibited</li>
              <li>Institutional logos, trademarks, and branding elements are protected intellectual property</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">10.2 Student Work and Academic Products</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Students retain rights to their original academic work, research, and creative productions</li>
              <li>NSCU may require non-exclusive licenses for institutional purposes such as accreditation review or academic quality assessment</li>
              <li>Collaborative work, group projects, or institutionally sponsored research may involve shared intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Privacy, Data Protection, and Information Security</h2>
            
            <h3 className="text-xl font-semibold mb-3">11.1 Student Privacy and Data Handling</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU collects, processes, and stores student information in accordance with applicable privacy laws and institutional policies</li>
              <li>Detailed privacy practices are outlined in separate privacy policy documentation</li>
              <li>Students have certain rights regarding their personal information, subject to applicable legal frameworks</li>
              <li>Cross-border data transfer may be necessary for international educational delivery</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">11.2 Academic Record Security</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU maintains academic records in accordance with educational record-keeping standards</li>
              <li>Students are responsible for maintaining backup copies of important academic documents</li>
              <li>Official transcripts and credential verification services are available through designated institutional processes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Information, Dispute Resolution, and Legal Framework</h2>
            
            <h3 className="text-xl font-semibold mb-3">12.1 Official Contact Information and Communication Channels</h3>
<ul className="list-disc pl-6 mb-4">
  <li><strong>U.S. Administrative Headquarters:</strong> The Tatnall School, 1501 Barley Mill Road, Wilmington, DE 19807, USA | Email: admin@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>Student Services and Support:</strong> Email: studentsupport@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>Academic Affairs and Faculty Relations:</strong> Email: academics@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>Admissions and Enrollment Services:</strong> Email: admissions@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>Financial Services and Business Office:</strong> Email: finance@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>Legal and Compliance Matters:</strong> Email: legal@nscu.govt.ac | Phone: +1 302-998-2292</li>
  <li><strong>International Student Services:</strong> Email: international@nscu.govt.ac | Phone: +1 302-998-2292</li>
</ul>
            </ul>

            <h3 className="text-xl font-semibold mb-3">12.2 Dispute Resolution and Grievance Procedures</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Students should first attempt to resolve concerns through direct communication with relevant departments</li>
              <li>Formal grievance procedures are available for academic, financial, or administrative disputes</li>
              <li>Mediation and arbitration options may be available for complex disputes</li>
              <li>Students should review detailed grievance policies in student handbook documentation</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">12.3 Governing Law and Jurisdiction</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Academic matters, degree issuance, and educational policies are governed by the laws of Belize</li>
              <li>U.S. administrative operations are subject to Delaware state law and applicable federal regulations</li>
              <li>International operations comply with local laws and regulations in respective jurisdictions</li>
              <li>Contractual disputes may be subject to specific jurisdiction and governing law clauses in enrollment agreements</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">12.4 Regulatory Compliance and Reporting</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>NSCU complies with applicable educational regulations, consumer protection laws, and disclosure requirements</li>
              <li>Students may file complaints with relevant regulatory authorities if institutional policies are not followed</li>
              <li>Contact information for relevant regulatory bodies is available upon request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Disclaimer Updates and Version Control</h2>
            
            <h3 className="text-xl font-semibold mb-3">13.1 Disclaimer Modification Rights</h3>
            <p className="mb-4">NSCU reserves the right to modify, update, or revise this disclaimer at any time to reflect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Changes in legal requirements or regulatory compliance</li>
              <li>Institutional policy updates or procedural modifications</li>
              <li>Industry standards or best practice implementations</li>
              <li>Technological advances or service delivery improvements</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">13.2 Student Notification and Awareness Responsibilities</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Students are responsible for regularly reviewing the current version of this disclaimer</li>
              <li>Significant changes will be communicated through official institutional communication channels</li>
              <li>Continued use of NSCU services constitutes acceptance of updated disclaimer terms</li>
              <li>Students should contact appropriate offices with questions about disclaimer modifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Comprehensive Student Acknowledgment and Legal Consent</h2>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <p className="mb-4">
                <strong>By using this website, accessing institutional materials, submitting application documents, participating in recruitment activities, or enrolling at NSCU, I hereby acknowledge, understand, and legally agree that:</strong>
              </p>

              <ol className="list-decimal pl-6 space-y-4">
                <li><strong>Foreign Degree Classification:</strong> All degrees, certificates, credentials, and qualifications are issued by NSCU Belize under Belizean educational law and are classified as foreign qualifications in most countries worldwide, requiring potential additional steps for recognition, equivalence, or acceptance.</li>

                <li><strong>Academic Equivalence Responsibility:</strong> Any equivalence recognition, credential evaluation, or degree acceptance for academic programs is optional, not guaranteed by NSCU, and remains my complete responsibility to research, pursue, finance, and complete through appropriate educational authorities, credential evaluation services, or recognition bodies.</li>

                <li><strong>Professional Practice and Licensing Limitations:</strong> Completion of professional, regulated, or practice-oriented programs does not automatically confer legal practice rights in any jurisdiction worldwide, and I must independently obtain all necessary licensure, registration, certification, or authorization from relevant statutory authorities, professional bodies, or regulatory organizations.</li>

                <li><strong>Institutional Branding and Government Affiliation Understanding:</strong> The designation "NSCU – Delaware, USA," the domain nscu.govt.ac, and all institutional branding are used exclusively for marketing, administrative, and operational purposes and do not imply any affiliation with, endorsement by, authority from, or connection to any government entity of the United States, Belize, or any other country.</li>

                <li><strong>Comprehensive Due Diligence Responsibility:</strong> I understand my complete responsibility to conduct thorough research and verify the acceptance, recognition, and utility of NSCU credentials with prospective employers, licensing boards, educational institutions, immigration authorities, and any other relevant entities before enrollment and throughout my academic journey.</li>

                <li><strong>Financial and Economic Risk Acceptance:</strong> I acknowledge that educational investment involves inherent financial risks, and NSCU provides no guarantees, warranties, or assurances regarding employment outcomes, salary expectations, career advancement, professional licensing success, degree equivalence approval, return on investment, or acceptance by any third parties.</li>

                <li><strong>Legal and Regulatory Compliance:</strong> I agree to comply with all applicable laws, regulations, institutional policies, academic integrity standards, and professional conduct requirements throughout my association with NSCU and in my subsequent use of NSCU credentials.</li>

                <li><strong>Limitation of Institutional Liability:</strong> I understand and accept that NSCU's liability is limited as outlined in this disclaimer, and I assume personal responsibility for my educational choices, career decisions, and any consequences arising from my use of NSCU credentials or services.</li>
              </ol>
            </div>
          </section>

          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>© 2024 NSCU – Delaware, USA. All rights reserved.</strong>
            </p>
            
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-2">
              <p><em>This comprehensive disclaimer is subject to periodic updates and modifications. Students are strongly advised to review the current version regularly and maintain copies for their records. Questions, concerns, or requests for clarification regarding this disclaimer should be directed to the appropriate institutional contacts listed above. This document constitutes a material part of the educational services agreement between NSCU and its students.</em></p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-left">
                <div>
                  <strong>Document Classification:</strong><br />
                  Official Institutional Policy
                </div>
                <div>
                  <strong>Distribution:</strong><br />
                  Public
                </div>
                <div>
                  <strong>Review Cycle:</strong><br />
                  Annual
                </div>
                <div>
                  <strong>Approval Authority:</strong><br />
                  Institutional Administration
                </div>
              </div>
              
              <p className="mt-4"><strong>Compliance:</strong> Legal and Regulatory Affairs</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsDisclaimer;