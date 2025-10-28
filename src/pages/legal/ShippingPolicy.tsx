import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, MapPin, Clock, Shield, FileText, DollarSign, AlertCircle } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <PageLayout
      title="Shipping & Delivery Policy"
      description="Shipping policy for academic documents, certificates, and transcripts"
    >
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Secure Packaging</h3>
                  <p className="text-sm text-muted-foreground">Tamper-proof sealed envelopes</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Tracked Delivery</h3>
                  <p className="text-sm text-muted-foreground">Real-time shipment tracking</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Global Shipping</h3>
                  <p className="text-sm text-muted-foreground">Worldwide delivery available</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Insured Transit</h3>
                  <p className="text-sm text-muted-foreground">Full insurance coverage</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    Shipping & Delivery Policy for Academic Documents
                  </h2>
                  
                  <div className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold mb-2">Policy Overview</p>
                    <p className="mb-0">
                      New States Continental University (NSCU) is committed to ensuring secure, timely, and reliable 
                      delivery of all academic documents including degree certificates, diplomas, transcripts, mark sheets, 
                      and other official credentials. This policy outlines our shipping procedures, timelines, costs, and 
                      terms for document delivery.
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">1. Eligible Documents for Shipping</h3>
                  <div className="space-y-4 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-primary">Original Documents</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Degree Certificates (Bachelor's, Master's, Doctoral)</li>
                          <li>• Diplomas and Professional Certificates</li>
                          <li>• Official Transcripts (sealed and signed)</li>
                          <li>• Consolidated Mark Sheets</li>
                          <li>• Provisional Certificates</li>
                          <li>• Migration Certificates</li>
                          <li>• Character Certificates</li>
                          <li>• Course Completion Certificates</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-primary">Certified Copies</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Attested Photocopies of Degrees</li>
                          <li>• Verified Transcript Copies</li>
                          <li>• Notarized Document Duplicates</li>
                          <li>• Apostille/Embassy Attested Documents</li>
                          <li>• Credential Evaluation Reports</li>
                          <li>• Letter of Recommendation</li>
                          <li>• Enrollment Verification Letters</li>
                          <li>• Grade Reports and Academic Records</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm mb-0">
                        <strong>Important:</strong> All original documents are shipped in tamper-proof, security-sealed 
                        envelopes with university embossing. Any broken seal invalidates the document's official status.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    2. Processing & Delivery Timelines
                  </h3>
                  <div className="mb-8">
                    <h4 className="font-bold text-lg mb-4">Document Processing Time</h4>
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="border p-3 text-left">Document Type</th>
                            <th className="border p-3 text-left">Processing Time</th>
                            <th className="border p-3 text-left">Verification Steps</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-3">Transcripts (Current Students)</td>
                            <td className="border p-3">3-5 business days</td>
                            <td className="border p-3">Academic record verification</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Transcripts (Alumni)</td>
                            <td className="border p-3">5-7 business days</td>
                            <td className="border p-3">Archive retrieval & verification</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Degree Certificates</td>
                            <td className="border p-3">7-10 business days</td>
                            <td className="border p-3">Registrar approval & printing</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Duplicate Certificates</td>
                            <td className="border p-3">10-15 business days</td>
                            <td className="border p-3">Affidavit verification & reprint</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Apostille/Attestation</td>
                            <td className="border p-3">15-20 business days</td>
                            <td className="border p-3">Government department processing</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="font-bold text-lg mb-4">Shipping Delivery Time (After Processing)</h4>
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="border p-3 text-left">Destination</th>
                            <th className="border p-3 text-left">Standard Shipping</th>
                            <th className="border p-3 text-left">Express Shipping</th>
                            <th className="border p-3 text-left">Courier Partner</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-3">Within USA (Domestic)</td>
                            <td className="border p-3">5-7 business days</td>
                            <td className="border p-3">2-3 business days</td>
                            <td className="border p-3">USPS, FedEx, UPS</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Canada</td>
                            <td className="border p-3">7-10 business days</td>
                            <td className="border p-3">3-5 business days</td>
                            <td className="border p-3">FedEx, DHL</td>
                          </tr>
                          <tr>
                            <td className="border p-3">UK & Europe</td>
                            <td className="border p-3">10-15 business days</td>
                            <td className="border p-3">5-7 business days</td>
                            <td className="border p-3">DHL, FedEx</td>
                          </tr>
                          <tr>
                            <td className="border p-3">India & Asia</td>
                            <td className="border p-3">12-18 business days</td>
                            <td className="border p-3">6-8 business days</td>
                            <td className="border p-3">DHL, FedEx, Blue Dart</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Middle East</td>
                            <td className="border p-3">10-14 business days</td>
                            <td className="border p-3">5-7 business days</td>
                            <td className="border p-3">Aramex, DHL</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Australia & New Zealand</td>
                            <td className="border p-3">12-16 business days</td>
                            <td className="border p-3">6-8 business days</td>
                            <td className="border p-3">DHL, FedEx</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Africa & South America</td>
                            <td className="border p-3">15-21 business days</td>
                            <td className="border p-3">8-10 business days</td>
                            <td className="border p-3">DHL, FedEx</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm mb-2">
                        <strong>Total Time Estimation:</strong> Processing Time + Shipping Time
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Example:</strong> A transcript to India = 5-7 days processing + 12-18 days shipping = 17-25 business days total
                      </p>
                      <p className="text-sm text-muted-foreground">
                        *Timelines exclude weekends, public holidays, and customs clearance delays. International shipments 
                        may experience delays due to customs inspection or local courier handoffs.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-primary" />
                    3. Shipping Charges & Payment
                  </h3>
                  <div className="mb-8">
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="border p-3 text-left">Destination Zone</th>
                            <th className="border p-3 text-left">Standard (Per Set)</th>
                            <th className="border p-3 text-left">Express (Per Set)</th>
                            <th className="border p-3 text-left">Premium/Insured</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-3">USA (Within State)</td>
                            <td className="border p-3">$15</td>
                            <td className="border p-3">$35</td>
                            <td className="border p-3">$50</td>
                          </tr>
                          <tr>
                            <td className="border p-3">USA (Other States)</td>
                            <td className="border p-3">$20</td>
                            <td className="border p-3">$45</td>
                            <td className="border p-3">$65</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Canada</td>
                            <td className="border p-3">$30</td>
                            <td className="border p-3">$60</td>
                            <td className="border p-3">$85</td>
                          </tr>
                          <tr>
                            <td className="border p-3">UK & Europe</td>
                            <td className="border p-3">$45</td>
                            <td className="border p-3">$90</td>
                            <td className="border p-3">$120</td>
                          </tr>
                          <tr>
                            <td className="border p-3">India & Asia</td>
                            <td className="border p-3">$40</td>
                            <td className="border p-3">$80</td>
                            <td className="border p-3">$110</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Middle East</td>
                            <td className="border p-3">$50</td>
                            <td className="border p-3">$95</td>
                            <td className="border p-3">$130</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Australia & Pacific</td>
                            <td className="border p-3">$55</td>
                            <td className="border p-3">$100</td>
                            <td className="border p-3">$140</td>
                          </tr>
                          <tr>
                            <td className="border p-3">Africa & South America</td>
                            <td className="border p-3">$60</td>
                            <td className="border p-3">$110</td>
                            <td className="border p-3">$150</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-bold mb-2">What's Included in "Per Set"?</h4>
                        <p className="text-sm">One set includes: 1 Degree Certificate + 1 Complete Transcript OR 
                        up to 3 individual documents (transcripts, certificates, mark sheets). Additional documents 
                        charged at $5 per document.</p>
                      </div>

                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-bold mb-2">Premium/Insured Shipping Includes:</h4>
                        <ul className="space-y-1 text-sm mt-2">
                          <li>• Priority express delivery with signature confirmation</li>
                          <li>• Full insurance coverage (up to $500 document value)</li>
                          <li>• Real-time GPS tracking</li>
                          <li>• Dedicated customer support</li>
                          <li>• Guaranteed delivery date (or full refund)</li>
                          <li>• Replacement guarantee for lost/damaged shipments</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-amber-500 pl-4">
                        <h4 className="font-bold mb-2">Additional Charges:</h4>
                        <ul className="space-y-1 text-sm mt-2">
                          <li>• Apostille/Embassy Attestation: $75-$150 (depending on country)</li>
                          <li>• WES/ECE Credential Evaluation: $100-$200</li>
                          <li>• Rush Processing (within 24-48 hours): $50-$100</li>
                          <li>• Multiple Recipient Copies: $10 per additional recipient</li>
                          <li>• Custom Delivery Instructions: $15-$25</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-bold mb-3">Payment Methods Accepted</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Online Payment</p>
                          <p>Credit/Debit Cards, PayPal, UPI</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Wire Transfer</p>
                          <p>Bank transfer, SWIFT, IBAN</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Other Methods</p>
                          <p>Mobile Wallets, Cryptocurrency</p>
                        </div>
                      </div>
                      <p className="text-sm mt-3 text-muted-foreground">
                        <strong>Payment Policy:</strong> Full payment must be received before document processing begins. 
                        Payment confirmation via email within 24 hours.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    4. Packaging & Security Standards
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-bold mb-4">Security Packaging Protocol</h4>
                      <ol className="space-y-3">
                        <li className="flex gap-3">
                          <span className="font-bold text-primary">1.</span>
                          <div>
                            <strong>Document Preparation:</strong> Original documents are placed in acid-free protective sleeves 
                            to prevent damage and fading.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-primary">2.</span>
                          <div>
                            <strong>Primary Envelope:</strong> Documents sealed in tamper-evident security envelopes with 
                            holographic university seal and registrar signature across seal.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-primary">3.</span>
                          <div>
                            <strong>Outer Packaging:</strong> Placed in rigid cardboard mailers with "DO NOT BEND" markings 
                            and cushioned padding for protection during transit.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-primary">4.</span>
                          <div>
                            <strong>Labeling:</strong> All packages marked as "Educational Documents - Handle with Care" and 
                            include tracking barcode, return address, and delivery confirmation requirement.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-primary">5.</span>
                          <div>
                            <strong>Quality Check:</strong> Each package inspected before dispatch by shipping coordinator 
                            and photographed for record-keeping.
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-primary">Standard Package Contents</h4>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Requested original/certified documents</li>
                          <li>✓ Delivery confirmation receipt</li>
                          <li>✓ University letterhead cover letter</li>
                          <li>✓ Instructions for document verification</li>
                          <li>✓ Contact information for inquiries</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-primary">Premium Package Additions</h4>
                        <ul className="space-y-2 text-sm">
                          <li>✓ All standard package items</li>
                          <li>✓ Hard-bound document folder</li>
                          <li>✓ Duplicate tracking slip</li>
                          <li>✓ QR code for instant verification</li>
                          <li>✓ Insurance certificate</li>
                          <li>✓ Return envelope for recipient signature</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <Truck className="h-6 w-6 text-primary" />
                    5. Tracking & Delivery Confirmation
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="border-l-4 border-primary pl-4 bg-primary/5 p-4">
                      <h4 className="font-bold mb-2">Real-Time Tracking</h4>
                      <p className="text-sm mb-3">
                        Once your documents are shipped, you'll receive a tracking number via email and SMS. Track your 
                        shipment in real-time using:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• University student portal (Dashboard → Documents → Track Shipment)</li>
                        <li>• Direct courier website (FedEx, DHL, UPS, etc.)</li>
                        <li>• Mobile tracking apps</li>
                        <li>• Email/SMS notifications at each delivery milestone</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-5 rounded-lg">
                      <h4 className="font-bold mb-4">Delivery Confirmation Methods</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                          <div className="font-bold text-primary">•</div>
                          <div>
                            <strong>Signature Required:</strong> All shipments require recipient signature for proof of delivery. 
                            Authorization for no-signature delivery available upon written request (liability waived).
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="font-bold text-primary">•</div>
                          <div>
                            <strong>Delivery Attempts:</strong> Courier makes 3 delivery attempts. If unsuccessful, package 
                            held at local facility for 7 days for pickup, then returned to university.
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="font-bold text-primary">•</div>
                          <div>
                            <strong>Alternative Delivery:</strong> Can authorize delivery to neighbor, building management, 
                            or alternate address via courier website/app.
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="font-bold text-primary">•</div>
                          <div>
                            <strong>Confirmation Email:</strong> University sends delivery confirmation email with recipient 
                            signature image and delivery timestamp within 24 hours of successful delivery.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                    6. Lost, Damaged, or Delayed Shipments
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
                      <h4 className="font-bold mb-4">Immediate Action Steps</h4>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="font-bold mb-2">If Package is Delayed Beyond Expected Date:</p>
                          <ol className="space-y-1 ml-4">
                            <li>1. Check tracking status on courier website for updates</li>
                            <li>2. Contact courier customer service with tracking number</li>
                            <li>3. If no resolution within 2 days, email: shipping@nscu.govt.ac with details</li>
                            <li>4. University will initiate tracer request with courier within 24 hours</li>
                          </ol>
                        </div>

                        <div>
                          <p className="font-bold mb-2">If Package is Lost:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Courier declares package lost after 10 business days (domestic) or 21 days (international)</li>
                            <li>• University files insurance claim immediately</li>
                            <li>• Replacement documents processed at no additional charge (if insured or Premium shipping)</li>
                            <li>• Standard/Express: 50% discount on replacement shipping charges</li>
                            <li>• Processing time: 5-7 business days for replacement</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold mb-2">If Package is Damaged:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Do NOT accept damaged package if seal is broken or documents visible</li>
                            <li>• If accepted, photograph damage immediately before opening</li>
                            <li>• Email photos to shipping@nscu.govt.ac within 24 hours</li>
                            <li>• File damage claim with courier</li>
                            <li>• University provides replacement free of charge if damage is courier's fault</li>
                            <li>• Damaged originals must be returned to university for verification</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold mb-2">If Wrong Documents Received:</p>
                          <ul className="space-y-1 ml-4">
                            <li>• Contact shipping@nscu.govt.ac immediately with order number and photo</li>
                            <li>• Return incorrect documents in original packaging</li>
                            <li>• University dispatches correct documents immediately (next business day)</li>
                            <li>• Return shipping covered by university</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-bold mb-2">University Liability & Guarantees</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Standard Shipping:</strong> University not liable for delays due to courier or customs. 
                        No refunds for delayed delivery. Insurance optional.</li>
                        <li>• <strong>Express Shipping:</strong> Partial refund (50% shipping charge) if delivery exceeds 
                        promised timeline by more than 3 days (domestic) or 5 days (international).</li>
                        <li>• <strong>Premium/Insured:</strong> Full shipping refund + replacement at no cost for any loss, 
                        damage, or delay. Guaranteed delivery date or full refund policy.</li>
                        <li>• <strong>University Errors:</strong> If wrong documents shipped due to university error, full 
                        refund of shipping charges + free priority replacement.</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">7. International Shipping Considerations</h3>
                  <div className="space-y-4 mb-8">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
                      <h4 className="font-bold mb-4">Important Information for International Recipients</h4>
                      
                      <div className="space-y-4 text-sm">
                        <div className="border-l-4 border-amber-500 pl-4">
                          <p className="font-bold mb-2">Customs Clearance</p>
                          <p>Educational documents are generally exempt from customs duties in most countries. However, packages 
                          may be held for inspection. Declare truthful value and mark as "Educational Documents - No Commercial Value".</p>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-4">
                          <p className="font-bold mb-2">Recipient Responsibilities</p>
                          <ul className="space-y-1 mt-2">
                            <li>• Provide accurate local address with postal/zip code</li>
                            <li>• Include contact phone number (required by international couriers)</li>
                            <li>• Monitor tracking and respond to courier delivery notifications</li>
                            <li>• May need to present ID for customs clearance in some countries</li>
                            <li>• Responsible for any import duties or taxes (rare for documents, but possible)</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-4">
                          <p className="font-bold mb-2">Country-Specific Restrictions</p>
                          <p className="mb-2">Some countries have shipping restrictions or require special procedures:</p>
                          <ul className="space-y-1">
                            <li>• <strong>India:</strong> Customs declaration required; may need to visit customs office</li>
                            <li>• <strong>China:</strong> Limited courier access; use DHL or FedEx only</li>
                            <li>• <strong>Russia:</strong> Extended customs processing (add 7-10 days)</li>
                            <li>• <strong>Brazil:</strong> Requires CPF number for delivery</li>
                            <li>• <strong>Middle East:</strong> Requires passport copy for customs</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-4">
                          <p className="font-bold mb-2">Undeliverable Countries/Regions</p>
                          <p>Due to courier restrictions or geopolitical situations, shipping may not be available to certain 
                          countries. Contact shipping@nscu.govt.ac to confirm availability before requesting documents.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">8. How to Request Document Shipping</h3>
                  <div className="bg-muted/50 p-6 rounded-lg mb-8">
                    <h4 className="font-bold mb-4 text-lg">Step-by-Step Process</h4>
                    <ol className="space-y-4">
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                        <div>
                          <p className="font-bold mb-1">Request Documents</p>
                          <p className="text-sm">Log in to student portal → Documents section → Request Official Documents OR 
                          email registrar@nscu.govt.ac with specific document request</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                        <div>
                          <p className="font-bold mb-1">Provide Details</p>
                          <p className="text-sm">Specify: Document type(s), quantity, delivery address (complete with postal code), 
                          contact phone, shipping method preference (Standard/Express/Premium)</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                        <div>
                          <p className="font-bold mb-1">Receive Quote</p>
                          <p className="text-sm">University provides cost estimate within 24 hours including document fees + 
                          processing charges + shipping costs</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                        <div>
                          <p className="font-bold mb-1">Make Payment</p>
                          <p className="text-sm">Pay via secure payment link sent to your email. Payment methods: credit/debit 
                          card, PayPal, wire transfer, UPI (for India)</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                        <div>
                          <p className="font-bold mb-1">Processing Confirmation</p>
                          <p className="text-sm">Receive email confirmation with estimated processing completion date and 
                          expected shipping date</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">6</div>
                        <div>
                          <p className="font-bold mb-1">Tracking Information</p>
                          <p className="text-sm">When shipped, receive tracking number via email & SMS with courier details and 
                          estimated delivery date</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">7</div>
                        <div>
                          <p className="font-bold mb-1">Delivery & Confirmation</p>
                          <p className="text-sm">Sign for package upon delivery. University receives delivery confirmation from 
                          courier and updates your portal status to "Delivered"</p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <h3 className="text-2xl font-bold mt-8 mb-4">9. Special Services</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Rush Processing & Delivery</h4>
                      <p className="text-sm mb-3">Need documents urgently? We offer expedited services:</p>
                      <ul className="space-y-2 text-sm">
                        <li><strong>24-Hour Rush:</strong> Document ready in 1 business day + overnight shipping ($150-$250)</li>
                        <li><strong>48-Hour Rush:</strong> Document ready in 2 business days + express shipping ($100-$150)</li>
                        <li><strong>72-Hour Rush:</strong> Document ready in 3 business days + express shipping ($75-$100)</li>
                      </ul>
                      <p className="text-xs mt-3 text-muted-foreground">Rush processing subject to availability and document type. 
                      Not available for documents requiring external attestation/apostille.</p>
                    </div>

                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Bulk Shipping</h4>
                      <p className="text-sm mb-3">Sending to multiple institutions? We offer bulk shipping discounts:</p>
                      <ul className="space-y-2 text-sm">
                        <li><strong>5-10 recipients:</strong> 10% discount on shipping charges</li>
                        <li><strong>11-20 recipients:</strong> 15% discount on shipping charges</li>
                        <li><strong>21+ recipients:</strong> 20% discount + dedicated coordinator</li>
                      </ul>
                      <p className="text-xs mt-3 text-muted-foreground">Ideal for job applications, university applications, or 
                      credential evaluation services.</p>
                    </div>

                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Digital + Physical Combo</h4>
                      <p className="text-sm mb-3">Get instant access while waiting for physical delivery:</p>
                      <ul className="space-y-2 text-sm">
                        <li>Secure PDF sent to your email within 24-48 hours</li>
                        <li>Password-protected with digital verification QR code</li>
                        <li>Physical documents follow standard shipping timeline</li>
                        <li>Additional cost: $25 per document set</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-5">
                      <h4 className="font-bold mb-3 text-primary">Direct University Delivery</h4>
                      <p className="text-sm mb-3">Applying to another institution? We ship directly to them:</p>
                      <ul className="space-y-2 text-sm">
                        <li>Documents sent sealed to institution's admissions office</li>
                        <li>University-to-university direct mail service</li>
                        <li>Tracking shared with both you and receiving institution</li>
                        <li>Standard university shipping rates apply</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-lg mb-3">Contact Shipping Department</h4>
                    <p className="mb-4">For questions about shipping, tracking updates, or special requests:</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="mb-2"><strong>Email:</strong> shipping@nscu.govt.ac</p>
                        <p className="mb-2"><strong>Registrar Office:</strong> registrar@nscu.govt.ac</p>
                        <p className="mb-2"><strong>Phone:</strong> +1 (302) 857-6150</p>
                      </div>
                      <div>
                        <p className="mb-2"><strong>Hours:</strong> Mon-Fri, 9 AM - 5 PM EST</p>
                        <p className="mb-2"><strong>Response Time:</strong> Within 24 hours</p>
                        <p><strong>Emergency:</strong> +1 (302) 857-6060</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-bold mb-2">Shipping Guarantee</p>
                    <p className="text-sm">
                      NSCU is committed to secure, timely delivery of your academic credentials. We work with trusted courier 
                      partners and maintain comprehensive tracking systems to ensure your documents reach you safely. Our 
                      shipping department is available to assist you throughout the delivery process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: January 2025 | Version 1.0</p>
              <p>Shipping policy subject to change. International shipping subject to courier availability and country restrictions.</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ShippingPolicy;
