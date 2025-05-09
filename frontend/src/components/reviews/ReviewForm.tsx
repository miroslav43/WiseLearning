
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RatingStars from './RatingStars';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Comentariul trebuie să conțină cel puțin 3 caractere').max(500, 'Comentariul nu poate depăși 500 de caractere'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => void;
  isSubmitting?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    }
  });

  const handleRatingChange = (rating: number) => {
    form.setValue('rating', rating);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evaluare</FormLabel>
              <FormControl>
                <RatingStars 
                  rating={field.value} 
                  interactive 
                  onChange={handleRatingChange} 
                  size="lg" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentariu</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Împărtășește-ți experiența..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-between text-xs text-gray-500">
                <FormMessage />
                <span>{field.value.length}/500</span>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Se trimite...' : 'Trimite recenzia'}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
