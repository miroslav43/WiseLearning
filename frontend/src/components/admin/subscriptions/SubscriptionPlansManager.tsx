
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { mockSubscriptionPlans } from '@/data/mockSubscriptionData';
import { SubscriptionPlan, SubscriptionPeriod } from '@/types/subscription';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const subscriptionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  period: z.enum(['monthly', 'annual']),
  featuredBenefit: z.string().optional(),
  benefits: z.array(z.string()),
  isPopular: z.boolean().default(false)
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const SubscriptionPlansManager: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [currentBenefit, setCurrentBenefit] = useState('');

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      period: 'monthly',
      benefits: [],
      isPopular: false
    }
  });

  const openNewPlanDialog = () => {
    form.reset({
      name: '',
      description: '',
      price: 0,
      period: 'monthly',
      benefits: [],
      isPopular: false
    });
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const openEditPlanDialog = (plan: SubscriptionPlan) => {
    form.reset({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      featuredBenefit: plan.featuredBenefit,
      benefits: plan.benefits,
      isPopular: plan.isPopular || false
    });
    setEditingPlan(plan);
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

  const onSubmit = (data: SubscriptionFormValues) => {
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id ? { ...data, id: editingPlan.id } as SubscriptionPlan : plan
      ));
      toast.success("Subscription plan updated successfully");
    } else {
      // Create new plan
      const newId = `${data.period}-${Date.now()}`;
      setPlans([...plans, { ...data, id: newId } as SubscriptionPlan]);
      toast.success("New subscription plan created successfully");
    }
    setIsDialogOpen(false);
  };

  const deletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription plan?")) {
      setPlans(plans.filter(plan => plan.id !== id));
      toast.success("Subscription plan deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Subscription Plans</h3>
        <Button onClick={openNewPlanDialog} className="gap-1">
          <Plus className="h-4 w-4" />
          Add New Plan
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.period === 'monthly' ? 'Monthly' : 'Annual'}</TableCell>
              <TableCell>{plan.price} RON</TableCell>
              <TableCell>
                {plan.isPopular ? 
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Popular</span> : 
                  '-'}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openEditPlanDialog(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deletePlan(plan.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {plans.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No subscription plans found. Create your first plan by clicking "Add New Plan".
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan ? 
                'Update the details of this subscription plan' : 
                'Fill in the details to create a new subscription plan'
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
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Basic Monthly Access" />
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
                        placeholder="Describe what this plan offers" 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (RON)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="e.g., 49.99"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Period</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a billing period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="featuredBenefit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Benefit (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Unlimited access to all courses" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be highlighted as the main benefit of the plan
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
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mark as Popular</FormLabel>
                      <FormDescription>
                        This plan will be highlighted as the recommended option
                      </FormDescription>
                    </div>
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
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansManager;
