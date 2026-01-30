import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, BookMarked, Upload, Link, Download, Search, ExternalLink, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ROLE_DEFINITIONS, getRoleDisplayName } from '@/lib/roles';

interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  volume?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  book_code: string;
  cover_image_url?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  file_path?: string;
  file_size?: number;
  external_url?: string;
  resource_type?: string;
  access_roles?: string[];
  download_count?: number;
  tags?: string[];
  is_active: boolean;
  created_at: string;
}

const CATEGORIES = [
  'General',
  'Science & Technology',
  'Arts & Humanities',
  'Business & Economics',
  'Health Sciences',
  'Law',
  'Education',
  'Engineering',
  'Social Sciences',
  'Reference',
  'Journals',
  'Research Papers',
];

const RESOURCE_TYPES = [
  { value: 'book', label: 'Book (PDF/eBook)' },
  { value: 'journal', label: 'Journal' },
  { value: 'article', label: 'Article' },
  { value: 'thesis', label: 'Thesis/Dissertation' },
  { value: 'video', label: 'Video Lecture' },
  { value: 'audio', label: 'Audio Resource' },
  { value: 'external', label: 'External Link' },
];

export function LibraryBooksManagement() {
  const { toast } = useToast();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    volume: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    description: '',
    cover_image_url: '',
    category: 'General',
    subcategory: '',
    external_url: '',
    resource_type: 'book',
    access_roles: ['student', 'alumni'] as string[],
    tags: '',
    is_active: true,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .order('title', { ascending: true });
      if (error) throw error;
      setBooks((data as LibraryBook[]) || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({ title: 'Error', description: 'Failed to fetch library books', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: LibraryBook) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author || '',
        volume: book.volume || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || new Date().getFullYear(),
        description: book.description || '',
        cover_image_url: book.cover_image_url || '',
        category: book.category || 'General',
        subcategory: book.subcategory || '',
        external_url: book.external_url || '',
        resource_type: book.resource_type || 'book',
        access_roles: book.access_roles || ['student', 'alumni'],
        tags: book.tags?.join(', ') || '',
        is_active: book.is_active,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        volume: '',
        isbn: '',
        publisher: '',
        publication_year: new Date().getFullYear(),
        description: '',
        cover_image_url: '',
        category: 'General',
        subcategory: '',
        external_url: '',
        resource_type: 'book',
        access_roles: ['student', 'alumni'],
        tags: '',
        is_active: true,
      });
    }
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      let filePath = editingBook?.file_path || null;
      let fileSize = editingBook?.file_size || null;

      // Upload file if selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('library-files')
          .upload(`books/${fileName}`, selectedFile);

        if (uploadError) throw uploadError;
        filePath = `books/${fileName}`;
        fileSize = selectedFile.size;
      }

      const bookData: any = {
        title: formData.title,
        author: formData.author || null,
        volume: formData.volume || null,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publication_year: formData.publication_year,
        description: formData.description || null,
        cover_image_url: formData.cover_image_url || null,
        category: formData.category,
        subcategory: formData.subcategory || null,
        external_url: formData.external_url || null,
        resource_type: formData.resource_type,
        access_roles: formData.access_roles,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
        is_active: formData.is_active,
      };

      if (filePath) {
        bookData.file_path = filePath;
        bookData.file_size = fileSize;
      }

      if (editingBook) {
        const { error } = await supabase
          .from('library_books')
          .update(bookData)
          .eq('id', editingBook.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Book updated successfully' });
      } else {
        const { error } = await supabase
          .from('library_books')
          .insert([bookData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Book added successfully' });
      }

      setDialogOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({ title: 'Error', description: 'Failed to save book', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (book: LibraryBook) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      // Delete file from storage if exists
      if (book.file_path) {
        await supabase.storage.from('library-files').remove([book.file_path]);
      }

      const { error } = await supabase.from('library_books').delete().eq('id', book.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Book deleted successfully' });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({ title: 'Error', description: 'Failed to delete book', variant: 'destructive' });
    }
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      access_roles: prev.access_roles.includes(role)
        ? prev.access_roles.filter(r => r !== role)
        : [...prev.access_roles, role]
    }));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const accessRoleOptions = ['student', 'alumni', 'faculty'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          Library Management
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="file">File/URL</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Resource title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resource Type</Label>
                    <Select value={formData.resource_type} onValueChange={(v) => setFormData({ ...formData, resource_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Input
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="e.g., Physics, Marketing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ISBN</Label>
                    <Input
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      placeholder="ISBN number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Publisher</Label>
                    <Input
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="Publisher name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Publication Year</Label>
                    <Input
                      type="number"
                      value={formData.publication_year}
                      onChange={(e) => setFormData({ ...formData, publication_year: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Volume</Label>
                    <Input
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      placeholder="e.g., Vol. 1"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Cover Image URL</Label>
                    <Input
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="programming, python, beginner"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload File (PDF, EPUB, etc.)</Label>
                    <Input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.epub,.doc,.docx,.ppt,.pptx,.mp3,.mp4"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                    {editingBook?.file_path && !selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Current file: {editingBook.file_path.split('/').pop()} ({formatFileSize(editingBook.file_size)})
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or provide external link</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <Input
                      value={formData.external_url}
                      onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                      placeholder="https://example.com/resource"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use this for linking to external resources like Google Books, JSTOR, etc.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="access" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Who can access this resource?</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {accessRoleOptions.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={formData.access_roles.includes(role)}
                            onCheckedChange={() => toggleRole(role)}
                          />
                          <Label htmlFor={`role-${role}`} className="cursor-pointer capitalize">
                            {role}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active (visible in library)</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={uploading}>
                {uploading ? 'Saving...' : editingBook ? 'Update' : 'Add'} Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{books.length}</div>
            <div className="text-sm text-muted-foreground">Total Resources</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{books.filter(b => b.file_path).length}</div>
            <div className="text-sm text-muted-foreground">Downloadable</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{books.filter(b => b.external_url).length}</div>
            <div className="text-sm text-muted-foreground">External Links</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{new Set(books.map(b => b.category)).size}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources found. Add one to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-mono text-sm">{book.book_code}</TableCell>
                  <TableCell className="font-medium max-w-xs">
                    <div className="flex items-center gap-2">
                      {book.file_path && <FileText className="h-4 w-4 text-primary" />}
                      {book.external_url && <ExternalLink className="h-4 w-4 text-primary/70" />}
                      <span className="truncate">{book.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{book.author || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.category}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{book.resource_type}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {book.access_roles?.map(role => (
                        <Badge key={role} variant="secondary" className="text-xs capitalize">
                          {role.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(book)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(book)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}