import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { PenTool, Users, Clock, BookOpen, MessageCircle, Award } from 'lucide-react';

const WritingCenter = () => {
  useSEO({
    title: "Writing Center - Academic Support | NSCU Delaware",
    description: "Get expert writing support at NSCU Delaware's Writing Center. Free tutoring, workshops, and consultations for all students across disciplines.",
    keywords: "writing center, academic writing, tutoring, writing support, essay help, research papers, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Writing Center" 
      description="Expert writing support for students across all disciplines"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <PenTool className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Free Tutoring</h3>
              <p className="text-gray-600">One-on-one writing consultations</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Workshops</h3>
              <p className="text-gray-600">Group sessions on writing strategies</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <MessageCircle className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Online Support</h3>
              <p className="text-gray-600">Virtual consultations available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Our Services</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Essay Writing Support</h3>
                    <p className="text-gray-600">Help with structure, organization, and clarity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Research Paper Assistance</h3>
                    <p className="text-gray-600">Citation, research methods, and thesis development</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Peer Review Sessions</h3>
                    <p className="text-gray-600">Collaborative feedback and improvement</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Hours & Location</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-uw-gold" />
                  <span className="font-semibold">Operating Hours</span>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Thursday: 9:00 AM - 8:00 PM</p>
                  <p>Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: 2:00 PM - 8:00 PM</p>
                </div>
                <div className="mt-6 p-4 bg-uw-purple text-white rounded">
                  <p className="font-semibold mb-2">Location: Library Building, Room 205</p>
                  <p className="text-sm">Schedule appointments online or walk-ins welcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WritingCenter;