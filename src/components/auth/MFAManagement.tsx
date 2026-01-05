import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import MFAEnroll from './MFAEnroll';

const MFAManagement: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const totpFactor = data?.totp?.[0];
      if (totpFactor && totpFactor.status === 'verified') {
        setIsEnabled(true);
        setFactorId(totpFactor.id);
      } else {
        setIsEnabled(false);
        setFactorId(null);
      }
    } catch (err: any) {
      console.error('Error checking MFA status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollSuccess = () => {
    setShowEnroll(false);
    checkMFAStatus();
  };

  const handleDisable = async () => {
    if (!factorId) return;
    
    setIsDisabling(true);
    setError('');

    try {
      // First verify the password
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('User not found');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: disablePassword
      });

      if (signInError) throw new Error('Invalid password');

      // Unenroll the factor
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId
      });

      if (unenrollError) throw unenrollError;

      toast.success('Two-factor authentication disabled');
      setShowDisableDialog(false);
      setDisablePassword('');
      checkMFAStatus();
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setIsDisabling(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (showEnroll) {
    return (
      <MFAEnroll
        onSuccess={handleEnrollSuccess}
        onCancel={() => setShowEnroll(false)}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account using an authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-3">
              {isEnabled ? (
                <ShieldCheck className="h-8 w-8 text-green-600" />
              ) : (
                <ShieldOff className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">
                  {isEnabled ? '2FA is enabled' : '2FA is not enabled'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isEnabled 
                    ? 'Your account is protected with two-factor authentication' 
                    : 'Enable 2FA for enhanced account security'}
                </p>
              </div>
            </div>
            {isEnabled ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDisableDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disable
              </Button>
            ) : (
              <Button onClick={() => setShowEnroll(true)}>
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Supported authenticator apps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Google Authenticator</li>
              <li>Microsoft Authenticator</li>
              <li>Authy</li>
              <li>1Password</li>
              <li>Any TOTP-compatible app</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your password to confirm disabling 2FA. This will make your account less secure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disablePassword">Password</Label>
              <Input
                id="disablePassword"
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDisableDialog(false);
                  setDisablePassword('');
                  setError('');
                }}
                disabled={isDisabling}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDisable}
                disabled={!disablePassword || isDisabling}
              >
                {isDisabling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  'Disable 2FA'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MFAManagement;
