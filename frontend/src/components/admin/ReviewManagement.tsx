import RatingStars from "@/components/reviews/RatingStars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllReviews, updateReviewStatus } from "@/services/adminService";
import { formatDate } from "@/utils/dateUtils";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Review {
  id: string;
  type: "course" | "tutoring";
  rating: number;
  comment: string;
  status: string;
  userId: string;
  userName?: string;
  courseId?: string;
  courseTitle?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt: string;
  studentName?: string;
}

const ReviewManagement: React.FC = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filters
  const [courseFilter, setCourseFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const itemsPerPage = 10;

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const filters: any = {};
      if (courseFilter) filters.courseTitle = courseFilter;
      if (teacherFilter) filters.teacherName = teacherFilter;
      if (userFilter) filters.userName = userFilter;
      if (activeTab !== "all") filters.type = activeTab;

      const response = await getAllReviews(currentPage, itemsPerPage, filters);

      if (response && Array.isArray(response.data)) {
        setReviews(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalReviews(response.pagination?.totalItems || 0);
      } else {
        setReviews([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset pagination when changing tabs
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filtering
    fetchReviews();
  };

  const handleDeleteReview = (id: string) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      setProcessingIds((prev) => [...prev, reviewToDelete]);

      await updateReviewStatus(reviewToDelete, "deleted");

      // Remove the review from the list
      setReviews(reviews.filter((review) => review.id !== reviewToDelete));

      toast({
        title: "Recenzie ștearsă",
        description: "Recenzia a fost ștearsă cu succes.",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge recenzia. Încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== reviewToDelete));
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const courseReviews = reviews.filter((review) => review.type === "course");
  const tutoringReviews = reviews.filter(
    (review) => review.type === "tutoring"
  );

  if (loading && reviews.length === 0) {
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
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Filtrează după curs..."
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          />
          <Input
            placeholder="Filtrează după profesor..."
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
          />
          <Input
            placeholder="Filtrează după utilizator..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleApplyFilters}>Aplică filtre</Button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground">Total recenzii: {totalReviews}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            Toate recenziile ({totalReviews})
          </TabsTrigger>
          <TabsTrigger value="course">
            Recenzii cursuri (
            {activeTab === "all" ? courseReviews.length : totalReviews})
          </TabsTrigger>
          <TabsTrigger value="tutoring">
            Recenzii tutoriat (
            {activeTab === "all" ? tutoringReviews.length : totalReviews})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tip</TableHead>
                <TableHead>Utilizator</TableHead>
                <TableHead>Profesor / Curs</TableHead>
                <TableHead>Evaluare</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Comentariu</TableHead>
                <TableHead>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Nu există recenzii care să corespundă criteriilor de
                    filtrare.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.type === "course" ? "Curs" : "Tutoriat"}
                    </TableCell>
                    <TableCell>
                      {review.userName || review.studentName || "Necunoscut"}
                    </TableCell>
                    <TableCell>
                      {review.type === "course"
                        ? review.courseTitle
                        : review.teacherName || "Necunoscut"}
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} size="sm" />
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(review.createdAt))}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={processingIds.includes(review.id)}
                      >
                        {processingIds.includes(review.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Șterge
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent
          value="course"
          className="border rounded-md overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizator</TableHead>
                <TableHead>Curs</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Evaluare</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Comentariu</TableHead>
                <TableHead>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Nu există recenzii care să corespundă criteriilor de
                    filtrare.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.userName || "Necunoscut"}</TableCell>
                    <TableCell>{review.courseTitle || "-"}</TableCell>
                    <TableCell>{review.teacherName || "-"}</TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} size="sm" />
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(review.createdAt))}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={processingIds.includes(review.id)}
                      >
                        {processingIds.includes(review.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Șterge
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent
          value="tutoring"
          className="border rounded-md overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Evaluare</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Comentariu</TableHead>
                <TableHead>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Nu există recenzii care să corespundă criteriilor de
                    filtrare.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.userName || review.studentName || "Necunoscut"}
                    </TableCell>
                    <TableCell>{review.teacherName || "-"}</TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} size="sm" />
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(review.createdAt))}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={processingIds.includes(review.id)}
                      >
                        {processingIds.includes(review.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Șterge
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă ștergerea</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi această recenzie? Această acțiune nu
              poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteReview}
              disabled={
                !reviewToDelete || processingIds.includes(reviewToDelete)
              }
            >
              {reviewToDelete && processingIds.includes(reviewToDelete) ? (
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

export default ReviewManagement;
