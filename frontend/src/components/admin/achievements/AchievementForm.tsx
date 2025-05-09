
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Achievement } from '@/types/user';

interface AchievementFormProps {
  achievement: Achievement | null;
  onSubmit: (achievement: any) => void;
  onCancel: () => void;
}

type FormValues = {
  name: string;
  description: string;
  category: 'learning' | 'community' | 'mastery';
  pointsRewarded: number;
  icon?: string;
};

const AchievementForm: React.FC<AchievementFormProps> = ({ 
  achievement,
  onSubmit,
  onCancel
}) => {
  const form = useForm<FormValues>({
    defaultValues: achievement ? {
      name: achievement.name,
      description: achievement.description,
      category: achievement.category || 'learning',
      pointsRewarded: achievement.pointsRewarded,
      icon: achievement.icon
    } : {
      name: '',
      description: '',
      category: 'learning',
      pointsRewarded: 50,
      icon: ''
    }
  });

  const handleSubmit = (values: FormValues) => {
    if (achievement) {
      onSubmit({
        ...achievement,
        ...values
      });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievement Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Perfect Score" {...field} />
              </FormControl>
              <FormDescription>
                The name displayed to users
              </FormDescription>
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
                  placeholder="e.g., Get 100% on any quiz" 
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain what the user needs to do to earn this achievement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="mastery">Mastery</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Group similar achievements together
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pointsRewarded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Reward</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many points users earn for this achievement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/icon.svg" {...field} />
              </FormControl>
              <FormDescription>
                URL to the icon for this achievement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{achievement ? 'Update' : 'Create'} Achievement</Button>
        </div>
      </form>
    </Form>
  );
};

export default AchievementForm;
