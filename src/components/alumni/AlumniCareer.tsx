import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ExternalLink, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string | null;
  job_type: string | null;
  location: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_range?: string | null;
  remote_ok?: boolean;
  application_url?: string | null;
  application_email?: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
}

interface Mentorship {
  id: string;
  mentor_id: string;
  mentee_id: string | null;
  program_name: string;
  description: string | null;
  status: string | null;
  mentor?: { full_name: string } | null;
  mentee?: { full_name: string } | null;
}

const AlumniCareer = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchMentorships();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      // Map to proper type
      const mappedJobs: Job[] = (data || []).map(job => ({
        ...job,
        profiles: null
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorships = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('alumni_mentorship')
        .select('*')
        .or(`mentor_id.eq.${user.user_id},mentee_id.eq.${user.user_id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mentorships:', error);
        return;
      }

      // Map to proper type
      const mappedMentorships: Mentorship[] = (data || []).map(m => ({
        ...m,
        mentor: null,
        mentee: null
      }));

      setMentorships(mappedMentorships);
    } catch (error) {
      console.error('Error fetching mentorships:', error);
    }
  };

  const formatSalary = (min: number | null | undefined, max: number | null | undefined) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Center</h2>
          <p className="text-muted-foreground">Browse job opportunities posted by the university and alumni network</p>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-lg text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="text-right">
                      {job.job_type && (
                        <Badge variant="secondary" className="mb-2">
                          {job.job_type}
                        </Badge>
                      )}
                      {(formatSalary(job.salary_min, job.salary_max) || job.salary_range) && (
                        <p className="text-sm font-medium text-primary">
                          {formatSalary(job.salary_min, job.salary_max) || job.salary_range}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    {job.location && (
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                        {job.remote_ok && " (Remote OK)"}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {job.profiles?.full_name && (
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Posted by {job.profiles.full_name}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    {job.application_url && (
                      <Button variant="default" asChild>
                        <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </a>
                      </Button>
                    )}
                    {job.application_email && (
                      <Button variant="outline" asChild>
                        <a href={`mailto:${job.application_email}`}>
                          Email Application
                        </a>
                      </Button>
                    )}
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground">
              Check back later for new job opportunities from the alumni network.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mentorship Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mentorship Program</CardTitle>
        </CardHeader>
        <CardContent>
          {mentorships.length > 0 ? (
            <div className="space-y-4">
              {mentorships.map((mentorship) => (
                <div key={mentorship.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {mentorship.mentor_id === user?.user_id 
                        ? `Mentoring ${mentorship.mentee?.full_name || 'Student'}`
                        : `Mentored by ${mentorship.mentor?.full_name || 'Mentor'}`
                      }
                    </h4>
                    <Badge variant={
                      mentorship.status === 'active' ? 'default' : 
                      mentorship.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {mentorship.status || 'Available'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {mentorship.program_name}
                  </p>
                  {mentorship.description && (
                    <p className="text-sm">{mentorship.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the Mentorship Program</h3>
              <p className="text-muted-foreground mb-4">
                Connect with fellow alumni as a mentor or mentee
              </p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline">
                  Become a Mentor
                </Button>
                <Button>
                  Find a Mentor
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniCareer;