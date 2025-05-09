
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Users, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const referralSchema = z.object({
  referralCode: z.string().min(1, "Codul este obligatoriu"),
});

interface ReferralCodeFormProps {
  referralCode: string | null;
  applyReferralCode: (code: string) => void;
  removeReferralCode: () => void;
}

const ReferralCodeForm: React.FC<ReferralCodeFormProps> = ({ 
  referralCode, 
  applyReferralCode, 
  removeReferralCode 
}) => {
  const form = useForm<z.infer<typeof referralSchema>>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      referralCode: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof referralSchema>) => {
    applyReferralCode(values.referralCode);
    form.reset();
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <Users className="mr-2 h-4 w-4 text-brand-600" />
        Cod referral
      </h3>
      
      {referralCode ? (
        <div className="bg-brand-50 p-3 rounded border border-brand-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-brand-800">{referralCode}</p>
              <p className="text-sm text-brand-600">Discount și puncte bonus aplicate</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-500"
              onClick={removeReferralCode}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input 
                        placeholder="Introdu codul referral" 
                        {...field}
                        className="flex-grow"
                      />
                    </FormControl>
                    <Button type="submit">Aplică</Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </Card>
  );
};

export default ReferralCodeForm;
