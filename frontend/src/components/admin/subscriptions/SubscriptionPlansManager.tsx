import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
} from "@/services/adminService";
import { SubscriptionPlan } from "@/types/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const subscriptionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  period: z.enum(["monthly", "annual"]),
  featuredBenefit: z.string().optional(),
  benefits: z.array(z.string()),
  isPopular: z.boolean().default(false),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const SubscriptionPlansManager: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      period: "monthly",
      benefits: [],
      isPopular: false,
    },
  });

  // Fetch subscription plans when component mounts
  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscriptionPlans();

      if (response && Array.isArray(response.data)) {
        setPlans(response.data);
      } else {
        setPlans([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subscription plans:", err);
      setError("Failed to load subscription plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openNewPlanDialog = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      period: "monthly",
      benefits: [],
      isPopular: false,
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
      isPopular: plan.isPopular || false,
    });
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const addBenefit = () => {
    if (!currentBenefit.trim()) return;

    const currentBenefits = form.getValues("benefits") || [];
    form.setValue("benefits", [...currentBenefits, currentBenefit]);
    setCurrentBenefit("");
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues("benefits") || [];
    form.setValue(
      "benefits",
      currentBenefits.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    setProcessing(true);
    try {
      if (editingPlan) {
        // Update existing plan
        await updateSubscriptionPlan(editingPlan.id, data);
        setPlans(
          plans.map((plan) =>
            plan.id === editingPlan.id
              ? ({ ...data, id: editingPlan.id } as SubscriptionPlan)
              : plan
          )
        );
        toast.success("Subscription plan updated successfully");
      } else {
        // Create new plan
        const response = await createSubscriptionPlan(data);
        const newPlan = response.data;
        setPlans([...plans, newPlan]);
        toast.success("New subscription plan created successfully");
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save subscription plan:", err);
      toast.error("Failed to save the subscription plan. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription plan?")) {
      setProcessing(true);
      try {
        await deleteSubscriptionPlan(id);
        setPlans(plans.filter((plan) => plan.id !== id));
        toast.success("Subscription plan deleted successfully");
      } catch (err) {
        console.error("Failed to delete subscription plan:", err);
        toast.error(
          "Failed to delete the subscription plan. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        <p>{error}</p>
        <Button
          variant="outline"
          onClick={fetchSubscriptionPlans}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Subscription Plans</h3>
        <Button
          onClick={openNewPlanDialog}
          className="gap-1"
          disabled={processing}
        >
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
              <TableCell>
                {plan.period === "monthly" ? "Monthly" : "Annual"}
              </TableCell>
              <TableCell>{plan.price} RON</TableCell>
              <TableCell>
                {plan.isPopular ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Popular
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditPlanDialog(plan)}
                  disabled={processing}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePlan(plan.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={processing}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {plans.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No subscription plans found. Create your first plan by clicking
                "Add New Plan".
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPlan
                ? "Edit Subscription Plan"
                : "Create New Subscription Plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update the details of this subscription plan"
                : "Fill in the details to create a new subscription plan"}
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
                      <Input
                        {...field}
                        placeholder="e.g., Basic Monthly Access"
                      />
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
                        <Input {...field} type="number" min="0" />
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
                            <SelectValue placeholder="Select billing period" />
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
                    <FormLabel>Featured Benefit (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Most Popular Choice"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      A highlighted benefit that will be displayed prominently
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel className="text-base">Featured Plan</FormLabel>
                      <FormDescription>
                        Mark this as the most popular subscription plan
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Benefits</Label>

                <div className="flex gap-2">
                  <Input
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    placeholder="e.g., Access to all courses"
                  />
                  <Button
                    type="button"
                    onClick={addBenefit}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2 mt-2">
                        {field.value?.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span>{benefit}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBenefit(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {field.value?.length === 0 && (
                          <div className="text-sm text-muted-foreground p-2">
                            No benefits added yet. Add benefits to make the plan
                            attractive.
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPlan ? "Update Plan" : "Create Plan"}
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
