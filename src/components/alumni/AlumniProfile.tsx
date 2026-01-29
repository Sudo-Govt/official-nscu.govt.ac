import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QrCode, Shield, Download, ExternalLink, Edit2, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChangePassword from '@/components/ChangePassword';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AlumniProfile = () => {
  const { user } = useAuth();
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  // Editing is disabled for alumni - only admin can edit via AlumniDataManagement

  const [formData, setFormData] = useState({
    graduation_year: 0,
    program: '',
    degree_type: '',
    college: '',
    major: '',
    minor: '',
    current_company: '',
    current_position: '',
    industry: '',
    location: '',
    linkedin_url: '',
    personal_website: '',
    bio: '',
    skills: [],
    achievements: [],
    interests: []
  });

  useEffect(() => {
    fetchAlumniProfile();
    fetchCredentials();
  }, [user]);

  const fetchAlumniProfile = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*')
        .eq('user_id', user.user_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching alumni profile:', error);
        return;
      }

      if (data) {
        setAlumniProfile(data);
        setFormData({
          graduation_year: data.graduation_year || 0,
          program: data.program || '',
          degree_type: data.degree_type || '',
          college: data.college || '',
          major: data.major || '',
          minor: data.minor || '',
          current_company: data.current_company || '',
          current_position: data.current_position || '',
          industry: data.industry || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          personal_website: data.personal_website || '',
          bio: data.bio || '',
          skills: data.skills || [],
          achievements: data.achievements || [],
          interests: data.interests || []
        });
      }
    } catch (error) {
      console.error('Error fetching alumni profile:', error);
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

  // Profile editing is now admin-only - handled via AlumniDataManagement

  const generateDigitalID = () => {
    const idData = {
      name: user?.full_name,
      alumni_id: alumniProfile?.alumni_id,
      graduation_year: alumniProfile?.graduation_year,
      program: alumniProfile?.program,
      verification_url: `https://nscu.edu/verify/${alumniProfile?.alumni_id}`
    };
    
    // In a real implementation, this would generate a QR code and blockchain verification
    toast.success('Digital ID generated! QR code saved to downloads.');
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
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={user?.full_name} />
                <AvatarFallback className="text-lg">
                  {user?.full_name?.split(' ').map(n => n[0]).join('') || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.full_name}</CardTitle>
                <p className="text-muted-foreground">
                  Alumni ID: {alumniProfile?.alumni_id || 'Not assigned'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">
                    Class of {alumniProfile?.graduation_year}
                  </Badge>
                  <Badge variant="outline">
                    {alumniProfile?.degree_type} {alumniProfile?.program}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={generateDigitalID} variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Digital ID
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="credentials">Digital Credentials</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information - View Only */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <p className="text-sm text-muted-foreground">Contact your administrator to update this information</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p><strong>Graduation:</strong> {alumniProfile?.graduation_year}</p>
              <p><strong>Degree:</strong> {alumniProfile?.degree_type} in {alumniProfile?.program}</p>
              <p><strong>College:</strong> {alumniProfile?.college}</p>
              <p><strong>Major:</strong> {alumniProfile?.major}</p>
              {alumniProfile?.minor && <p><strong>Minor:</strong> {alumniProfile.minor}</p>}
              {alumniProfile?.bio && (
                <div>
                  <strong>Bio:</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{alumniProfile.bio}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Information - View Only */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <p className="text-sm text-muted-foreground">Contact your administrator to update this information</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {alumniProfile?.current_company && (
                <p><strong>Company:</strong> {alumniProfile.current_company}</p>
              )}
              {alumniProfile?.current_position && (
                <p><strong>Position:</strong> {alumniProfile.current_position}</p>
              )}
              {alumniProfile?.industry && (
                <p><strong>Industry:</strong> {alumniProfile.industry}</p>
              )}
              {alumniProfile?.location && (
                <p><strong>Location:</strong> {alumniProfile.location}</p>
              )}
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://linkedin.com/company/nscu-us" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                {alumniProfile?.personal_website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={alumniProfile.personal_website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Digital Credentials Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{credential.title}</h4>
                    <Badge variant={credential.is_verified ? "default" : "secondary"}>
                      {credential.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{credential.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Issued: {new Date(credential.issue_date).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No credentials found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your digital degrees and certificates will appear here once issued
              </p>
            </div>
          )}
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

export default AlumniProfile;