
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { formatDate } from '@/utils/dateUtils';
import ReviewCard from '@/components/reviews/ReviewCard';
import RatingStars from '@/components/reviews/RatingStars';
import { 
  useReviewService, 
  getAllCourseReviews, 
  getAllTutoringReviews 
} from '@/services/reviewService';
import { Review } from '@/types/course';
import { TutoringReview } from '@/types/tutoring';

const ReviewManagement: React.FC = () => {
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [tutoringReviews, setTutoringReviews] = useState<TutoringReview[]>([]);
  const [courseFilter, setCourseFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const { removeCourseReview, removeTutoringReview } = useReviewService();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setCourseReviews(getAllCourseReviews());
    setTutoringReviews(getAllTutoringReviews());
  };

  const handleDeleteCourseReview = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi această recenzie?')) {
      removeCourseReview(id);
      loadReviews();
    }
  };

  const handleDeleteTutoringReview = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi această recenzie?')) {
      removeTutoringReview(id);
      loadReviews();
    }
  };

  const filteredCourseReviews = courseReviews.filter(review => {
    return (
      (courseFilter === '' || review.courseTitle?.toLowerCase().includes(courseFilter.toLowerCase())) &&
      (teacherFilter === '' || review.teacherName?.toLowerCase().includes(teacherFilter.toLowerCase())) &&
      (userFilter === '' || review.userName.toLowerCase().includes(userFilter.toLowerCase()))
    );
  });

  const filteredTutoringReviews = tutoringReviews.filter(review => {
    return (
      (teacherFilter === '' || review.teacherName?.toLowerCase().includes(teacherFilter.toLowerCase())) &&
      (userFilter === '' || (review.studentName && review.studentName.toLowerCase().includes(userFilter.toLowerCase())))
    );
  });

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Recenzii cursuri ({filteredCourseReviews.length})</TabsTrigger>
          <TabsTrigger value="tutoring">Recenzii tutoriat ({filteredTutoringReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
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
              {filteredCourseReviews.map(review => (
                <TableRow key={review.id}>
                  <TableCell>{review.userName}</TableCell>
                  <TableCell>{review.courseTitle || '-'}</TableCell>
                  <TableCell>{review.teacherName || '-'}</TableCell>
                  <TableCell>
                    <RatingStars rating={review.rating} size="sm" />
                  </TableCell>
                  <TableCell>{formatDate(new Date(review.createdAt))}</TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteCourseReview(review.id)}
                    >
                      Șterge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourseReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nu există recenzii pentru cursuri care să corespundă criteriilor de filtrare.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="tutoring">
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
              {filteredTutoringReviews.map(review => (
                <TableRow key={review.id}>
                  <TableCell>{review.studentName}</TableCell>
                  <TableCell>{review.teacherName || '-'}</TableCell>
                  <TableCell>
                    <RatingStars rating={review.rating} size="sm" />
                  </TableCell>
                  <TableCell>{formatDate(new Date(review.createdAt))}</TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteTutoringReview(review.id)}
                    >
                      Șterge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTutoringReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nu există recenzii pentru tutoriat care să corespundă criteriilor de filtrare.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewManagement;
