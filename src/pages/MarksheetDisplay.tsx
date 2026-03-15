import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { XCircle, ShieldCheck, Search, Download } from "lucide-react";

interface StudentResult {
  id: string;
  student_name: string;
  enrollment_number: string;
  grade_level: string | null;
  examination: string;
  session: string;
  result_html: string;
  marksheet_html: string | null;
  certificate_id: string | null;
}

const MarksheetDisplay = () => {
  const { resultId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [searchText, setSearchText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const searchString = "Searching NSCU Verification Ledger...";

  useEffect(() => {
    if (resultId) fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const { data, error } = await supabase
        .from("student_results")
        .select("*")
        .eq("id", resultId)
        .single();
      if (error) throw error;
      setResult(data as any);
    } catch {
      // result stays null
    }
    startTypingAnimation();
  };

  const startTypingAnimation = () => {
    let index = 0;
    const interval = setInterval(() => {
      setSearchText(searchString.slice(0, index + 1));
      index++;
      if (index >= searchString.length) {
        clearInterval(interval);
        setTypingDone(true);
        setTimeout(() => { setShowResult(true); setLoading(false); }, 2500);
      }
    }, 120);
  };

  const handleDownloadMarksheet = () => {
    const html = result?.marksheet_html || result?.result_html;
    if (!html) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <Search className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="font-mono text-sm">
            {searchText}
            {!typingDone && <span className="animate-pulse">|</span>}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> NFC Verified — Secure Document Access
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
            <h2 className="text-xl font-semibold mb-2">Marksheet Not Found</h2>
            <p className="text-muted-foreground">The marksheet you're looking for could not be verified.</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Verified — {result.student_name}
              </span>
            </div>
            <Button variant="outline" onClick={handleDownloadMarksheet}>
              <Download className="h-4 w-4 mr-2" /> Print / Download
            </Button>
          </div>

          <Card className="p-0 overflow-hidden">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.marksheet_html || result.result_html || "") }}
            />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarksheetDisplay;
