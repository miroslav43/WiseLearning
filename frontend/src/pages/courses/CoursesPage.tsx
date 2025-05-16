import CourseCard from "@/components/courses/CourseCard";
import SubjectCard from "@/components/courses/SubjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPublishedCourses } from "@/services/courseService";
import { Course, Subject } from "@/types/course";
import { Filter, Loader2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const subjects: Subject[] = [
  "mathematics",
  "romanian",
  "history",
  "biology",
  "geography",
  "computer-science",
];

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters: { subject?: string; search?: string } = {};
        if (selectedSubject) {
          filters.subject = selectedSubject;
        }
        if (searchQuery) {
          filters.search = searchQuery;
        }

        const data = await fetchPublishedCourses(filters);
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Nu am putut încărca cursurile. Te rugăm să încerci din nou.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [selectedSubject, searchQuery]);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject((prevSubject) =>
      prevSubject === subject ? null : subject
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Toate cursurile pentru Bacalaureat
      </h1>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            placeholder="Caută cursuri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrează
        </Button>
      </div>

      {/* Subjects */}
      <h2 className="text-xl font-semibold mb-4">Categorii de materii</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {subjects.map((subject) => (
          <div
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className={`cursor-pointer transition-all ${
              selectedSubject === subject
                ? "ring-2 ring-brand-500 scale-105"
                : ""
            }`}
          >
            <SubjectCard
              subject={subject}
              count={courses.filter((c) => c.subject === subject).length}
            />
          </div>
        ))}
      </div>

      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {selectedSubject
            ? `Cursuri de ${
                selectedSubject.charAt(0).toUpperCase() +
                selectedSubject.slice(1)
              }`
            : "Toate cursurile"}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            <span className="ml-2">Se încarcă cursurile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject(null);
              }}
            >
              Încearcă din nou
            </Button>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nu am găsit cursuri care să corespundă criteriilor tale de
              căutare.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject(null);
              }}
            >
              Resetează filtrele
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
