import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, BookMarked } from 'lucide-react';
import { useLibraryBooks } from '@/hooks/useAcademicData';
import type { LibraryBook } from '@/types/academic';

export function LibraryBooksManagement() {
  const { data: books, loading, fetch, create, update, remove } = useLibraryBooks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    volume: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    description: '',
    cover_image_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetch();
  }, []);

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
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    if (editingBook) {
      await update(editingBook.id, formData);
    } else {
      await create(formData);
    }
    setDialogOpen(false);
    setEditingBook(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await remove(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          Library Books
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Book' : 'Add Book'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Book title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ISBN</Label>
                  <Input
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="ISBN number"
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
                <Label>Cover Image URL</Label>
                <Input
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the book"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingBook ? 'Update' : 'Add'} Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-muted-foreground">No books in library. Add one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-mono text-sm">{book.book_code}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{book.title}</TableCell>
                  <TableCell className="text-muted-foreground">{book.author || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{book.publisher || '-'}</TableCell>
                  <TableCell>{book.publication_year || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(book)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                    >
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
