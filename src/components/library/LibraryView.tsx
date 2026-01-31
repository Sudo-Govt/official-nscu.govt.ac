import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, Search, Download, ExternalLink, Filter, 
  Grid3X3, List, BookMarked, FileText, Video, Library,
  Music, GraduationCap, SortAsc, SortDesc, Calendar,
  User, Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OpenAccessLibrary from './OpenAccessLibrary';

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
  download_count?: number;
  tags?: string[];
  is_active: boolean;
}

const CATEGORIES = [
  'All Categories',
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

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LibraryView: React.FC = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'year' | 'recent'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [mainTab, setMainTab] = useState<'nscu' | 'openaccess'>('nscu');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('library_books')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setBooks((data as LibraryBook[]) || []);
    } catch (error) {
      console.error('Error fetching library:', error);
      toast({ title: 'Error', description: 'Failed to load library', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (book: LibraryBook) => {
    if (book.external_url) {
      window.open(book.external_url, '_blank');
      return;
    }

    if (!book.file_path) {
      toast({ title: 'Not available', description: 'This resource has no downloadable file', variant: 'destructive' });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('library-files')
        .download(book.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = book.file_path.split('/').pop() || book.title;
      a.click();
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('library_books')
        .update({ download_count: (book.download_count || 0) + 1 })
        .eq('id', book.id);

      toast({ title: 'Success', description: 'Download started' });
    } catch (error) {
      console.error('Error downloading:', error);
      toast({ title: 'Error', description: 'Failed to download file', variant: 'destructive' });
    }
  };

  const getResourceIcon = (type?: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'journal': return <FileText className="h-4 w-4" />;
      case 'thesis': return <GraduationCap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by resource type tab
    if (activeTab !== 'all') {
      result = result.filter(book => book.resource_type === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.isbn?.toLowerCase().includes(term) ||
        book.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Filter by letter
    if (selectedLetter) {
      result = result.filter(book => 
        book.title.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = (a.author || '').localeCompare(b.author || '');
          break;
        case 'year':
          comparison = (a.publication_year || 0) - (b.publication_year || 0);
          break;
        case 'recent':
          comparison = 0; // Already ordered by created_at from DB
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [books, searchTerm, selectedCategory, selectedLetter, sortBy, sortOrder, activeTab]);

  // Group books by category for display
  const booksByCategory = useMemo(() => {
    const grouped: Record<string, LibraryBook[]> = {};
    filteredBooks.forEach(book => {
      const cat = book.category || 'General';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(book);
    });
    return grouped;
  }, [filteredBooks]);

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookMarked className="h-6 w-6" />
            Digital Library
          </h2>
          <p className="text-muted-foreground">
            {books.length} NSCU resources + Open Access collections
          </p>
        </div>
      </div>

      {/* Main Library Tabs */}
      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'nscu' | 'openaccess')}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="nscu" className="gap-2">
            <BookMarked className="h-4 w-4" />
            NSCU Library
          </TabsTrigger>
          <TabsTrigger value="openaccess" className="gap-2">
            <Library className="h-4 w-4" />
            Open Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="openaccess" className="mt-6">
          <OpenAccessLibrary />
        </TabsContent>

        <TabsContent value="nscu" className="mt-6 space-y-6">
      {/* Resource Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="book">Books</TabsTrigger>
          <TabsTrigger value="journal">Journals</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="thesis">Theses</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, ISBN, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t">
            <Button
              variant={selectedLetter === null ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedLetter(null)}
            >
              All
            </Button>
            {ALPHABET.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'ghost'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                      {getResourceIcon(book.resource_type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm line-clamp-2">{book.title}</CardTitle>
                    {book.author && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {book.author}
                      </p>
                    )}
                    {book.publication_year && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {book.publication_year}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">{book.category}</Badge>
                  <Badge variant="secondary" className="text-xs capitalize">{book.resource_type}</Badge>
                </div>
                {book.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {book.description}
                  </p>
                )}
                <div className="mt-auto">
                  {book.file_path || book.external_url ? (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(book)}
                    >
                      {book.external_url ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Link
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download {formatFileSize(book.file_size)}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full" variant="outline" disabled>
                      Reference Only
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                      {getResourceIcon(book.resource_type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{book.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {book.author && <span>{book.author}</span>}
                      {book.publisher && <span>• {book.publisher}</span>}
                      {book.publication_year && <span>• {book.publication_year}</span>}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{book.category}</Badge>
                      {book.isbn && <Badge variant="secondary" className="text-xs">ISBN: {book.isbn}</Badge>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {book.file_path || book.external_url ? (
                      <Button size="sm" onClick={() => handleDownload(book)}>
                        {book.external_url ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      </Button>
                    ) : (
                      <Badge variant="outline">Reference</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Summary */}
      {!searchTerm && !selectedLetter && selectedCategory === 'All Categories' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browse by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
                <Button
                  key={category}
                  variant="outline"
                  className="justify-between"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                  <Badge variant="secondary">{categoryBooks.length}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryView;