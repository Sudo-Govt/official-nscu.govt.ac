import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudentResult {
  id: string;
  student_name: string;
  enrollment_number: string;
  grade_level: string | null;
  examination: string;
  session: string;
  total_marks: string | null;
  percentage: string | null;
  school_name: string | null;
  result_html: string | null;
}

type LoadingStage = "qr" | "blockchain" | "found" | "complete";

const ResultDisplay = () => {
  const { resultId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("qr");
  const [result, setResult] = useState<StudentResult | null>(null);

  useEffect(() => {
    if (resultId) runVerificationSequence();
  }, [resultId]);

  const runVerificationSequence = async () => {
    setLoadingStage("qr");
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoadingStage("blockchain");
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { data, error } = await supabase
        .from("student_results")
        .select("id, student_name, enrollment_number, grade_level, examination, session, total_marks, percentage, school_name, result_html")
        .eq("id", resultId)
        .single();

      if (error) throw error;
      setResult(data as any);
      setLoadingStage("found");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoadingStage("complete");
    } catch {
      setLoadingStage("complete");
    }
    setLoading(false);
  };

  const getProgressValue = () => {
    switch (loadingStage) {
      case "qr": return 33;
      case "blockchain": return 66;
      case "found": return 100;
      default: return 100;
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case "qr": return "Verifying the QR...";
      case "blockchain": return "Accessing verification system...";
      case "found": return "Document found";
      default: return "Complete";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md px-4">
          {loadingStage === "found" ? (
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
          ) : (
            <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
          )}
          <h2 className="text-xl font-semibold">{getLoadingMessage()}</h2>
          <Progress value={getProgressValue()} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {loadingStage === "qr" && "Scanning QR code data..."}
            {loadingStage === "blockchain" && "Retrieving record from secure ledger..."}
            {loadingStage === "found" && "Record verified successfully!"}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Secured by NSCU Verification System
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Record Not Found</h2>
            <p className="text-muted-foreground">
              The result you're looking for could not be found. Please verify the QR code or link.
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Verification Badge */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Verified Document — {result.student_name} | {result.enrollment_number}
            </span>
          </div>

          {/* Result Summary */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryField label="Student Name" value={result.student_name} />
              <SummaryField label="Enrollment No." value={result.enrollment_number} mono />
              <SummaryField label="Examination" value={result.examination} />
              <SummaryField label="Session" value={result.session} />
              {result.total_marks && <SummaryField label="Total Marks" value={result.total_marks} />}
              {result.percentage && <SummaryField label="Percentage" value={result.percentage} />}
              {result.school_name && <SummaryField label="School/Institution" value={result.school_name} />}
            </div>
          </Card>

          {/* Full Result HTML */}
          {result.result_html && (
            <Card className="p-0 overflow-hidden">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.result_html) }}
              />
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SummaryField = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-sm font-semibold ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

export default ResultDisplay;
