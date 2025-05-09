
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, PlayCircle, BookOpen } from 'lucide-react';
import { Topic, Lesson } from '@/types/course';

interface CourseTopicsProps {
  courseId: string;
  topics: Topic[];
  expandedTopics: {[key: string]: boolean};
  toggleTopic: (topicId: string) => void;
  formatDuration: (minutes: number) => string;
}

const CourseTopics: React.FC<CourseTopicsProps> = ({ 
  courseId, 
  topics, 
  expandedTopics, 
  toggleTopic, 
  formatDuration 
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Conținutul cursului</h2>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>{topics.length} secțiuni • {topics.reduce((total, topic) => total + topic.lessons.length, 0)} lecții • {formatDuration(topics.reduce((total, topic) => total + topic.lessons.reduce((subtotal, lesson) => subtotal + lesson.duration, 0), 0))}</span>
          <button className="text-primary hover:underline">Expandează toate</button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          {topics.map((topic, index) => (
            <div key={topic.id}>
              <Collapsible 
                open={expandedTopics[topic.id]} 
                onOpenChange={() => toggleTopic(topic.id)}
              >
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer" onClick={() => toggleTopic(topic.id)}>
                  <div className="flex items-center gap-2">
                    {expandedTopics[topic.id] ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <div className="text-left">
                      <h3 className="font-medium">{topic.title}</h3>
                      <p className="text-sm text-gray-500">
                        {topic.lessons.length} lecții • {formatDuration(topic.lessons.reduce((sum, lesson) => sum + lesson.duration, 0))}
                      </p>
                    </div>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="border-t">
                    {topic.lessons.map((lesson, lessonIndex) => (
                      <Link 
                        key={lesson.id}
                        to={`/courses/${courseId}/lessons/${lesson.id}`}
                        className="flex items-center p-4 hover:bg-gray-50"
                      >
                        {lesson.type === 'lesson' ? (
                          <PlayCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        ) : lesson.type === 'quiz' ? (
                          <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{lesson.title}</h4>
                          <p className="text-xs text-gray-500">{formatDuration(lesson.duration)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Previzualizare</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              {index < topics.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTopics;
