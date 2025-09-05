import PageLayout from '@/components/PageLayout';

const FitnessCenters = () => {
  return (
    <PageLayout 
      title="Fitness Centers" 
      description="State-of-the-art fitness facilities and wellness programs at NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Fitness Facilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Main Recreation Center</h3>
                <p className="text-gray-600 mb-4">
                  Our flagship 75,000 sq ft facility featuring modern equipment and diverse spaces.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Cardio equipment with entertainment systems</li>
                  <li>Free weights and strength training</li>
                  <li>Group exercise studios</li>
                  <li>Indoor track and courts</li>
                  <li>Swimming pool complex</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Satellite Fitness Centers</h3>
                <p className="text-gray-600 mb-4">
                  Convenient locations across campus for quick workouts between classes.
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Residence hall fitness rooms</li>
                  <li>Academic building gyms</li>
                  <li>24/7 access with student ID</li>
                  <li>Specialized equipment zones</li>
                  <li>Outdoor fitness stations</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Programs & Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Group Fitness</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Over 50 classes per week including yoga, spin, and HIIT.
                </p>
                <ul className="text-xs text-gray-500">
                  <li>• Morning and evening sessions</li>
                  <li>• All skill levels welcome</li>
                  <li>• Certified instructors</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Personal Training</h3>
                <p className="text-sm text-gray-600 mb-3">
                  One-on-one training with certified fitness professionals.
                </p>
                <ul className="text-xs text-gray-500">
                  <li>• Customized workout plans</li>
                  <li>• Nutrition guidance</li>
                  <li>• Injury prevention</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Wellness Programs</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Holistic wellness initiatives for mind and body health.
                </p>
                <ul className="text-xs text-gray-500">
                  <li>• Stress management workshops</li>
                  <li>• Healthy cooking classes</li>
                  <li>• Mental health resources</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Membership & Hours</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Membership Benefits</h3>
                  <ul className="text-gray-600">
                    <li>✓ Access to all facilities</li>
                    <li>✓ Unlimited group fitness classes</li>
                    <li>✓ Equipment orientation</li>
                    <li>✓ Locker rental available</li>
                    <li>✓ Guest passes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Operating Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Monday-Friday:</strong> 5:30 AM - 11:00 PM</p>
                    <p><strong>Saturday:</strong> 7:00 AM - 10:00 PM</p>
                    <p><strong>Sunday:</strong> 9:00 AM - 10:00 PM</p>
                    <p className="text-sm mt-2">Hours may vary during holidays and breaks</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default FitnessCenters;