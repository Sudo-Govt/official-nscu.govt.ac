import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Edit2, Trash2, Globe, Users, GraduationCap, Briefcase, MapPin, Clock, Video, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  is_virtual: boolean;
  virtual_link: string | null;
  max_attendees: number | null;
  registration_required: boolean;
  is_active: boolean;
  created_at: string;
}

const EventsManagement = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'public',
    start_date: '',
    end_date: '',
    location: '',
    is_virtual: false,
    virtual_link: '',
    max_attendees: '',
    registration_required: false,
    is_active: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents((data as unknown as Event[]) || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({ title: 'Error', description: 'Failed to fetch events', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.start_date) {
      toast({ title: 'Error', description: 'Title and start date are required', variant: 'destructive' });
      return;
    }

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        event_type: formData.event_type,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        location: formData.location || null,
        is_virtual: formData.is_virtual,
        virtual_link: formData.virtual_link || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        registration_required: formData.registration_required,
        is_active: formData.is_active
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events' as any)
          .update(eventData)
          .eq('id', editingEvent.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Event updated successfully' });
      } else {
        const { error } = await supabase
          .from('events' as any)
          .insert([eventData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Event created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({ title: 'Error', description: 'Failed to save event', variant: 'destructive' });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      start_date: event.start_date.slice(0, 16),
      end_date: event.end_date?.slice(0, 16) || '',
      location: event.location || '',
      is_virtual: event.is_virtual,
      virtual_link: event.virtual_link || '',
      max_attendees: event.max_attendees?.toString() || '',
      registration_required: event.registration_required,
      is_active: event.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events' as any).delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Event deleted successfully' });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_type: 'public',
      start_date: '',
      end_date: '',
      location: '',
      is_virtual: false,
      virtual_link: '',
      max_attendees: '',
      registration_required: false,
      is_active: true
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'alumni': return <Users className="h-4 w-4" />;
      case 'faculty': return <Briefcase className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'public': return 'default';
      case 'student': return 'secondary';
      case 'alumni': return 'outline';
      case 'faculty': return 'destructive';
      default: return 'default';
    }
  };

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.event_type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Events Management
          </h2>
          <p className="text-muted-foreground">Manage public and role-specific events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Annual Alumni Reunion"
                  />
                </div>

                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Visible to all)</SelectItem>
                      <SelectItem value="student">Student Events</SelectItem>
                      <SelectItem value="alumni">Alumni Events</SelectItem>
                      <SelectItem value="faculty">Faculty Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div>
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the event..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Main Auditorium"
                  />
                </div>

                <div>
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_virtual}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_virtual: checked })}
                  />
                  <Label>Virtual Event</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.registration_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
                  />
                  <Label>Registration Required</Label>
                </div>

                {formData.is_virtual && (
                  <div className="col-span-2">
                    <Label htmlFor="virtual_link">Virtual Meeting Link</Label>
                    <Input
                      id="virtual_link"
                      value={formData.virtual_link}
                      onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
                      placeholder="https://zoom.us/..."
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> Public
          </TabsTrigger>
          <TabsTrigger value="student" className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3" /> Student
          </TabsTrigger>
          <TabsTrigger value="alumni" className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Alumni
          </TabsTrigger>
          <TabsTrigger value="faculty" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> Faculty
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className={!event.is_active ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(event.event_type)}
                        <Badge variant={getEventTypeBadgeVariant(event.event_type) as any}>
                          {event.event_type}
                        </Badge>
                        {!event.is_active && <Badge variant="outline">Inactive</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(event.start_date), 'PPP p')}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.is_virtual && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Max {event.max_attendees} attendees</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsManagement;
