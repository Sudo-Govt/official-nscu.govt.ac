import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BookOpen, Clock, DollarSign, Users, GraduationCap, Download, ChevronDown, FileText, Award } from 'lucide-react';

const BachelorArtsEnglish = () => {
  const programOverview = {
    name: "Bachelor of Arts in English",
    duration: "4 Years, 8 Semesters",
    totalCredits: 120,
    structure: ["Core Courses", "Electives", "Skill-Based Courses", "Capstone Project"],
    assessment: "70% External Exam, 20% Internal Assessment, 10% Continuous Evaluation"
  };

  const semesters = [
    {
      id: "sem1",
      title: "Semester I",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "Introduction to Literature",
          code: "ENG101",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Tutorials"],
          topics: ["Literary Genres", "Critical Reading", "Text Analysis", "Literary Periods", "Close Reading Techniques"],
          referenceBooks: ["M.H. Abrams - A Glossary of Literary Terms", "Terry Eagleton - Literary Theory: An Introduction"],
          learningOutcomes: ["Analyze literary texts critically", "Identify literary devices", "Understand historical contexts"],
          assessment: "60% Final Exam, 25% Mid-term, 15% Assignments"
        },
        {
          name: "English Composition I",
          code: "ENG102",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Writing Workshops"],
          topics: ["Essay Writing", "Paragraph Development", "Grammar and Style", "Research Methods", "Citation Formats"],
          referenceBooks: ["Diana Hacker - A Writer's Reference", "Joseph M. Williams - Style: Lessons in Clarity and Grace"],
          learningOutcomes: ["Write clear, coherent essays", "Apply proper citation methods", "Develop critical thinking through writing"],
          assessment: "40% Portfolio, 30% Final Essay, 30% Class Participation"
        },
        {
          name: "World Literature Survey",
          code: "ENG103",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Ancient Literature", "Medieval Works", "Renaissance Texts", "Global Perspectives", "Cultural Contexts"],
          referenceBooks: ["Norton Anthology of World Literature", "David Damrosch - What Is World Literature?"],
          learningOutcomes: ["Understand global literary traditions", "Compare cultural expressions", "Analyze cross-cultural themes"],
          assessment: "50% Exams, 30% Essays, 20% Participation"
        },
        {
          name: "Fundamentals of Language",
          code: "ENG104",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Lab Sessions"],
          topics: ["Phonetics", "Morphology", "Syntax", "Semantics", "Pragmatics"],
          referenceBooks: ["David Crystal - The Cambridge Encyclopedia of Language", "George Yule - The Study of Language"],
          learningOutcomes: ["Understand language structure", "Analyze linguistic phenomena", "Apply linguistic concepts"],
          assessment: "55% Exams, 30% Assignments, 15% Lab Work"
        },
        {
          name: "General Studies",
          code: "GS101",
          credits: 3,
          contactHours: 90,
          breakdown: ["90 Lectures"],
          topics: ["Environmental Awareness", "Human Rights", "Ethics", "Indian Constitution", "Current Affairs"],
          referenceBooks: ["Environmental Studies by Erach Bharucha", "Indian Polity by M. Laxmikanth"],
          learningOutcomes: ["Develop environmental consciousness", "Understand fundamental rights", "Apply ethical principles"],
          assessment: "70% Final Exam, 20% Assignment, 10% Class Test"
        }
      ]
    },
    {
      id: "sem2",
      title: "Semester II",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "British Literature I",
          code: "ENG201",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Medieval Literature", "Chaucer", "Renaissance Drama", "Shakespeare's Early Works", "Metaphysical Poetry"],
          referenceBooks: ["Norton Anthology of English Literature", "Helen Gardner - The Metaphysical Poets"],
          learningOutcomes: ["Analyze British literary traditions", "Understand historical development", "Interpret classical texts"],
          assessment: "60% Final Exam, 25% Mid-term, 15% Presentations"
        },
        {
          name: "English Composition II",
          code: "ENG202",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Writing Workshops"],
          topics: ["Advanced Essay Writing", "Argumentative Writing", "Research Papers", "Creative Writing", "Peer Review"],
          referenceBooks: ["John Bean - Engaging Ideas", "Nancy Sommers - Responding to Student Writers"],
          learningOutcomes: ["Write persuasive arguments", "Conduct scholarly research", "Develop personal voice"],
          assessment: "35% Research Paper, 35% Portfolio, 30% Peer Review"
        },
        {
          name: "American Literature Survey",
          code: "ENG203",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Colonial Literature", "Transcendentalism", "Realism", "Modern American Fiction", "Contemporary Voices"],
          referenceBooks: ["Norton Anthology of American Literature", "Sacvan Bercovitch - The Cambridge History of American Literature"],
          learningOutcomes: ["Trace American literary development", "Understand cultural contexts", "Analyze national themes"],
          assessment: "50% Exams, 30% Essays, 20% Class Participation"
        },
        {
          name: "Introduction to Literary Theory",
          code: "ENG204",
          credits: 3,
          contactHours: 90,
          breakdown: ["75 Lectures", "15 Tutorials"],
          topics: ["Formalism", "Structuralism", "Feminist Theory", "Postcolonial Theory", "Reader Response"],
          referenceBooks: ["Terry Eagleton - Literary Theory: An Introduction", "Peter Barry - Beginning Theory"],
          learningOutcomes: ["Apply theoretical frameworks", "Critique literary interpretations", "Develop analytical skills"],
          assessment: "60% Final Exam, 25% Research Project, 15% Class Tests"
        },
        {
          name: "Hindi/Regional Language",
          code: "HL201",
          credits: 3,
          contactHours: 90,
          breakdown: ["90 Lectures"],
          topics: ["Grammar", "Composition", "Literature", "Translation", "Cultural Context"],
          referenceBooks: ["Modern Hindi Grammar", "Selected Hindi Literature"],
          learningOutcomes: ["Develop language proficiency", "Understand cultural heritage", "Apply translation skills"],
          assessment: "70% Final Exam, 20% Assignments, 10% Oral Test"
        }
      ]
    },
    {
      id: "sem3",
      title: "Semester III",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "British Literature II",
          code: "ENG301",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Restoration Drama", "Augustan Poetry", "18th Century Novel", "Romantic Poetry", "Gothic Literature"],
          referenceBooks: ["Pat Rogers - The Cambridge History of English Literature", "Duncan Wu - Romanticism: An Anthology"],
          learningOutcomes: ["Analyze literary movements", "Understand historical contexts", "Compare literary styles"],
          assessment: "60% Final Exam, 25% Mid-term, 15% Presentations"
        },
        {
          name: "Shakespeare Studies",
          code: "ENG302",
          credits: 4,
          contactHours: 120,
          breakdown: ["75 Lectures", "45 Performance Analysis"],
          topics: ["Early Comedies", "History Plays", "Major Tragedies", "Late Romances", "Sonnets"],
          referenceBooks: ["Harold Bloom - Shakespeare: The Invention of the Human", "Stephen Greenblatt - Will in the World"],
          learningOutcomes: ["Interpret Shakespearean texts", "Analyze dramatic techniques", "Understand Renaissance context"],
          assessment: "55% Final Exam, 30% Performance Analysis, 15% Essays"
        },
        {
          name: "Indian English Literature",
          code: "ENG303",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Colonial Writings", "Independence Movement Literature", "Contemporary Fiction", "Postcolonial Themes", "Diaspora Voices"],
          referenceBooks: ["K.R. Srinivasa Iyengar - Indian Writing in English", "Bruce King - Modern Indian Poetry in English"],
          learningOutcomes: ["Understand postcolonial literature", "Analyze cultural identity", "Explore linguistic choices"],
          assessment: "50% Exams, 35% Research Paper, 15% Participation"
        },
        {
          name: "Phonetics and Spoken English",
          code: "ENG304",
          credits: 2,
          contactHours: 60,
          breakdown: ["30 Lectures", "30 Practical Sessions"],
          topics: ["IPA Symbols", "Stress Patterns", "Intonation", "Accent Training", "Public Speaking"],
          referenceBooks: ["Daniel Jones - English Pronouncing Dictionary", "J.D. O'Connor - Better English Pronunciation"],
          learningOutcomes: ["Master pronunciation skills", "Use phonetic transcription", "Improve speaking confidence"],
          assessment: "40% Practical Exam, 35% Oral Test, 25% Assignments"
        },
        {
          name: "Environmental Studies",
          code: "EVS301",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Field Work"],
          topics: ["Ecosystem Dynamics", "Biodiversity", "Pollution Control", "Sustainable Development", "Environmental Laws"],
          referenceBooks: ["Erach Bharucha - Textbook of Environmental Studies", "C.P. Kaushik - Environmental Studies"],
          learningOutcomes: ["Understand environmental issues", "Develop conservation awareness", "Apply sustainability principles"],
          assessment: "60% Final Exam, 25% Field Report, 15% Project"
        }
      ]
    },
    {
      id: "sem4",
      title: "Semester IV",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "British Literature III",
          code: "ENG401",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Victorian Poetry", "Victorian Novel", "Modern Drama", "20th Century Poetry", "Contemporary Fiction"],
          referenceBooks: ["Walter Houghton - The Victorian Frame of Mind", "Frank Kermode - Modern Essays"],
          learningOutcomes: ["Analyze Victorian literature", "Understand modernist techniques", "Trace literary evolution"],
          assessment: "60% Final Exam, 25% Mid-term, 15% Presentations"
        },
        {
          name: "American Literature: Modern Period",
          code: "ENG402",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Modernist Poetry", "Lost Generation", "Harlem Renaissance", "Beat Generation", "Postmodern Fiction"],
          referenceBooks: ["Malcolm Bradbury - The Modern American Novel", "Houston Baker - Modernism and the Harlem Renaissance"],
          learningOutcomes: ["Understand modernist movements", "Analyze cultural contexts", "Explore literary innovations"],
          assessment: "50% Exams, 30% Research Paper, 20% Class Participation"
        },
        {
          name: "Literary Criticism",
          code: "ENG403",
          credits: 3,
          contactHours: 90,
          breakdown: ["75 Lectures", "15 Tutorials"],
          topics: ["Classical Criticism", "Neoclassical Theory", "Romantic Criticism", "Modern Criticism", "Practical Criticism"],
          referenceBooks: ["M.H. Abrams - The Mirror and the Lamp", "I.A. Richards - Practical Criticism"],
          learningOutcomes: ["Apply critical methods", "Develop analytical skills", "Write critical essays"],
          assessment: "65% Final Exam, 25% Critical Essays, 10% Class Tests"
        },
        {
          name: "Creative Writing Workshop",
          code: "ENG404",
          credits: 3,
          contactHours: 90,
          breakdown: ["30 Lectures", "60 Workshop Sessions"],
          topics: ["Poetry Writing", "Short Story Craft", "Character Development", "Plot Structure", "Workshop Critique"],
          referenceBooks: ["Janet Burroway - Imaginative Writing", "Stephen King - On Writing"],
          learningOutcomes: ["Create original works", "Develop writing skills", "Give constructive feedback"],
          assessment: "50% Creative Portfolio, 30% Workshop Participation, 20% Final Reading"
        },
        {
          name: "Computer Applications",
          code: "CA401",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Practical Sessions"],
          topics: ["MS Office Suite", "Internet Research", "Digital Presentation", "Basic Programming", "Database Management"],
          referenceBooks: ["Computer Fundamentals by Anita Goel", "MS Office 2019 by Maria Langer"],
          learningOutcomes: ["Master computer skills", "Create digital presentations", "Conduct online research"],
          assessment: "40% Practical Exam, 35% Project Work, 25% Theory Exam"
        }
      ]
    },
    {
      id: "sem5",
      title: "Semester V",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "Modern European Literature",
          code: "ENG501",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["French Literature", "German Literature", "Russian Literature", "Existentialist Writers", "Modernist Movements"],
          referenceBooks: ["Peter France - The New Oxford Companion to Literature in French", "Victor Terras - Handbook of Russian Literature"],
          learningOutcomes: ["Understand European literary traditions", "Compare cultural perspectives", "Analyze universal themes"],
          assessment: "55% Exams, 30% Comparative Essays, 15% Presentations"
        },
        {
          name: "Women's Writing",
          code: "ENG502",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Feminist Literary Theory", "Women Novelists", "Contemporary Women Poets", "Gender Studies", "Identity Politics"],
          referenceBooks: ["Elaine Showalter - A Literature of Their Own", "Sandra Gilbert - The Madwoman in the Attic"],
          learningOutcomes: ["Analyze feminist perspectives", "Understand gender issues", "Explore women's voices"],
          assessment: "50% Final Exam, 35% Research Project, 15% Class Participation"
        },
        {
          name: "Postcolonial Literature",
          code: "ENG503",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Colonial Discourse", "Identity and Exile", "Cultural Hybridity", "Resistance Literature", "Diaspora Narratives"],
          referenceBooks: ["Bill Ashcroft - The Empire Writes Back", "Homi Bhabha - The Location of Culture"],
          learningOutcomes: ["Understand postcolonial theory", "Analyze cultural conflicts", "Explore identity themes"],
          assessment: "55% Exams, 30% Research Paper, 15% Group Discussions"
        },
        {
          name: "Translation Studies",
          code: "ENG504",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Translation Practice"],
          topics: ["Translation Theory", "Cultural Translation", "Literary Translation", "Technical Translation", "Comparative Analysis"],
          referenceBooks: ["Susan Bassnett - Translation Studies", "Lawrence Venuti - The Translation Studies Reader"],
          learningOutcomes: ["Master translation techniques", "Understand cultural nuances", "Practice translation skills"],
          assessment: "40% Translation Portfolio, 35% Theory Exam, 25% Practical Test"
        },
        {
          name: "Film and Literature",
          code: "ENG505",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Film Analysis"],
          topics: ["Adaptation Theory", "Narrative Techniques", "Visual Storytelling", "Comparative Analysis", "Film Criticism"],
          referenceBooks: ["Linda Hutcheon - A Theory of Adaptation", "Robert Stam - Literature through Film"],
          learningOutcomes: ["Analyze film adaptations", "Compare media forms", "Develop visual literacy"],
          assessment: "45% Film Analysis Project, 35% Final Exam, 20% Presentations"
        }
      ]
    },
    {
      id: "sem6",
      title: "Semester VI",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "Contemporary World Literature",
          code: "ENG601",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Discussions"],
          topics: ["Globalization and Literature", "Magic Realism", "Postmodern Fiction", "Contemporary Poetry", "Digital Literature"],
          referenceBooks: ["Theo D'haen - International Postmodernism", "Jessica Hagedorn - Charlie Chan Is Dead"],
          learningOutcomes: ["Understand global literary trends", "Analyze contemporary themes", "Explore digital media"],
          assessment: "50% Exams, 35% Research Project, 15% Class Participation"
        },
        {
          name: "Research Methodology",
          code: "ENG602",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Research Lab"],
          topics: ["Research Design", "Literature Review", "Data Collection", "Citation Methods", "Academic Writing"],
          referenceBooks: ["Wayne Booth - The Craft of Research", "Kate Turabian - A Manual for Writers"],
          learningOutcomes: ["Design research projects", "Apply research methods", "Write academic papers"],
          assessment: "40% Research Proposal, 35% Final Exam, 25% Literature Review"
        },
        {
          name: "Professional Communication",
          code: "ENG603",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Practical Sessions"],
          topics: ["Business Writing", "Technical Communication", "Presentation Skills", "Digital Communication", "Interpersonal Skills"],
          referenceBooks: ["Diana Hacker - A Writer's Reference", "Mike Markel - Technical Communication"],
          learningOutcomes: ["Master professional writing", "Develop presentation skills", "Communicate effectively"],
          assessment: "40% Portfolio, 35% Practical Test, 25% Presentations"
        },
        {
          name: "Digital Humanities",
          code: "ENG604",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Computer Lab"],
          topics: ["Text Analysis Software", "Digital Archives", "Corpus Linguistics", "Data Visualization", "Online Publishing"],
          referenceBooks: ["Susan Schreibman - A Companion to Digital Humanities", "Matthew Jockers - Macroanalysis"],
          learningOutcomes: ["Use digital tools", "Analyze large text corpora", "Create digital projects"],
          assessment: "45% Digital Project, 35% Final Exam, 20% Lab Work"
        },
        {
          name: "Internship/Project Work",
          code: "ENG605",
          credits: 3,
          contactHours: 90,
          breakdown: ["90 Hours Field Work/Project"],
          topics: ["Industry Exposure", "Professional Skills", "Project Management", "Report Writing", "Presentation"],
          referenceBooks: ["Project Management Guidelines", "Industry-Specific Resources"],
          learningOutcomes: ["Gain practical experience", "Apply theoretical knowledge", "Develop professional skills"],
          assessment: "50% Project Report, 30% Supervisor Evaluation, 20% Presentation"
        }
      ]
    },
    {
      id: "sem7",
      title: "Semester VII",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "Advanced Literary Theory",
          code: "ENG701",
          credits: 4,
          contactHours: 120,
          breakdown: ["90 Lectures", "30 Research Seminars"],
          topics: ["Deconstruction", "New Historicism", "Cultural Studies", "Psychoanalytic Criticism", "Ecocriticism"],
          referenceBooks: ["Jonathan Culler - Literary Theory: A Very Short Introduction", "Julie Rivkin - Literary Theory: An Anthology"],
          learningOutcomes: ["Master advanced theoretical concepts", "Conduct independent research", "Develop original arguments"],
          assessment: "50% Research Paper, 30% Final Exam, 20% Seminar Presentations"
        },
        {
          name: "Comparative Literature",
          code: "ENG702",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Comparative Analysis"],
          topics: ["Cross-Cultural Studies", "Intertextuality", "Translation Theory", "World Literature", "Cultural Exchange"],
          referenceBooks: ["Gayatri Spivak - Death of a Discipline", "Franco Moretti - Distant Reading"],
          learningOutcomes: ["Compare literary traditions", "Analyze cultural exchanges", "Develop global perspective"],
          assessment: "45% Comparative Essay, 35% Final Exam, 20% Class Participation"
        },
        {
          name: "English Language Teaching",
          code: "ENG703",
          credits: 3,
          contactHours: 90,
          breakdown: ["45 Lectures", "45 Teaching Practice"],
          topics: ["Pedagogy", "Curriculum Design", "Assessment Methods", "Language Acquisition", "Classroom Management"],
          referenceBooks: ["Jack Richards - Approaches and Methods in Language Teaching", "Penny Ur - A Course in Language Teaching"],
          learningOutcomes: ["Design lesson plans", "Apply teaching methods", "Assess student progress"],
          assessment: "40% Teaching Demonstration, 35% Lesson Plans, 25% Theory Exam"
        },
        {
          name: "Dissertation Preparation",
          code: "ENG704",
          credits: 2,
          contactHours: 60,
          breakdown: ["30 Lectures", "30 Individual Guidance"],
          topics: ["Topic Selection", "Proposal Writing", "Research Planning", "Supervisor Meetings", "Timeline Management"],
          referenceBooks: ["Umberto Eco - How to Write a Thesis", "Kate Turabian - A Manual for Writers"],
          learningOutcomes: ["Select research topic", "Write research proposal", "Plan dissertation timeline"],
          assessment: "60% Research Proposal, 25% Progress Reports, 15% Supervisor Evaluation"
        },
        {
          name: "Elective I",
          code: "ENG7E1",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Varies by Elective Choice", "Specialized Study Area", "Advanced Topics", "Current Research", "Case Studies"],
          referenceBooks: ["Subject-Specific References", "Current Research Papers"],
          learningOutcomes: ["Develop specialization", "Explore advanced topics", "Conduct focused research"],
          assessment: "50% Final Exam, 30% Research Project, 20% Class Participation"
        }
      ]
    },
    {
      id: "sem8",
      title: "Semester VIII",
      totalCredits: 15,
      contactHours: 360,
      courses: [
        {
          name: "Dissertation",
          code: "ENG801",
          credits: 8,
          contactHours: 240,
          breakdown: ["240 Hours Independent Research"],
          topics: ["Original Research", "Data Analysis", "Academic Writing", "Critical Analysis", "Literature Review"],
          referenceBooks: ["MLA Handbook", "Chicago Manual of Style", "Subject-Specific Academic Sources"],
          learningOutcomes: ["Conduct original research", "Write academic dissertation", "Defend research findings"],
          assessment: "70% Written Dissertation, 20% Oral Defense, 10% Progress Evaluation"
        },
        {
          name: "Contemporary Issues in Literature",
          code: "ENG802",
          credits: 3,
          contactHours: 90,
          breakdown: ["60 Lectures", "30 Seminars"],
          topics: ["Climate Fiction", "Digital Literature", "Pandemic Narratives", "AI and Literature", "Social Media Poetry"],
          referenceBooks: ["Adam Trexler - Anthropocene Fictions", "N. Katherine Hayles - Electronic Literature"],
          learningOutcomes: ["Analyze contemporary trends", "Understand current debates", "Explore emerging genres"],
          assessment: "45% Research Paper, 35% Final Exam, 20% Seminar Participation"
        },
        {
          name: "Career Development",
          code: "ENG803",
          credits: 2,
          contactHours: 60,
          breakdown: ["30 Lectures", "30 Practical Sessions"],
          topics: ["Resume Writing", "Interview Skills", "Networking", "Graduate School Preparation", "Professional Portfolio"],
          referenceBooks: ["What Color Is Your Parachute?", "The Academic Job Search Handbook"],
          learningOutcomes: ["Prepare for career transition", "Develop professional skills", "Create career portfolio"],
          assessment: "50% Portfolio Development, 30% Mock Interviews, 20% Career Plan"
        },
        {
          name: "Elective II",
          code: "ENG8E2",
          credits: 2,
          contactHours: 60,
          breakdown: ["45 Lectures", "15 Tutorials"],
          topics: ["Advanced Specialization", "Independent Study", "Research Methods", "Field Work", "Creative Projects"],
          referenceBooks: ["Specialized Academic Sources", "Professional Literature"],
          learningOutcomes: ["Complete specialized study", "Demonstrate expertise", "Apply advanced knowledge"],
          assessment: "60% Final Project, 25% Final Exam, 15% Class Participation"
        }
      ]
    }
  ];

  const electives = [
    { name: "Creative Writing Workshop", code: "ENG301", credits: 3, semester: "V" },
    { name: "Digital Humanities", code: "ENG302", credits: 3, semester: "VI" },
    { name: "Film and Literature", code: "ENG303", credits: 3, semester: "V" },
    { name: "Women Writers", code: "ENG304", credits: 3, semester: "VI" }
  ];

  const skillBasedCourses = [
    {
      name: "Professional Writing",
      credits: 4,
      contactHours: 80,
      topics: ["Business Communication", "Technical Writing", "Grant Writing", "Digital Content Creation"],
      referenceBooks: ["Mike Markel - Technical Communication", "Diana Hacker - A Writer's Reference"]
    }
  ];

  return (
    <PageLayout 
      title="Bachelor of Arts in English - Course Nomenclature" 
      description="Comprehensive curriculum and course details"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Program Overview Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Program Overview</span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Full Nomenclature (PDF)
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Program Details</h3>
                  <div className="space-y-2">
                    <div><strong>Program Name:</strong> {programOverview.name}</div>
                    <div><strong>Duration:</strong> {programOverview.duration}</div>
                    <div><strong>Total Credits:</strong> {programOverview.totalCredits}</div>
                    <div><strong>Assessment:</strong> {programOverview.assessment}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Program Structure</h3>
                  <ul className="space-y-1">
                    {programOverview.structure.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-uw-purple rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester Navigation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Semester-wise Curriculum</h2>
          <Tabs defaultValue="sem1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {semesters.map((semester, index) => (
                <TabsTrigger key={semester.id} value={semester.id}>
                  Sem {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {semesters.map((semester) => (
              <TabsContent key={semester.id} value={semester.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{semester.title}</CardTitle>
                    <CardDescription>
                      Total Credits: {semester.totalCredits} | Contact Hours: {semester.contactHours}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {semester.courses.map((course, courseIndex) => (
                        <AccordionItem key={courseIndex} value={`course-${courseIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex justify-between items-center w-full pr-4">
                              <span>{course.name} ({course.code})</span>
                              <Badge variant="outline">{course.credits} Credits</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                              <div>
                                <h4 className="font-semibold mb-2">Course Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div><strong>Course Code:</strong> {course.code}</div>
                                  <div><strong>Credits:</strong> {course.credits}</div>
                                  <div><strong>Contact Hours:</strong> {course.contactHours}</div>
                                  <div><strong>Breakdown:</strong> {course.breakdown.join(", ")}</div>
                                  <div><strong>Assessment:</strong> {course.assessment}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Topics Covered</h4>
                                <ul className="text-sm space-y-1">
                                  {course.topics.map((topic, topicIndex) => (
                                    <li key={topicIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-uw-purple rounded-full mr-2 mt-2"></span>
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Reference Books</h4>
                                <ul className="text-sm space-y-1">
                                  {course.referenceBooks.map((book, bookIndex) => (
                                    <li key={bookIndex} className="flex items-start">
                                      <FileText className="w-3 h-3 mr-2 mt-0.5 text-uw-purple" />
                                      {book}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                                <ul className="text-sm space-y-1">
                                  {course.learningOutcomes.map((outcome, outcomeIndex) => (
                                    <li key={outcomeIndex} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2"></span>
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Program Electives Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Program Electives</h2>
          <Card>
            <CardHeader>
              <CardTitle>Discipline-Specific Electives</CardTitle>
              <CardDescription>Choose from specialized courses in your area of interest</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Elective Name</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Semester Offered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {electives.map((elective, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{elective.name}</TableCell>
                      <TableCell>{elective.code}</TableCell>
                      <TableCell>{elective.credits}</TableCell>
                      <TableCell>{elective.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Skill-Based Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skill-Based Courses</h2>
          {skillBasedCourses.map((course, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.credits} Credits | {course.contactHours} Contact Hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Topics Covered</h4>
                    <ul className="space-y-1">
                      {course.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-uw-purple rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reference Books</h4>
                    <ul className="space-y-1">
                      {course.referenceBooks.map((book, bookIndex) => (
                        <li key={bookIndex} className="flex items-start">
                          <FileText className="w-4 h-4 mr-2 mt-0.5 text-uw-purple" />
                          {book}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Apply Now Section */}
        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            className="bg-uw-purple hover:bg-uw-purple/90"
            onClick={() => window.location.href = '/admissions/apply'}
          >
            <Award className="h-5 w-5 mr-2" />
            Apply Now for BA English Program
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default BachelorArtsEnglish;
