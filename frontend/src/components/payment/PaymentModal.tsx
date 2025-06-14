import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import PaymentForm from "./PaymentForm";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  title?: string;
  description?: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = "eur",
  metadata = {},
  title = "Complete Payment",
  description = "Please provide your payment details to complete the transaction.",
  onPaymentSuccess,
  onPaymentError,
}) => {
  const handlePaymentSuccess = (paymentId: string) => {
    onPaymentSuccess(paymentId);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    onPaymentError(error);
    // Don't close the modal on error so the user can try again
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <PaymentForm
          amount={amount}
          currency={currency}
          metadata={metadata}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
