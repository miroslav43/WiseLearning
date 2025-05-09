
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';

interface AdminBlogActionsProps {
  post?: BlogPost;
  onAddPost?: () => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  className?: string;
}

const AdminBlogActions: React.FC<AdminBlogActionsProps> = ({ 
  post, 
  onAddPost,
  onEditPost,
  onDeletePost,
  className 
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const { toast } = useToast();

  // If user is not admin, don't render anything
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleAdd = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      image: 'https://placehold.co/600x400',
      author: user.name,
      authorAvatar: user.avatar || 'https://ui-avatars.com/api/?name=Admin&background=3f7e4e&color=fff',
      date: new Date().toLocaleDateString('ro-RO'),
      readTime: 5,
      categories: ['General'],
      comments: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    if (!post) return;
    setCurrentPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!post) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!post) return;
    
    if (onDeletePost) {
      onDeletePost(post.id);
    }
    
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

    if (currentPost.id && post && onEditPost) {
      // Edit existing post
      onEditPost({...post, ...currentPost} as BlogPost);
      toast({
        title: "Articol actualizat",
        description: "Articolul a fost actualizat cu succes.",
      });
    } else if (onAddPost) {
      // Add new post
      onAddPost();
      toast({
        title: "Articol adăugat",
        description: "Articolul a fost adăugat cu succes.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <>
      {post ? (
        // Edit/Delete actions for existing post
        <div className={`flex gap-2 ${className}`}>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
            className="gap-1"
          >
            <Pencil className="h-4 w-4" />
            Editează
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Șterge
          </Button>
        </div>
      ) : (
        // Add new post button
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă articol nou
        </Button>
      )}

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
            <p>Ești sigur că vrei să ștergi articolul "{post?.title}"?</p>
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
    </>
  );
};

export default AdminBlogActions;
