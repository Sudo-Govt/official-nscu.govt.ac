import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, MessageCircle, Calendar, ExternalLink, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AlumniNetworking = () => {
  const [alumniProfiles, setAlumniProfiles] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumniProfiles();
    fetchChapters();
  }, []);

  const fetchAlumniProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .eq('is_public_profile', true)
        .eq('allow_networking', true)
        .order('graduation_year', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching alumni profiles:', error);
        return;
      }

      setAlumniProfiles(data || []);
    } catch (error) {
      console.error('Error fetching alumni profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_chapters')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching chapters:', error);
        return;
      }

      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const filteredProfiles = alumniProfiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = !yearFilter || profile.graduation_year.toString() === yearFilter;
    const matchesLocation = !locationFilter || profile.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesYear && matchesLocation;
  });

  const uniqueYears = [...new Set(alumniProfiles.map(p => p.graduation_year))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Alumni Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, program, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    Class of {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Found {filteredProfiles.length} alumni in your network
          </div>
        </CardContent>
      </Card>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {profile.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {profile.profiles?.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Class of {profile.graduation_year}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {profile.program}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {profile.current_company && (
                  <p className="text-sm">
                    <strong>Company:</strong> {profile.current_company}
                  </p>
                )}
                {profile.current_position && (
                  <p className="text-sm">
                    <strong>Position:</strong> {profile.current_position}
                  </p>
                )}
                {profile.location && (
                  <p className="text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </p>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                {profile.linkedin_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regional Chapters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Regional Alumni Chapters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{chapter.name}</h3>
                  <Badge variant="outline">
                    {chapter.member_count || 0} members
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {chapter.location}
                </p>
                {chapter.description && (
                  <p className="text-sm text-muted-foreground">
                    {chapter.description}
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Join Chapter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {chapters.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active chapters found</p>
              <Button className="mt-4" variant="outline">
                Start a Chapter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniNetworking;