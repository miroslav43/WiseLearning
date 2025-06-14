import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAllBlogPosts, updateBlogPostStatus } from "@/services/adminService";
import { BlogPost } from "@/types/blog";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(
    null
  );
  const { toast } = useToast();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogPosts(currentPage, itemsPerPage);

      if (response && Array.isArray(response.data)) {
        setPosts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalPosts(response.pagination?.totalItems || 0);
      } else {
        setPosts([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentPost({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      status: "draft",
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

  const handleChangeStatus = async (postId: string, newStatus: string) => {
    try {
      setProcessingIds((prev) => [...prev, postId]);

      await updateBlogPostStatus(postId, newStatus);

      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );

      toast({
        title: "Status actualizat",
        description: `Articolul a fost ${
          newStatus === "published" ? "publicat" : "ascuns"
        } cu succes.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to update post status:", err);
      toast({
        title: "Eroare",
        description:
          "Nu am putut actualiza statusul articolului. Încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  const confirmDelete = async () => {
    if (!currentPost?.id) return;

    try {
      setProcessingIds((prev) => [...prev, currentPost.id as string]);

      // In a real implementation, you would call a delete API here
      // await deleteBlogPost(currentPost.id);

      // For now, we'll just update the status to 'deleted'
      await updateBlogPostStatus(currentPost.id, "deleted");

      // Remove from local state
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== currentPost.id)
      );

      setIsDeleteDialogOpen(false);
      toast({
        title: "Articol șters",
        description: "Articolul a fost șters cu succes.",
      });
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge articolul. Încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== currentPost.id));
    }
  };

  const handleSave = async () => {
    if (!currentPost?.title || !currentPost?.excerpt) {
      toast({
        title: "Eroare",
        description: "Titlul și descrierea scurtă sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, you would call create/update API endpoints
    // For now, we'll just show a success message and close the dialog
    setIsDialogOpen(false);
    toast({
      title: currentPost.id ? "Articol actualizat" : "Articol creat",
      description: `Articolul a fost ${
        currentPost.id ? "actualizat" : "creat"
      } cu succes.`,
      variant: "default",
    });

    // Refresh the post list to show the latest changes
    fetchBlogPosts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
            Publicat
          </span>
        );
      case "draft":
        return (
          <span className="text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs">
            Ciornă
          </span>
        );
      case "archived":
        return (
          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs">
            Arhivat
          </span>
        );
      default:
        return (
          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">Total articole: {totalPosts}</p>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă articol nou
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titlu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data publicării</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nu există articole disponibile
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(post.status || "draft")}
                  </TableCell>
                  <TableCell>{post.author || "Necunoscut"}</TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("ro-RO")
                      : post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("ro-RO")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {post.status !== "published" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() =>
                            handleChangeStatus(post.id, "published")
                          }
                          disabled={processingIds.includes(post.id)}
                        >
                          {processingIds.includes(post.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
                          Publică
                        </Button>
                      )}
                      {post.status === "published" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(post.id, "draft")}
                          disabled={processingIds.includes(post.id)}
                        >
                          {processingIds.includes(post.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
                          Ascunde
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        disabled={processingIds.includes(post.id)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editează
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post)}
                        disabled={processingIds.includes(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Șterge
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentPost?.id ? "Editează articolul" : "Adaugă articol nou"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titlu</Label>
              <Input
                id="title"
                value={currentPost?.title || ""}
                onChange={(e) =>
                  setCurrentPost((prev) => ({
                    ...prev!,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Descriere scurtă</Label>
              <Textarea
                id="excerpt"
                value={currentPost?.excerpt || ""}
                onChange={(e) =>
                  setCurrentPost((prev) => ({
                    ...prev!,
                    excerpt: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Conținut</Label>
              <Textarea
                id="content"
                value={currentPost?.content || ""}
                onChange={(e) =>
                  setCurrentPost((prev) => ({
                    ...prev!,
                    content: e.target.value,
                  }))
                }
                className="min-h-[200px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">URL imagine</Label>
              <Input
                id="image"
                value={currentPost?.image || ""}
                onChange={(e) =>
                  setCurrentPost((prev) => ({
                    ...prev!,
                    image: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categories">Categorie</Label>
              <Input
                id="categories"
                value={currentPost?.categories?.[0] || ""}
                onChange={(e) =>
                  setCurrentPost((prev) => ({
                    ...prev!,
                    categories: [e.target.value],
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSave}>Salvează</Button>
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
            <p>
              Ești sigur că vrei să ștergi articolul "{currentPost?.title}"?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Această acțiune nu poate fi anulată.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={processingIds.includes(currentPost?.id || "")}
            >
              {processingIds.includes(currentPost?.id || "") ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
