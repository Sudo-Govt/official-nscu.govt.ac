import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const PaymentPolicy = () => {
  return (
    <PageLayout
      title="Payment Policy"
      description="Official payment policy and accepted payment modes at NSCU"
    >
      <Card>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
          <h2>Payment Policy — New States Continental University (NSCU)</h2>
          
          <p>
            All students and applicants are required to make payments only through the official channels provided by NSCU.
          </p>

          <h3>Accepted Payment Modes:</h3>
          <ul>
            <li>Online payment via UPI, debit/credit card, or bank transfer.</li>
            <li>International payments via secure payment gateway link (sent to applicant's email).</li>
          </ul>

          <h3>Security:</h3>
          <p>
            All transactions are processed through encrypted and verified payment gateways. NSCU does not store or access card details directly.
          </p>

          <h3>Processing:</h3>
          <p>
            Payments are reflected within 24–48 working hours. A confirmation email will be sent automatically.
          </p>

          <h3>Important Notes:</h3>
          <ul>
            <li>Application and evaluation fees are non-refundable.</li>
            <li>University reserves the right to revise fees without prior notice.</li>
            <li>Payment acknowledgment serves as proof of application submission.</li>
          </ul>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default PaymentPolicy;
