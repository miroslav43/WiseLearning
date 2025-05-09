
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import CheckoutForm from '@/components/cart/CheckoutForm';

interface PaymentSectionProps {
  onSubmit: (values: any) => void;
  isProcessing: boolean;
  paymentError: string | null;
  onGoBack: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  onSubmit,
  isProcessing,
  paymentError,
  onGoBack
}) => {
  return (
    <div>
      <CheckoutForm 
        onSubmit={onSubmit} 
        isProcessing={isProcessing} 
      />
      
      {paymentError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm flex items-start">
          <X className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          <p>{paymentError}</p>
        </div>
      )}
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={onGoBack}
          disabled={isProcessing}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la coș
        </Button>
      </div>
    </div>
  );
};

export default PaymentSection;
