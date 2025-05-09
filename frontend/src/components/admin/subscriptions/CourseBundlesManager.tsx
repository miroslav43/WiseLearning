
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { mockCourseBundles } from '@/data/mockSubscriptionData';
import { CourseBundle } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Course } from '@/types/course';
import { Checkbox } from '@/components/ui/checkbox';

// Mock courses for selection
const mockCourses: Pick<Course, 'id' | 'title' | 'subject' | 'teacherName'>[] = [
  { id: 'course-1', title: 'Mathematics for BAC', subject: 'mathematics', teacherName: 'Prof. Ionescu' },
  { id: 'course-2', title: 'Romanian Literature', subject: 'romanian', teacherName: 'Prof. Popescu' },
  { id: 'course-3', title: 'History of Romania', subject: 'history', teacherName: 'Prof. Andreescu' },
  { id: 'course-4', title: 'Biology Fundamentals', subject: 'biology', teacherName: 'Prof. Georgescu' },
  { id: 'course-5', title: 'Physics for BAC', subject: 'physics', teacherName: 'Prof. Radulescu' },
];

const bundleFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  originalPrice: z.coerce.number().positive("Original price must be a positive number"),
  discount: z.coerce.number().min(0, "Discount must be positive").max(100, "Discount cannot exceed 100%"),
  courses: z.array(z.string()).min(1, "Select at least one course"),
  featuredBenefit: z.string().optional(),
  benefits: z.array(z.string()),
  imageUrl: z.string().optional()
});

type BundleFormValues = z.infer<typeof bundleFormSchema>;

const CourseBundlesManager: React.FC = () => {
  const [bundles, setBundles] = useState<CourseBundle[]>(mockCourseBundles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<CourseBundle | null>(null);
  const [currentBenefit, setCurrentBenefit] = useState('');
  
  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      courses: [],
      benefits: [],
      imageUrl: 'https://placehold.co/600x400/3f7e4e/FFF?text=Course+Bundle'
    }
  });

  // Update form when original price or discount changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'originalPrice' || name === 'discount') {
        const originalPrice = form.getValues('originalPrice') || 0;
        const discount = form.getValues('discount') || 0;
        
        if (originalPrice > 0 && discount > 0) {
          const calculatedPrice = originalPrice * (1 - discount / 100);
          form.setValue('price', parseFloat(calculatedPrice.toFixed(2)));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const openNewBundleDialog = () => {
    form.reset({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      courses: [],
      benefits: [],
      imageUrl: 'https://placehold.co/600x400/3f7e4e/FFF?text=Course+Bundle'
    });
    setEditingBundle(null);
    setIsDialogOpen(true);
  };

  const openEditBundleDialog = (bundle: CourseBundle) => {
    form.reset({
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      discount: bundle.discount,
      courses: bundle.courses,
      featuredBenefit: bundle.featuredBenefit,
      benefits: bundle.benefits,
      imageUrl: bundle.imageUrl
    });
    setEditingBundle(bundle);
    setIsDialogOpen(true);
  };

  const addBenefit = () => {
    if (!currentBenefit.trim()) return;
    
    const currentBenefits = form.getValues('benefits') || [];
    form.setValue('benefits', [...currentBenefits, currentBenefit]);
    setCurrentBenefit('');
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues('benefits') || [];
    form.setValue('benefits', currentBenefits.filter((_, i) => i !== index));
  };

  const onSubmit = (data: BundleFormValues) => {
    if (editingBundle) {
      // Update existing bundle
      setBundles(bundles.map(bundle => 
        bundle.id === editingBundle.id ? { ...data, id: editingBundle.id } as CourseBundle : bundle
      ));
      toast.success("Course bundle updated successfully");
    } else {
      // Create new bundle
      const newId = `bundle-${Date.now()}`;
      setBundles([...bundles, { ...data, id: newId } as CourseBundle]);
      toast.success("New course bundle created successfully");
    }
    setIsDialogOpen(false);
  };

  const deleteBundle = (id: string) => {
    if (confirm("Are you sure you want to delete this course bundle?")) {
      setBundles(bundles.filter(bundle => bundle.id !== id));
      toast.success("Course bundle deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Course Packages</h3>
        <Button onClick={openNewBundleDialog} className="gap-1">
          <Plus className="h-4 w-4" />
          Add New Package
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles.map((bundle) => (
            <TableRow key={bundle.id}>
              <TableCell className="font-medium">{bundle.name}</TableCell>
              <TableCell>{bundle.price} RON</TableCell>
              <TableCell>{bundle.discount}%</TableCell>
              <TableCell>{bundle.courses.length} courses</TableCell>
              <TableCell className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openEditBundleDialog(bundle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteBundle(bundle.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {bundles.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No course packages found. Create your first package by clicking "Add New Package".
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBundle ? 'Edit Course Package' : 'Create New Course Package'}
            </DialogTitle>
            <DialogDescription>
              {editingBundle ? 
                'Update the details of this course package' : 
                'Fill in the details to create a new course package'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Mathematics + Physics Bundle" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe what this package offers" 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (RON)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="e.g., 499.99"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="1" 
                          placeholder="e.g., 20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Price (RON)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="Calculated automatically"
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription>
                        Calculated based on original price and discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Courses in Package</FormLabel>
                    <FormDescription>
                      Select the courses to include in this package
                    </FormDescription>
                    <Card>
                      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mockCourses.map((course) => (
                          <FormItem
                            key={course.id}
                            className="flex items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(course.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, course.id]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((value) => value !== course.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium">
                                {course.title}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {course.subject} · {course.teacherName}
                              </FormDescription>
                            </div>
                          </FormItem>
                        ))}
                      </CardContent>
                    </Card>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredBenefit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Benefit (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Complete preparation for the BAC exam" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be highlighted as the main benefit of the package
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <Label>Benefits</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      value={currentBenefit}
                      onChange={(e) => setCurrentBenefit(e.target.value)}
                      placeholder="e.g., Access to premium courses"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addBenefit} variant="secondary">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-3 space-y-2">
                  <Label className="text-sm text-gray-500">Current Benefits</Label>
                  <ul className="space-y-2">
                    {form.watch('benefits')?.map((benefit, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{benefit}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeBenefit(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                    {(!form.watch('benefits') || form.watch('benefits').length === 0) && (
                      <li className="text-gray-400 text-sm italic">No benefits added yet</li>
                    )}
                  </ul>
                </div>
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Image URL for the package card" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an image that represents this package
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBundle ? 'Update Package' : 'Create Package'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseBundlesManager;
