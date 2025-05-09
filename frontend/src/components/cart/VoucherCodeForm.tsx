
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tag, X } from 'lucide-react';
import { VoucherCode } from '@/contexts/cart/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const voucherSchema = z.object({
  voucherCode: z.string().min(1, "Codul este obligatoriu"),
});

interface VoucherCodeFormProps {
  voucherCode: VoucherCode | null;
  applyVoucherCode: (code: string) => void;
  removeVoucherCode: () => void;
}

const VoucherCodeForm: React.FC<VoucherCodeFormProps> = ({ 
  voucherCode, 
  applyVoucherCode, 
  removeVoucherCode 
}) => {
  const form = useForm<z.infer<typeof voucherSchema>>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherCode: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof voucherSchema>) => {
    applyVoucherCode(values.voucherCode);
    form.reset();
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <Tag className="mr-2 h-4 w-4 text-brand-600" />
        Cod voucher
      </h3>
      
      {voucherCode ? (
        <div className="bg-brand-50 p-3 rounded border border-brand-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-brand-800">{voucherCode.code}</p>
              <p className="text-sm text-brand-600">
                {voucherCode.type === 'percentage' && `${voucherCode.value}% reducere`}
                {voucherCode.type === 'fixed' && `${voucherCode.value} RON reducere`}
                {voucherCode.type === 'points' && `${voucherCode.value} puncte extra`}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-500"
              onClick={removeVoucherCode}
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
              name="voucherCode"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input 
                        placeholder="Introdu codul voucher" 
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

export default VoucherCodeForm;
