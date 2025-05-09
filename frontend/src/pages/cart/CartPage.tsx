
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

// Import components
import CartHeader from '@/components/cart/CartHeader';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import CodeForms from '@/components/cart/CodeForms';
import SuccessMessage from '@/components/cart/SuccessMessage';
import InsufficientPointsMessage from '@/components/cart/InsufficientPointsMessage';
import PaymentSection from '@/components/cart/PaymentSection';
import OrderSummary from '@/components/cart/OrderSummary';

const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    clearCart, 
    checkoutWithPoints, 
    voucherCode, 
    applyVoucherCode, 
    removeVoucherCode,
    referralCode,
    applyReferralCode,
    removeReferralCode,
    calculatedDiscount,
    pointsToEarn
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { points, hasEnoughPoints, formatPoints } = usePoints();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'points_payment' | 'success'>('cart');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Safety check - ensure cart exists and has valid properties
  const safeCart = cart || { items: [], totalPrice: 0, totalPointsPrice: 0 };

  // Calculate final price after discounts
  const finalPrice = Math.max(0, safeCart.totalPrice - calculatedDiscount);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a finaliza comanda.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutStep('payment');
  };

  const handlePointsCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a finaliza comanda.",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughPoints(cart.totalPointsPrice)) {
      setCheckoutStep('points_payment');
      return;
    }

    setIsProcessing(true);
    checkoutWithPoints().then(success => {
      setIsProcessing(false);
      if (success) {
        setCheckoutStep('success');
      }
    });
  };

  const handlePaymentSubmit = (values: any) => {
    setIsProcessing(true);
    setPaymentError(null);
    
    console.log('Payment values:', values);
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate successful payment
      setIsProcessing(false);
      setCheckoutStep('success');
      clearCart();
    }, 2000);
  };

  // Handle empty cart
  if ((!safeCart.items || safeCart.items.length === 0) && checkoutStep === 'cart') {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartHeader title="Coșul meu" isEmpty={true} />
      </div>
    );
  }

  // Success screen
  if (checkoutStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartHeader title="Comandă finalizată" />
        <SuccessMessage />
      </div>
    );
  }

  // Points payment insufficient screen
  if (checkoutStep === 'points_payment') {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartHeader title="Puncte insuficiente" />
        <InsufficientPointsMessage 
          totalPointsPrice={cart.totalPointsPrice}
          userPoints={points}
          onGoBack={() => setCheckoutStep('cart')}
          formatPoints={formatPoints}
        />
        <OrderSummary 
          items={cart.items} 
          totalPrice={cart.totalPrice} 
          totalPointsPrice={cart.totalPointsPrice}
          discount={calculatedDiscount}
          finalPrice={finalPrice}
          pointsToEarn={pointsToEarn}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CartHeader title={checkoutStep === 'payment' ? 'Finalizare comandă' : 'Coșul meu'} />

      {checkoutStep === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems 
              items={cart.items} 
              onRemoveItem={removeFromCart} 
              onClearCart={clearCart}
              formatPrice={formatPrice}
              formatPoints={formatPoints}
              formatDate={formatDate}
            />
            
            <CodeForms 
              voucherCode={voucherCode}
              referralCode={referralCode}
              applyVoucherCode={applyVoucherCode}
              removeVoucherCode={removeVoucherCode}
              applyReferralCode={applyReferralCode}
              removeReferralCode={removeReferralCode}
            />
          </div>
          
          <div>
            <CartSummary 
              totalPrice={safeCart.totalPrice}
              totalPointsPrice={safeCart.totalPointsPrice}
              discount={calculatedDiscount}
              pointsToEarn={pointsToEarn}
              onCheckout={handleCheckout}
              onPointsCheckout={handlePointsCheckout}
              finalPrice={finalPrice}
              formatPrice={formatPrice}
              formatPoints={formatPoints}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PaymentSection 
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
              paymentError={paymentError}
              onGoBack={() => setCheckoutStep('cart')}
            />
          </div>
          
          <div>
            <OrderSummary 
              items={cart.items} 
              totalPrice={cart.totalPrice} 
              totalPointsPrice={cart.totalPointsPrice}
              discount={calculatedDiscount}
              finalPrice={finalPrice}
              pointsToEarn={pointsToEarn}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
