import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, MessageCircle, Search, Star } from "lucide-react";
import { useState } from "react";

const TeacherReviewsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Sample mock data for reviews
  const mockReviews = [
    {
      id: "1",
      studentName: "Ana Maria",
      courseName: "Informatică: Algoritmi",
      rating: 5,
      comment:
        "Un curs excelent, am învățat foarte multe despre algoritmi și complexitate.",
      date: "2025-04-10T14:30:00Z",
      type: "course",
    },
    {
      id: "2",
      studentName: "Mihai Ionescu",
      courseName: "Informatică: Baze de date",
      rating: 4,
      comment:
        "Foarte bine structurat, am apreciat exercițiile practice și feedback-ul prompt.",
      date: "2025-04-08T09:15:00Z",
      type: "course",
    },
    {
      id: "3",
      studentName: "Elena Popa",
      courseName: null,
      rating: 5,
      comment:
        "Meditațiile sunt extrem de utile, profesorul explică foarte clar conceptele.",
      date: "2025-04-05T17:45:00Z",
      type: "tutoring",
    },
    {
      id: "4",
      studentName: "Andrei Dumitrescu",
      courseName: "Programare web",
      rating: 3,
      comment: "Cursul este bun, dar ar putea avea mai multe exemple practice.",
      date: "2025-04-01T11:20:00Z",
      type: "course",
    },
  ];

  if (!user || user.role !== "teacher") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recenziile mele</h1>
          <p>
            Trebuie să fii autentificat ca profesor pentru a accesa această
            pagină.
          </p>
        </div>
      </div>
    );
  }

  const filteredReviews = mockReviews.filter(
    (review) =>
      (activeTab === "all" || review.type === activeTab) &&
      (review.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.courseName &&
          review.courseName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const courseReviews = mockReviews.filter(
    (review) => review.type === "course"
  );
  const tutoringReviews = mockReviews.filter(
    (review) => review.type === "tutoring"
  );

  // Calculate average ratings
  const calculateAverage = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverage(mockReviews);
  const courseAverageRating = calculateAverage(courseReviews);
  const tutoringAverageRating = calculateAverage(tutoringReviews);

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400" : "fill-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Recenziile mele</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating general
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{averageRating}</div>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(parseFloat(averageRating)))}
                <span className="text-sm text-muted-foreground">
                  ({mockReviews.length} recenzii)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating cursuri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{courseAverageRating}</div>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(parseFloat(courseAverageRating)))}
                <span className="text-sm text-muted-foreground">
                  ({courseReviews.length} recenzii)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rating meditații
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{tutoringAverageRating}</div>
              <div className="flex items-center gap-2">
                {renderStars(Math.round(parseFloat(tutoringAverageRating)))}
                <span className="text-sm text-muted-foreground">
                  ({tutoringReviews.length} recenzii)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toate recenziile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută în recenzii..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="justify-center md:w-auto"
              onClick={() => setSearchQuery("")}
            >
              Resetează
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6 w-full max-w-md">
              <TabsTrigger value="all">
                Toate ({mockReviews.length})
              </TabsTrigger>
              <TabsTrigger value="course">
                Cursuri ({courseReviews.length})
              </TabsTrigger>
              <TabsTrigger value="tutoring">
                Meditații ({tutoringReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {review.studentName}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating)}
                                <Badge variant="outline">
                                  {review.type === "course"
                                    ? "Curs"
                                    : "Meditație"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(review.date).toLocaleDateString(
                                "ro-RO"
                              )}
                            </div>
                          </div>
                          {review.courseName && (
                            <div className="text-sm text-muted-foreground">
                              Pentru: {review.courseName}
                            </div>
                          )}
                          <div className="mt-2 border-l-4 pl-3 py-1 border-gray-200">
                            {review.comment}
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              Răspunde
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-4">
                    Nu a fost găsită nicio recenzie care să corespundă căutării.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherReviewsPage;
