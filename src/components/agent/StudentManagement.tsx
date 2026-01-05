import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Search, Filter, Upload, Eye, Edit, FileText, Calendar, Trash2, MessageSquare, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import MessageDialog from './MessageDialog';

interface StudentApplication {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string;
  status: string;
  admission_year: number;
  admission_month: number;
  created_at: string;
  course: {
    course_name: string;
    degree_type: string;
    college: string;
  };
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  degree_type: string;
  college: string;
  fee_structure: any;
}

const StudentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
  const [generatingPaymentLink, setGeneratingPaymentLink] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchCourses();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) return;

      const { data, error } = await supabase
        .from('student_applications')
        .select(`
          *,
          course:courses(course_name, degree_type, college)
        `)
        .eq('agent_id', agentProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load student applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('course_name');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('student_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application deleted successfully"
      });

      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = (application: StudentApplication) => {
    setSelectedApplication(application);
    setShowMessageDialog(true);
  };

  const handleGeneratePaymentLink = async (application: StudentApplication) => {
    setGeneratingPaymentLink(application.id);
    
    try {
      // Find the course to get fee structure
      const course = courses.find(c => c.course_name === application.course?.course_name);
      const feeStructure = course?.fee_structure;
      
      // Calculate application fee from course fee_structure or use default $1500 USD
      let amount = 1500; // Default application fee in USD
      if (feeStructure && typeof feeStructure === 'object') {
        const fees = feeStructure as Record<string, any>;
        // Try different fee field names that might be in the structure
        if (fees.application_fee_usd) {
          amount = parseFloat(fees.application_fee_usd);
        } else if (fees.applicationFee) {
          amount = parseFloat(fees.applicationFee);
        } else if (fees.application_fee) {
          amount = parseFloat(fees.application_fee);
        } else if (fees.tuition_usd) {
          amount = parseFloat(fees.tuition_usd);
        } else if (fees.Online) {
          // If using delivery mode based fees, use Online as reference
          amount = parseFloat(fees.Online);
        }
      }

      const response = await supabase.functions.invoke('create-razorpay-payment', {
        body: {
          amount,
          currency: 'USD',
          customer_name: `${application.first_name} ${application.last_name}`,
          customer_email: application.email,
          customer_phone: application.phone || '',
          course_id: course?.id,
          application_id: application.id,
          description: `Application fee for ${application.course?.course_name || 'admission'}`
        }
      });

      if (response.error) throw response.error;
      
      const paymentData = response.data;
      
      if (paymentData.payment_link_url) {
        // Copy to clipboard
        await navigator.clipboard.writeText(paymentData.payment_link_url);
        toast({
          title: "Payment Link Created",
          description: "Payment link copied to clipboard! Share with the student."
        });
        
        // Optionally open in new tab
        window.open(paymentData.payment_link_url, '_blank');
      } else {
        throw new Error('No payment link received');
      }
    } catch (error: any) {
      console.error('Error generating payment link:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate payment link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingPaymentLink(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'enrolled': return 'default';
      case 'submitted': return 'secondary';
      case 'pending': return 'secondary';
      case 'in_review': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div>Loading student applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Management</h2>
          <p className="text-muted-foreground">Manage student applications and enrollment</p>
        </div>
        <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student Application</DialogTitle>
              <DialogDescription>
                Create a new student application with their details
              </DialogDescription>
            </DialogHeader>
            <AddStudentForm 
              courses={courses} 
              onSuccess={() => {
                setShowAddStudent(false);
                fetchApplications();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Applications</CardTitle>
                  <CardDescription>
                    {applications.length} total applications
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application #</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Intake</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono text-sm">
                        {app.application_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {app.first_name} {app.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {app.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.course?.course_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.course?.college}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(app.admission_year, app.admission_month - 1), 'MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(app.status)}>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(app.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Documents">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendMessage(app)}
                              title="Send Message"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            {(app.status === 'pending' || app.status === 'accepted') && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleGeneratePaymentLink(app)}
                                disabled={generatingPaymentLink === app.id}
                                title="Generate Payment Link"
                                className="text-green-600 hover:text-green-700"
                              >
                                {generatingPaymentLink === app.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CreditCard className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {(app.status !== 'accepted' && app.status !== 'enrolled') && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteApplication(app.id)}
                                className="text-destructive hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No applications match your filters'
                      : 'No student applications yet'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Students</CardTitle>
              <CardDescription>
                Upload multiple student applications using CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and Excel files up to 10MB
                  </p>
                </div>
                <Button className="mt-4">
                  Choose File
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Download Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download our CSV template with all required fields
                    </p>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Download CSV Template
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      View your previous bulk upload sessions
                    </p>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-green-600">+20% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-sm text-green-600">Above average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-sm text-green-600">Excellent</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedApplication && (
        <MessageDialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          application={selectedApplication}
          onMessageSent={() => {
            // Optionally refresh data or show success
            toast({
              title: "Success",
              description: "Message sent successfully"
            });
          }}
        />
      )}
    </div>
  );
};

// Add Student Form Component
const AddStudentForm = ({ courses, onSuccess }: { courses: Course[], onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    passport_number: '',
    address: '',
    course_id: '',
    admission_year: new Date().getFullYear(),
    admission_month: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('user_id', user.user_id)
        .single();

      if (!agentProfile) throw new Error('Agent profile not found');

      // Get the selected course name for program field
      const selectedCourse = courses.find(c => c.id === formData.course_id);
      const programName = selectedCourse?.course_name || 'Unknown Program';

      const { error } = await supabase
        .from('student_applications')
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            full_name: `${formData.first_name} ${formData.last_name}`,
            email: formData.email,
            phone: formData.phone,
            nationality: formData.nationality,
            course_id: formData.course_id,
            program: programName,
            admission_year: formData.admission_year,
            admission_month: formData.admission_month,
            agent_id: agentProfile.id,
            // Store extra fields in JSON so we don't depend on schema columns
            application_data: {
              date_of_birth: formData.date_of_birth,
              passport_number: formData.passport_number,
              address: formData.address,
            },
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student application created successfully"
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: "Error",
        description: "Failed to create student application",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            required
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          />
        </div>
        <div>
          <Label>Nationality</Label>
          <Input
            required
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Passport Number</Label>
        <Input
          value={formData.passport_number}
          onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div>
        <Label>Course</Label>
        <Select 
          value={formData.course_id} 
          onValueChange={(value) => setFormData({ ...formData, course_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.course_name} - {course.college}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Admission Year</Label>
          <Select 
            value={formData.admission_year.toString()} 
            onValueChange={(value) => setFormData({ ...formData, admission_year: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: new Date().getFullYear() + 2 - 1980 + 1 }, (_, i) => 1980 + i)
                .reverse()
                .map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Admission Intake</Label>
          <Select 
            value={formData.admission_month.toString()} 
            onValueChange={(value) => setFormData({ ...formData, admission_month: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select intake" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">Fall Intake (August/September)</SelectItem>
              <SelectItem value="1">Spring Intake (January)</SelectItem>
              <SelectItem value="5">Summer Intake (May/June)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Application'}
        </Button>
      </div>
    </form>
  );
};

export default StudentManagement;