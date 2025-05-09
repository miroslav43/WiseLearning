
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseFormData } from '@/types/course';
import { BookOpen, Clock, FileQuestion, FileText } from 'lucide-react';

interface CoursePreviewFrameProps {
  courseData: CourseFormData;
}

export const CoursePreviewFrame: React.FC<CoursePreviewFrameProps> = ({ courseData }) => {
  // Calculate total duration
  const totalDuration = courseData.topics.reduce((acc, topic) => {
    return acc + topic.lessons.reduce((lessonAcc, lesson) => {
      return lessonAcc + (lesson.duration || 0);
    }, 0);
  }, 0);
  
  // Count different content types
  const contentCounts = courseData.topics.reduce((acc, topic) => {
    topic.lessons.forEach(lesson => {
      acc[lesson.type] = (acc[lesson.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const getSubjectLabel = (subject: string) => {
    const subjectMap: Record<string, string> = {
      'computer-science': 'Informatică',
      'romanian': 'Română',
      'mathematics': 'Matematică',
      'history': 'Istorie',
      'biology': 'Biologie',
      'geography': 'Geografie',
      'physics': 'Fizică',
      'chemistry': 'Chimie',
      'english': 'Engleză',
      'french': 'Franceză',
      'other': 'Altele'
    };
    
    return subjectMap[subject] || subject;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm text-center">
          <h1 className="text-lg text-muted-foreground">Previzualizare curs</h1>
          <p className="text-sm text-muted-foreground">Așa va arăta cursul tău pentru studenți</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2">{getSubjectLabel(courseData.subject)}</Badge>
                    <CardTitle className="text-2xl mb-2">
                      {courseData.title || 'Titlul cursului'}
                    </CardTitle>
                    <CardDescription>
                      {courseData.description || 'Descrierea cursului va apărea aici.'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{totalDuration} minute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{contentCounts['lesson'] || 0} lecții</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4 text-muted-foreground" />
                    <span>{contentCounts['quiz'] || 0} quizuri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{contentCounts['assignment'] || 0} teme</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Conținut curs</h3>
                  
                  {courseData.topics.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-lg">
                      <p className="text-muted-foreground">Adaugă module și lecții pentru a vedea structura cursului.</p>
                    </div>
                  ) : (
                    courseData.topics.map((topic, topicIndex) => (
                      <div key={topic.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                          <h4 className="font-medium">
                            Modulul {topicIndex + 1}: {topic.title || `Modul ${topicIndex + 1}`}
                          </h4>
                          {topic.description && (
                            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                          )}
                        </div>
                        
                        <div className="divide-y">
                          {topic.lessons.length === 0 ? (
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground">Acest modul nu conține lecții.</p>
                            </div>
                          ) : (
                            topic.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                                <div className="flex-shrink-0">
                                  {lesson.type === 'lesson' ? (
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                  ) : lesson.type === 'quiz' ? (
                                    <FileQuestion className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-orange-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {lesson.title || `${lessonIndex + 1}. Conținut`}
                                  </p>
                                  {lesson.description && (
                                    <p className="text-sm text-gray-600">{lesson.description}</p>
                                  )}
                                </div>
                                {lesson.duration > 0 && (
                                  <div className="flex-shrink-0 text-sm text-gray-500">
                                    {lesson.duration} min
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Detalii curs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <img 
                    src={courseData.image} 
                    alt={courseData.title || 'Course preview'} 
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
                
                <div className="text-2xl font-bold">
                  {courseData.price} RON
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Module:</span>
                    <span className="font-medium">{courseData.topics.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lecții:</span>
                    <span className="font-medium">{contentCounts['lesson'] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quizuri:</span>
                    <span className="font-medium">{contentCounts['quiz'] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teme:</span>
                    <span className="font-medium">{contentCounts['assignment'] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durată totală:</span>
                    <span className="font-medium">{totalDuration} minute</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <div className="text-center text-sm text-muted-foreground">
                  Previzualizare curs
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
