import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, UserPlus, RefreshCw, AlertCircle, CheckCircle, Copy, Trash2, 
  Eye, Lock, Pause, Play, Search, MoreVertical, Key, Trash
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailAppModern from '@/components/email/EmailAppModern';

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

const AdminEmailManagement = () => {
  const { toast } = useToast();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [usersWithoutEmail, setUsersWithoutEmail] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('accounts');
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: string; account: EmailAccount | null }>({
    open: false, type: '', account: null
  });
  const [accessedAccount, setAccessedAccount] = useState<EmailAccount | null>(null);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{ open: boolean; account: EmailAccount | null; newPassword: string }>({
    open: false, account: null, newPassword: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: accounts, error: accountsError } = await supabase
        .from('email_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsError) throw accountsError;
      setEmailAccounts(accounts || []);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, role');

      if (profilesError) throw profilesError;

      const accountUserIds = new Set((accounts || []).map(a => a.user_id));
      const usersWithout = (profiles || []).filter(p => !accountUserIds.has(p.user_id));
      setUsersWithoutEmail(usersWithout);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: "Error", description: "Failed to load email accounts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createEmailAccount = async () => {
    if (!selectedUserId) {
      toast({ title: "Error", description: "Please select a user first", variant: "destructive" });
      return;
    }

    const userProfile = usersWithoutEmail.find(u => u.user_id === selectedUserId);
    if (!userProfile) return;

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-email-account', {
        body: { full_name: userProfile.full_name, user_id: userProfile.user_id }
      });

      if (error) throw error;

      setCreatedCredentials({ email: data.email_address, password: data.password });
      setShowCredentials(true);
      setSelectedUserId('');
      toast({ title: "Success", description: `Email account created: ${data.email_address}` });
      await loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create email account", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const toggleAccountStatus = async (account: EmailAccount) => {
    try {
      const { error } = await supabase
        .from('email_accounts')
        .update({ is_active: !account.is_active })
        .eq('id', account.id);

      if (error) throw error;

      toast({ 
        title: account.is_active ? "Account Suspended" : "Account Activated", 
        description: `${account.email_address} has been ${account.is_active ? 'suspended' : 'activated'}`
      });
      await loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const flushEmails = async (account: EmailAccount) => {
    try {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('user_id', account.user_id);

      if (error) throw error;

      toast({ title: "Emails Flushed", description: `All emails for ${account.email_address} have been deleted` });
      setConfirmDialog({ open: false, type: '', account: null });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteEmailAccount = async (account: EmailAccount) => {
    try {
      // First delete all emails
      await supabase.from('emails').delete().eq('user_id', account.user_id);
      
      // Then delete the account
      const { error } = await supabase
        .from('email_accounts')
        .delete()
        .eq('id', account.id);

      if (error) throw error;

      toast({ title: "Account Deleted", description: `${account.email_address} has been deleted` });
      setConfirmDialog({ open: false, type: '', account: null });
      await loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetPassword = async () => {
    if (!resetPasswordDialog.account) return;
    
    const newPassword = Math.random().toString(36).slice(-12) + 'A1!';
    
    try {
      const { error } = await supabase
        .from('email_accounts')
        .update({ encrypted_password: newPassword })
        .eq('id', resetPasswordDialog.account.id);

      if (error) throw error;

      setResetPasswordDialog({ ...resetPasswordDialog, newPassword });
      toast({ title: "Password Reset", description: "New password has been generated" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  const filteredAccounts = emailAccounts.filter(account =>
    account.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If accessing an account, show the email interface
  if (accessedAccount) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setAccessedAccount(null)}>
              ← Back to Management
            </Button>
            <div>
              <h3 className="font-semibold">Accessing: {accessedAccount.display_name}</h3>
              <p className="text-sm text-muted-foreground">{accessedAccount.email_address}</p>
            </div>
          </div>
          <Badge variant="destructive">Admin Access Mode</Badge>
        </div>
        <EmailAppModern adminUserId={accessedAccount.user_id} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailAccounts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {emailAccounts.filter(a => a.is_active).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Suspended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {emailAccounts.filter(a => !a.is_active).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Pending Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{usersWithoutEmail.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search email accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Accounts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quota</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.display_name}</TableCell>
                      <TableCell>{account.email_address}</TableCell>
                      <TableCell>
                        <Badge variant={account.is_active ? "default" : "secondary"}>
                          {account.is_active ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.quota_mb} MB</TableCell>
                      <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setAccessedAccount(account)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Access Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleAccountStatus(account)}>
                              {account.is_active ? (
                                <><Pause className="h-4 w-4 mr-2" />Suspend Account</>
                              ) : (
                                <><Play className="h-4 w-4 mr-2" />Activate Account</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetPasswordDialog({ open: true, account, newPassword: '' })}>
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setConfirmDialog({ open: true, type: 'flush', account })}
                              className="text-orange-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Flush All Emails
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setConfirmDialog({ open: true, type: 'delete', account })}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New Email Account
              </CardTitle>
              <CardDescription>
                Create @nscu.govt.ac email accounts for users who don't have one yet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {usersWithoutEmail.length > 0 ? (
                <>
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
                    <Button onClick={createEmailAccount} disabled={creating || !selectedUserId}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {creating ? 'Creating...' : 'Create Email Account'}
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      Users Without Email ({usersWithoutEmail.length})
                    </h4>
                    <div className="grid gap-2 max-h-80 overflow-auto">
                      {usersWithoutEmail.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUserId(user.user_id);
                              createEmailAccount();
                            }}
                            disabled={creating}
                          >
                            Create
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                  <p>All users have email accounts!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Credentials Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Account Created!</DialogTitle>
            <DialogDescription>
              Share these credentials with the user securely.
            </DialogDescription>
          </DialogHeader>
          {createdCredentials && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-background rounded border text-sm">
                      {createdCredentials.email}
                    </code>
                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(createdCredentials.email)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Temporary Password</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-background rounded border text-sm font-mono">
                      {createdCredentials.password}
                    </code>
                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(createdCredentials.password)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowCredentials(false)} className="w-full">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'flush' ? 'Flush All Emails?' : 'Delete Email Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'flush' 
                ? `This will permanently delete all emails (inbox, sent, drafts, trash) for ${confirmDialog.account?.email_address}. This action cannot be undone.`
                : `This will permanently delete the email account ${confirmDialog.account?.email_address} and all associated emails. This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog.type === 'flush' && confirmDialog.account) {
                  flushEmails(confirmDialog.account);
                } else if (confirmDialog.type === 'delete' && confirmDialog.account) {
                  deleteEmailAccount(confirmDialog.account);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {confirmDialog.type === 'flush' ? 'Flush All Emails' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog.open} onOpenChange={(open) => setResetPasswordDialog({ ...resetPasswordDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Generate a new password for {resetPasswordDialog.account?.email_address}
            </DialogDescription>
          </DialogHeader>
          {resetPasswordDialog.newPassword ? (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <label className="text-xs text-muted-foreground">New Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-background rounded border text-sm font-mono">
                    {resetPasswordDialog.newPassword}
                  </code>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(resetPasswordDialog.newPassword)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => setResetPasswordDialog({ open: false, account: null, newPassword: '' })} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetPasswordDialog({ open: false, account: null, newPassword: '' })}>
                Cancel
              </Button>
              <Button onClick={resetPassword}>Generate New Password</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailManagement;
