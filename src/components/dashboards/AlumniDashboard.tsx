import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Calendar, Network, GraduationCap, Briefcase, Award, Globe, Coffee, BookOpen, Mail, User, FileText, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AlumniProfile from '@/components/alumni/AlumniProfile';
import AlumniNetworking from '@/components/alumni/AlumniNetworking';
import AlumniCareer from '@/components/alumni/AlumniCareer';
import AlumniDocuments from '@/components/alumni/AlumniDocuments';
import AlumniChatRoom from '@/components/alumni/AlumniChatRoom';
import DashboardLayout from '@/components/DashboardLayout';
import { InternalMailSystem } from '@/components/intranet/InternalMailSystem';
import * as LucideIcons from 'lucide-react';

interface CTAButton {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  action_type: string;
  action_value: string;
  is_active: boolean;
  sort_order: number;
}

const AlumniDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ctaButtons, setCTAButtons] = useState<CTAButton[]>([]);
  const [loadingCTAs, setLoadingCTAs] = useState(true);

  useEffect(() => {
    fetchCTAButtons();
  }, []);

  const fetchCTAButtons = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_cta_buttons')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCTAButtons(data || []);
    } catch (error) {
      console.error('Error fetching CTA buttons:', error);
    } finally {
      setLoadingCTAs(false);
    }
  };

  const handleCTAClick = (cta: CTAButton) => {
    switch (cta.action_type) {
      case 'tab':
        setActiveTab(cta.action_value);
        break;
      case 'link':
        if (cta.action_value.startsWith('http')) {
          window.open(cta.action_value, '_blank');
        } else {
          navigate(cta.action_value);
        }
        break;
      case 'toast':
        toast({
          title: cta.title,
          description: cta.action_value,
        });
        break;
      default:
        toast({
          title: cta.title,
          description: 'Action coming soon!',
        });
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.HelpCircle;
  };

  const alumniStats = {
    graduationYear: "2020",
    degree: "Bachelor of Science in Computer Science",
    networkConnections: 156,
    eventsAttended: 8,
    donationTotal: 2500,
    menteeCount: 3
  };

  const upcomingEvents = [
    { name: "Alumni Homecoming Weekend", date: "Oct 15-17, 2024", type: "Reunion" },
    { name: "Regional Chapter Meetup", date: "Nov 5, 2024", type: "Networking" },
    { name: "Career Fair - Alumni Booth", date: "Nov 20, 2024", type: "Volunteering" }
  ];

  const handleDonationClick = () => {
    navigate('/alumni/give-back');
  };

  const handleEventClick = () => {
    navigate('/alumni/events');
  };

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-2xl p-8 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Alumni! 🎓
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              {alumniStats.degree} • Class of {alumniStats.graduationYear}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-primary" />
                <span>{alumniStats.networkConnections} connections</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span>{alumniStats.eventsAttended} events attended</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-primary" />
                <span>${alumniStats.donationTotal} donated</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Globe className="h-24 w-24 text-primary/20" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('networking')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alumniStats.networkConnections}</div>
            <p className="text-xs text-muted-foreground">Alumni connections</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('career')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentorship</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alumniStats.menteeCount}</div>
            <p className="text-xs text-muted-foreground">Active mentees</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleDonationClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giving Back</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${alumniStats.donationTotal}</div>
            <p className="text-xs text-muted-foreground">Total donations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Alumni Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer" onClick={handleEventClick}>
                <div>
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <Badge variant="secondary">{event.type}</Badge>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline" onClick={handleEventClick}>
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Alumni Services - Dynamic CTAs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Alumni Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingCTAs ? (
              <div className="text-center py-4 text-muted-foreground">Loading services...</div>
            ) : ctaButtons.length > 0 ? (
              ctaButtons.slice(0, 4).map((cta) => {
                const IconComponent = getIconComponent(cta.icon);
                return (
                  <div 
                    key={cta.id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" 
                    onClick={() => handleCTAClick(cta)}
                  >
                    <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{cta.title}</h4>
                      <p className="text-xs text-muted-foreground">{cta.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('networking')}>
                  <Network className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Alumni Network</h4>
                    <p className="text-xs text-muted-foreground">Connect with 50,000+ alumni worldwide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('career')}>
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Career Services</h4>
                    <p className="text-xs text-muted-foreground">Lifetime career counseling and job board access</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('documents')}>
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Document Services</h4>
                    <p className="text-xs text-muted-foreground">Transcripts, certificates, and verifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('chatroom')}>
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Alumni Chat Room</h4>
                    <p className="text-xs text-muted-foreground">Connect and chat with fellow alumni</p>
                  </div>
                </div>
              </>
            )}
            <Button className="w-full mt-4" variant="outline" onClick={() => setActiveTab('profile')}>
              Explore All Benefits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Dynamic CTAs */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingCTAs ? (
              <div className="col-span-4 text-center py-4 text-muted-foreground">Loading...</div>
            ) : ctaButtons.length > 0 ? (
              ctaButtons.slice(0, 8).map((cta) => {
                const IconComponent = getIconComponent(cta.icon);
                return (
                  <Button 
                    key={cta.id}
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center" 
                    onClick={() => handleCTAClick(cta)}
                  >
                    <IconComponent className="h-6 w-6 mb-2" />
                    <span className="text-sm">{cta.title}</span>
                  </Button>
                );
              })
            ) : (
              <>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('networking')}>
                  <Network className="h-6 w-6 mb-2" />
                  <span className="text-sm">Alumni Directory</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={handleDonationClick}>
                  <Heart className="h-6 w-6 mb-2" />
                  <span className="text-sm">Make a Donation</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('career')}>
                  <Briefcase className="h-6 w-6 mb-2" />
                  <span className="text-sm">Career Center</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('documents')}>
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Documents</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('chatroom')}>
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span className="text-sm">Chat Room</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={handleEventClick}>
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('profile')}>
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-sm">My Profile</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => setActiveTab('mail')}>
                  <Mail className="h-6 w-6 mb-2" />
                  <span className="text-sm">Internal Mail</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const menuGroups = [
    {
      label: "Main",
      items: [
        { title: "Dashboard", icon: Globe, value: "dashboard", onClick: () => setActiveTab("dashboard") },
        { title: "Profile", icon: User, value: "profile", onClick: () => setActiveTab("profile") },
        { title: "Network", icon: Network, value: "networking", onClick: () => setActiveTab("networking") },
        { title: "Career", icon: Briefcase, value: "career", onClick: () => setActiveTab("career") },
        { title: "Documents", icon: FileText, value: "documents", onClick: () => setActiveTab("documents") },
        { title: "Chat Room", icon: MessageCircle, value: "chatroom", onClick: () => setActiveTab("chatroom") },
        { title: "Internal Mail", icon: Mail, value: "mail", onClick: () => setActiveTab("mail") },
      ]
    }
  ];

  return (
    <DashboardLayout
      title="Alumni Portal"
      subtitle={`Welcome back, ${user?.full_name}`}
      userBadge={`Class of ${alumniStats.graduationYear}`}
      menuGroups={menuGroups}
      activeTab={activeTab}
    >
      {/* Content based on active tab */}
      {activeTab === "dashboard" && renderDashboardOverview()}
      {activeTab === "profile" && <AlumniProfile />}
      {activeTab === "networking" && <AlumniNetworking />}
      {activeTab === "career" && <AlumniCareer />}
      {activeTab === "documents" && <AlumniDocuments />}
      {activeTab === "chatroom" && <AlumniChatRoom />}
      {activeTab === "mail" && <InternalMailSystem />}
    </DashboardLayout>
  );
};

export default AlumniDashboard;