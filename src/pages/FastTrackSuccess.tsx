import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ExternalLink, Loader2, Zap, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FastTrackSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentCode, setPaymentCode] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const applicationId = searchParams.get('application_id');
  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const razorpayPaymentLinkStatus = searchParams.get('razorpay_payment_link_status');

  useEffect(() => {
    const processPayment = async () => {
      if (!applicationId) {
        setError('Invalid payment link. Application ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // Call the secure edge function to confirm payment
        const { data, error: fnError } = await supabase.functions.invoke('confirm-payment', {
          body: {
            application_id: applicationId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_payment_link_status: razorpayPaymentLinkStatus,
          },
        });

        if (fnError) {
          console.error('Payment confirmation error:', fnError);
          setError('Failed to process payment confirmation. Please contact support.');
          setLoading(false);
          return;
        }

        if (data?.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        setPaymentCode(data.payment_code);
        setStudentName(data.student_name);
        setCourseName(data.course_name);
        setFeeAmount(data.fee_amount || 0);
      } catch (err: any) {
        console.error('Error processing payment:', err);
        setError('Failed to process payment confirmation. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [applicationId, razorpayPaymentId, razorpayPaymentLinkStatus]);

  const handleDownloadReceipt = async () => {
    if (!applicationId) return;

    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { application_id: applicationId },
      });

      if (error) throw error;

      if (data?.html) {
        // Open printable receipt
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(data.html);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (err: any) {
      console.error('Error generating receipt:', err);
      toast({
        title: 'Error',
        description: 'Failed to generate receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              If you believe this is an error, please contact our support team.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact-us">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mx-auto mb-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Fast Track Admission</span>
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base">
            Thank you for your payment, {studentName}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="text-center bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Course Enrolled</p>
            <p className="font-semibold text-lg">{courseName}</p>
            {feeAmount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">Amount Paid: US$ {feeAmount.toLocaleString()}</p>
            )}
          </div>

          {/* Confirmation Code */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Confirmation Code</p>
            <div className="text-3xl font-mono font-bold tracking-wider text-primary">
              {paymentCode}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Please save this code for your records
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-accent/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
            <p className="text-sm text-muted-foreground">
              One of our Student Service Officers will get in touch with you within the next <strong>48 hours</strong> to guide you through the next steps of your Fast Track program.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              className="w-full"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Receipt...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Fee Receipt
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="w-full"
            >
              <a 
                href="https://nscu.govt.ac/students_work" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse Student Articles
              </a>
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground">
            A confirmation email has been sent to your registered email address.
            You may close this window after downloading your receipt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FastTrackSuccess;
