import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdmissionSuccess = () => {
  return (
    <PageLayout
      title="Admission Form Submitted"
      description="Your application has been successfully submitted to NSCU"
    >
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Admission Form Has Been Successfully Submitted 🎓</h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg">Thank you for applying to New States Continental University.</p>

            <p>
              A secure payment link will be sent to your registered email address within 24 hours.
              Please check your inbox and spam folder.
            </p>

            <h3>Once your payment is confirmed:</h3>
            <ul>
              <li>You will receive your <strong>Student ID</strong> and <strong>Dashboard Login Credentials</strong>.</li>
              <li>You can then access your account to manage documents, track progress, and view results.</li>
            </ul>

            <h3>Before proceeding with payment, please review:</h3>
            <div className="flex flex-col gap-2 not-prose my-4">
              <Button variant="outline" asChild>
                <Link to="/payment-policy">Payment Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/refund-policy">Refund & Cancellation Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/terms">Terms & Conditions</Link>
              </Button>
            </div>

            <p className="text-center mt-6">
              For assistance, contact: <a href="mailto:admissions@nscu.govt.ac">admissions@nscu.govt.ac</a>
            </p>
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AdmissionSuccess;
