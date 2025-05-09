
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const CoursePointsConfig: React.FC = () => {
  const [exchangeRate, setExchangeRate] = useState(10); // 1 EUR = 10 points
  const [coursePrices, setCoursePrices] = useState([
    { id: 1, name: 'Introduction to Mathematics', regular: 29.99, points: 299 },
    { id: 2, name: 'Advanced Computer Science', regular: 49.99, points: 499 },
    { id: 3, name: 'Romanian Language Basics', regular: 19.99, points: 199 },
    { id: 4, name: 'Biology Fundamentals', regular: 24.99, points: 249 },
  ]);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setExchangeRate(newRate);
  };

  const updateAllCoursePrices = () => {
    const updated = coursePrices.map(course => ({
      ...course,
      points: Math.round(course.regular * exchangeRate)
    }));
    setCoursePrices(updated);
    toast.success('All course point prices updated');
  };

  const handleCoursePointsChange = (id: number, points: number) => {
    setCoursePrices(coursePrices.map(course => 
      course.id === id ? { ...course, points } : course
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="exchange-rate">
                Points Exchange Rate (Points per €)
              </Label>
              <div className="flex items-center mt-2">
                <Input
                  id="exchange-rate"
                  type="number"
                  min={1}
                  step={0.1}
                  value={exchangeRate}
                  onChange={handleRateChange}
                  className="max-w-xs"
                />
                <span className="ml-2 text-muted-foreground">
                  {exchangeRate} points = €1.00
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This rate will be used for calculating course point prices
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={updateAllCoursePrices}>
            Recalculate All Course Prices
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Regular Price (€)</TableHead>
              <TableHead>Points Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coursePrices.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>€{course.regular.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={course.points}
                    onChange={(e) => handleCoursePointsChange(course.id, parseInt(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCoursePointsChange(course.id, Math.round(course.regular * exchangeRate));
                      toast.success(`Updated points for ${course.name}`);
                    }}
                  >
                    Apply Rate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CoursePointsConfig;
