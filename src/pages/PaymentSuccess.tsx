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
  const razorpayPaymentLinkId = searchParams.get('razorpay_payment_link_id');
  const razorpayPaymentLinkStatus = searchParams.get('razorpay_payment_link_status');

  useEffect(() => {
    const processPayment = async () => {
      if (!applicationId) {
        setError('Invalid payment link. Application ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // First, fetch the application to check current status
        const { data: application, error: fetchError } = await supabase
          .from('student_applications')
          .select(`
            id,
            first_name,
            last_name,
            payment_status,
            payment_code,
            course:courses(course_name)
          `)
          .eq('id', applicationId)
          .single();

        if (fetchError) throw fetchError;

        if (!application) {
          setError('Application not found.');
          setLoading(false);
          return;
        }

        setStudentName(`${application.first_name} ${application.last_name}`);
        setCourseName((application.course as any)?.course_name || 'N/A');

        // If payment already completed, show existing code
        if (application.payment_status === 'completed' && application.payment_code) {
          setPaymentCode(application.payment_code);
          setLoading(false);
          return;
        }

        // Generate new payment code and update application
        const { data: codeData, error: codeError } = await supabase
          .rpc('generate_payment_code');

        if (codeError) throw codeError;

        const newPaymentCode = codeData as string;

        // Update application with payment details
        const { error: updateError } = await supabase
          .from('student_applications')
          .update({
            payment_status: 'completed',
            payment_code: newPaymentCode,
            payment_completed_at: new Date().toISOString(),
            status: 'enrolled' // Auto-enroll after payment
          })
          .eq('id', applicationId);

        if (updateError) throw updateError;

        setPaymentCode(newPaymentCode);
      } catch (err: any) {
        console.error('Error processing payment:', err);
        setError('Failed to process payment confirmation. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [applicationId]);

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
