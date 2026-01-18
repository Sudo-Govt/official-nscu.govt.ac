import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Home, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentCode, setPaymentCode] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
        // This uses service role on the server to update payment status
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
      } catch (err: any) {
        console.error('Error processing payment:', err);
        setError('Failed to process payment confirmation. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [applicationId, razorpayPaymentId, razorpayPaymentLinkStatus]);

  const handleCopyCode = async () => {
    if (paymentCode) {
      await navigator.clipboard.writeText(paymentCode);
      toast({
        title: "Copied!",
        description: "Payment code copied to clipboard"
      });
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
            <CardTitle className="text-destructive">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your payment, {studentName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Course</p>
            <p className="font-medium">{courseName}</p>
          </div>

          <div className="bg-muted rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Confirmation Code</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-mono font-bold tracking-wider text-primary">
                {paymentCode}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopyCode}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Please save this code for your records. You will need it for verification.
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to your registered email address.</p>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
