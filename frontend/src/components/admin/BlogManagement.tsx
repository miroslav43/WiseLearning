
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { mockBlogPosts } from '@/data/mockBlogData';
import { BlogPost } from '@/types/blog';

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      image: 'https://placehold.co/600x400',
      author: 'Admin Demo',
      authorAvatar: 'https://ui-avatars.com/api/?name=Admin+Demo&background=3f7e4e&color=fff',
      date: new Date().toLocaleDateString('ro-RO'),
      readTime: 5,
      categories: ['General'],
      comments: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentPost?.id) return;
    
    setPosts(prevPosts => prevPosts.filter(post => post.id !== currentPost.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Articol șters",
      description: "Articolul a fost șters cu succes.",
    });
  };

  const handleSave = () => {
    if (!currentPost?.title || !currentPost?.excerpt) {
      toast({
        title: "Eroare",
        description: "Titlul și descrierea scurtă sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    if (currentPost.id) {
      // Edit existing post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === currentPost.id ? { ...post, ...currentPost } as BlogPost : post
        )
      );
      toast({
        title: "Articol actualizat",
        description: "Articolul a fost actualizat cu succes.",
      });
    } else {
      // Add new post
      const newPost: BlogPost = {
        ...currentPost as Omit<BlogPost, 'id'>,
        id: Math.random().toString(36).substr(2, 9),
      } as BlogPost;
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast({
        title: "Articol adăugat",
        description: "Articolul a fost adăugat cu succes.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă articol nou
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titlu</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data publicării</TableHead>
            <TableHead>Comentarii</TableHead>
            <TableHead>Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.categories[0]}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>{post.comments}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editează
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(post)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Șterge
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentPost?.id ? 'Editează articolul' : 'Adaugă articol nou'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titlu</Label>
              <Input 
                id="title" 
                value={currentPost?.title || ''} 
                onChange={(e) => setCurrentPost(prev => ({...prev!, title: e.target.value}))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Descriere scurtă</Label>
              <Textarea 
                id="excerpt" 
                value={currentPost?.excerpt || ''} 
                onChange={(e) => setCurrentPost(prev => ({...prev!, excerpt: e.target.value}))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Conținut</Label>
              <Textarea 
                id="content" 
                value={currentPost?.content || ''} 
                onChange={(e) => setCurrentPost(prev => ({...prev!, content: e.target.value}))} 
                className="min-h-[200px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">URL imagine</Label>
              <Input 
                id="image" 
                value={currentPost?.image || ''} 
                onChange={(e) => setCurrentPost(prev => ({...prev!, image: e.target.value}))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="categories">Categorie</Label>
              <Input 
                id="categories" 
                value={currentPost?.categories?.[0] || ''} 
                onChange={(e) => setCurrentPost(prev => ({...prev!, categories: [e.target.value]}))} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSave}>
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă ștergerea</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Ești sigur că vrei să ștergi articolul "{currentPost?.title}"?</p>
            <p className="text-sm text-muted-foreground mt-2">Această acțiune nu poate fi anulată.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
