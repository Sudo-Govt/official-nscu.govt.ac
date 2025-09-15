import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Download, DollarSign, Globe, Upload } from 'lucide-react';
import ChangePassword from '@/components/ChangePassword';

interface AgentProfile {
  id: string;
  agent_id: string;
  kyc_status: string;
  accreditation_certificate_url?: string;
  commission_rate: number;
  total_earnings: number;
  region?: string;
  languages: string[];
  contact_info: any;
}

const AgentProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAgentProfile();
  }, [user]);

  const fetchAgentProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', user.user_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create new agent profile
        await createAgentProfile();
      }
    } catch (error) {
      console.error('Error fetching agent profile:', error);
      toast({
        title: "Error",
        description: "Failed to load agent profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgentProfile = async () => {
    if (!user) return;

    try {
      const agentId = `AGT${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('agent_profiles')
        .insert({
          user_id: user.user_id,
          agent_id: agentId,
          contact_info: {
            email: user.email || '',
            phone: '',
            address: ''
          }
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating agent profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<AgentProfile>) => {
    if (!profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('agent_profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleContactInfoUpdate = (field: string, value: string) => {
    if (!profile) return;
    
    const updatedContactInfo = { ...profile.contact_info, [field]: value };
    updateProfile({ contact_info: updatedContactInfo });
  };

  if (loading) {
    return <div>Loading agent profile...</div>;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Profile</h2>
          <p className="text-muted-foreground">Manage your agent credentials and settings</p>
        </div>
        <Badge variant={profile.kyc_status === 'verified' ? 'default' : 'secondary'}>
          {profile.kyc_status === 'verified' ? 'Verified' : 'Pending Verification'}
        </Badge>
      </div>

      <Tabs defaultValue="credentials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Agent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Agent ID</Label>
                  <Input value={profile.agent_id} disabled className="font-mono" />
                </div>
                <div>
                  <Label>Full Name</Label>
                  <Input value={user?.full_name || ''} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label>KYC Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.kyc_status === 'verified' ? 'default' : 'secondary'}>
                      {profile.kyc_status.toUpperCase()}
                    </Badge>
                    {profile.kyc_status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Upload KYC Documents
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Accreditation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Accreditation Certificate</Label>
                  {profile.accreditation_certificate_url ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Certificate
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Authorization Status</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.kyc_status === 'verified' 
                      ? 'Authorized by NSCU for student recruitment'
                      : 'Pending NSCU authorization'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.contact_info?.phone || ''}
                    onChange={(e) => handleContactInfoUpdate('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Select 
                    value={profile.region || ''} 
                    onValueChange={(value) => updateProfile({ region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north_america">North America</SelectItem>
                      <SelectItem value="south_america">South America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={profile.contact_info?.address || ''}
                  onChange={(e) => handleContactInfoUpdate('address', e.target.value)}
                  placeholder="Full address"
                />
              </div>
              <div>
                <Label>Languages Spoken</Label>
                <Input
                  value={profile.languages?.join(', ') || ''}
                  onChange={(e) => updateProfile({ languages: e.target.value.split(',').map(l => l.trim()) })}
                  placeholder="English, Spanish, French"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Commission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Commission Rate</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{profile.commission_rate}%</span>
                    <span className="text-sm text-muted-foreground">per successful enrollment</span>
                  </div>
                </div>
                <div>
                  <Label>Total Earnings</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">${profile.total_earnings}</span>
                    <span className="text-sm text-muted-foreground">lifetime earnings</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Bank Account</Label>
                  <Button size="sm" variant="outline" className="mt-2">
                    Add Bank Details
                  </Button>
                </div>
                <div>
                  <Label>Payment Schedule</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly payouts on the 15th
                  </p>
                </div>
                <Button variant="outline">
                  Request Payout
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="cet">Central European Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about applications</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentProfile;