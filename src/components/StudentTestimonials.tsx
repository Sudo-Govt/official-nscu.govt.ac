
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Emma Thompson",
    year: "Junior",
    major: "Computer Science",
    quote: "The collaborative environment and cutting-edge research opportunities at NSCU have exceeded all my expectations. I've worked on AI projects that are actually making a difference.",
    rating: 5,
    image: "photo-1494790108755-2616b612b5bc"
  },
  {
    name: "James Wilson",
    year: "Senior",
    major: "Pre-Medicine",
    quote: "The mentorship from faculty and hands-on experience in research labs has prepared me incredibly well for medical school. NSCU truly invests in student success.",
    rating: 5,
    image: "photo-1472099645785-5658abf4ff4e"
  },
  {
    name: "Sofia Martinez",
    year: "Sophomore",
    major: "Environmental Engineering",
    quote: "Being part of the sustainability initiatives on campus while studying environmental engineering has been transformative. Theory meets practice every day here.",
    rating: 5,
    image: "photo-1580489944761-15a19d654956"
  },
  {
    name: "David Chen",
    year: "Graduate Student",
    major: "Business Administration",
    quote: "The diverse community and global perspective in the business program have opened doors I never imagined. The networking opportunities are incredible.",
    rating: 5,
    image: "photo-1507003211169-0a1dd7228f2d"
  },
  {
    name: "Maya Patel",
    year: "Junior",
    major: "International Relations",
    quote: "NSCU's commitment to global education and the study abroad programs have given me perspectives that will shape my entire career in diplomacy.",
    rating: 5,
    image: "photo-1438761681033-6461ffad8d80"
  },
  {
    name: "Alex Rodriguez",
    year: "Senior",
    major: "Digital Arts",
    quote: "The creative facilities and supportive arts community here are unmatched. I've been able to explore interdisciplinary projects that blend technology and art.",
    rating: 5,
    image: "photo-1500648767791-00dcc994a43e"
  }
];

const StudentTestimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-uw-purple mb-4">
            Student Voices
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear directly from our students about their experiences, achievements, 
            and the transformative impact of their NSCU education.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-uw-gold fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <Quote className="h-6 w-6 text-uw-purple mb-3" />
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                </div>

                {/* Student Info */}
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/${testimonial.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80)`
                    }}
                  />
                  <div>
                    <div className="font-semibold text-uw-purple">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.year}, {testimonial.major}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Stats */}
        <div className="bg-uw-purple/5 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-uw-purple mb-2">96%</div>
              <div className="text-gray-600">Student Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-uw-purple mb-2">18:1</div>
              <div className="text-gray-600">Student-Faculty Ratio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-uw-purple mb-2">92%</div>
              <div className="text-gray-600">Graduate Employment Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-uw-purple mb-2">85%</div>
              <div className="text-gray-600">Graduate School Acceptance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
