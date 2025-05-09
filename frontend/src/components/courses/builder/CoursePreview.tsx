
import React from 'react';
import { CourseFormData, Subject } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { getSubjectLabel } from '@/utils/subjectUtils';
import { BookOpen, FileQuestion, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface CoursePreviewProps {
  courseData: CourseFormData;
  setCourseData?: React.Dispatch<React.SetStateAction<CourseFormData>>;
  subjects?: { label: string; value: Subject }[];
  previewMode?: boolean;
}

export const CoursePreview: React.FC<CoursePreviewProps> = ({ 
  courseData, 
  setCourseData, 
  subjects = [],
  previewMode = false 
}) => {
  const totalLessons = courseData.topics.reduce((acc, topic) => acc + topic.lessons.length, 0);
  
  const handleChange = (field: keyof CourseFormData, value: any) => {
    if (setCourseData && !previewMode) {
      setCourseData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <Badge variant="outline" className="w-fit mb-2">{getSubjectLabel(courseData.subject)}</Badge>
                <CardTitle className="text-2xl">{courseData.title || 'Titlu curs'}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {courseData.description ? (
                  <div className="text-gray-600">{courseData.description}</div>
                ) : (
                  <div className="text-gray-400 italic">Adaugă o descriere pentru cursul tău</div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Conținut curs</h3>
              
              {courseData.topics.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Acest curs nu are încă niciun topic
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={courseData.topics.map(t => t.id)} className="space-y-2">
                  {courseData.topics.map((topic, index) => (
                    <AccordionItem key={topic.id} value={topic.id} className="border rounded-md overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Topic {index + 1}: {topic.title}</span>
                          <Badge variant="outline" className="ml-2">
                            {topic.lessons.length} {topic.lessons.length === 1 ? 'lecție' : 'lecții'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        {topic.description && (
                          <p className="text-gray-600 mb-4">{topic.description}</p>
                        )}
                        
                        {topic.lessons.length === 0 ? (
                          <div className="text-gray-400 italic text-center py-2">
                            Acest topic nu are conținut încă
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {topic.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                                {lesson.type === 'lesson' ? (
                                  <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                                ) : lesson.type === 'quiz' ? (
                                  <FileQuestion className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                  <FileText className="h-4 w-4 text-orange-500 mr-2" />
                                )}
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  {lesson.type === 'lesson' && lesson.duration > 0 && (
                                    <div className="text-xs text-gray-500">{lesson.duration} minute</div>
                                  )}
                                  {lesson.type === 'quiz' && lesson.quiz && (
                                    <div className="text-xs text-gray-500">
                                      {lesson.quiz.questions.length} {lesson.quiz.questions.length === 1 ? 'întrebare' : 'întrebări'}, {lesson.quiz.timeLimit} minute
                                    </div>
                                  )}
                                  {lesson.type === 'assignment' && lesson.assignment && (
                                    <div className="text-xs text-gray-500">
                                      {lesson.assignment.maxScore} puncte
                                      {lesson.assignment.dueDate && `, termen: ${new Date(lesson.assignment.dueDate).toLocaleDateString()}`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detalii curs</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Preț</div>
                    <div className="font-bold text-xl">{courseData.price} RON</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Topics</div>
                    <div>{courseData.topics.length}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Lecții totale</div>
                    <div>{totalLessons}</div>
                  </div>

                  {courseData.image && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Imagine copertă</div>
                      <img 
                        src={courseData.image} 
                        alt="Imagine copertă curs" 
                        className="rounded-md max-h-40 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400?text=Imagine+curs';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // Edit mode form
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Detalii curs</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Titlu curs</Label>
          <Input 
            id="title" 
            value={courseData.title} 
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Introducere în programare" 
          />
        </div>
        
        <div>
          <Label htmlFor="subject">Materie</Label>
          <Select 
            value={courseData.subject} 
            onValueChange={(value) => handleChange('subject', value)}
          >
            <SelectTrigger id="subject">
              <SelectValue placeholder="Selectează materia" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.value} value={subject.value}>
                  {subject.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="price">Preț (RON)</Label>
          <Input 
            id="price" 
            type="number" 
            value={courseData.price.toString()} 
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            placeholder="99.99" 
          />
        </div>
        
        <div>
          <Label htmlFor="image">URL imagine copertă</Label>
          <Input 
            id="image" 
            value={courseData.image} 
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg" 
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="description">Descriere</Label>
          <Textarea 
            id="description" 
            value={courseData.description} 
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrie cursul tău într-un mod atractiv pentru potențialii cursanți." 
            rows={4} 
          />
        </div>
      </div>
      
      {courseData.image && (
        <div>
          <Label>Previzualizare imagine</Label>
          <div className="mt-2 border rounded-md overflow-hidden max-w-sm">
            <img 
              src={courseData.image} 
              alt="Previzualizare copertă curs" 
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Imagine+curs';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
