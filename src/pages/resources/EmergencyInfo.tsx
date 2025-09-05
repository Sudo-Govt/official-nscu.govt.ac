import PageLayout from '@/components/PageLayout';

const EmergencyInfo = () => {
  return (
    <PageLayout 
      title="Emergency Information" 
      description="Emergency procedures and contacts for NSCU"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-red-100 border-l-4 border-red-500 p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-800">Emergency Contacts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-red-700">Life-Threatening Emergency</h3>
                <p className="text-2xl font-bold text-red-600">911</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-700">Campus Safety</h3>
                <p className="text-xl font-bold text-red-600">(302) 857-6111</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Emergency Procedures</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Fire Emergency</h3>
                <ol className="list-decimal pl-6 text-gray-600">
                  <li>Activate fire alarm</li>
                  <li>Evacuate immediately</li>
                  <li>Use stairs, not elevators</li>
                  <li>Go to assembly point</li>
                  <li>Call 911</li>
                </ol>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Severe Weather</h3>
                <ol className="list-decimal pl-6 text-gray-600">
                  <li>Monitor weather alerts</li>
                  <li>Move to safe areas</li>
                  <li>Avoid windows</li>
                  <li>Stay informed via emergency alerts</li>
                  <li>Wait for all-clear signal</li>
                </ol>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Medical Emergency</h3>
                <ol className="list-decimal pl-6 text-gray-600">
                  <li>Call 911 immediately</li>
                  <li>Don't move injured person</li>
                  <li>Provide first aid if trained</li>
                  <li>Guide emergency responders</li>
                  <li>Report to campus safety</li>
                </ol>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Active Threat</h3>
                <ol className="list-decimal pl-6 text-gray-600">
                  <li>Run if safe to do so</li>
                  <li>Hide if you cannot run</li>
                  <li>Fight as last resort</li>
                  <li>Call 911 when safe</li>
                  <li>Follow law enforcement instructions</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Emergency Notifications</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="mb-4">
                NSCU uses multiple methods to communicate emergency information to the campus community.
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Text message alerts</li>
                <li>Email notifications</li>
                <li>Campus sirens</li>
                <li>Website updates</li>
                <li>Social media alerts</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default EmergencyInfo;