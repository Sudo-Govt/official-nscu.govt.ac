import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <PageLayout
      title="Terms & Conditions"
      description="Terms and conditions for using NSCU website and services"
    >
      <Card>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
          <h2>Terms & Conditions</h2>
          
          <p>
            By using the NSCU website or applying for admission, you agree to abide by all university policies and academic regulations.
          </p>

          <h3>Key Points:</h3>
          <ul>
            <li>All content, forms, and materials on this website are property of NSCU.</li>
            <li>Applicants must submit accurate and authentic documents.</li>
            <li>Misuse or falsification of data may result in cancellation of admission.</li>
            <li>NSCU shall not be held liable for typographical errors or outdated information.</li>
            <li>The jurisdiction for any disputes shall be Delaware, USA.</li>
          </ul>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TermsConditions;
