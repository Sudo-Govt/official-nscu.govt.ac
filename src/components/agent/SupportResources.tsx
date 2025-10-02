import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, FileText, Download, BookOpen, Video, MessageCircle, Send } from 'lucide-react';

const faqs = [
  {
    question: "How do I onboard a new student?",
    answer: "To onboard a new student, go to the Students tab and click 'Add New Student'. Fill in all required information including personal details, course selection, and intake dates. Make sure to collect all necessary documents before submission."
  },
  {
    question: "What documents are required for admission?",
    answer: "Required documents include: Passport copy, Academic transcripts, Diploma/certificates, Recommendation letters, Personal statement, Language proficiency certificates (IELTS/TOEFL), and Financial proof of funds."
  },
  {
    question: "How is commission calculated?",
    answer: "Commission is calculated based on the fee structure of the enrolled course. Your commission rate is shown in your profile. Commission is paid once the student completes fee payment and enrollment is confirmed."
  },
  {
    question: "When will I receive my commission payment?",
    answer: "Commissions are paid monthly on the 15th. You must reach the minimum payout threshold of $100. You can track your pending and paid commissions in the Finance tab."
  },
  {
    question: "What is the application review process?",
    answer: "Applications go through: 1) Document verification, 2) Academic review, 3) Administrative approval, 4) Fee payment, 5) Final enrollment. You'll be notified at each stage via the communications hub."
  },
  {
    question: "How do I verify document authenticity?",
    answer: "All uploaded documents go through AI-powered verification. High-risk documents are flagged for manual review. You can view verification status in the Documents tab."
  },
  {
    question: "Can I bulk upload student applications?",
    answer: "Yes, use the Bulk Upload feature in the Students tab. Download our CSV template, fill in the student details, and upload the file. The system will process all applications in batch."
  },
  {
    question: "How do I communicate with students?",
    answer: "Use the Communications Hub to send emails, WhatsApp messages, or internal notifications. You can use pre-configured templates for common scenarios like offer letters and payment reminders."
  }
];

const resources = [
  {
    title: "Agent Handbook 2025",
    description: "Complete guide for admission agents",
    type: "PDF",
    size: "2.5 MB"
  },
  {
    title: "Course Prospectus",
    description: "Detailed information about all programs",
    type: "PDF",
    size: "5.1 MB"
  },
  {
    title: "Admission Policy Guidelines",
    description: "Latest admission policies and procedures",
    type: "PDF",
    size: "1.8 MB"
  },
  {
    title: "Marketing Materials Kit",
    description: "Brochures, flyers, and promotional content",
    type: "ZIP",
    size: "12.3 MB"
  },
  {
    title: "Document Checklist Template",
    description: "Template for tracking student documents",
    type: "XLSX",
    size: "0.5 MB"
  },
  {
    title: "Fee Structure 2025",
    description: "Complete fee breakdown for all courses",
    type: "PDF",
    size: "0.8 MB"
  }
];

const trainingVideos = [
  {
    title: "Getting Started as an Agent",
    duration: "15:30",
    description: "Introduction to the platform and basic operations"
  },
  {
    title: "Student Application Process",
    duration: "22:45",
    description: "Step-by-step guide to creating applications"
  },
  {
    title: "Document Management Best Practices",
    duration: "18:20",
    description: "How to handle and verify student documents"
  },
  {
    title: "Commission Structure Explained",
    duration: "12:15",
    description: "Understanding your earnings and payments"
  }
];

const SupportResources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Ticket Created",
      description: "Our team will respond within 24 hours"
    });
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support & Resources</h2>
        <p className="text-muted-foreground">Help center, training materials, and support tickets</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="training">
            <Video className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
          <TabsTrigger value="support">
            <MessageCircle className="h-4 w-4 mr-2" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No FAQs match your search</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Resources</CardTitle>
              <CardDescription>Essential documents and marketing materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription className="text-sm">{resource.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{resource.size}</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Videos</CardTitle>
              <CardDescription>Step-by-step video tutorials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-muted-foreground">{video.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">Duration: {video.duration}</div>
                      </div>
                    </div>
                    <Button variant="outline">Watch</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Guidelines</CardTitle>
              <CardDescription>Important policies and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Data Protection & GDPR</div>
                  <p className="text-sm text-muted-foreground">
                    Learn about handling student data securely and compliance requirements
                  </p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Ethical Recruitment</div>
                  <p className="text-sm text-muted-foreground">
                    Guidelines for ethical student recruitment practices
                  </p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-medium mb-1">Document Verification Standards</div>
                  <p className="text-sm text-muted-foreground">
                    Standards for authenticating and verifying student documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  support@nscu.edu
                </p>
                <p className="text-xs text-muted-foreground">
                  Response time: Within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  +1 (555) 123-4567
                </p>
                <p className="text-xs text-muted-foreground">
                  Mon-Fri: 9:00 AM - 6:00 PM EST
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Available during business hours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Raise an issue with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="application">Application Support</SelectItem>
                      <SelectItem value="payment">Payment Query</SelectItem>
                      <SelectItem value="documents">Document Verification</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Brief description of the issue" />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Provide detailed information about your issue..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportResources;
