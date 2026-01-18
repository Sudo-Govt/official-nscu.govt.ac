import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, BookOpen, FileText, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Subject, Topic, Lesson } from '@/types/academic';

interface CurriculumEditorProps {
  courseId: string;
  courseName: string;
}

export function CurriculumEditor({ courseId, courseName }: CurriculumEditorProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<(Subject & { topics: (Topic & { lessons: Lesson[] })[] })[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [topicDialog, setTopicDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  
  // Editing states
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [parentSubjectId, setParentSubjectId] = useState('');
  const [parentTopicId, setParentTopicId] = useState('');

  // Form states
  const [subjectForm, setSubjectForm] = useState({ name: '', credits: 0, semester: 1, description: '' });
  const [topicForm, setTopicForm] = useState({ name: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ name: '', content: '', video_url: '', estimated_duration_minutes: 30 });

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('academic_subjects')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      if (subjectsError) throw subjectsError;

      // Fetch topics
      const subjectIds = subjectsData?.map(s => s.id) || [];
      const { data: topicsData, error: topicsError } = await supabase
        .from('academic_topics')
        .select('*')
        .in('subject_id', subjectIds.length ? subjectIds : [''])
        .order('order_index');
      if (topicsError) throw topicsError;

      // Fetch lessons
      const topicIds = topicsData?.map(t => t.id) || [];
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('academic_lessons')
        .select('*')
        .in('topic_id', topicIds.length ? topicIds : [''])
        .order('order_index');
      if (lessonsError) throw lessonsError;

      // Assemble hierarchy
      const topicsWithLessons = (topicsData || []).map(topic => ({
        ...topic,
        lessons: (lessonsData || []).filter(l => l.topic_id === topic.id),
      }));

      const subjectsWithTopics = (subjectsData || []).map(subject => ({
        ...subject,
        topics: topicsWithLessons.filter(t => t.subject_id === subject.id),
      }));

      setSubjects(subjectsWithTopics as any);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load curriculum', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  // Subject CRUD
  const openSubjectDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name,
        credits: subject.credits,
        semester: subject.semester || 1,
        description: subject.description || '',
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', credits: 0, semester: 1, description: '' });
    }
    setSubjectDialog(true);
  };

  const saveSubject = async () => {
    try {
      if (editingSubject) {
        await supabase
          .from('academic_subjects')
          .update(subjectForm)
          .eq('id', editingSubject.id);
      } else {
        await supabase
          .from('academic_subjects')
          .insert([{ ...subjectForm, course_id: courseId, order_index: subjects.length }]);
      }
      toast({ title: 'Success', description: 'Subject saved' });
      setSubjectDialog(false);
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save subject', variant: 'destructive' });
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('Delete this subject and all its topics/lessons?')) return;
    try {
      await supabase.from('academic_subjects').delete().eq('id', id);
      toast({ title: 'Success', description: 'Subject deleted' });
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  // Topic CRUD
  const openTopicDialog = (subjectId: string, topic?: Topic) => {
    setParentSubjectId(subjectId);
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({ name: topic.name, description: topic.description || '' });
    } else {
      setEditingTopic(null);
      setTopicForm({ name: '', description: '' });
    }
    setTopicDialog(true);
  };

  const saveTopic = async () => {
    try {
      const subject = subjects.find(s => s.id === parentSubjectId);
      if (editingTopic) {
        await supabase
          .from('academic_topics')
          .update(topicForm)
          .eq('id', editingTopic.id);
      } else {
        await supabase
          .from('academic_topics')
          .insert([{ ...topicForm, subject_id: parentSubjectId, order_index: subject?.topics.length || 0 }]);
      }
      toast({ title: 'Success', description: 'Topic saved' });
      setTopicDialog(false);
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save topic', variant: 'destructive' });
    }
  };

  const deleteTopic = async (id: string) => {
    if (!confirm('Delete this topic and all its lessons?')) return;
    try {
      await supabase.from('academic_topics').delete().eq('id', id);
      toast({ title: 'Success', description: 'Topic deleted' });
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  // Lesson CRUD
  const openLessonDialog = (topicId: string, lesson?: Lesson) => {
    setParentTopicId(topicId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        name: lesson.name,
        content: lesson.content || '',
        video_url: lesson.video_url || '',
        estimated_duration_minutes: lesson.estimated_duration_minutes,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({ name: '', content: '', video_url: '', estimated_duration_minutes: 30 });
    }
    setLessonDialog(true);
  };

  const saveLesson = async () => {
    try {
      const subject = subjects.find(s => s.topics.some(t => t.id === parentTopicId));
      const topic = subject?.topics.find(t => t.id === parentTopicId);
      if (editingLesson) {
        await supabase
          .from('academic_lessons')
          .update(lessonForm)
          .eq('id', editingLesson.id);
      } else {
        await supabase
          .from('academic_lessons')
          .insert([{ ...lessonForm, topic_id: parentTopicId, order_index: topic?.lessons.length || 0 }]);
      }
      toast({ title: 'Success', description: 'Lesson saved' });
      setLessonDialog(false);
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save lesson', variant: 'destructive' });
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await supabase.from('academic_lessons').delete().eq('id', id);
      toast({ title: 'Success', description: 'Lesson deleted' });
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  // Reorder helper
  const reorder = async (table: string, items: { id: string }[], currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const item1 = items[currentIndex];
    const item2 = items[newIndex];

    try {
      if (table === 'academic_subjects') {
        await supabase.from('academic_subjects').update({ order_index: newIndex }).eq('id', item1.id);
        await supabase.from('academic_subjects').update({ order_index: currentIndex }).eq('id', item2.id);
      } else if (table === 'academic_topics') {
        await supabase.from('academic_topics').update({ order_index: newIndex }).eq('id', item1.id);
        await supabase.from('academic_topics').update({ order_index: currentIndex }).eq('id', item2.id);
      } else if (table === 'academic_lessons') {
        await supabase.from('academic_lessons').update({ order_index: newIndex }).eq('id', item1.id);
        await supabase.from('academic_lessons').update({ order_index: currentIndex }).eq('id', item2.id);
      }
      }
      fetchCurriculum();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' });
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading curriculum...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {subjects.length} subjects, {subjects.reduce((acc, s) => acc + s.topics.length, 0)} topics, {subjects.reduce((acc, s) => acc + s.topics.reduce((a, t) => a + t.lessons.length, 0), 0)} lessons
        </p>
        <Button onClick={() => openSubjectDialog()} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No subjects yet. Click "Add Subject" to start building your curriculum.
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {subjects.map((subject, sIndex) => (
            <AccordionItem key={subject.id} value={subject.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {subject.subject_code} • {subject.credits} credits • Semester {subject.semester || 1}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => openSubjectDialog(subject)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteSubject(subject.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => reorder('academic_subjects', subjects, sIndex, 'up')} disabled={sIndex === 0}>
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => reorder('academic_subjects', subjects, sIndex, 'down')} disabled={sIndex === subjects.length - 1}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button size="sm" onClick={() => openTopicDialog(subject.id)}>
                    <Plus className="h-3 w-3 mr-1" /> Add Topic
                  </Button>
                </div>

                {subject.topics.length === 0 ? (
                  <p className="text-sm text-muted-foreground ml-4">No topics yet.</p>
                ) : (
                  <div className="ml-4 space-y-2">
                    {subject.topics.map((topic, tIndex) => (
                      <Card key={topic.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{topic.name}</span>
                            <span className="text-xs text-muted-foreground">({topic.topic_code})</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openTopicDialog(subject.id, topic)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteTopic(topic.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => reorder('academic_topics', subject.topics, tIndex, 'up')} disabled={tIndex === 0}>
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => reorder('academic_topics', subject.topics, tIndex, 'down')} disabled={tIndex === subject.topics.length - 1}>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openLessonDialog(topic.id)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {topic.lessons.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {topic.lessons.map((lesson, lIndex) => (
                              <div key={lesson.id} className="flex items-center justify-between py-1 text-sm">
                                <div className="flex items-center gap-2">
                                  {lesson.video_url ? (
                                    <Video className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                  )}
                                  <span>{lesson.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({lesson.lesson_code}) • {lesson.estimated_duration_minutes}min
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => openLessonDialog(topic.id, lesson)}>
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deleteLesson(lesson.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => reorder('academic_lessons', topic.lessons, lIndex, 'up')} disabled={lIndex === 0}>
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => reorder('academic_lessons', topic.lessons, lIndex, 'down')} disabled={lIndex === topic.lessons.length - 1}>
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Subject Dialog */}
      <Dialog open={subjectDialog} onOpenChange={setSubjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject Name *</Label>
              <Input
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="e.g., Circuit Theory"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input
                  type="number"
                  value={subjectForm.credits}
                  onChange={(e) => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Input
                  type="number"
                  value={subjectForm.semester}
                  onChange={(e) => setSubjectForm({ ...subjectForm, semester: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
              />
            </div>
            <Button onClick={saveSubject} className="w-full">Save Subject</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Topic Dialog */}
      <Dialog open={topicDialog} onOpenChange={setTopicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Topic Name *</Label>
              <Input
                value={topicForm.name}
                onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                placeholder="e.g., AC Circuits"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              />
            </div>
            <Button onClick={saveTopic} className="w-full">Save Topic</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lesson Name *</Label>
              <Input
                value={lessonForm.name}
                onChange={(e) => setLessonForm({ ...lessonForm, name: e.target.value })}
                placeholder="e.g., Introduction to AC Circuits"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video URL (optional)</Label>
                <Input
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={lessonForm.estimated_duration_minutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, estimated_duration_minutes: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                placeholder="Lesson content (supports markdown)"
                rows={8}
              />
            </div>
            <Button onClick={saveLesson} className="w-full">Save Lesson</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
