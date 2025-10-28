import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const Grievance = () => {
  return (
    <PageLayout
      title="Student Grievance & Support"
      description="Student grievance redressal and support system at NSCU"
    >
      <Card>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
          <h2>Student Grievance & Support</h2>
          
          <p>
            NSCU values student welfare and transparency in all operations.
          </p>

          <h3>How to Raise a Concern:</h3>
          <p>
            Submit your issue through the official email or student dashboard once enrolled.
          </p>

          <h3>Response Time:</h3>
          <p>Within 7–10 working days from receipt.</p>

          <h3>Contact:</h3>
          <p>
            <a href="mailto:support@nscu.govt.ac">support@nscu.govt.ac</a>
          </p>

          <p>
            For unresolved issues, students may escalate to the Office of Academic Affairs, NSCU Delaware, USA.
          </p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Grievance;
