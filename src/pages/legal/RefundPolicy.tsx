import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const RefundPolicy = () => {
  return (
    <PageLayout
      title="Refund & Cancellation Policy"
      description="Refund and cancellation policy for NSCU programs and services"
    >
      <Card>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
          <h2>Refund & Cancellation Policy</h2>

          <h3>1. Application Fees:</h3>
          <p>Non-refundable once payment is made.</p>

          <h3>2. Program Fees:</h3>
          <p>
            Refund may be considered only before issuance of enrollment ID and access credentials.
          </p>

          <h3>3. Refund Timeline:</h3>
          <p>
            Approved refunds will be processed within 7–14 working days via the original payment method.
          </p>

          <h3>4. Non-Refundable Cases:</h3>
          <ul>
            <li>Admission withdrawn after confirmation.</li>
            <li>Certificate or transcript re-issue fees.</li>
            <li>Payments made to third-party representatives.</li>
          </ul>

          <p>
            For refund queries, contact: <a href="mailto:finance@nscu.govt.ac">finance@nscu.govt.ac</a>
          </p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default RefundPolicy;
