import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Clock, CheckCircle, AlertCircle, Plus, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AlumniDocuments = () => {
  const { user } = useAuth();
  const [documentRequests, setDocumentRequests] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRequestingDocument, setIsRequestingDocument] = useState(false);

  const [requestForm, setRequestForm] = useState({
    document_type: '',
    purpose: '',
    delivery_method: '',
    delivery_address: '',
    quantity: 1,
    urgent: false,
    notes: ''
  });

  useEffect(() => {
    fetchDocumentRequests();
    fetchCredentials();
  }, []);

  const fetchDocumentRequests = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('alumni_document_requests')
        .select('*')
        .eq('requester_id', user.user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document requests:', error);
        return;
      }

      setDocumentRequests(data || []);
    } catch (error) {
      console.error('Error fetching document requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredentials = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('alumni_credentials')
        .select('*')
        .eq('user_id', user.user_id)
        .order('issue_date', { ascending: false });

      if (error) {
        console.error('Error fetching credentials:', error);
        return;
      }

      setCredentials(data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const handleRequestDocument = async () => {
    if (!user?.user_id) return;

    try {
      const { error } = await supabase
        .from('alumni_document_requests')
        .insert([{
          ...requestForm,
          requester_id: user.user_id
        }]);

      if (error) throw error;

      toast.success('Document request submitted successfully!');
      setIsRequestingDocument(false);
      setRequestForm({
        document_type: '',
        purpose: '',
        delivery_method: '',
        delivery_address: '',
        quantity: 1,
        urgent: false,
        notes: ''
      });
      fetchDocumentRequests();
    } catch (error) {
      console.error('Error requesting document:', error);
      toast.error('Failed to submit document request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'ready':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'ready':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Request Document Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Services</h2>
          <p className="text-muted-foreground">Request transcripts, certificates, and verify credentials</p>
        </div>
        <Dialog open={isRequestingDocument} onOpenChange={setIsRequestingDocument}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Academic Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Document Type</Label>
                  <Select value={requestForm.document_type} onValueChange={(value) => setRequestForm({...requestForm, document_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transcript">Official Transcript</SelectItem>
                      <SelectItem value="degree_certificate">Degree Certificate</SelectItem>
                      <SelectItem value="enrollment_verification">Enrollment Verification</SelectItem>
                      <SelectItem value="grade_report">Grade Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Delivery Method</Label>
                  <Select value={requestForm.delivery_method} onValueChange={(value) => setRequestForm({...requestForm, delivery_method: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital/Email</SelectItem>
                      <SelectItem value="physical">Physical Mail</SelectItem>
                      <SelectItem value="both">Both Digital & Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={requestForm.purpose}
                  onChange={(e) => setRequestForm({...requestForm, purpose: e.target.value})}
                  placeholder="Employment verification, graduate school application, etc."
                />
              </div>

              <div>
                <Label htmlFor="delivery-address">Delivery Address (if physical)</Label>
                <Textarea
                  id="delivery-address"
                  value={requestForm.delivery_address}
                  onChange={(e) => setRequestForm({...requestForm, delivery_address: e.target.value})}
                  placeholder="Full mailing address for physical delivery"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({...requestForm, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={requestForm.urgent}
                    onChange={(e) => setRequestForm({...requestForm, urgent: e.target.checked})}
                  />
                  <Label htmlFor="urgent">Rush processing (+$25)</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                  placeholder="Any special instructions or requirements"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRequestingDocument(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestDocument}>
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Document Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {documentRequests.length > 0 ? (
            <div className="space-y-4">
              {documentRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <h4 className="font-semibold capitalize">
                          {request.document_type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {request.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.urgent && (
                        <Badge variant="destructive" className="ml-2">
                          Rush
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <strong>Requested:</strong> {new Date(request.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Delivery:</strong> {request.delivery_method}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {request.quantity}
                    </div>
                    {request.estimated_delivery && (
                      <div>
                        <strong>Est. Delivery:</strong> {new Date(request.estimated_delivery).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {request.admin_notes && (
                    <div className="bg-muted/50 rounded p-3 mb-3">
                      <p className="text-sm">
                        <strong>Admin Notes:</strong> {request.admin_notes}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {request.status === 'ready' && (
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Document Requests</h3>
              <p className="text-muted-foreground mb-4">
                Request official transcripts, certificates, and other academic documents
              </p>
              <Button onClick={() => setIsRequestingDocument(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Request Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials Vault */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          {credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{credential.title}</h4>
                    <Badge variant={credential.is_verified ? "default" : "secondary"}>
                      {credential.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  
                  {credential.description && (
                    <p className="text-sm text-muted-foreground">
                      {credential.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Issued: {new Date(credential.issue_date).toLocaleDateString()}</p>
                    {credential.verification_count > 0 && (
                      <p>Verified {credential.verification_count} times</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Digital Credentials</h3>
              <p className="text-muted-foreground">
                Your verified digital certificates and credentials will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Degree Attestation</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get your degree attested for international use
            </p>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Equivalency Check</h3>
            <p className="text-sm text-muted-foreground mb-3">
              AI-powered credential equivalency verification
            </p>
            <Button variant="outline" size="sm">
              Check Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Download className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">LinkedIn Integration</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Share verified credentials on LinkedIn
            </p>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlumniDocuments;