import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, Calendar, LogOut, Network, GraduationCap, Briefcase, Award, Globe, Coffee, BookOpen, Mail, User, FileText, DollarSign } from 'lucide-react';
import AlumniProfile from '@/components/alumni/AlumniProfile';
import AlumniNetworking from '@/components/alumni/AlumniNetworking';
import AlumniCareer from '@/components/alumni/AlumniCareer';
import AlumniDocuments from '@/components/alumni/AlumniDocuments';

const AlumniDashboard = () => {
  const { user, logout } = useAuth();

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

  const alumniServices = [
    { icon: Network, title: "Alumni Network", description: "Connect with 50,000+ alumni worldwide" },
    { icon: Briefcase, title: "Career Services", description: "Lifetime career counseling and job board access" },
    { icon: BookOpen, title: "Library Access", description: "Digital and physical library privileges" },
    { icon: Award, title: "Alumni Benefits", description: "Exclusive discounts and services" },
    { icon: Coffee, title: "Mentorship Program", description: "Mentor current students or recent graduates" },
    { icon: Mail, title: "Alumni Magazine", description: "Quarterly digital and print publications" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Alumni Portal
                </h1>
                <p className="text-muted-foreground font-medium">Welcome back, {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Class of {alumniStats.graduationYear}
              </Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alumniStats.networkConnections}</div>
              <p className="text-xs text-muted-foreground">Alumni connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentorship</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alumniStats.menteeCount}</div>
              <p className="text-xs text-muted-foreground">Active mentees</p>
            </CardContent>
          </Card>

          <Card>
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
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Alumni Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Alumni Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alumniServices.slice(0, 4).map((service, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <service.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{service.title}</h4>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                Explore All Benefits
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Network className="h-6 w-6 mb-2" />
                  <span className="text-sm">Alumni Directory</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Heart className="h-6 w-6 mb-2" />
                  <span className="text-sm">Make a Donation</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Briefcase className="h-6 w-6 mb-2" />
                  <span className="text-sm">Career Center</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Award className="h-6 w-6 mb-2" />
                  <span className="text-sm">Mentorship</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;