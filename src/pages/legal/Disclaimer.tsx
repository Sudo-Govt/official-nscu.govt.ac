import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const Disclaimer = () => {
  return (
    <PageLayout
      title="Disclaimer"
      description="Disclaimer and limitations of liability for NSCU website"
    >
      <Card>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
          <h2>Disclaimer</h2>
          
          <p>
            While NSCU strives to maintain accuracy of information, policies and programs are subject to change without prior notice.
          </p>

          <h3>The University shall not be liable for:</h3>
          <ul>
            <li>Any loss due to use of outdated or misinterpreted information.</li>
            <li>Third-party links or content mentioned on this website.</li>
            <li>Technical downtime or server maintenance interruptions.</li>
          </ul>

          <p>Use of this website implies acceptance of this disclaimer.</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Disclaimer;
