import PageLayout from '@/components/PageLayout';

const MyNSCU = () => {
  return (
    <PageLayout 
      title="MyNSCU Portal" 
      description="Access your student information, grades, and university services"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">
              Please log in with your NSCU credentials to access your personal portal.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Login to MyNSCU
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Portal Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Academic Services</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>View grades and transcripts</li>
                  <li>Register for classes</li>
                  <li>Check degree progress</li>
                  <li>Access academic calendar</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Financial Services</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>View account balance</li>
                  <li>Make payments</li>
                  <li>Financial aid information</li>
                  <li>Tax documents</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Campus Life</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Housing information</li>
                  <li>Meal plan details</li>
                  <li>Campus events</li>
                  <li>Student organizations</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Support Services</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>IT help desk tickets</li>
                  <li>Library services</li>
                  <li>Career center resources</li>
                  <li>Health services</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default MyNSCU;