
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Code } from 'lucide-react';
import { Assignment, Subject, UnitTest } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';
import { RichTextEditor } from './RichTextEditor';

interface AssignmentEditorProps {
  assignment: Assignment;
  courseSubject: Subject;
  onChange: (assignment: Partial<Assignment>) => void;
}

export const AssignmentEditor: React.FC<AssignmentEditorProps> = ({ 
  assignment, 
  courseSubject,
  onChange 
}) => {
  const [showCodeTests, setShowCodeTests] = useState(false);

  const handleAddAllowedFileType = () => {
    const currentTypes = assignment.allowedFileTypes || [];
    onChange({ allowedFileTypes: [...currentTypes, ''] });
  };

  const handleAllowedFileTypeChange = (index: number, value: string) => {
    const updatedTypes = [...(assignment.allowedFileTypes || [])];
    updatedTypes[index] = value;
    onChange({ allowedFileTypes: updatedTypes });
  };

  const handleRemoveAllowedFileType = (index: number) => {
    const updatedTypes = [...(assignment.allowedFileTypes || [])];
    updatedTypes.splice(index, 1);
    onChange({ allowedFileTypes: updatedTypes });
  };

  const handleAddUnitTest = () => {
    const newTest: UnitTest = {
      id: uuidv4(),
      name: `Test ${(assignment.unitTests?.length || 0) + 1}`,
      testCode: '',
      expectedOutput: ''
    };
    
    onChange({ 
      unitTests: [...(assignment.unitTests || []), newTest] 
    });
  };

  const handleRemoveUnitTest = (index: number) => {
    const updatedTests = [...(assignment.unitTests || [])];
    updatedTests.splice(index, 1);
    onChange({ unitTests: updatedTests });
  };

  const handleUnitTestChange = (index: number, field: keyof UnitTest, value: string) => {
    const updatedTests = [...(assignment.unitTests || [])];
    updatedTests[index] = {
      ...updatedTests[index],
      [field]: value
    };
    
    onChange({ unitTests: updatedTests });
  };

  // Check if the course subject is computer-science to show code tests option
  const isComputerScience = courseSubject === 'computer-science';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titlu temă</label>
          <Input 
            value={assignment.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Titlul temei"
            className="border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Punctaj maxim</label>
          <Input 
            type="number"
            value={assignment.maxScore}
            onChange={(e) => onChange({ maxScore: parseInt(e.target.value) || 0 })}
            placeholder="100"
            className="border-gray-300"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Descriere temă</label>
        <RichTextEditor 
          value={assignment.description}
          onChange={(value) => onChange({ description: value })}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          id="allow-uploads"
          checked={assignment.allowFileUpload}
          onCheckedChange={(checked) => onChange({ allowFileUpload: checked })}
        />
        <Label htmlFor="allow-uploads">Permite încărcarea fișierelor</Label>
      </div>
      
      {assignment.allowFileUpload && (
        <div className="space-y-3">
          <label className="block text-sm font-medium mb-1">Tipuri de fișiere permise</label>
          
          {(assignment.allowedFileTypes?.length || 0) > 0 ? (
            <div className="space-y-2">
              {assignment.allowedFileTypes?.map((fileType, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={fileType}
                    onChange={(e) => handleAllowedFileTypeChange(index, e.target.value)}
                    placeholder=".pdf, .doc, .docx, etc."
                    className="border-gray-300"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveAllowedFileType(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nu sunt specificate tipuri de fișiere permise.</p>
          )}
          
          <Button variant="outline" size="sm" onClick={handleAddAllowedFileType}>
            <Plus className="h-3 w-3 mr-1" />
            Adaugă tip de fișier
          </Button>
        </div>
      )}
      
      {isComputerScience && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id="show-code-tests"
                checked={showCodeTests}
                onCheckedChange={setShowCodeTests}
              />
              <Label htmlFor="show-code-tests" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Teste de cod pentru evaluare automată
              </Label>
            </div>
          </div>
          
          {showCodeTests && (
            <div className="space-y-4 mt-3">
              <Button onClick={handleAddUnitTest} variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Adaugă test
              </Button>
              
              {(assignment.unitTests?.length || 0) > 0 ? (
                <div className="space-y-4">
                  {assignment.unitTests?.map((test, index) => (
                    <Card key={test.id} className="shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
                        <h4 className="font-medium">Test {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveUnitTest(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nume test</label>
                          <Input 
                            value={test.name}
                            onChange={(e) => handleUnitTestChange(index, 'name', e.target.value)}
                            placeholder="Nume test"
                            className="border-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Cod de test</label>
                          <Textarea 
                            value={test.testCode}
                            onChange={(e) => handleUnitTestChange(index, 'testCode', e.target.value)}
                            placeholder="Codul care va fi rulat pentru a testa soluția studentului"
                            rows={5}
                            className="border-gray-300 font-mono text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Rezultat așteptat</label>
                          <Textarea 
                            value={test.expectedOutput || ''}
                            onChange={(e) => handleUnitTestChange(index, 'expectedOutput', e.target.value)}
                            placeholder="Output-ul așteptat (opțional)"
                            rows={2}
                            className="border-gray-300 font-mono text-sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed rounded-lg p-6 text-center">
                  <p className="text-muted-foreground mb-3">Nu există teste pentru această temă.</p>
                  <Button onClick={handleAddUnitTest}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă primul test
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
