export interface PressRelease {
  id: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  year: number;
  refCode: string;
  author: string;
  quote?: {
    text: string;
    attribution: string;
    title: string;
  };
  image?: string;
}

export const pressReleases: PressRelease[] = [
  // 2010
  {
    id: "pr-2010-001",
    date: "2010-02-18",
    title: "NSCU Announces Exploratory Campus Feasibility Study in India",
    summary: "NSCU launches a feasibility study for an offshore learning centre in India, citing rising global demand for transnational education after the global financial crisis recovery.",
    content: `The New States Continental University (NSCU) announced today the commencement of a comprehensive feasibility study for establishing an offshore learning centre in India. This strategic initiative responds to the growing global demand for accessible transnational higher education in the wake of the recent financial crisis recovery.

The study will assess infrastructure requirements, regulatory frameworks, and partnership opportunities with Indian educational institutions. NSCU aims to expand its global footprint while maintaining the rigorous academic standards for which the institution is recognized.

"This initiative represents NSCU's commitment to democratizing access to quality higher education," stated Dr. Margaret Harrison, Vice President for International Affairs. "India presents tremendous opportunities for collaborative educational ventures, and we are excited to explore pathways that will benefit students across continents."

The feasibility assessment is expected to conclude by the fourth quarter of 2010, with preliminary findings informing the University's strategic planning for international expansion.`,
    category: "International Expansion",
    year: 2010,
    refCode: "NSCU/PR/2010/001/IND",
    author: "Office of Communications",
    quote: {
      text: "This initiative represents NSCU's commitment to democratizing access to quality higher education. India presents tremendous opportunities for collaborative educational ventures, and we are excited to explore pathways that will benefit students across continents.",
      attribution: "Dr. Margaret Harrison",
      title: "Vice President for International Affairs"
    },
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop"
  },
  {
    id: "pr-2010-002",
    date: "2010-04-12",
    title: "New Partnership with Belize MOECST Registration Initiated",
    summary: "NSCU files registration paperwork with MOECST (Belize) to formalize transnational governance pathways; position framed as part of broader international education regulatory modernization.",
    content: `The New States Continental University has formally initiated registration procedures with the Ministry of Education, Culture, Science and Technology (MOECST) of Belize, marking a significant milestone in the institution's commitment to transparent transnational educational governance.

This registration process aligns with NSCU's broader strategy to operate within established international regulatory frameworks and demonstrates the University's dedication to quality assurance and academic integrity across jurisdictions.

"Formalizing our relationship with MOECST represents a critical step in our institutional development," explained Dr. Robert Chen, University Registrar. "This partnership ensures that our offshore operations maintain the highest standards of accountability and academic rigor while respecting local educational governance structures."

The registration process is part of a comprehensive modernization initiative addressing the evolving landscape of cross-border higher education. NSCU anticipates completion of the registration process within the current academic year.`,
    category: "Regulatory Affairs",
    year: 2010,
    refCode: "NSCU/PR/2010/002/REG",
    author: "Office of the Registrar",
    quote: {
      text: "Formalizing our relationship with MOECST represents a critical step in our institutional development. This partnership ensures that our offshore operations maintain the highest standards of accountability and academic rigor while respecting local educational governance structures.",
      attribution: "Dr. Robert Chen",
      title: "University Registrar"
    }
  },
  {
    id: "pr-2010-003",
    date: "2010-06-23",
    title: "Launch of Online Certificate Programs in Response to E-Learning Growth",
    summary: "NSCU debuts three short online certificates (business analytics, English for academia, research writing) timed to the rapid uptake of online learning technologies.",
    content: `In response to the accelerating adoption of digital learning technologies, The New States Continental University today announced the launch of three professional certificate programs delivered entirely online: Business Analytics, English for Academic Purposes, and Research Writing.

These certificate programs are designed to meet the needs of working professionals and lifelong learners seeking to enhance their skills without interrupting their careers. Each program can be completed in 12-16 weeks and features asynchronous learning modules, interactive assignments, and personalized feedback from experienced faculty.

"The rise of online learning presents unprecedented opportunities to reach learners who might otherwise be unable to access quality higher education," noted Dr. Jennifer Williams, Dean of Continuing Education. "Our certificate programs combine academic rigor with practical application, ensuring that graduates are immediately prepared to apply their new skills in professional contexts."

Enrollment for the inaugural cohort opens July 1, 2010, with classes beginning in September.`,
    category: "Academic Programs",
    year: 2010,
    refCode: "NSCU/PR/2010/003/ACA",
    author: "Continuing Education Division",
    quote: {
      text: "The rise of online learning presents unprecedented opportunities to reach learners who might otherwise be unable to access quality higher education. Our certificate programs combine academic rigor with practical application, ensuring that graduates are immediately prepared to apply their new skills in professional contexts.",
      attribution: "Dr. Jennifer Williams",
      title: "Dean of Continuing Education"
    },
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop"
  },
  {
    id: "pr-2010-004",
    date: "2010-09-01",
    title: "Summer Research Internships Announced Tied to Global Climate Summit",
    summary: "NSCU opens applications for climate and sustainability internships to align with global climate policy dialogues happening that year.",
    content: `The New States Continental University has announced a new summer research internship program focused on climate science and sustainability, timed to coincide with ongoing global climate policy dialogues.

The program will provide undergraduate and graduate students with opportunities to engage in meaningful research addressing critical environmental challenges. Interns will work alongside NSCU faculty and external partners on projects related to renewable energy, climate adaptation strategies, and environmental policy analysis.

"Climate change represents one of the defining challenges of our generation," stated Dr. Thomas Green, Director of the Institute for Environmental Studies. "This internship program empowers the next generation of researchers and policy-makers to contribute to evidence-based solutions while developing their professional skills."

Applications are now open, with the first cohort of interns beginning their work in summer 2011. The program is supported by institutional funding and external grants from environmental foundations.`,
    category: "Research & Innovation",
    year: 2010,
    refCode: "NSCU/PR/2010/004/RES",
    author: "Institute for Environmental Studies",
    quote: {
      text: "Climate change represents one of the defining challenges of our generation. This internship program empowers the next generation of researchers and policy-makers to contribute to evidence-based solutions while developing their professional skills.",
      attribution: "Dr. Thomas Green",
      title: "Director, Institute for Environmental Studies"
    }
  },
  {
    id: "pr-2010-005",
    date: "2010-11-20",
    title: "NSCU Faculty Delegation Attends International Education Forum",
    summary: "NSCU sends delegates to an international higher-education conference to deepen ties with accreditation bodies and global partners.",
    content: `A delegation of senior NSCU faculty and administrators participated in the Global Higher Education Forum held in Singapore this month, strengthening the University's relationships with international accreditation bodies and educational partners.

The forum brought together leaders from over 50 countries to discuss emerging trends in transnational education, quality assurance frameworks, and innovative pedagogical approaches. NSCU representatives contributed to panel discussions on offshore education governance and student mobility.

"These international convenings are essential for staying at the forefront of global educational best practices," explained President Dr. Elizabeth Morrison. "The insights and partnerships we develop through such engagement directly benefit our students and enhance our institutional effectiveness."

The delegation also held bilateral meetings with representatives from partner institutions in Asia, Europe, and Latin America, exploring opportunities for expanded research collaborations and student exchange programs.`,
    category: "International Relations",
    year: 2010,
    refCode: "NSCU/PR/2010/005/INT",
    author: "Office of the President",
    quote: {
      text: "These international convenings are essential for staying at the forefront of global educational best practices. The insights and partnerships we develop through such engagement directly benefit our students and enhance our institutional effectiveness.",
      attribution: "Dr. Elizabeth Morrison",
      title: "President, NSCU"
    }
  },

  // 2011
  {
    id: "pr-2011-001",
    date: "2011-01-10",
    title: "NSCU Establishes Ethics & Governance Center",
    summary: "Responding to heightened public discussion about institutional accountability, NSCU creates an internal center focused on ethics in research and higher-education governance.",
    content: `The New States Continental University has established a new Ethics & Governance Center, responding to increased emphasis on institutional accountability and ethical conduct in higher education.

The Center will serve as a hub for research on ethical issues in academia, provide training and resources for faculty and staff, and develop institutional policies that promote integrity across all University operations.

"In an era of increasing complexity in higher education, having a dedicated center focused on ethics and governance demonstrates our unwavering commitment to the highest standards of institutional conduct," stated Provost Dr. David Larson. "This Center will be instrumental in maintaining the trust that students, families, and partners place in NSCU."

The Center will begin operations in February 2011 under the direction of Dr. Patricia Wong, a noted scholar in research ethics and academic integrity.`,
    category: "Institutional Development",
    year: 2011,
    refCode: "NSCU/PR/2011/001/GOV",
    author: "Office of the Provost",
    quote: {
      text: "In an era of increasing complexity in higher education, having a dedicated center focused on ethics and governance demonstrates our unwavering commitment to the highest standards of institutional conduct. This Center will be instrumental in maintaining the trust that students, families, and partners place in NSCU.",
      attribution: "Dr. David Larson",
      title: "Provost"
    }
  },
  {
    id: "pr-2011-002",
    date: "2011-03-22",
    title: "NSCU Announces Scholarship Fund for Disaster-Affected Students",
    summary: "University opens a relief scholarship stream for students affected by natural disasters worldwide, reflecting an increased global focus on humanitarian responses.",
    content: `In response to recent natural disasters affecting communities worldwide, The New States Continental University has established an emergency scholarship fund to support students whose education has been disrupted by catastrophic events.

The Disaster Relief Scholarship Fund will provide financial assistance covering tuition, housing, and essential expenses for eligible students demonstrating need due to natural disaster impact on their families or communities.

"Education is a pathway to recovery and resilience," explained Dr. Sarah Mitchell, Vice President for Student Affairs. "When disaster strikes, students often face impossible choices between continuing their education and supporting their families. This fund aims to remove that barrier and ensure that talented students can complete their degrees despite extraordinary circumstances."

The University has committed $500,000 as initial funding, with additional contributions being solicited from alumni and institutional partners. Applications will be reviewed on a rolling basis.`,
    category: "Student Support",
    year: 2011,
    refCode: "NSCU/PR/2011/002/STU",
    author: "Student Affairs Division",
    quote: {
      text: "Education is a pathway to recovery and resilience. When disaster strikes, students often face impossible choices between continuing their education and supporting their families. This fund aims to remove that barrier and ensure that talented students can complete their degrees despite extraordinary circumstances.",
      attribution: "Dr. Sarah Mitchell",
      title: "Vice President for Student Affairs"
    },
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=400&fit=crop"
  },
  {
    id: "pr-2011-003",
    date: "2011-06-15",
    title: "NSCU Launches Joint Webinar Series on Digital Learning",
    summary: "University rolls out a public webinar series addressing the future of digital pedagogy amid rapid tech adoption in education.",
    content: `The New States Continental University has launched "Futures in Digital Learning," a free public webinar series examining transformative trends in educational technology and online pedagogy.

The monthly series will feature NSCU faculty alongside guest speakers from leading technology companies, educational institutions, and policy organizations. Topics will include adaptive learning systems, assessment in online environments, digital literacy, and the future of credentialing.

"Technology is fundamentally reshaping how we teach and learn," noted Dr. Marcus Johnson, Director of Educational Technology. "This webinar series creates a platform for thoughtful dialogue about how institutions can harness technology to improve educational outcomes while maintaining our commitment to academic quality and student success."

The inaugural webinar, "The Promise and Perils of Online Assessment," will be held June 28, 2011. Registration is free and open to educators, students, and interested members of the public.`,
    category: "Educational Technology",
    year: 2011,
    refCode: "NSCU/PR/2011/003/TECH",
    author: "Center for Educational Technology",
    quote: {
      text: "Technology is fundamentally reshaping how we teach and learn. This webinar series creates a platform for thoughtful dialogue about how institutions can harness technology to improve educational outcomes while maintaining our commitment to academic quality and student success.",
      attribution: "Dr. Marcus Johnson",
      title: "Director of Educational Technology"
    }
  },
  {
    id: "pr-2011-004",
    date: "2011-09-05",
    title: "Memorandum of Understanding Signed with Offshore Partner College",
    summary: "NSCU signs MoU with an offshore study centre to administer degree programmes locally while exams remain under NSCU oversight.",
    content: `The New States Continental University has formalized a Memorandum of Understanding (MoU) with International Academic Centre (IAC) to establish a collaborative educational partnership for delivering NSCU degree programs internationally.

Under the agreement, IAC will provide local instruction and student support services while NSCU maintains oversight of curriculum development, assessment standards, and degree certification. This partnership model ensures consistent academic quality across geographic boundaries.

"Strategic partnerships with established educational providers enable NSCU to extend our reach while maintaining the academic integrity that is central to our mission," stated Dr. Margaret Harrison, Vice President for International Affairs. "This MoU establishes clear accountability frameworks that protect student interests and uphold the value of NSCU credentials."

The partnership will initially focus on business administration and health sciences programs, with potential expansion to additional disciplines based on student demand and institutional capacity.`,
    category: "International Partnerships",
    year: 2011,
    refCode: "NSCU/PR/2011/004/PART",
    author: "International Affairs Office",
    quote: {
      text: "Strategic partnerships with established educational providers enable NSCU to extend our reach while maintaining the academic integrity that is central to our mission. This MoU establishes clear accountability frameworks that protect student interests and uphold the value of NSCU credentials.",
      attribution: "Dr. Margaret Harrison",
      title: "Vice President for International Affairs"
    }
  },
  {
    id: "pr-2011-005",
    date: "2011-12-12",
    title: "NSCU Issues Statement Supporting Open-Access Research Initiatives",
    summary: "NSCU commits to expanding open-access publication policies to increase research visibility and impact.",
    content: `The New States Continental University has announced its formal support for open-access scholarly publishing, committing to policies that will make NSCU-funded research more widely accessible to the global academic community and general public.

The University's new open-access policy encourages faculty to publish in open-access journals and provides institutional support for article processing charges. NSCU is also developing an institutional repository to archive and disseminate scholarly works produced by faculty, students, and researchers.

"Open access accelerates the pace of scientific discovery and ensures that knowledge generated through publicly-supported research benefits society broadly," explained Dr. Rachel Adams, University Librarian. "NSCU's commitment to open access reflects our belief that education and research are public goods that should be shared as widely as possible."

The policy will be phased in over the next academic year, with full implementation expected by fall 2012.`,
    category: "Research Policy",
    year: 2011,
    refCode: "NSCU/PR/2011/005/LIB",
    author: "University Library Services",
    quote: {
      text: "Open access accelerates the pace of scientific discovery and ensures that knowledge generated through publicly-supported research benefits society broadly. NSCU's commitment to open access reflects our belief that education and research are public goods that should be shared as widely as possible.",
      attribution: "Dr. Rachel Adams",
      title: "University Librarian"
    }
  },

  // 2012
  {
    id: "pr-2012-001",
    date: "2012-02-27",
    title: "NSCU Inaugurates Centre for Sports Science",
    summary: "To leverage global interest during the Olympic year, NSCU opens a sports science research program and student internships.",
    content: `The New States Continental University has officially opened its new Centre for Sports Science, capitalizing on heightened global interest in athletics during this Olympic year.

The Centre will conduct research on athletic performance, injury prevention, sports psychology, and exercise physiology. It will also offer undergraduate and graduate programs in sports science and provide internship opportunities with professional sports organizations and Olympic training facilities.

"Sport is a universal language that transcends cultural and national boundaries," stated Dr. Kevin Martinez, Director of the Centre for Sports Science. "Our Centre combines cutting-edge research with practical training to prepare the next generation of sports scientists, coaches, and athletic professionals. With the world's attention focused on the Olympics this year, it's an ideal time to launch this initiative."

The Centre features state-of-the-art biomechanics laboratories, sports psychology research facilities, and partnerships with regional athletic organizations.`,
    category: "Academic Programs",
    year: 2012,
    refCode: "NSCU/PR/2012/001/SPORT",
    author: "College of Health Sciences",
    quote: {
      text: "Sport is a universal language that transcends cultural and national boundaries. Our Centre combines cutting-edge research with practical training to prepare the next generation of sports scientists, coaches, and athletic professionals. With the world's attention focused on the Olympics this year, it's an ideal time to launch this initiative.",
      attribution: "Dr. Kevin Martinez",
      title: "Director, Centre for Sports Science"
    },
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop"
  },
  {
    id: "pr-2012-002",
    date: "2012-04-18",
    title: "New Postgraduate Diploma in Disaster Risk Management",
    summary: "Program introduced in response to heightened global attention on disaster preparedness and resilience-building.",
    content: `The New States Continental University is launching a Postgraduate Diploma in Disaster Risk Management, addressing the critical need for trained professionals in disaster preparedness, response, and recovery.

The 18-month program covers emergency management principles, risk assessment methodologies, community resilience planning, and humanitarian response coordination. Students will gain practical experience through simulations and field placements with emergency management agencies.

"Recent global events have underscored the essential importance of disaster preparedness and effective emergency response," explained Dr. Linda Thompson, Program Director. "This diploma equips professionals with the knowledge and skills to save lives, protect communities, and build resilience against natural and human-made disasters."

The program is designed for working professionals and will be offered in both on-campus and blended learning formats. Applications for the inaugural cohort are now being accepted.`,
    category: "Graduate Education",
    year: 2012,
    refCode: "NSCU/PR/2012/002/GRAD",
    author: "Graduate Studies Office",
    quote: {
      text: "Recent global events have underscored the essential importance of disaster preparedness and effective emergency response. This diploma equips professionals with the knowledge and skills to save lives, protect communities, and build resilience against natural and human-made disasters.",
      attribution: "Dr. Linda Thompson",
      title: "Program Director, Disaster Risk Management"
    }
  },
  {
    id: "pr-2012-003",
    date: "2012-07-02",
    title: "NSCU Publishes First Institutional Quality Assurance Manual",
    summary: "The manual outlines procedures for offshore exam conduct and degree verification as international enrollment expands.",
    content: `The New States Continental University has published its first comprehensive Institutional Quality Assurance Manual, establishing standardized procedures for maintaining academic integrity across all campuses and offshore learning centres.

The manual provides detailed protocols for examination administration, degree verification, transcript authentication, and quality monitoring. It reflects NSCU's commitment to consistent standards regardless of where students are located geographically.

"As NSCU expands internationally, maintaining consistent quality standards becomes both more important and more complex," stated Dr. Robert Chen, University Registrar. "This Quality Assurance Manual serves as our institutional compass, ensuring that every NSCU credential represents the same level of academic achievement and rigor."

The manual was developed in consultation with international quality assurance agencies and will be reviewed and updated annually to reflect evolving best practices.`,
    category: "Quality Assurance",
    year: 2012,
    refCode: "NSCU/PR/2012/003/QA",
    author: "Office of Quality Assurance",
    quote: {
      text: "As NSCU expands internationally, maintaining consistent quality standards becomes both more important and more complex. This Quality Assurance Manual serves as our institutional compass, ensuring that every NSCU credential represents the same level of academic achievement and rigor.",
      attribution: "Dr. Robert Chen",
      title: "University Registrar"
    }
  },
  {
    id: "pr-2012-004",
    date: "2012-10-10",
    title: "Launch of Faculty Exchange Program with Latin American Universities",
    summary: "Exchange agreements focus on research collaborations and curricular alignment across continents.",
    content: `The New States Continental University has established a faculty exchange program with a consortium of universities in Latin America, facilitating research collaboration and curricular innovation across institutions.

The exchange program will enable NSCU faculty to teach and conduct research at partner institutions while hosting visiting scholars from throughout the region. The initiative emphasizes interdisciplinary collaboration in areas of mutual strategic interest, including public health, environmental sciences, and education.

"Faculty exchange enriches our academic community by bringing diverse perspectives and expertise to our campuses," noted Provost Dr. David Larson. "These partnerships strengthen research capacity, enhance teaching quality, and prepare our students to succeed in an increasingly interconnected world."

The program will begin with pilot exchanges in the 2013 academic year, with plans to expand based on initial outcomes.`,
    category: "Faculty Development",
    year: 2012,
    refCode: "NSCU/PR/2012/004/FAC",
    author: "Office of the Provost",
    quote: {
      text: "Faculty exchange enriches our academic community by bringing diverse perspectives and expertise to our campuses. These partnerships strengthen research capacity, enhance teaching quality, and prepare our students to succeed in an increasingly interconnected world.",
      attribution: "Dr. David Larson",
      title: "Provost"
    }
  },
  {
    id: "pr-2012-005",
    date: "2012-12-05",
    title: "NSCU Pilot Telemedicine Collaboration Announced",
    summary: "University partners with health technology providers to pilot telemedicine training modules, reflecting growth in digital health solutions.",
    content: `The New States Continental University has partnered with leading health technology providers to develop pilot telemedicine training modules for medical and nursing students.

The initiative responds to rapid growth in telehealth services and prepares healthcare professionals to deliver quality care through digital platforms. Students will gain hands-on experience with telemedicine technologies through simulations and supervised clinical placements.

"Telemedicine is transforming healthcare delivery, particularly in underserved communities," explained Dr. Amelia Rodriguez, Dean of the College of Health Sciences. "Our students must be proficient in these technologies to meet the evolving needs of patients and healthcare systems. This pilot program positions NSCU at the forefront of health professions education."

The pilot will run through the 2013 academic year, with evaluation results informing permanent curriculum integration.`,
    category: "Health Sciences",
    year: 2012,
    refCode: "NSCU/PR/2012/005/HEALTH",
    author: "College of Health Sciences",
    quote: {
      text: "Telemedicine is transforming healthcare delivery, particularly in underserved communities. Our students must be proficient in these technologies to meet the evolving needs of patients and healthcare systems. This pilot program positions NSCU at the forefront of health professions education.",
      attribution: "Dr. Amelia Rodriguez",
      title: "Dean, College of Health Sciences"
    },
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop"
  },

  // 2013
  {
    id: "pr-2013-001",
    date: "2013-01-22",
    title: "NSCU Expands Research Grants for Public Health Studies",
    summary: "New grants target infectious disease surveillance and community health systems amid rising global public-health awareness.",
    content: `The New States Continental University has announced the expansion of its research grant program for public health studies, with a particular focus on infectious disease surveillance and community health systems strengthening.

The expanded program will provide competitive grants ranging from $25,000 to $150,000 for faculty and graduate student research projects addressing critical public health challenges. Priority areas include epidemiological surveillance, health systems capacity-building, and community-based health interventions.

"Public health is fundamental to the well-being of communities worldwide," stated Dr. Michael Foster, Dean of the School of Public Health. "These grants enable our researchers to contribute to evidence-based solutions that can save lives and improve health outcomes, particularly in underserved populations."

Applications are now open, with the first round of awards to be announced in April 2013. The program is funded through a combination of institutional resources and external partnerships with public health foundations.`,
    category: "Research Funding",
    year: 2013,
    refCode: "NSCU/PR/2013/001/PH",
    author: "School of Public Health",
    quote: {
      text: "Public health is fundamental to the well-being of communities worldwide. These grants enable our researchers to contribute to evidence-based solutions that can save lives and improve health outcomes, particularly in underserved populations.",
      attribution: "Dr. Michael Foster",
      title: "Dean, School of Public Health"
    }
  },
  {
    id: "pr-2013-002",
    date: "2013-03-15",
    title: "NSCU Issues Policy on Academic Integrity and Plagiarism Detection",
    summary: "With expanded online offerings, NSCU enacts stronger policies and launches institutional use of plagiarism-detection tools.",
    content: `The New States Continental University has implemented a comprehensive Academic Integrity Policy and deployed plagiarism detection technology across all courses as part of its commitment to maintaining the highest standards of scholarly conduct.

The policy provides clear definitions of academic misconduct, outlines consequences for violations, and establishes support systems to help students understand and uphold academic integrity standards. All student submissions will be processed through institutional plagiarism detection systems.

"Academic integrity is the foundation of meaningful education," explained Dr. Robert Chen, University Registrar. "As we expand our online offerings and serve increasingly diverse student populations, clear policies and robust detection systems protect both students who uphold these standards and the value of NSCU credentials."

The University is also implementing educational programming to help students develop proper citation practices and understand the principles of academic honesty.`,
    category: "Academic Policy",
    year: 2013,
    refCode: "NSCU/PR/2013/002/REG",
    author: "Office of the Registrar",
    quote: {
      text: "Academic integrity is the foundation of meaningful education. As we expand our online offerings and serve increasingly diverse student populations, clear policies and robust detection systems protect both students who uphold these standards and the value of NSCU credentials.",
      attribution: "Dr. Robert Chen",
      title: "University Registrar"
    }
  },
  {
    id: "pr-2013-003",
    date: "2013-06-01",
    title: "NSCU Hosts Regional Conference on Offshore Education Quality",
    summary: "The conference brings regulators, accreditation bodies, and institutional leaders to discuss quality assurance for offshore centres.",
    content: `The New States Continental University will host a three-day regional conference on quality assurance in offshore education, convening regulatory officials, accreditation representatives, and university leaders from across multiple jurisdictions.

The conference, titled "Ensuring Excellence: Quality Frameworks for Transnational Higher Education," will address challenges and best practices in maintaining academic standards across borders, protecting student interests, and building trust in international credentials.

"Offshore education presents unique quality assurance challenges that require collaborative solutions," noted Dr. Margaret Harrison, Vice President for International Affairs. "This conference creates a forum for stakeholders to share insights, develop common frameworks, and strengthen the integrity of transnational higher education."

The conference will include panel discussions, case study presentations, and working sessions focused on developing practical quality assurance tools.`,
    category: "Quality Assurance",
    year: 2013,
    refCode: "NSCU/PR/2013/003/CONF",
    author: "International Affairs Office",
    quote: {
      text: "Offshore education presents unique quality assurance challenges that require collaborative solutions. This conference creates a forum for stakeholders to share insights, develop common frameworks, and strengthen the integrity of transnational higher education.",
      attribution: "Dr. Margaret Harrison",
      title: "Vice President for International Affairs"
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
  },

  // 2020-2024 added for completeness
  {
    id: "pr-2020-001",
    date: "2020-03-12",
    title: "NSCU Transitions to Fully Remote Instruction Amid Global Pandemic Measures",
    summary: "With nations imposing health restrictions, NSCU moves teaching online and scales student support services.",
    content: `The New States Continental University has transitioned all instructional activities to fully remote delivery in response to global public health measures addressing the COVID-19 pandemic.

The rapid transition involved mobilizing technology infrastructure, training faculty in online pedagogy, and expanding student support services to address the challenges of remote learning. The University has established enhanced technical support, academic advising, and mental health resources accessible to all students.

"Our priority is ensuring continuity of learning while protecting the health and safety of our community," stated President Dr. Elizabeth Morrison. "We are committed to maintaining educational quality and supporting student success through this unprecedented challenge."

The University will continue to monitor public health guidance and adjust operations accordingly, with plans to return to in-person instruction when it is safe to do so.`,
    category: "Institutional Response",
    year: 2020,
    refCode: "NSCU/PR/2020/001/COVID",
    author: "Office of the President",
    quote: {
      text: "Our priority is ensuring continuity of learning while protecting the health and safety of our community. We are committed to maintaining educational quality and supporting student success through this unprecedented challenge.",
      attribution: "Dr. Elizabeth Morrison",
      title: "President, NSCU"
    },
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800&h=400&fit=crop"
  },

  // 2025 (most recent)
  {
    id: "pr-2025-001",
    date: "2025-01-15",
    title: "NSCU Announces Expansion of Doctoral Scholarships for Climate and Health Research",
    summary: "New scholarships prioritize interdisciplinary projects addressing pressing global challenges.",
    content: `The New States Continental University has announced a significant expansion of its doctoral scholarship program, with new funding dedicated specifically to interdisciplinary research in climate science and global health.

The expanded program will support up to 25 doctoral candidates annually, providing full tuition coverage, stipends, and research funding for projects addressing the intersections of climate change, public health, and social equity.

"The challenges facing our world today—from pandemic preparedness to climate resilience—demand sophisticated, interdisciplinary approaches," stated President Dr. Elizabeth Morrison. "These scholarships will enable exceptional scholars to pursue transformative research that can inform policy and improve lives globally."

Priority will be given to applicants whose research demonstrates clear pathways to real-world impact and addresses populations disproportionately affected by climate and health vulnerabilities. Applications for the 2025-2026 cohort open February 1, 2025.`,
    category: "Research Funding",
    year: 2025,
    refCode: "NSCU/PR/2025/001/RES",
    author: "Graduate Studies & Research Office",
    quote: {
      text: "The challenges facing our world today—from pandemic preparedness to climate resilience—demand sophisticated, interdisciplinary approaches. These scholarships will enable exceptional scholars to pursue transformative research that can inform policy and improve lives globally.",
      attribution: "Dr. Elizabeth Morrison",
      title: "President, NSCU"
    },
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop"
  },
  {
    id: "pr-2025-005",
    date: "2025-09-30",
    title: "NSCU Announces Five-Year Plan to Grow Inclusive Online Doctoral Pathways",
    summary: "The plan commits to accessible, low-cost doctoral routes with robust supervision, student supports, and verifiable credentials.",
    content: `The New States Continental University has unveiled an ambitious five-year strategic plan to expand accessible online doctoral education, with emphasis on supporting scholars who face geographic, financial, or personal barriers to traditional on-campus programs.

The "Pathways to Doctoral Excellence" initiative commits to developing fully online doctoral programs across multiple disciplines, supported by comprehensive student services, robust mentorship structures, and innovative assessment methods that maintain academic rigor.

"Doctoral education has traditionally been accessible primarily to those with the resources and flexibility to relocate and study full-time," explained Provost Dr. David Larson. "Our plan reimagines this model, creating pathways that enable working professionals, caregivers, and scholars in remote locations to pursue rigorous doctoral study while maintaining their other commitments."

Key features include synchronous and asynchronous learning options, digital research resources, virtual dissertation defenses, and blockchain-verified credentials. The first programs will launch in 2026, with full implementation by 2030.`,
    category: "Strategic Planning",
    year: 2025,
    refCode: "NSCU/PR/2025/005/STRAT",
    author: "Office of the Provost",
    quote: {
      text: "Doctoral education has traditionally been accessible primarily to those with the resources and flexibility to relocate and study full-time. Our plan reimagines this model, creating pathways that enable working professionals, caregivers, and scholars in remote locations to pursue rigorous doctoral study while maintaining their other commitments.",
      attribution: "Dr. David Larson",
      title: "Provost"
    },
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop"
  }
];

export const getPressReleaseById = (id: string): PressRelease | undefined => {
  return pressReleases.find(pr => pr.id === id);
};

export const getPressReleasesByYear = (year: number): PressRelease[] => {
  return pressReleases.filter(pr => pr.year === year).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getAllYears = (): number[] => {
  const years = [...new Set(pressReleases.map(pr => pr.year))];
  return years.sort((a, b) => b - a);
};
