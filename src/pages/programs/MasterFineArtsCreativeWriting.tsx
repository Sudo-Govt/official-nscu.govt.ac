
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Download, Clock, BookOpen, Users, Award } from 'lucide-react';

const MasterFineArtsCreativeWriting = () => {
  return (
    <PageLayout 
      title="Master of Fine Arts in Creative Writing" 
      description="A comprehensive 2-year program designed to develop advanced creative writing skills across multiple genres including fiction, poetry, non-fiction, and screenwriting."
    >
      <div className="container mx-auto px-4 py-8">
        {/* Program Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Program Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Program Name</h4>
                <p>Master of Fine Arts in Creative Writing</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Duration</h4>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  2 Years, 4 Semesters
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Total Credits</h4>
                <p>60 Credits</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Program Structure</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Core Creative Writing Workshops</li>
                  <li>Literature & Critical Studies</li>
                  <li>Thesis Project</li>
                  <li>Professional Development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Assessment</h4>
                <p>70% Portfolio/Creative Work, 20% Critical Essays, 10% Participation</p>
              </div>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Complete Curriculum (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admission Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Admission Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Application Dates</h4>
              <ul className="space-y-1">
                <li>Application Opens: November 1</li>
                <li>Application Deadline: February 15</li>
                <li>Interviews: March 15-30</li>
                <li>Results: April 15</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Program Fees</h4>
              <ul className="space-y-1">
                <li>Tuition: $18,000/year</li>
                <li>Application Fee: $75</li>
                <li>Technology Fee: $500/year</li>
                <li>Total: $37,000 (2 years)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Requirements</h4>
              <ul className="space-y-1">
                <li>Bachelor's degree (any field)</li>
                <li>Writing portfolio (20-30 pages)</li>
                <li>Personal statement</li>
                <li>3 Letters of recommendation</li>
                <li>GRE scores (optional)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Semester Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
            <CardDescription>Detailed semester-wise breakdown of courses and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="semester1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="semester1">Semester I</TabsTrigger>
                <TabsTrigger value="semester2">Semester II</TabsTrigger>
                <TabsTrigger value="semester3">Semester III</TabsTrigger>
                <TabsTrigger value="semester4">Semester IV</TabsTrigger>
              </TabsList>

              {/* Semester I */}
              <TabsContent value="semester1" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester I</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Workshops: <span className="font-semibold">3 Core</span></div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course1">
                    <AccordionTrigger>Fiction Workshop I (CW501) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Workshop, 30 Individual Conferences)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Elements of fiction: plot, character, setting, point of view</li>
                          <li>Narrative techniques and voice development</li>
                          <li>Workshop critique methodology</li>
                          <li>Contemporary short story forms</li>
                          <li>Revision strategies and manuscript development</li>
                          <li>Reading as a writer: analyzing published work</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Janet Burroway's "Writing Fiction: A Guide to Narrative Craft"</li>
                          <li>John Gardner's "The Art of Fiction"</li>
                          <li>Tobias Wolff's "Selected Stories"</li>
                          <li>Alice Munro's "Selected Stories"</li>
                          <li>The Best American Short Stories (current year)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Develop skills in fiction writing and revision</li>
                          <li>Provide constructive workshop critique</li>
                          <li>Understand narrative craft elements</li>
                          <li>Build a portfolio of polished short fiction</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Portfolio 60%, Workshop Participation 25%, Critical Response Papers 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course2">
                    <AccordionTrigger>Poetry Workshop I (CW502) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Workshop, 30 Individual Conferences)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Poetic forms: free verse, traditional forms, experimental poetry</li>
                          <li>Line breaks, stanza structure, and white space</li>
                          <li>Imagery, metaphor, and figurative language</li>
                          <li>Sound patterns: rhythm, meter, rhyme</li>
                          <li>Contemporary and classic poetry analysis</li>
                          <li>Revision techniques for poetry</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Mary Oliver's "A Poetry Handbook"</li>
                          <li>Stephen Fry's "The Ode Less Travelled"</li>
                          <li>The Norton Anthology of Contemporary Poetry</li>
                          <li>Louise Glück's "Selected Poems"</li>
                          <li>Best American Poetry (current year)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Master fundamental poetic techniques</li>
                          <li>Develop personal poetic voice</li>
                          <li>Analyze contemporary and classic poetry</li>
                          <li>Create a cohesive poetry portfolio</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Portfolio 65%, Workshop Participation 20%, Poetry Analysis Papers 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course3">
                    <AccordionTrigger>Literary Analysis (CW503) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Seminars, 15 Discussion Groups)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Critical theory and literary analysis methods</li>
                          <li>Close reading techniques</li>
                          <li>Historical and cultural contexts in literature</li>
                          <li>Genre studies and literary movements</li>
                          <li>Research methodologies in literary studies</li>
                          <li>Academic writing for creative writers</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Terry Eagleton's "Literary Theory: An Introduction"</li>
                          <li>The Norton Anthology of Theory and Criticism</li>
                          <li>David Lodge's "The Art of Fiction"</li>
                          <li>Selected contemporary critical essays</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Apply critical theory to literary analysis</li>
                          <li>Develop academic writing skills</li>
                          <li>Understand literature within historical contexts</li>
                          <li>Conduct independent literary research</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Research Paper 50%, Critical Essays 30%, Class Participation 20%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Semester II */}
              <TabsContent value="semester2" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester II</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Workshops: <span className="font-semibold">3 Advanced</span></div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course4">
                    <AccordionTrigger>Fiction Workshop II (CW504) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Workshop, 30 Individual Conferences)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Advanced narrative techniques and experimental forms</li>
                          <li>Novella and novel excerpt development</li>
                          <li>Genre fiction exploration (literary, mystery, sci-fi)</li>
                          <li>Character psychology and development</li>
                          <li>Manuscript preparation for publication</li>
                          <li>Reading series and performance skills</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Anne Lamott's "Bird by Bird"</li>
                          <li>Francine Prose's "Reading Like a Writer"</li>
                          <li>Contemporary literary novels (instructor selected)</li>
                          <li>Pushcart Prize anthology</li>
                          <li>O. Henry Prize Stories</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Master advanced fiction writing techniques</li>
                          <li>Develop longer narrative works</li>
                          <li>Prepare work for publication</li>
                          <li>Build professional presentation skills</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Portfolio 65%, Workshop Leadership 20%, Public Reading 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course5">
                    <AccordionTrigger>Creative Nonfiction Workshop (CW505) - 6 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 90 Hours (60 Workshop, 30 Field Work)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Memoir and personal narrative techniques</li>
                          <li>Literary journalism and reportage</li>
                          <li>Essay forms: lyric, reflective, argumentative</li>
                          <li>Research methods for creative nonfiction</li>
                          <li>Ethics in personal and documentary writing</li>
                          <li>Fact-checking and verification processes</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Lee Gutkind's "The Art of Creative Nonfiction"</li>
                          <li>Annie Dillard's "The Writing Life"</li>
                          <li>Best American Essays (current year)</li>
                          <li>Joan Didion's "The White Album"</li>
                          <li>Tobias Wolff's "This Boy's Life"</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Master creative nonfiction techniques</li>
                          <li>Develop research and interview skills</li>
                          <li>Understand ethical considerations in life writing</li>
                          <li>Create compelling personal narratives</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Portfolio 60%, Research Project 25%, Workshop Participation 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course6">
                    <AccordionTrigger>Contemporary Literature Studies (CW506) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Seminars, 15 Independent Study)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>21st century literary movements and trends</li>
                          <li>Diverse voices in contemporary literature</li>
                          <li>Digital literature and new media writing</li>
                          <li>Global literature in translation</li>
                          <li>Literary magazines and publishing landscape</li>
                          <li>Book reviews and literary criticism writing</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Recent Pulitzer Prize and National Book Award winners</li>
                          <li>Literary magazines: The Paris Review, Granta, McSweeney's</li>
                          <li>International literature in translation</li>
                          <li>Critical essays on contemporary writers</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Analyze contemporary literary trends</li>
                          <li>Develop critical writing skills</li>
                          <li>Understand global literary contexts</li>
                          <li>Engage with current literary debates</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Critical Essays 60%, Book Reviews 25%, Presentation 15%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Semester III */}
              <TabsContent value="semester3" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester III</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Specialization & Thesis</span></div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course7">
                    <AccordionTrigger>Genre Specialization Workshop (CW507) - 9 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 135 Hours (90 Workshop, 45 Independent Study)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Intensive focus on chosen genre (Fiction, Poetry, or Nonfiction)</li>
                          <li>Advanced manuscript development</li>
                          <li>Professional portfolio preparation</li>
                          <li>Submission strategies for literary magazines</li>
                          <li>Grant writing and fellowship applications</li>
                          <li>Literary community engagement</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Genre-specific craft books (selected based on specialization)</li>
                          <li>Duotrope's Digest and submission guidelines</li>
                          <li>AWP Writer's Chronicle</li>
                          <li>Contemporary masters in chosen genre</li>
                          <li>Literary contest and fellowship directories</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Develop expertise in chosen writing genre</li>
                          <li>Create publication-ready manuscripts</li>
                          <li>Understand literary publishing industry</li>
                          <li>Build professional writing career skills</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Thesis Proposal 40%, Workshop Portfolio 35%, Professional Development 25%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course8">
                    <AccordionTrigger>Teaching Creative Writing (CW508) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Seminar, 15 Teaching Practice)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Pedagogy of creative writing</li>
                          <li>Workshop facilitation techniques</li>
                          <li>Developing writing exercises and prompts</li>
                          <li>Assessment methods for creative work</li>
                          <li>Classroom management in creative environments</li>
                          <li>Community workshop leadership</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Wendy Bishop's "Teaching Lives: Essays and Stories"</li>
                          <li>Tim Mayers' "Writing Craft"</li>
                          <li>AWP Pedagogy Papers</li>
                          <li>Creative writing exercise collections</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Develop teaching skills for creative writing</li>
                          <li>Design effective writing curricula</li>
                          <li>Lead productive writing workshops</li>
                          <li>Support diverse student writers</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Teaching Demo 40%, Curriculum Design 35%, Reflection Paper 25%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course9">
                    <AccordionTrigger>Literary Publishing & Editing (CW509) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Workshop, 15 Practicum)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Literary magazine production and editing</li>
                          <li>Manuscript evaluation and selection</li>
                          <li>Copy editing and proofreading skills</li>
                          <li>Book publishing industry overview</li>
                          <li>Digital publishing platforms</li>
                          <li>Literary event planning and promotion</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Reference Books</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Chicago Manual of Style</li>
                          <li>Publishing industry handbooks</li>
                          <li>Literary magazine case studies</li>
                          <li>Digital publishing guides</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Understand literary publishing processes</li>
                          <li>Develop editorial judgment and skills</li>
                          <li>Create and manage literary publications</li>
                          <li>Build industry connections and knowledge</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Editorial Project 50%, Manuscript Evaluations 30%, Industry Report 20%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Semester IV */}
              <TabsContent value="semester4" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Semester IV</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Total Credits: <span className="font-semibold">15 Credits</span></div>
                    <div>Contact Hours: <span className="font-semibold">225 Hours</span></div>
                    <div>Focus: <span className="font-semibold">Thesis Completion</span></div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course10">
                    <AccordionTrigger>MFA Thesis Project (CW510) - 12 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 180 Hours (60 Seminars, 120 Independent Work)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Project Requirements</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Complete manuscript in chosen genre (50-100 pages)</li>
                          <li>Critical introduction (15-20 pages)</li>
                          <li>Public thesis reading</li>
                          <li>Thesis defense with committee</li>
                          <li>Professional portfolio compilation</li>
                          <li>Publishing plan and submissions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Thesis Options</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Fiction: Collection of short stories or novella</li>
                          <li>Poetry: Full-length poetry collection</li>
                          <li>Creative Nonfiction: Memoir or essay collection</li>
                          <li>Mixed Genre: Hybrid creative work</li>
                          <li>Screenplay: Feature-length or series pilot</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Complete substantial creative work</li>
                          <li>Demonstrate mastery of chosen genre</li>
                          <li>Articulate artistic vision and process</li>
                          <li>Prepare for professional writing career</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Thesis Manuscript 60%, Critical Introduction 20%, Defense 10%, Reading 10%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course11">
                    <AccordionTrigger>Professional Development Seminar (CW511) - 3 Credits</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold">Course Details</h5>
                        <p><strong>Contact Hours:</strong> 45 Hours (30 Seminars, 15 Networking Events)</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Topics Covered</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Writing career paths and opportunities</li>
                          <li>Literary agent relationships and publishing contracts</li>
                          <li>Grant writing and residency applications</li>
                          <li>Teaching and academic job market</li>
                          <li>Freelance writing and editing opportunities</li>
                          <li>Building professional networks and platforms</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Guest Speakers</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Published authors and poets</li>
                          <li>Literary agents and editors</li>
                          <li>Writing program directors</li>
                          <li>Literary magazine editors</li>
                          <li>Arts administrators and grant officers</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Learning Outcomes</h5>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Understand diverse writing career options</li>
                          <li>Develop professional presentation skills</li>
                          <li>Build industry connections</li>
                          <li>Create sustainable writing practice</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold">Assessment</h5>
                        <p>Career Portfolio 40%, Professional Presentation 35%, Networking Report 25%</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Apply Now Section */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-uw-purple hover:bg-uw-purple/90">
            <Award className="h-5 w-5 mr-2" />
            Apply Now for MFA Program
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MasterFineArtsCreativeWriting;
