
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from './rich-text-editor';
import { CourseFormData, UnitTest } from '@/types/course';
import { FileText, Calendar, Upload, Code, PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssignmentBuilderProps {
  assignment: NonNullable<CourseFormData['topics'][0]['lessons'][0]['assignment']>;
  onUpdate: (data: Partial<NonNullable<CourseFormData['topics'][0]['lessons'][0]['assignment']>>) => void;
  courseSubject: CourseFormData['subject'];
}

export const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({ assignment, onUpdate, courseSubject }) => {
  const [showUnitTests, setShowUnitTests] = useState(true);
  
  const handleAllowedFileTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const fileTypes = input.split(',').map(type => {
      let cleanType = type.trim();
      if (!cleanType.startsWith('.') && cleanType !== '') {
        cleanType = '.' + cleanType;
      }
      return cleanType;
    }).filter(type => type !== '');
    
    onUpdate({ allowedFileTypes: fileTypes });
  };

  const addUnitTest = () => {
    const unitTests = assignment.unitTests || [];
    onUpdate({
      unitTests: [
        ...unitTests,
        {
          id: uuidv4(),
          name: `Test ${unitTests.length + 1}`,
          testCode: '',
          expectedOutput: ''
        }
      ]
    });
  };

  const updateUnitTest = (testId: string, data: Partial<UnitTest>) => {
    const unitTests = assignment.unitTests || [];
    onUpdate({
      unitTests: unitTests.map(test => 
        test.id === testId ? { ...test, ...data } : test
      )
    });
  };

  const removeUnitTest = (testId: string) => {
    const unitTests = assignment.unitTests || [];
    onUpdate({
      unitTests: unitTests.filter(test => test.id !== testId)
    });
  };

  const isComputerScience = courseSubject === 'computer-science';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-orange-500" />
          <label className="text-sm font-medium">Titlu temă</label>
        </div>
        <Input
          value={assignment.title}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Titlul temei"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-orange-500" />
          <label className="text-sm font-medium">Descriere temă</label>
        </div>
        <RichTextEditor
          value={assignment.description}
          onChange={value => onUpdate({ description: value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <label className="text-sm font-medium">Data limită (opțional)</label>
          </div>
          <Input
            type="date"
            value={assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : ''}
            onChange={e => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onUpdate({ dueDate: date });
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-orange-500" />
            <label className="text-sm font-medium">Punctaj maxim</label>
          </div>
          <Input
            type="number"
            value={assignment.maxScore}
            onChange={e => onUpdate({ maxScore: parseInt(e.target.value) || 100 })}
            placeholder="100"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center">
          <Upload className="h-4 w-4 mr-2 text-orange-500" />
          <label className="text-sm font-medium">Opțiuni încărcare fișiere</label>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="allow-file-upload"
            checked={assignment.allowFileUpload}
            onCheckedChange={(checked) => {
              onUpdate({ allowFileUpload: checked === true });
            }}
          />
          <label 
            htmlFor="allow-file-upload" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Permite încărcarea de fișiere
          </label>
        </div>

        {assignment.allowFileUpload && (
          <div className="pl-6 space-y-2">
            <label className="text-sm font-medium">Tipuri de fișiere permise</label>
            <Input
              value={(assignment.allowedFileTypes || []).join(', ')}
              onChange={handleAllowedFileTypesChange}
              placeholder=".pdf, .doc, .docx, .jpg, .png"
            />
            <p className="text-xs text-gray-500">
              Introdu extensiile de fișiere separate prin virgulă (ex: .pdf, .doc, .jpg)
            </p>
          </div>
        )}
      </div>

      {isComputerScience && (
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-4 w-4 mr-2 text-green-600" />
              <label className="text-sm font-medium">Unit Tests pentru evaluare automată</label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowUnitTests(!showUnitTests)}
            >
              {showUnitTests ? 'Ascunde' : 'Arată'} teste
            </Button>
          </div>
          
          {showUnitTests && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Adaugă unit tests pentru a evalua automat codul elevilor. Testele vor rula
                automat atunci când un elev trimite un răspuns la această temă.
              </p>
              
              {(assignment.unitTests || []).map((test, index) => (
                <Card key={test.id} className="border border-gray-200">
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">
                        <Input
                          value={test.name}
                          onChange={e => updateUnitTest(test.id, { name: e.target.value })}
                          placeholder="Nume test"
                          className="h-7 text-sm"
                        />
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUnitTest(test.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3 px-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Cod test
                      </label>
                      <Textarea
                        value={test.testCode}
                        onChange={e => updateUnitTest(test.id, { testCode: e.target.value })}
                        placeholder="def test_function(student_code):\n    # Scrie codul testului aici\n    assert student_function(10) == 20"
                        className="font-mono text-xs h-32"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Output așteptat (opțional)
                      </label>
                      <Textarea
                        value={test.expectedOutput || ''}
                        onChange={e => updateUnitTest(test.id, { expectedOutput: e.target.value })}
                        placeholder="Rezultatul așteptat al execuției (dacă se poate verifica prin compararea outputului)"
                        className="font-mono text-xs h-20"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={addUnitTest}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adaugă unit test
              </Button>
              
              {(assignment.unitTests || []).length === 0 && (
                <div className="p-4 border border-dashed rounded-md text-center">
                  <p className="text-sm text-gray-500">
                    Nu există unit tests pentru această temă. 
                    Adaugă unit tests pentru a evalua automat codul elevilor.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
