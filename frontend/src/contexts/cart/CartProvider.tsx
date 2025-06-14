import { usePoints } from "@/contexts/PointsContext";
import { useToast } from "@/hooks/use-toast";
import { purchaseCoursesWithPoints } from "@/services/pointsService";
import { Cart, CartItem } from "@/types/cart";
import { Course } from "@/types/course";
import React, { useEffect, useState } from "react";
import { CartContext, defaultCart } from "./CartContext";
import { VoucherCode } from "./types";
import {
  calculateTotalPrice,
  validReferralCodes,
  validVoucherCodes,
} from "./utils";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { deductPoints, hasEnoughPoints } = usePoints();
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [voucherCode, setVoucherCode] = useState<VoucherCode | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [calculatedDiscount, setCalculatedDiscount] = useState<number>(0);
  const [pointsToEarn, setPointsToEarn] = useState<number>(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("bacCart");
    const savedVoucherCode = localStorage.getItem("bacVoucherCode");
    const savedReferralCode = localStorage.getItem("bacReferralCode");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert string dates back to Date objects
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCart(defaultCart);
      }
    }

    if (savedVoucherCode) {
      try {
        setVoucherCode(JSON.parse(savedVoucherCode));
      } catch (error) {
        console.error("Failed to parse voucher code from localStorage:", error);
      }
    }

    if (savedReferralCode) {
      setReferralCode(savedReferralCode);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bacCart", JSON.stringify(cart));
  }, [cart]);

  // Save voucher code to localStorage whenever it changes
  useEffect(() => {
    if (voucherCode) {
      localStorage.setItem("bacVoucherCode", JSON.stringify(voucherCode));
    } else {
      localStorage.removeItem("bacVoucherCode");
    }
  }, [voucherCode]);

  // Save referral code to localStorage whenever it changes
  useEffect(() => {
    if (referralCode) {
      localStorage.setItem("bacReferralCode", referralCode);
    } else {
      localStorage.removeItem("bacReferralCode");
    }
  }, [referralCode]);

  // Calculate discount and points to earn whenever cart, voucher or referral code changes
  useEffect(() => {
    let discount = 0;
    let extraPoints = 0;

    // Apply voucher code discount
    if (voucherCode && voucherCode.valid) {
      if (voucherCode.type === "percentage") {
        discount += (cart.totalPrice * voucherCode.value) / 100;
      } else if (voucherCode.type === "fixed") {
        discount += Math.min(voucherCode.value, cart.totalPrice);
      } else if (voucherCode.type === "points") {
        extraPoints += voucherCode.value;
      }
    }

    // Apply referral code discount and points
    if (referralCode) {
      const refCode =
        validReferralCodes[referralCode as keyof typeof validReferralCodes];
      if (refCode) {
        discount += (cart.totalPrice * refCode.discount) / 100;
        extraPoints += refCode.points;
      }
    }

    // Base points to earn (10% of purchase price)
    const basePoints = Math.floor(cart.totalPrice * 0.1);

    setCalculatedDiscount(discount);
    setPointsToEarn(basePoints + extraPoints);
  }, [cart, voucherCode, referralCode]);

  const addToCart = (course: Course) => {
    if (isInCart(course.id)) {
      toast({
        title: "Curs deja adăugat",
        description: "Acest curs este deja în coșul tău.",
        variant: "default",
      });
      return;
    }

    const newItem: CartItem = {
      id: `cart-${course.id}-${Date.now()}`,
      courseId: course.id,
      title: course.title,
      price: course.price,
      pointsPrice: course.pointsPrice,
      image: course.image,
      teacherName: course.teacherName,
      subject: course.subject,
      addedAt: new Date(),
    };

    const updatedItems = [...cart.items, newItem];
    const { moneyPrice, pointsPrice } = calculateTotalPrice(updatedItems);

    setCart({
      items: updatedItems,
      totalPrice: moneyPrice,
      totalPointsPrice: pointsPrice,
    });

    toast({
      title: "Curs adăugat în coș",
      description: `${course.title} a fost adăugat în coșul tău.`,
      variant: "default",
    });
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cart.items.filter((item) => item.id !== itemId);
    const { moneyPrice, pointsPrice } = calculateTotalPrice(updatedItems);

    setCart({
      items: updatedItems,
      totalPrice: moneyPrice,
      totalPointsPrice: pointsPrice,
    });

    toast({
      title: "Curs eliminat din coș",
      description: "Cursul a fost eliminat din coșul tău.",
      variant: "default",
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0, totalPointsPrice: 0 });

    toast({
      title: "Coș golit",
      description: "Toate cursurile au fost eliminate din coșul tău.",
      variant: "default",
    });
  };

  const isInCart = (courseId: string): boolean => {
    return cart.items.some((item) => item.courseId === courseId);
  };

  const applyVoucherCode = (code: string) => {
    // Check if the code is valid
    const voucherDetails = validVoucherCodes[code];

    if (!voucherDetails) {
      toast({
        title: "Cod voucher invalid",
        description: "Codul introdus nu este valid sau a expirat.",
        variant: "destructive",
      });
      return;
    }

    const newVoucherCode: VoucherCode = {
      code,
      type: voucherDetails.type,
      value: voucherDetails.value,
      valid: true,
    };

    setVoucherCode(newVoucherCode);

    toast({
      title: "Cod voucher aplicat",
      description: "Codul de voucher a fost aplicat cu succes.",
      variant: "default",
    });
  };

  const removeVoucherCode = () => {
    setVoucherCode(null);

    toast({
      title: "Cod voucher eliminat",
      description: "Codul de voucher a fost eliminat.",
      variant: "default",
    });
  };

  const applyReferralCode = (code: string) => {
    // Check if the code is valid
    const refCode = validReferralCodes[code as keyof typeof validReferralCodes];

    if (!refCode) {
      toast({
        title: "Cod referral invalid",
        description: "Codul introdus nu este valid.",
        variant: "destructive",
      });
      return;
    }

    setReferralCode(code);

    toast({
      title: "Cod referral aplicat",
      description: "Codul de referral a fost aplicat cu succes.",
      variant: "default",
    });
  };

  const removeReferralCode = () => {
    setReferralCode(null);

    toast({
      title: "Cod referral eliminat",
      description: "Codul de referral a fost eliminat.",
      variant: "default",
    });
  };

  const checkoutWithPoints = async (): Promise<boolean> => {
    if (cart.items.length === 0) {
      toast({
        title: "Coș gol",
        description: "Nu ai niciun curs în coș.",
        variant: "destructive",
      });
      return false;
    }

    if (!hasEnoughPoints(cart.totalPointsPrice)) {
      toast({
        title: "Puncte insuficiente",
        description: `Ai nevoie de ${cart.totalPointsPrice} puncte pentru a achiziționa aceste cursuri.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Use the new purchase courses endpoint that creates enrollments
      const courseIds = cart.items.map((item) => item.courseId);
      const description = `Achiziție: ${cart.items.length} ${
        cart.items.length === 1 ? "curs" : "cursuri"
      }`;

      const response = await purchaseCoursesWithPoints(
        courseIds,
        cart.totalPointsPrice,
        description
      );

      if (response.data.success) {
        // Clear the cart after successful purchase
        clearCart();
        // Also clear any voucher or referral codes
        removeVoucherCode();
        removeReferralCode();

        toast({
          title: "Achiziție reușită!",
          description:
            "Cursurile au fost adăugate în contul tău. Vei fi redirecționat către cursurile tale.",
          variant: "default",
        });

        // Redirect to my courses page after a short delay to show the toast
        setTimeout(() => {
          window.location.href = "/my-courses";
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Points checkout error:", error);
      toast({
        title: "Eroare la procesare",
        description: "A apărut o eroare la procesarea plății cu puncte.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        checkoutWithPoints,
        voucherCode,
        applyVoucherCode,
        removeVoucherCode,
        referralCode,
        applyReferralCode,
        removeReferralCode,
        calculatedDiscount,
        pointsToEarn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
