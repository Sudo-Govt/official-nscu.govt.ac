import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, UserPlus, RefreshCw, AlertCircle, CheckCircle, Copy, Wifi } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  display_name: string;
  quota_mb: number;
  is_active: boolean;
  created_at: string;
  last_synced_at: string | null;
  cpanel_account_created: boolean;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
}

const EmailAccountManagement = () => {
  const { toast } = useToast();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [usersWithoutEmail, setUsersWithoutEmail] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all email accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('email_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsError) throw accountsError;
      setEmailAccounts(accounts || []);

      // Load all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, role')
        .neq('role', 'superadmin'); // Don't create emails for superadmins

      if (profilesError) throw profilesError;

      // Filter users who don't have email accounts
      const accountUserIds = new Set((accounts || []).map(a => a.user_id));
      const usersWithout = (profiles || []).filter(p => !accountUserIds.has(p.user_id));
      setUsersWithoutEmail(usersWithout);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load email accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmailAccountFromDropdown = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive"
      });
      return;
    }

    const userProfile = usersWithoutEmail.find(u => u.user_id === selectedUserId);
    if (!userProfile) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive"
      });
      return;
    }

    await createEmailAccount(userProfile);
  };

  const createEmailAccount = async (userProfile: UserProfile) => {
    setCreating(true);
    setSelectedUser(userProfile);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-email-account', {
        body: {
          full_name: userProfile.full_name,
          user_id: userProfile.user_id
        }
      });

      if (error) throw error;

      setCreatedCredentials({
        email: data.email_address,
        password: data.password
      });
      setShowCredentials(true);
      setSelectedUserId(''); // Reset selection

      toast({
        title: "Success",
        description: `Email account created: ${data.email_address}`,
      });

      await loadData();

    } catch (error: any) {
      console.error('Error creating email account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create email account",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const testSmtpConnection = async (accountId: string) => {
    setTestingConnection(accountId);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: { email_account_id: accountId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Connection Test Successful",
          description: data.message,
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: data.results?.error_details || data.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error testing SMTP:', error);
      toast({
        title: "Test Failed",
        description: error.message || "Failed to test SMTP connection",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Email Account Management</CardTitle>
                <CardDescription>
                  Create and manage @nscu.govt.ac email accounts for users
                </CardDescription>
              </div>
            </div>
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Email Form */}
          {usersWithoutEmail.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Create New Email Account</CardTitle>
                <CardDescription>Select a user to create their @nscu.govt.ac email account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {usersWithoutEmail.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.full_name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={createEmailAccountFromDropdown}
                    disabled={creating || !selectedUserId}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {creating ? 'Creating...' : 'Create Email'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailAccounts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {emailAccounts.filter(a => a.is_active).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {usersWithoutEmail.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users without email */}
          {usersWithoutEmail.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Users Without Email Accounts ({usersWithoutEmail.length})
              </h3>
              <div className="space-y-2">
                {usersWithoutEmail.map((user) => (
                  <Card key={user.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                        </div>
                        <Button
                          onClick={() => createEmailAccount(user)}
                          disabled={creating}
                          size="sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {creating && selectedUser?.id === user.id ? 'Creating...' : 'Create Email'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Existing email accounts */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Email Accounts ({emailAccounts.length})
            </h3>
            <div className="space-y-2">
              {emailAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{account.display_name}</span>
                          <Badge variant={account.is_active ? "default" : "secondary"}>
                            {account.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {account.cpanel_account_created && (
                            <Badge variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              cPanel Created
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {account.email_address}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Quota: {account.quota_mb} MB
                          {account.last_synced_at && (
                            <> • Last synced: {new Date(account.last_synced_at).toLocaleString()}</>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => testSmtpConnection(account.id)}
                        disabled={testingConnection === account.id}
                        size="sm"
                        variant="outline"
                      >
                        <Wifi className="h-4 w-4 mr-2" />
                        {testingConnection === account.id ? 'Testing...' : 'Test Connection'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Account Created Successfully!</DialogTitle>
            <DialogDescription>
              Share these credentials with the user. They should change the password immediately after first login.
            </DialogDescription>
          </DialogHeader>
          
          {createdCredentials && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Email Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-background rounded border text-sm">
                      {createdCredentials.email}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(createdCredentials.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Temporary Password</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-background rounded border text-sm font-mono">
                      {createdCredentials.password}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(createdCredentials.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>⚠️ <strong>Important:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Copy these credentials now - they won't be shown again</li>
                  <li>User should change the password after first login</li>
                  <li>Email can be accessed from the dashboard</li>
                </ul>
              </div>

              <Button onClick={() => setShowCredentials(false)} className="w-full">
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailAccountManagement;
