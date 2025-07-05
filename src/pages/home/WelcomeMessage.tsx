
import PageLayout from '@/components/PageLayout';

const WelcomeMessage = () => {
  return (
    <PageLayout 
      title="Welcome to NSCU-Delaware" 
      description="A message from our university leadership"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Welcome from the President</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  Dear Students, Faculty, Staff, Alumni, and Friends,
                </p>
                <p className="text-gray-700 mb-4">
                  Welcome to New States Continental University - Delaware, where innovation meets excellence 
                  and tradition embraces the future. As we continue our mission to provide world-class education, 
                  groundbreaking research, and meaningful community engagement, I am proud to lead an institution 
                  that has been shaping minds and transforming lives for generations.
                </p>
                <p className="text-gray-700 mb-4">
                  Our commitment to academic excellence is matched only by our dedication to fostering an 
                  inclusive and diverse community where every individual can thrive. Whether you are a 
                  prospective student considering your educational journey, a current member of our university 
                  family, or an alumnus continuing to make your mark on the world, you are an essential part 
                  of the NSCU-Delaware story.
                </p>
                <p className="text-gray-700 mb-6">
                  Together, we are building a brighter future through education, research, and service. 
                  Thank you for being part of our remarkable community.
                </p>
                <p className="text-gray-700 font-semibold">
                  Sincerely,<br />
                  Dr. Sarah Mitchell<br />
                  President, NSCU-Delaware
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WelcomeMessage;
