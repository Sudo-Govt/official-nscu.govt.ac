import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Shield, Clock, AlertCircle, FileText, DollarSign } from "lucide-react";

const PaymentPolicy = () => {
  return (
    <PageLayout
      title="Payment Policy"
      description="Official payment policy and accepted payment modes at NSCU"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Multiple Payment Options</h3>
                  <p className="text-sm text-muted-foreground">UPI, Cards, Bank Transfer & International Gateways</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Secure Processing</h3>
                  <p className="text-sm text-muted-foreground">256-bit SSL Encryption & PCI DSS Compliant</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Quick Confirmation</h3>
                  <p className="text-sm text-muted-foreground">24-48 Hour Processing & Email Receipts</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    Payment Policy — New States Continental University (NSCU)
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-lg mb-2">Official Payment Channels Only</p>
                    <p className="mb-0">
                      All students and applicants are required to make payments only through the official channels provided by NSCU. 
                      The university will not be responsible for payments made to unauthorized third parties or agents.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Accepted Payment Modes
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold text-lg mb-3 text-primary">Domestic Payments (India)</h4>
                      <ul className="space-y-2">
                        <li>✓ Unified Payments Interface (UPI)</li>
                        <li>✓ Credit Cards (Visa, Mastercard, RuPay)</li>
                        <li>✓ Debit Cards (All major banks)</li>
                        <li>✓ Net Banking (All major banks)</li>
                        <li>✓ Direct Bank Transfer (NEFT/RTGS/IMPS)</li>
                        <li>✓ Mobile Wallets (Paytm, PhonePe, Google Pay)</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold text-lg mb-3 text-primary">International Payments</h4>
                      <ul className="space-y-2">
                        <li>✓ International Credit/Debit Cards</li>
                        <li>✓ PayPal</li>
                        <li>✓ Wire Transfer (SWIFT)</li>
                        <li>✓ Western Union</li>
                        <li>✓ Secure payment gateway link (sent via email)</li>
                        <li>✓ Cryptocurrency (Bitcoin, USDT) - Select programs</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Payment Security & Data Protection
                  </h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <p className="mb-3">
                      <strong>Industry-Standard Security:</strong> All transactions are processed through encrypted and verified payment gateways 
                      that comply with PCI DSS (Payment Card Industry Data Security Standard) Level 1 certification.
                    </p>
                    <p className="mb-3">
                      <strong>Data Privacy:</strong> NSCU does not store, access, or retain any credit/debit card details, CVV numbers, or banking passwords. 
                      All sensitive financial information is handled exclusively by certified payment processors.
                    </p>
                    <p className="mb-3">
                      <strong>SSL Encryption:</strong> Our payment pages use 256-bit SSL (Secure Socket Layer) encryption to protect your data during transmission.
                    </p>
                    <p className="mb-0">
                      <strong>Fraud Protection:</strong> Real-time fraud detection systems monitor all transactions. Suspicious activities are flagged 
                      and verified before processing.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    Payment Processing & Confirmation
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="font-bold text-primary min-w-[140px]">Processing Time:</div>
                      <div>Payments are typically reflected within 24–48 working hours. In some cases, bank processing may take up to 72 hours.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="font-bold text-primary min-w-[140px]">Confirmation:</div>
                      <div>An automated email confirmation with payment receipt and transaction ID will be sent to your registered email address.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="font-bold text-primary min-w-[140px]">SMS Updates:</div>
                      <div>You will receive SMS notifications for successful payment on your registered mobile number.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="font-bold text-primary min-w-[140px]">Receipt Access:</div>
                      <div>All payment receipts are also accessible through your student dashboard under "Transaction History".</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Fee Structure & Payment Schedule
                  </h3>
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border-collapse border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border p-3 text-left">Fee Type</th>
                          <th className="border p-3 text-left">Amount Range</th>
                          <th className="border p-3 text-left">Payment Timeline</th>
                          <th className="border p-3 text-left">Refundable</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-3">Application Fee</td>
                          <td className="border p-3">$50 - $200</td>
                          <td className="border p-3">At time of application</td>
                          <td className="border p-3">No</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Document Evaluation Fee</td>
                          <td className="border p-3">$100 - $500</td>
                          <td className="border p-3">After document submission</td>
                          <td className="border p-3">No</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Tuition Fee (Semester)</td>
                          <td className="border p-3">$2,000 - $8,000</td>
                          <td className="border p-3">Before semester start</td>
                          <td className="border p-3">Partial*</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Registration Fee</td>
                          <td className="border p-3">$100 - $300</td>
                          <td className="border p-3">Upon enrollment confirmation</td>
                          <td className="border p-3">No</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Technology & Library Fee</td>
                          <td className="border p-3">$50 - $150/semester</td>
                          <td className="border p-3">With tuition payment</td>
                          <td className="border p-3">No</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-sm mt-2 text-muted-foreground">*Subject to refund policy conditions</p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-primary" />
                    Important Notes & Conditions
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Non-Refundable Fees:</strong> Application fees, evaluation fees, and registration charges are non-refundable once payment is processed, regardless of admission status.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Fee Revisions:</strong> The university reserves the right to revise fees with 60 days notice for existing students and without notice for new applicants.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Payment Acknowledgment:</strong> Payment receipt serves as official proof of application submission and must be retained for future reference.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Late Payment Penalty:</strong> A late fee of 2% per month will be charged on overdue balances. Students with outstanding dues may be restricted from accessing academic services.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Currency Conversion:</strong> For international payments, amounts shown in USD. Exchange rates and conversion fees are determined by your payment provider.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Payment Plans:</strong> Installment payment options are available for tuition fees. Contact the finance office for eligibility and terms.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Failed Transactions:</strong> If payment fails, amount will be refunded to source within 5-7 business days. Contact your bank if refund is delayed beyond 10 days.</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-primary mt-1">•</div>
                      <div><strong>Tax Deductions:</strong> Tuition fee receipts can be used for tax deduction purposes under applicable tax laws. Consult your tax advisor for eligibility.</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">Scholarship & Financial Aid Impact</h3>
                  <p className="mb-4">
                    Students receiving scholarships or financial aid must note that:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li>Scholarship amounts are credited after tuition fee payment</li>
                    <li>Financial aid disbursement follows the university's academic calendar</li>
                    <li>Students are responsible for the difference between total fees and aid awarded</li>
                    <li>Scholarships may have specific payment deadline requirements</li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-8 mb-4">Banking Details for Direct Transfer</h3>
                  <div className="bg-muted/50 p-6 rounded-lg border">
                    <p className="font-bold mb-3">For Domestic (India) Wire Transfers:</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div><strong>Bank Name:</strong> [Bank Name]</div>
                      <div><strong>Account Name:</strong> New States Continental University</div>
                      <div><strong>Account Number:</strong> [Account Number]</div>
                      <div><strong>IFSC Code:</strong> [IFSC Code]</div>
                      <div><strong>Branch:</strong> [Branch Name]</div>
                      <div><strong>Account Type:</strong> Current Account</div>
                    </div>
                    <p className="font-bold mb-3">For International Wire Transfers:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><strong>SWIFT Code:</strong> [SWIFT Code]</div>
                      <div><strong>Routing Number:</strong> [Routing Number]</div>
                      <div><strong>Bank Address:</strong> [Bank Address]</div>
                      <div><strong>Reference:</strong> Application ID / Student ID</div>
                    </div>
                    <p className="text-sm mt-4 text-muted-foreground">
                      Note: Always include your Application ID or Student ID in the payment reference for quick processing.
                    </p>
                  </div>

                  <div className="mt-8 p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-lg mb-3">Contact Finance Department</h4>
                    <p className="mb-2">For payment-related queries, refund requests, or payment verification:</p>
                    <p className="mb-1"><strong>Email:</strong> finance@nscu.govt.ac</p>
                    <p className="mb-1"><strong>Phone:</strong> +1 (302) 857-6060 (9 AM - 6 PM EST, Mon-Fri)</p>
                    <p className="mb-1"><strong>WhatsApp Support:</strong> +91-XXXXXXXXXX (24/7 automated responses)</p>
                    <p className="mb-0"><strong>Office Hours:</strong> Monday to Friday, 9:00 AM - 5:00 PM (EST)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 2.1</p>
              <p>This payment policy is subject to change. Students will be notified of any significant changes via email.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentPolicy;
