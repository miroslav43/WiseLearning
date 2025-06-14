import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as paymentService from "@/services/paymentService";
import { Building, CreditCard, Loader2, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PaymentFormProps {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = "eur",
  metadata = {},
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Card payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // Bank transfer state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Mobile payment state
  const [mobileNumber, setMobileNumber] = useState("");

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 3-4 digits
    const cvc = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvc(cvc);
  };

  const validateCardForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid card number");
      return false;
    }

    if (!cardExpiry || cardExpiry.length < 5) {
      toast.error("Please enter a valid expiry date");
      return false;
    }

    if (!cardCvc || cardCvc.length < 3) {
      toast.error("Please enter a valid CVC");
      return false;
    }

    if (!cardName) {
      toast.error("Please enter the cardholder name");
      return false;
    }

    return true;
  };

  const validateBankForm = () => {
    if (!bankName) {
      toast.error("Please select a bank");
      return false;
    }

    if (!accountNumber || accountNumber.length < 8) {
      toast.error("Please enter a valid account number");
      return false;
    }

    return true;
  };

  const validateMobileForm = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = false;

    switch (paymentMethod) {
      case "card":
        isValid = validateCardForm();
        break;
      case "bank_transfer":
        isValid = validateBankForm();
        break;
      case "mobile":
        isValid = validateMobileForm();
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create a payment intent
      const paymentIntentResponse = await paymentService.createPaymentIntent(
        amount,
        currency,
        metadata,
        [paymentMethod]
      );

      const paymentIntentId = paymentIntentResponse.data.id;

      // Confirm the payment intent (in a real app, this would be handled by Stripe.js)
      const confirmedIntent = await paymentService.confirmPaymentIntent(
        paymentIntentId,
        paymentMethod
      );

      if (confirmedIntent.data.status === "succeeded") {
        toast.success("Payment successful!");
        onPaymentSuccess(paymentIntentId);
      } else {
        toast.error("Payment failed. Please try again.");
        onPaymentError(new Error("Payment confirmation failed"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while processing your payment");
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment of{" "}
          {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency.toUpperCase(),
          }).format(amount / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="card"
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="bank_transfer">
              <Building className="h-4 w-4 mr-2" />
              Bank
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={handleCvcChange}
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={isProcessing}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="bank_transfer" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Select Bank</Label>
                <Select
                  value={bankName}
                  onValueChange={setBankName}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ing">ING Bank</SelectItem>
                    <SelectItem value="bnr">Romanian National Bank</SelectItem>
                    <SelectItem value="bcr">BCR</SelectItem>
                    <SelectItem value="bt">Banca Transilvania</SelectItem>
                    <SelectItem value="raiffeisen">Raiffeisen Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="RO12BANK1234567890123456"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div className="text-sm text-gray-500 mt-2">
                <p>
                  Bank transfer payments may take 1-3 business days to process.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  placeholder="+40 712 345 678"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={isProcessing}
                  required
                />
              </div>

              <div className="text-sm text-gray-500 mt-2">
                <p>You will receive an SMS with payment instructions.</p>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(amount / 100)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
