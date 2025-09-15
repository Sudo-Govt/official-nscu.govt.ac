
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, DollarSign, Users, GraduationCap, Download, ChevronDown, FileText, Award, Cog } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const BachelorEngineering = () => {
  useSEO({
    title: "Bachelor of Engineering Program - GCHEA Accredited | NSCU Belize",
    description: "Earn your Bachelor of Engineering degree from NSCU Belize. GCHEA-accredited 4-year program with specializations in Mechanical, Electrical, Computer, Civil, Chemical Engineering. Apply by January 5th, 2026.",
    keywords: "Bachelor Engineering NSCU Belize, accredited engineering degree Belize, mechanical electrical computer engineering program, engineering admissions 2026, GCHEA engineering degree",
    canonical: "https://newstatesuniversity.lovable.app/programs/bachelor-engineering",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Bachelor of Engineering",
      "description": "Comprehensive 4-year engineering program with multiple specializations",
      "provider": {
        "@type": "University",
        "name": "New States Continental University",
        "url": "https://newstatesuniversity.lovable.app"
      },
      "educationalCredentialAwarded": "Bachelor of Engineering",
      "teaches": ["Engineering Mathematics", "Thermodynamics", "Circuit Analysis", "Materials Science", "Engineering Design"],
      "totalTime": "P4Y",
      "courseMode": "on-campus",
      "applicationDeadline": "2026-01-05",
      "startDate": "2026-01-15"
    }
  });
  const programOverview = {
    name: "Bachelor of Engineering",
    duration: "4 Years, 8 Semesters", 
    totalCredits: 120,
    structure: ["Foundation Mathematics & Sciences", "Core Engineering Courses", "Specialization Tracks", "Capstone Project"],
    assessment: "65% External Exam, 25% Laboratory Assessment, 10% Continuous Evaluation"
  };

  const semesters = [
    {
      id: "sem1",
      title: "Semester I",
      totalCredits: 15,
      contactHours: 375,
      courses: [
        {
          name: "Engineering Mathematics I",
          code: "MATH101",
          credits: 4,
          contactHours: 120,
          breakdown: ["90 Lectures", "30 Tutorials"],
          topics: ["Calculus", "Differential Equations", "Linear Algebra", "Complex Numbers", "Vector Analysis"],
          referenceBooks: ["Advanced Engineering Mathematics by Kreyszig", "Calculus by James Stewart", "Linear Algebra by Gilbert Strang"],
          learningOutcomes: ["Apply calculus to engineering problems", "Solve differential equations", "Use linear algebra in engineering contexts"],
          assessment: "70% Final Exam, 20% Mid-term, 10% Assignments"
        },
        {
          name: "Engineering Physics I",
          code: "PHYS101",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Mechanics", "Thermodynamics", "Wave Motion", "Optics", "Modern Physics"],
          referenceBooks: ["University Physics by Young & Freedman", "Physics for Scientists and Engineers by Serway"],
          learningOutcomes: ["Understand fundamental physics principles", "Apply physics to engineering systems", "Conduct laboratory experiments"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Quizzes"
        },
        {
          name: "Chemistry for Engineers",
          code: "CHEM101",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Laboratory"],
          topics: ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Kinetics", "Materials Chemistry"],
          referenceBooks: ["General Chemistry by Petrucci", "Chemistry: The Central Science by Brown"],
          learningOutcomes: ["Apply chemistry principles to materials", "Understand chemical processes", "Analyze material properties"],
          assessment: "65% Exams, 25% Lab Work, 10% Assignments"
        },
        {
          name: "Engineering Graphics & CAD",
          code: "ENG101",
          credits: 3,
          contactHours: 90,
          breakdown: ["30 Lectures", "60 CAD Lab"],
          topics: ["Technical Drawing", "Orthographic Projection", "AutoCAD", "SolidWorks", "3D Modeling"],
          referenceBooks: ["Engineering Graphics by Giesecke", "AutoCAD Manual", "SolidWorks Tutorial"],
          learningOutcomes: ["Create technical drawings", "Use CAD software proficiently", "Design 3D models"],
          assessment: "40% Project Work, 35% Lab Assignments, 25% Final Exam"
        },
        {
          name: "Introduction to Engineering",
          code: "ENG102", 
          credits: 1,
          contactHours: 30,
          breakdown: ["30 Seminars"],
          topics: ["Engineering Disciplines", "Problem Solving", "Ethics", "Communication", "Teamwork"],
          referenceBooks: ["Introduction to Engineering by Wickert", "Engineering Ethics by Martin"],
          learningOutcomes: ["Understand engineering profession", "Apply problem-solving methods", "Work effectively in teams"],
          assessment: "50% Project, 30% Presentations, 20% Participation"
        }
      ]
    },
    {
      id: "sem2", 
      title: "Semester II",
      totalCredits: 15,
      contactHours: 375,
      courses: [
        {
          name: "Engineering Mathematics II",
          code: "MATH102",
          credits: 4,
          contactHours: 120,
          breakdown: ["90 Lectures", "30 Tutorials"],
          topics: ["Multivariable Calculus", "Vector Calculus", "Fourier Series", "Laplace Transforms", "Numerical Methods"],
          referenceBooks: ["Advanced Engineering Mathematics by Kreyszig", "Numerical Methods by Chapra"],
          learningOutcomes: ["Solve multivariable problems", "Apply transforms to engineering", "Use numerical methods"],
          assessment: "70% Final Exam, 20% Mid-term, 10% Assignments"
        },
        {
          name: "Engineering Physics II", 
          code: "PHYS102",
          credits: 4,
          contactHours: 120,
          breakdown: ["60 Lectures", "60 Laboratory"],
          topics: ["Electricity & Magnetism", "Electromagnetic Waves", "AC/DC Circuits", "Electronic Devices", "Quantum Physics"],
          referenceBooks: ["University Physics by Young & Freedman", "Introduction to Electrodynamics by Griffiths"],
          learningOutcomes: ["Understand electromagnetic principles", "Analyze electrical circuits", "Apply quantum concepts"],
          assessment: "60% Final Exam, 25% Lab Reports, 15% Quizzes"
        },
        {
          name: "Engineering Mechanics - Statics",
          code: "ENG201",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Problem Sessions"],
          topics: ["Force Systems", "Equilibrium", "Trusses", "Friction", "Centroids", "Moments of Inertia"],
          referenceBooks: ["Engineering Mechanics: Statics by Hibbeler", "Statics by Meriam & Kraige"],
          learningOutcomes: ["Analyze static structures", "Apply equilibrium principles", "Solve truss problems"],
          assessment: "65% Exams, 25% Assignments, 10% Quizzes"
        },
        {
          name: "Materials Science",
          code: "MATL201",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Laboratory"],
          topics: ["Crystal Structure", "Phase Diagrams", "Mechanical Properties", "Metals", "Ceramics", "Polymers"],
          referenceBooks: ["Materials Science and Engineering by Callister", "Introduction to Materials Science by Shackelford"],
          learningOutcomes: ["Understand material properties", "Select appropriate materials", "Analyze material behavior"],
          assessment: "60% Final Exam, 30% Lab Reports, 10% Assignments"
        },
        {
          name: "Programming for Engineers",
          code: "CS101",
          credits: 1,
          contactHours: 45,
          breakdown: ["15 Lectures", "30 Programming Lab"],
          topics: ["C Programming", "MATLAB", "Data Structures", "Algorithms", "Engineering Applications"],
          referenceBooks: ["C Programming by Kernighan & Ritchie", "MATLAB Guide by Higham"],
          learningOutcomes: ["Program in C and MATLAB", "Solve engineering problems computationally", "Apply algorithms"],
          assessment: "50% Programming Projects, 30% Lab Work, 20% Final Exam"
        }
      ]
    }
  ];

  const specializationTracks = [
    {
      name: "Mechanical Engineering",
      description: "Design, manufacture, and maintain mechanical systems and devices",
      careerFields: ["Automotive Engineer", "Aerospace Engineer", "Manufacturing Engineer", "HVAC Engineer", "Robotics Engineer"],
      courses: [
        {
          semester: 3,
          courses: [
            { code: "ME301", name: "Engineering Thermodynamics I", credits: 3, hours: "3-0-0", description: "Laws of thermodynamics, properties of substances, processes and cycles" },
            { code: "ME302", name: "Fluid Mechanics I", credits: 3, hours: "3-0-0", description: "Fluid statics, kinematics, and dynamics; dimensional analysis" },
            { code: "ME303", name: "Mechanics of Materials", credits: 3, hours: "3-0-0", description: "Stress, strain, torsion, bending, and deflection analysis" }
          ]
        },
        {
          semester: 4,
          courses: [
            { code: "ME401", name: "Engineering Thermodynamics II", credits: 3, hours: "3-0-0", description: "Gas and vapor power cycles, refrigeration, psychrometrics" },
            { code: "ME402", name: "Fluid Mechanics II", credits: 3, hours: "3-0-0", description: "Compressible flow, turbomachinery, pipe networks" },
            { code: "ME403", name: "Heat Transfer", credits: 3, hours: "3-0-0", description: "Conduction, convection, radiation heat transfer mechanisms" },
            { code: "ME404", name: "Machine Design I", credits: 3, hours: "2-0-3", description: "Design of machine elements, shafts, bearings, gears" }
          ]
        },
        {
          semester: 5,
          courses: [
            { code: "ME501", name: "Manufacturing Processes", credits: 3, hours: "2-0-3", description: "Casting, forming, machining, joining, and modern manufacturing" },
            { code: "ME502", name: "Machine Design II", credits: 3, hours: "2-0-3", description: "Advanced machine design, clutches, brakes, springs" },
            { code: "ME503", name: "Dynamics of Machinery", credits: 3, hours: "3-0-0", description: "Kinematics and dynamics of mechanisms and machines" },
            { code: "ME504", name: "Control Systems", credits: 3, hours: "3-0-0", description: "Feedback control systems, stability, and compensation" }
          ]
        },
        {
          semester: 6,
          courses: [
            { code: "ME601", name: "Internal Combustion Engines", credits: 3, hours: "3-0-0", description: "Engine cycles, combustion, performance, emissions" },
            { code: "ME602", name: "Refrigeration & Air Conditioning", credits: 3, hours: "3-0-0", description: "Vapor compression, absorption systems, psychrometric processes" },
            { code: "ME603", name: "Mechanical Vibrations", credits: 3, hours: "3-0-0", description: "Free and forced vibrations, multi-DOF systems" },
            { code: "ME604", name: "Automotive Engineering", credits: 3, hours: "2-0-3", description: "Vehicle dynamics, powertrains, chassis design" }
          ]
        },
        {
          semester: 7,
          courses: [
            { code: "ME701", name: "Power Plant Engineering", credits: 3, hours: "3-0-0", description: "Steam, gas turbine, nuclear, renewable power systems" },
            { code: "ME702", name: "Robotics & Automation", credits: 3, hours: "2-0-3", description: "Robot kinematics, dynamics, control, and programming" },
            { code: "ME703", name: "Computational Fluid Dynamics", credits: 3, hours: "2-0-3", description: "Numerical methods for fluid flow analysis" },
            { code: "ME704", name: "Advanced Materials", credits: 3, hours: "3-0-0", description: "Composites, smart materials, nanomaterials" },
            { code: "ME705", name: "Finite Element Analysis", credits: 3, hours: "2-0-3", description: "FEA theory and applications in structural analysis" }
          ]
        },
        {
          semester: 8,
          courses: [
            { code: "ME801", name: "Project Management", credits: 2, hours: "2-0-0", description: "Project planning, scheduling, cost control, quality management" },
            { code: "ME802", name: "Capstone Design Project", credits: 4, hours: "0-0-12", description: "Major design project incorporating engineering principles" },
            { code: "ME803", name: "Industrial Training", credits: 2, hours: "0-0-6", description: "Practical industrial experience and internship" }
          ]
        }
      ]
    },
    {
      name: "Electrical Engineering",
      description: "Design and develop electrical systems, electronics, and power systems",
      careerFields: ["Power Systems Engineer", "Electronics Engineer", "Control Systems Engineer", "Telecommunications Engineer", "Instrumentation Engineer"],
      courses: [
        {
          semester: 3,
          courses: [
            { code: "EE301", name: "Circuit Analysis I", credits: 4, hours: "3-0-3", description: "DC and AC circuit analysis, network theorems, phasors" },
            { code: "EE302", name: "Electronic Devices", credits: 3, hours: "3-0-0", description: "Semiconductor physics, diodes, BJTs, MOSFETs" },
            { code: "EE303", name: "Signals and Systems", credits: 3, hours: "3-0-0", description: "Continuous and discrete signals, Fourier transforms" }
          ]
        },
        {
          semester: 4,
          courses: [
            { code: "EE401", name: "Circuit Analysis II", credits: 4, hours: "3-0-3", description: "Advanced AC analysis, three-phase systems, filters" },
            { code: "EE402", name: "Electronic Circuits", credits: 4, hours: "3-0-3", description: "Amplifiers, oscillators, operational amplifiers" },
            { code: "EE403", name: "Digital Logic Design", credits: 3, hours: "2-0-3", description: "Boolean algebra, combinational and sequential circuits" },
            { code: "EE404", name: "Electromagnetic Fields", credits: 3, hours: "3-0-0", description: "Maxwell's equations, wave propagation, transmission lines" }
          ]
        },
        {
          semester: 5,
          courses: [
            { code: "EE501", name: "Power Systems I", credits: 3, hours: "3-0-0", description: "Power generation, transmission, distribution systems" },
            { code: "EE502", name: "Control Systems I", credits: 3, hours: "3-0-0", description: "Feedback systems, stability analysis, root locus" },
            { code: "EE503", name: "Microprocessors", credits: 4, hours: "2-0-6", description: "8086/ARM architecture, assembly programming, interfacing" },
            { code: "EE504", name: "Communication Systems", credits: 3, hours: "3-0-0", description: "Analog and digital modulation, noise, channel capacity" }
          ]
        },
        {
          semester: 6,
          courses: [
            { code: "EE601", name: "Power Systems II", credits: 3, hours: "3-0-0", description: "Load flow, fault analysis, protection systems" },
            { code: "EE602", name: "Control Systems II", credits: 3, hours: "2-0-3", description: "State space analysis, digital control, PID controllers" },
            { code: "EE603", name: "VLSI Design", credits: 3, hours: "2-0-3", description: "CMOS technology, logic design, layout techniques" },
            { code: "EE604", name: "Digital Signal Processing", credits: 3, hours: "3-0-0", description: "Z-transforms, FFT, digital filters, applications" }
          ]
        },
        {
          semester: 7,
          courses: [
            { code: "EE701", name: "Power Electronics", credits: 3, hours: "3-0-0", description: "Power semiconductor devices, converters, motor drives" },
            { code: "EE702", name: "Wireless Communications", credits: 3, hours: "3-0-0", description: "Cellular systems, antenna theory, propagation models" },
            { code: "EE703", name: "Embedded Systems", credits: 4, hours: "2-0-6", description: "Real-time systems, RTOS, hardware-software co-design" },
            { code: "EE704", name: "Renewable Energy Systems", credits: 3, hours: "3-0-0", description: "Solar, wind, energy storage, grid integration" },
            { code: "EE705", name: "Electric Machines", credits: 3, hours: "3-0-0", description: "DC machines, induction motors, synchronous machines" }
          ]
        },
        {
          semester: 8,
          courses: [
            { code: "EE801", name: "Industrial Automation", credits: 3, hours: "2-0-3", description: "PLCs, SCADA systems, industrial networks" },
            { code: "EE802", name: "Capstone Design Project", credits: 4, hours: "0-0-12", description: "Major electrical engineering design project" },
            { code: "EE803", name: "Professional Practice", credits: 1, hours: "1-0-0", description: "Ethics, patents, professional registration" }
          ]
        }
      ]
    },
    {
      name: "Computer Engineering", 
      description: "Bridge hardware and software to create computing systems and solutions",
      careerFields: ["Software Engineer", "Hardware Engineer", "Systems Architect", "Embedded Systems Engineer", "Network Engineer"],
      courses: [
        {
          semester: 3,
          courses: [
            { code: "CE301", name: "Data Structures & Algorithms", credits: 4, hours: "3-0-3", description: "Arrays, linked lists, trees, graphs, sorting, searching" },
            { code: "CE302", name: "Computer Organization", credits: 3, hours: "3-0-0", description: "CPU design, memory hierarchy, instruction sets" },
            { code: "CE303", name: "Digital Logic Design", credits: 4, hours: "3-0-3", description: "Boolean algebra, combinational and sequential circuits" }
          ]
        },
        {
          semester: 4,
          courses: [
            { code: "CE401", name: "Computer Architecture", credits: 3, hours: "3-0-0", description: "Pipeline, cache, virtual memory, parallel processing" },
            { code: "CE402", name: "Operating Systems", credits: 4, hours: "3-0-3", description: "Process management, memory, file systems, concurrency" },
            { code: "CE403", name: "Database Systems", credits: 3, hours: "2-0-3", description: "Relational model, SQL, normalization, transactions" },
            { code: "CE404", name: "Object-Oriented Programming", credits: 4, hours: "3-0-3", description: "OOP concepts, Java/C++, design patterns" }
          ]
        },
        {
          semester: 5,
          courses: [
            { code: "CE501", name: "Software Engineering", credits: 3, hours: "3-0-0", description: "SDLC, requirements, design, testing, maintenance" },
            { code: "CE502", name: "Computer Networks", credits: 4, hours: "3-0-3", description: "OSI model, TCP/IP, routing, network security" },
            { code: "CE503", name: "Microprocessor Systems", credits: 4, hours: "2-0-6", description: "8086/ARM programming, interfacing, embedded systems" },
            { code: "CE504", name: "Web Technologies", credits: 3, hours: "2-0-3", description: "HTML, CSS, JavaScript, server-side programming" }
          ]
        },
        {
          semester: 6,
          courses: [
            { code: "CE601", name: "Embedded Systems", credits: 4, hours: "2-0-6", description: "Real-time systems, RTOS, hardware-software co-design" },
            { code: "CE602", name: "Computer Graphics", credits: 3, hours: "2-0-3", description: "2D/3D graphics, rendering, animation, OpenGL" },
            { code: "CE603", name: "Artificial Intelligence", credits: 3, hours: "3-0-0", description: "Search algorithms, machine learning, neural networks" },
            { code: "CE604", name: "Compiler Design", credits: 3, hours: "3-0-0", description: "Lexical analysis, parsing, code generation" }
          ]
        },
        {
          semester: 7,
          courses: [
            { code: "CE701", name: "Mobile Application Development", credits: 3, hours: "2-0-3", description: "Android/iOS development, cross-platform frameworks" },
            { code: "CE702", name: "Cybersecurity", credits: 3, hours: "3-0-0", description: "Cryptography, network security, ethical hacking" },
            { code: "CE703", name: "Cloud Computing", credits: 3, hours: "2-0-3", description: "AWS/Azure, distributed systems, containerization" },
            { code: "CE704", name: "Internet of Things", credits: 3, hours: "2-0-3", description: "IoT architecture, sensors, communication protocols" },
            { code: "CE705", name: "Machine Learning", credits: 3, hours: "2-0-3", description: "Supervised/unsupervised learning, deep learning" }
          ]
        },
        {
          semester: 8,
          courses: [
            { code: "CE801", name: "Project Management", credits: 2, hours: "2-0-0", description: "Agile methodologies, team management, software quality" },
            { code: "CE802", name: "Capstone Project", credits: 4, hours: "0-0-12", description: "Major software/hardware development project" },
            { code: "CE803", name: "Industry Internship", credits: 2, hours: "0-0-6", description: "Practical experience in software/hardware industry" }
          ]
        }
      ]
    },
    {
      name: "Civil Engineering",
      description: "Design and construct infrastructure including buildings, roads, bridges, and water systems",
      careerFields: ["Structural Engineer", "Transportation Engineer", "Environmental Engineer", "Geotechnical Engineer", "Construction Manager"],
      courses: [
        {
          semester: 3,
          courses: [
            { code: "CV301", name: "Engineering Mechanics - Dynamics", credits: 3, hours: "3-0-0", description: "Kinematics and kinetics of particles and rigid bodies" },
            { code: "CV302", name: "Fluid Mechanics", credits: 3, hours: "3-0-0", description: "Fluid properties, statics, dynamics, flow measurement" },
            { code: "CV303", name: "Surveying", credits: 3, hours: "2-0-3", description: "Leveling, traversing, triangulation, modern surveying techniques" }
          ]
        },
        {
          semester: 4,
          courses: [
            { code: "CV401", name: "Structural Analysis I", credits: 4, hours: "3-0-3", description: "Analysis of determinate beams, trusses, and frames" },
            { code: "CV402", name: "Soil Mechanics", credits: 4, hours: "3-0-3", description: "Soil properties, classification, compaction, permeability" },
            { code: "CV403", name: "Hydraulics", credits: 3, hours: "3-0-0", description: "Open channel flow, pipe flow, hydraulic machinery" },
            { code: "CV404", name: "Construction Materials", credits: 3, hours: "2-0-3", description: "Concrete, steel, wood, bituminous materials, testing" }
          ]
        },
        {
          semester: 5,
          courses: [
            { code: "CV501", name: "Structural Analysis II", credits: 4, hours: "3-0-3", description: "Indeterminate structures, moment distribution, matrix methods" },
            { code: "CV502", name: "Foundation Engineering", credits: 3, hours: "2-0-3", description: "Shallow and deep foundations, bearing capacity, settlement" },
            { code: "CV503", name: "Transportation Engineering", credits: 3, hours: "3-0-0", description: "Highway planning, geometric design, pavement design" },
            { code: "CV504", name: "Environmental Engineering I", credits: 3, hours: "3-0-0", description: "Water supply, water treatment, distribution systems" }
          ]
        },
        {
          semester: 6,
          courses: [
            { code: "CV601", name: "Reinforced Concrete Design", credits: 4, hours: "3-0-3", description: "Design of beams, slabs, columns, footings" },
            { code: "CV602", name: "Steel Structure Design", credits: 3, hours: "3-0-0", description: "Design of tension, compression, flexural members" },
            { code: "CV603", name: "Water Resources Engineering", credits: 3, hours: "3-0-0", description: "Hydrology, reservoir design, flood control" },
            { code: "CV604", name: "Environmental Engineering II", credits: 3, hours: "2-0-3", description: "Wastewater treatment, solid waste management" }
          ]
        },
        {
          semester: 7,
          courses: [
            { code: "CV701", name: "Pre-stressed Concrete", credits: 3, hours: "3-0-0", description: "Pre-tensioning, post-tensioning, design principles" },
            { code: "CV702", name: "Bridge Engineering", credits: 3, hours: "3-0-0", description: "Bridge types, design, construction, maintenance" },
            { code: "CV703", name: "Construction Management", credits: 3, hours: "3-0-0", description: "Project planning, scheduling, cost estimation" },
            { code: "CV704", name: "Earthquake Engineering", credits: 3, hours: "3-0-0", description: "Seismic design, dynamic analysis, code provisions" },
            { code: "CV705", name: "Traffic Engineering", credits: 3, hours: "2-0-3", description: "Traffic flow theory, intersection design, signal timing" }
          ]
        },
        {
          semester: 8,
          courses: [
            { code: "CV801", name: "Professional Practice", credits: 2, hours: "2-0-0", description: "Ethics, contracts, specifications, project delivery" },
            { code: "CV802", name: "Capstone Design Project", credits: 4, hours: "0-0-12", description: "Major civil engineering design project" },
            { code: "CV803", name: "Construction Internship", credits: 2, hours: "0-0-6", description: "Practical construction industry experience" }
          ]
        }
      ]
    },
    {
      name: "Chemical Engineering",
      description: "Apply chemistry, physics, and math to solve problems involving chemical processes",
      careerFields: ["Process Engineer", "Environmental Engineer", "Petroleum Engineer", "Biotechnology Engineer", "Materials Engineer"],
      courses: [
        {
          semester: 3,
          courses: [
            { code: "CH301", name: "Chemical Engineering Thermodynamics I", credits: 3, hours: "3-0-0", description: "First and second laws, properties of fluids, phase equilibrium" },
            { code: "CH302", name: "Fluid Mechanics for Chemical Engineers", credits: 3, hours: "3-0-0", description: "Momentum transfer, viscous flow, flow measurement" },
            { code: "CH303", name: "Chemical Process Calculations", credits: 3, hours: "3-0-0", description: "Material balances, energy balances, reactive systems" }
          ]
        },
        {
          semester: 4,
          courses: [
            { code: "CH401", name: "Chemical Engineering Thermodynamics II", credits: 3, hours: "3-0-0", description: "Chemical reaction equilibrium, electrochemical systems" },
            { code: "CH402", name: "Heat Transfer", credits: 4, hours: "3-0-3", description: "Conduction, convection, radiation, heat exchangers" },
            { code: "CH403", name: "Mass Transfer", credits: 4, hours: "3-0-3", description: "Diffusion, convective mass transfer, interphase transport" },
            { code: "CH404", name: "Chemical Engineering Laboratory I", credits: 2, hours: "0-0-6", description: "Experiments in fluid flow, heat and mass transfer" }
          ]
        },
        {
          semester: 5,
          courses: [
            { code: "CH501", name: "Separation Processes", credits: 4, hours: "3-0-3", description: "Distillation, absorption, extraction, membrane processes" },
            { code: "CH502", name: "Chemical Reaction Engineering", credits: 4, hours: "3-0-3", description: "Reaction kinetics, reactor design, catalysis" },
            { code: "CH503", name: "Process Control", credits: 3, hours: "2-0-3", description: "Feedback control, stability, PID controllers" },
            { code: "CH504", name: "Chemical Engineering Laboratory II", credits: 2, hours: "0-0-6", description: "Separation processes, reaction engineering experiments" }
          ]
        },
        {
          semester: 6,
          courses: [
            { code: "CH601", name: "Chemical Process Design", credits: 4, hours: "2-0-6", description: "Process synthesis, optimization, economic evaluation" },
            { code: "CH602", name: "Petroleum Refining", credits: 3, hours: "3-0-0", description: "Crude oil processing, refining operations, petrochemicals" },
            { code: "CH603", name: "Environmental Engineering", credits: 3, hours: "3-0-0", description: "Air and water pollution control, waste treatment" },
            { code: "CH604", name: "Process Safety", credits: 2, hours: "2-0-0", description: "Hazard identification, risk assessment, safety systems" }
          ]
        },
        {
          semester: 7,
          courses: [
            { code: "CH701", name: "Biochemical Engineering", credits: 3, hours: "2-0-3", description: "Enzyme kinetics, fermentation, bioreactor design" },
            { code: "CH702", name: "Polymer Engineering", credits: 3, hours: "3-0-0", description: "Polymerization, polymer processing, properties" },
            { code: "CH703", name: "Advanced Process Control", credits: 3, hours: "2-0-3", description: "Multivariable control, model predictive control" },
            { code: "CH704", name: "Process Economics", credits: 2, hours: "2-0-0", description: "Cost estimation, profitability analysis, optimization" },
            { code: "CH705", name: "Materials Science for Chemical Engineers", credits: 3, hours: "3-0-0", description: "Structure-property relationships, advanced materials" }
          ]
        },
        {
          semester: 8,
          courses: [
            { code: "CH801", name: "Process Plant Design", credits: 4, hours: "1-0-9", description: "Complete chemical plant design project" },
            { code: "CH802", name: "Industrial Training", credits: 2, hours: "0-0-6", description: "Practical experience in chemical industry" },
            { code: "CH803", name: "Professional Ethics", credits: 1, hours: "1-0-0", description: "Engineering ethics, professional responsibility" }
          ]
        }
      ]
    }
  ];

  const courseStructure = {
    semester1: [
      { code: "MATH 101", title: "Calculus I", credits: 4, contact: "4-0-0", description: "Limits, derivatives, applications of derivatives, basic integration" },
      { code: "PHYS 101", title: "Physics I (Mechanics)", credits: 4, contact: "3-0-3", description: "Kinematics, dynamics, work-energy theorem, rotational mechanics" },
      { code: "CHEM 101", title: "General Chemistry", credits: 3, contact: "3-0-0", description: "Atomic structure, chemical bonding, thermodynamics, kinetics" },
      { code: "ENG 101", title: "Engineering Graphics", credits: 3, contact: "1-0-6", description: "Technical drawing, CAD fundamentals, orthographic projections" },
      { code: "ENGL 101", title: "Technical Communication", credits: 3, contact: "3-0-0", description: "Technical writing, presentation skills, documentation" },
      { code: "CS 101", title: "Programming Fundamentals", credits: 3, contact: "2-0-3", description: "C programming, algorithms, data structures basics" }
    ],
    semester2: [
      { code: "MATH 102", title: "Calculus II", credits: 4, contact: "4-0-0", description: "Integration techniques, series, multivariable calculus introduction" },
      { code: "PHYS 102", title: "Physics II (Electricity & Magnetism)", credits: 4, contact: "3-0-3", description: "Electric fields, magnetic fields, electromagnetic induction" },
      { code: "MATH 201", title: "Differential Equations", credits: 3, contact: "3-0-0", description: "First-order ODEs, second-order linear ODEs, Laplace transforms" },
      { code: "ENG 102", title: "Engineering Mechanics - Statics", credits: 3, contact: "3-0-0", description: "Force systems, equilibrium, trusses, friction, centroids" },
      { code: "CHEM 102", title: "Chemistry Lab", credits: 1, contact: "0-0-3", description: "Laboratory experiments in general chemistry" },
      { code: "HIST 101", title: "World History", credits: 3, contact: "3-0-0", description: "Global historical perspectives and civilizations" }
    ],
    semester3: [
      { code: "MATH 301", title: "Linear Algebra", credits: 3, contact: "3-0-0", description: "Matrices, vector spaces, eigenvalues, linear transformations" },
      { code: "ENG 201", title: "Engineering Mechanics - Dynamics", credits: 3, contact: "3-0-0", description: "Kinematics and kinetics of particles and rigid bodies" },
      { code: "EE 201", title: "Circuit Analysis", credits: 4, contact: "3-0-3", description: "DC and AC circuits, network theorems, operational amplifiers" },
      { code: "MATL 201", title: "Materials Science", credits: 3, contact: "3-0-0", description: "Structure-property relationships, metals, ceramics, polymers" },
      { code: "STAT 201", title: "Engineering Statistics", credits: 3, contact: "3-0-0", description: "Probability, distributions, hypothesis testing, regression" },
      { code: "ECON 101", title: "Engineering Economics", credits: 3, contact: "3-0-0", description: "Time value of money, economic analysis of engineering projects" }
    ],
    semester4: [
      { code: "ME 201", title: "Thermodynamics", credits: 3, contact: "3-0-0", description: "Laws of thermodynamics, entropy, cycles, phase equilibrium" },
      { code: "ME 202", title: "Fluid Mechanics", credits: 3, contact: "3-0-0", description: "Fluid statics, conservation laws, viscous flow, turbulence" },
      { code: "EE 202", title: "Electronics", credits: 4, contact: "3-0-3", description: "Diodes, transistors, amplifiers, digital logic circuits" },
      { code: "CS 201", title: "Data Structures", credits: 3, contact: "2-0-3", description: "Arrays, linked lists, stacks, queues, trees, graphs" },
      { code: "ENG 301", title: "Engineering Design", credits: 3, contact: "1-0-6", description: "Design process, CAD/CAM, prototyping, project management" },
      { code: "PHIL 101", title: "Engineering Ethics", credits: 2, contact: "2-0-0", description: "Professional ethics, social responsibility, case studies" }
    ]
  };

  const admissionRequirements = [
    "High School Diploma with minimum 85% aggregate",
    "Strong background in Mathematics and Physics",
    "SAT score of 1200+ or equivalent standardized test",
    "English proficiency (TOEFL 80+ for international students)",
    "Personal statement and recommendation letters"
  ];

  const careerOpportunities = [
    "Design Engineer", "Project Manager", "Research & Development",
    "Quality Assurance Engineer", "Manufacturing Engineer", "Consulting Engineer",
    "Systems Analyst", "Technical Sales Engineer", "Patent Engineer"
  ];

  return (
    <PageLayout 
      title="Bachelor of Engineering" 
      description="Comprehensive 4-year engineering program preparing students for diverse engineering careers"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Program Overview */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Clock className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Years</div>
                <p className="text-xs text-muted-foreground">8 Semesters</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">Credit Hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Degree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">B.Eng</div>
                <p className="text-xs text-muted-foreground">ABET Accredited</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Structure */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Course Structure</h3>
              
              {/* Foundation Years (First 2 Semesters) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Foundation Years (Semesters 1-2)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    All engineering students complete common foundation courses in mathematics, 
                    physics, chemistry, and basic engineering principles during the first two semesters.
                  </p>
                  <div className="grid gap-4">
                    {courseStructure.semester1.map((course, index) => (
                      <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{course.code}</Badge>
                            <span className="font-semibold">{course.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Contact Hours: {course.contact} (L-T-P)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-uw-purple">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Specialization Tracks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Specialization Tracks (Semesters 3-8)
                  </CardTitle>
                  <CardDescription>
                    Choose your engineering specialty and dive deep into specialized coursework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {specializationTracks.map((track, trackIndex) => (
                      <AccordionItem key={trackIndex} value={`track-${trackIndex}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div className="text-left">
                              <h4 className="font-semibold text-lg">{track.name}</h4>
                              <p className="text-sm text-muted-foreground">{track.description}</p>
                            </div>
                            <Badge variant="secondary">{track.courses.reduce((total, sem) => total + sem.courses.length, 0)}+ Courses</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-4">
                            {/* Career Fields */}
                            <div>
                              <h5 className="font-semibold mb-2">Career Opportunities</h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                {track.careerFields.map((career, idx) => (
                                  <Badge key={idx} variant="outline" className="justify-center">
                                    {career}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Semester-wise Course Breakdown */}
                            <div className="space-y-4">
                              <h5 className="font-semibold">Detailed Curriculum by Semester</h5>
                              {track.courses.map((semester, semIdx) => (
                                <Card key={semIdx} className="border-l-4 border-l-primary">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Semester {semester.semester}</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {semester.courses.map((course, courseIdx) => (
                                        <div key={courseIdx} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge variant="outline" className="text-xs">{course.code}</Badge>
                                              <span className="font-medium">{course.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{course.description}</p>
                                            <div className="text-xs text-muted-foreground">
                                              Contact Hours: {course.hours} (Lecture-Tutorial-Practical)
                                            </div>
                                          </div>
                                          <div className="text-right ml-4">
                                            <div className="font-bold text-primary">{course.credits}</div>
                                            <div className="text-xs text-muted-foreground">Credits</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                                      <span className="font-medium">
                                        Semester Total: {semester.courses.reduce((total, course) => total + course.credits, 0)} Credits
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {admissionRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-uw-purple rounded-full mt-2"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {careerOpportunities.map((career, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {career}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tuition Fee (per semester)</span>
                    <span className="font-bold">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee (per semester)</span>
                    <span className="font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee (one-time)</span>
                    <span className="font-bold">$500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total per Year</span>
                    <span>$34,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BachelorEngineering;
