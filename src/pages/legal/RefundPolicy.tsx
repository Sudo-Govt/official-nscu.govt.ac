import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, XCircle, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

const RefundPolicy = () => {
  return (
    <PageLayout
      title="Refund & Cancellation Policy"
      description="Refund and cancellation policy for NSCU programs and services"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <RefreshCcw className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Clear Process</h3>
                  <p className="text-sm text-muted-foreground">Transparent refund request procedure</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">7-14 Days Processing</h3>
                  <p className="text-sm text-muted-foreground">Quick turnaround for approved refunds</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Original Method</h3>
                  <p className="text-sm text-muted-foreground">Refunds to source payment method</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    Refund & Cancellation Policy
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold mb-2">Policy Overview</p>
                    <p className="mb-0">
                      New States Continental University (NSCU) is committed to providing fair and transparent refund policies. 
                      This policy outlines the conditions, timelines, and procedures for refunds and cancellations of various 
                      university fees and services.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-500" />
                    1. Non-Refundable Fees
                  </h3>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-6">
                    <p className="font-bold mb-4">The following fees are <strong>NON-REFUNDABLE</strong> under any circumstances:</p>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.1 Application Processing Fee</h4>
                        <p>
                          Application fees are non-refundable once payment is processed, regardless of:
                        </p>
                        <ul className="mt-2 space-y-1">
                          <li>• Application acceptance or rejection status</li>
                          <li>• Withdrawal before document submission</li>
                          <li>• Change of mind or program preference</li>
                          <li>• Duplicate or erroneous applications</li>
                        </ul>
                        <p className="text-sm mt-2 text-muted-foreground">
                          <strong>Reason:</strong> Application fees cover administrative costs of processing applications, 
                          document verification, and evaluation services.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.2 Document Evaluation & Verification Fee</h4>
                        <p>
                          Fees paid for credential evaluation, transcript verification, and document authentication are 
                          non-refundable as these services are rendered immediately upon document submission.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.3 Registration & Enrollment Fee</h4>
                        <p>
                          Once registration is confirmed and student ID is generated, the registration fee becomes non-refundable. 
                          This applies even if student withdraws before classes begin.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.4 Technology & Library Access Fee</h4>
                        <p>
                          These fees grant access to university systems, digital libraries, and online resources. 
                          Once access credentials are issued, fees are non-refundable.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.5 Certificate/Transcript Re-issue Fees</h4>
                        <p>
                          Fees for duplicate certificates, extra transcripts, or document attestation services are 
                          non-refundable once documents are processed.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold mb-2">1.6 Payments to Third-Party Representatives</h4>
                        <p>
                          NSCU is not responsible for refunds on payments made to unauthorized agents, consultants, 
                          or third-party representatives not officially recognized by the university.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    2. Refundable Fees (Conditional)
                  </h3>
                  <div className="space-y-6 mb-8">
                    <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-bold text-lg mb-3 text-green-700 dark:text-green-400">2.1 Tuition Fee Refunds</h4>
                      <p className="mb-4">
                        Tuition fees may be partially refunded based on the following timeline:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                          <thead className="bg-muted">
                            <tr>
                              <th className="border p-3 text-left">Withdrawal Timeline</th>
                              <th className="border p-3 text-left">Refund Percentage</th>
                              <th className="border p-3 text-left">Deductions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-3">Before enrollment ID issuance</td>
                              <td className="border p-3 font-bold text-green-600">90%</td>
                              <td className="border p-3">Processing fee retained</td>
                            </tr>
                            <tr>
                              <td className="border p-3">Within 7 days of enrollment</td>
                              <td className="border p-3 font-bold text-green-600">75%</td>
                              <td className="border p-3">Registration + admin fees</td>
                            </tr>
                            <tr>
                              <td className="border p-3">8-15 days after enrollment</td>
                              <td className="border p-3 font-bold text-amber-600">50%</td>
                              <td className="border p-3">One month tuition + admin fees</td>
                            </tr>
                            <tr>
                              <td className="border p-3">16-30 days after enrollment</td>
                              <td className="border p-3 font-bold text-amber-600">25%</td>
                              <td className="border p-3">Two months tuition + fees</td>
                            </tr>
                            <tr>
                              <td className="border p-3">After 30 days / After classes begin</td>
                              <td className="border p-3 font-bold text-red-600">0%</td>
                              <td className="border p-3">No refund</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h4 className="font-bold text-lg mb-3">2.2 Semester Withdrawal Refunds</h4>
                      <p className="mb-3">
                        For students withdrawing during an active semester:
                      </p>
                      <ul className="space-y-2">
                        <li><strong>Week 1-2:</strong> 80% tuition refund (minus registration fee)</li>
                        <li><strong>Week 3-4:</strong> 50% tuition refund</li>
                        <li><strong>Week 5-6:</strong> 25% tuition refund</li>
                        <li><strong>After Week 6:</strong> No refund eligible</li>
                      </ul>
                      <p className="text-sm mt-3 text-muted-foreground">
                        Note: Semester duration is calculated from the official start date, not student's enrollment date.
                      </p>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h4 className="font-bold text-lg mb-3">2.3 Program Cancellation by University</h4>
                      <p className="mb-3">
                        If NSCU cancels a program before commencement due to insufficient enrollment or other reasons:
                      </p>
                      <ul className="space-y-2">
                        <li>• <strong>100% full refund</strong> of all fees paid (including application fee)</li>
                        <li>• Option to transfer to alternative program without additional application fee</li>
                        <li>• Refund processed within 7-10 business days</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h4 className="font-bold text-lg mb-3">2.4 Course Drop Refunds</h4>
                      <p className="mb-3">
                        For individual course drops (not full withdrawal):
                      </p>
                      <ul className="space-y-2">
                        <li>• Drop within first week: 100% course fee refund</li>
                        <li>• Drop in week 2: 75% course fee refund</li>
                        <li>• Drop in week 3: 50% course fee refund</li>
                        <li>• After week 3: No course refund</li>
                      </ul>
                      <p className="text-sm mt-3 text-muted-foreground">
                        Minimum credit hour requirements must be maintained for full-time student status.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    3. Refund Processing Timeline
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Request Submission</h4>
                        <p>Submit refund request through student portal or email to finance@nscu.govt.ac with required documents.</p>
                        <p className="text-sm text-muted-foreground mt-1">Processing starts immediately upon receipt.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Verification & Approval (3-5 Days)</h4>
                        <p>Finance department reviews request, verifies eligibility, and calculates refund amount.</p>
                        <p className="text-sm text-muted-foreground mt-1">You'll receive approval/rejection notification via email.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Payment Processing (7-14 Days)</h4>
                        <p>Approved refunds are initiated to the original payment method.</p>
                        <p className="text-sm text-muted-foreground mt-1">Bank transfer times may vary by institution and country.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Confirmation</h4>
                        <p>Refund confirmation email sent with transaction reference number.</p>
                        <p className="text-sm text-muted-foreground mt-1">Contact your bank if funds not received within timeline.</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">4. How to Request a Refund</h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <p className="font-bold mb-4">Required Information:</p>
                    <ol className="space-y-3">
                      <li>
                        <strong>1. Written Request:</strong> Formal email or letter stating reason for refund request
                      </li>
                      <li>
                        <strong>2. Student Details:</strong> Full name, Student ID, program name, and enrollment date
                      </li>
                      <li>
                        <strong>3. Payment Proof:</strong> Original payment receipt or transaction ID
                      </li>
                      <li>
                        <strong>4. Bank Details:</strong> Account holder name, account number, IFSC/SWIFT code
                      </li>
                      <li>
                        <strong>5. Supporting Documents:</strong> Medical certificates (if applicable), withdrawal forms, etc.
                      </li>
                    </ol>
                    <p className="mt-4 font-bold">Submit To:</p>
                    <p className="mt-2">
                      <strong>Email:</strong> finance@nscu.govt.ac<br/>
                      <strong>Subject Line:</strong> Refund Request - [Your Student ID] - [Your Name]<br/>
                      <strong>Or via Student Portal:</strong> Dashboard → Financial Services → Request Refund
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                    5. Special Circumstances & Exceptions
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-bold mb-2">5.1 Medical Emergencies</h4>
                      <p>
                        Students withdrawing due to serious medical conditions (with valid medical certificates) may be eligible 
                        for special consideration beyond standard refund timelines. Each case is reviewed individually.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-bold mb-2">5.2 Visa Rejections (International Students)</h4>
                      <p>
                        International students facing visa rejections before program start may receive:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li>• 90% tuition refund (application fee non-refundable)</li>
                        <li>• Must provide official visa rejection letter</li>
                        <li>• Request must be made within 30 days of rejection</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-bold mb-2">5.3 Military Deployment</h4>
                      <p>
                        Active military personnel called to deployment may receive full or partial refunds upon providing 
                        official deployment orders, regardless of standard timelines.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-bold mb-2">5.4 University Policy Changes</h4>
                      <p>
                        If significant program changes occur after enrollment that materially affect the student experience, 
                        affected students may request special refund consideration.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">6. Failed Payment Refunds</h3>
                  <p className="mb-4">
                    If a payment fails or is declined but amount is debited from your account:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li>• Automatic refund initiated by payment gateway within 5-7 business days</li>
                    <li>• No action required from student</li>
                    <li>• If not received within 10 days, contact your bank with transaction reference</li>
                    <li>• University can provide transaction documentation for bank disputes</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4">7. Refund Deductions & Processing Charges</h3>
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border-collapse border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border p-3 text-left">Fee Type</th>
                          <th className="border p-3 text-left">Processing Charge</th>
                          <th className="border p-3 text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-3">Domestic Refunds</td>
                          <td className="border p-3">$10 or 2% (whichever is higher)</td>
                          <td className="border p-3">Bank transfer charges</td>
                        </tr>
                        <tr>
                          <td className="border p-3">International Refunds</td>
                          <td className="border p-3">$25 + currency conversion fees</td>
                          <td className="border p-3">SWIFT/Wire charges apply</td>
                        </tr>
                        <tr>
                          <td className="border p-3">PayPal/Wallet Refunds</td>
                          <td className="border p-3">3.5% of refund amount</td>
                          <td className="border p-3">Platform processing fees</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-lg mb-3">Contact Finance Department</h4>
                    <p className="mb-3">For refund queries, status updates, or assistance:</p>
                    <p className="mb-1"><strong>Email:</strong> finance@nscu.govt.ac</p>
                    <p className="mb-1"><strong>Phone:</strong> +1 (302) 857-6060 (Mon-Fri, 9 AM - 5 PM EST)</p>
                    <p className="mb-1"><strong>WhatsApp:</strong> +91-XXXXXXXXXX</p>
                    <p className="mb-0"><strong>Student Portal:</strong> Dashboard → Support → Financial Services</p>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-bold mb-2">Important Note</p>
                    <p className="text-sm">
                      All refund requests are subject to verification and approval by the Finance Department. 
                      NSCU reserves the right to retain fees for services already rendered or administrative costs incurred. 
                      This policy is subject to change with 30 days notice to enrolled students.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 2.0</p>
              <p>Refund policy effective for all enrollments from January 1, 2025 onwards.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RefundPolicy;
