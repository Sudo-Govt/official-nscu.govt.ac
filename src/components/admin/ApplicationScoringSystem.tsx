import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Clock,
  Award
} from 'lucide-react';

interface Application {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  course_id: string;
  status: string;
  created_at: string;
  academic_documents: any;
  previous_education: any;
  review_notes?: string;
  application_score?: number;
  scoring_breakdown?: any;
  courses?: {
    course_name: string;
    college: string;
  };
}

interface ScoringCriteria {
  academic_performance: number;
  english_proficiency: number;
  work_experience: number;
  extracurricular: number;
  personal_statement: number;
  recommendation_letters: number;
}

const ApplicationScoringSystem = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [scoring, setScoring] = useState<ScoringCriteria>({
    academic_performance: 0,
    english_proficiency: 0,
    work_experience: 0,
    extracurricular: 0,
    personal_statement: 0,
    recommendation_letters: 0
  });
  const [reviewNotes, setReviewNotes] = useState('');
  const [finalDecision, setFinalDecision] = useState('');
  const [scoringDialogOpen, setScoringDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('student_applications')
        .select(`
          *,
          courses (course_name, college)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    }
  };

  const handleScoreApplication = (application: Application) => {
    setSelectedApplication(application);
    
    // Load existing scoring if available
    if (application.scoring_breakdown) {
      setScoring(application.scoring_breakdown);
    } else {
      setScoring({
        academic_performance: 0,
        english_proficiency: 0,
        work_experience: 0,
        extracurricular: 0,
        personal_statement: 0,
        recommendation_letters: 0
      });
    }
    
    setReviewNotes(application.review_notes || '');
    setFinalDecision(application.status);
    setScoringDialogOpen(true);
  };

  const calculateTotalScore = () => {
    return Object.values(scoring).reduce((sum, score) => sum + score, 0);
  };

  const getScoreGrade = (score: number) => {
    if (score >= 85) return { grade: 'A+', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 75) return { grade: 'A', color: 'bg-green-400', textColor: 'text-green-600' };
    if (score >= 65) return { grade: 'B+', color: 'bg-blue-500', textColor: 'text-blue-600' };
    if (score >= 55) return { grade: 'B', color: 'bg-blue-400', textColor: 'text-blue-500' };
    if (score >= 45) return { grade: 'C', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { grade: 'F', color: 'bg-red-500', textColor: 'text-red-600' };
  };

  const submitScoring = async () => {
    if (!selectedApplication) return;

    try {
      const totalScore = calculateTotalScore();
      
        const { error } = await supabase
          .from('student_applications')
          .update({
            application_score: totalScore,
            scoring_breakdown: scoring as any,
            review_notes: reviewNotes,
            status: finalDecision,
            reviewed_at: new Date().toISOString(),
            reviewed_by: (await supabase.auth.getUser()).data.user?.id
          })
          .eq('id', selectedApplication.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application scoring submitted successfully"
      });

      setScoringDialogOpen(false);
      setSelectedApplication(null);
      await fetchApplications();
    } catch (error) {
      console.error('Error submitting scoring:', error);
      toast({
        title: "Error",
        description: "Failed to submit application scoring",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'scored') return app.application_score !== null;
    if (filter === 'unscored') return app.application_score === null;
    return app.status === filter;
  });

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Under Review</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Application Scoring System</CardTitle>
                <CardDescription>Review and score student applications with detailed criteria</CardDescription>
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter applications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="unscored">Unscored</SelectItem>
                <SelectItem value="scored">Scored</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const scoreInfo = application.application_score ? getScoreGrade(application.application_score) : null;
              
              return (
                <div key={application.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {application.first_name} {application.last_name}
                        </h3>
                        {getStatusBadge(application.status, application.application_score)}
                        {application.application_score && (
                          <Badge variant="outline" className={`${scoreInfo?.textColor} border-current`}>
                            <Star className="h-3 w-3 mr-1" />
                            {application.application_score}/100 ({scoreInfo?.grade})
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <p><strong>Application #:</strong> {application.application_number}</p>
                          <p><strong>Email:</strong> {application.email}</p>
                        </div>
                        <div>
                          <p><strong>Course:</strong> {application.courses?.course_name || 'N/A'}</p>
                          <p><strong>College:</strong> {application.courses?.college || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{Array.isArray(application.academic_documents) ? application.academic_documents.length : 0} documents</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Submitted {new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {application.application_score ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleScoreApplication(application)}
                          className="gap-2"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Re-evaluate
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleScoreApplication(application)}
                          className="gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Score Application
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No applications found for the selected filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={scoringDialogOpen} onOpenChange={setScoringDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Score Application - {selectedApplication?.first_name} {selectedApplication?.last_name}
            </DialogTitle>
            <DialogDescription>
              Evaluate each criterion on a scale of 0-20 points. Total score will be calculated automatically.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Application Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Application #:</strong> {selectedApplication.application_number}</p>
                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                      <p><strong>Course:</strong> {selectedApplication.courses?.course_name}</p>
                    </div>
                    <div>
                      <p><strong>Documents:</strong> {Array.isArray(selectedApplication.academic_documents) ? selectedApplication.academic_documents.length : 0} uploaded</p>
                      <p><strong>Education History:</strong> {Array.isArray(selectedApplication.previous_education) ? selectedApplication.previous_education.length : 0} entries</p>
                      <p><strong>Submitted:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scoring Criteria */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Scoring Criteria (0-20 points each)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Academic Performance (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.academic_performance}
                        onChange={(e) => setScoring({...scoring, academic_performance: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">GPA, grades, academic achievements</p>
                    </div>

                    <div className="space-y-2">
                      <Label>English Proficiency (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.english_proficiency}
                        onChange={(e) => setScoring({...scoring, english_proficiency: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">IELTS/TOEFL scores, language certificates</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Work Experience (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.work_experience}
                        onChange={(e) => setScoring({...scoring, work_experience: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">Relevant work experience and internships</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Extracurricular Activities (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.extracurricular}
                        onChange={(e) => setScoring({...scoring, extracurricular: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">Leadership, volunteering, competitions</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Personal Statement (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.personal_statement}
                        onChange={(e) => setScoring({...scoring, personal_statement: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">Quality of essay, motivation, goals</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Recommendation Letters (0-20)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={scoring.recommendation_letters}
                        onChange={(e) => setScoring({...scoring, recommendation_letters: Math.max(0, Math.min(20, parseInt(e.target.value) || 0))})}
                      />
                      <p className="text-xs text-muted-foreground">Quality and credibility of references</p>
                    </div>
                  </div>

                  {/* Total Score Display */}
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total Score:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">{calculateTotalScore()}/100</span>
                        <Badge className={`${getScoreGrade(calculateTotalScore()).color} text-white text-lg px-3 py-1`}>
                          {getScoreGrade(calculateTotalScore()).grade}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              <div className="space-y-2">
                <Label>Review Notes</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add detailed review notes, feedback, and recommendations..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Final Decision */}
              <div className="space-y-2">
                <Label>Final Decision</Label>
                <Select value={finalDecision} onValueChange={setFinalDecision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select final decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">✅ Approved</SelectItem>
                    <SelectItem value="rejected">❌ Rejected</SelectItem>
                    <SelectItem value="pending">⏳ Pending (Need More Info)</SelectItem>
                    <SelectItem value="waitlist">📋 Waitlist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setScoringDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitScoring}>
                  Submit Scoring & Decision
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationScoringSystem;