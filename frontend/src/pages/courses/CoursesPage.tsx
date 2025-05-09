
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import CourseCard from '@/components/courses/CourseCard';
import SubjectCard from '@/components/courses/SubjectCard';
import { mockCourses } from '@/data/mockData';
import { Subject } from '@/types/course';

const subjects: Subject[] = [
  'mathematics', 
  'romanian', 
  'history', 
  'biology', 
  'geography', 
  'computer-science'
];

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject ? course.subject === selectedSubject : true;
    return matchesSearch && matchesSubject;
  });

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(prevSubject => prevSubject === subject ? null : subject);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Toate cursurile pentru Bacalaureat</h1>
      
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
            className={`cursor-pointer transition-all ${selectedSubject === subject ? 'ring-2 ring-brand-500 scale-105' : ''}`}
          >
            <SubjectCard 
              subject={subject} 
              count={mockCourses.filter(c => c.subject === subject).length} 
            />
          </div>
        ))}
      </div>
      
      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {selectedSubject 
            ? `Cursuri de ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}`
            : 'Toate cursurile'
          }
        </h2>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nu am găsit cursuri care să corespundă criteriilor tale de căutare.</p>
            <Button variant="link" onClick={() => {
              setSearchQuery('');
              setSelectedSubject(null);
            }}>
              Resetează filtrele
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
