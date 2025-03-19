
import { useState } from "react";
import { PaymentStatus } from "../PaymentModal";

export function usePayment(
  selectedPaymentMethod: string,
  onPaymentComplete: (paymentMethod: string) => void,
  setPaymentStatus: React.Dispatch<React.SetStateAction<PaymentStatus>>
) {
  const handlePaymentSubmit = () => {
    if (selectedPaymentMethod === "cash") {
      setPaymentStatus("cash-input");
    } else {
      setPaymentStatus("processing");
      
      // Simulate payment processing for non-cash payments
      setTimeout(() => {
        setPaymentStatus("success");
        
        // After showing success message, close modal and notify parent
        setTimeout(() => {
          onPaymentComplete(selectedPaymentMethod);
        }, 1500);
      }, 2000);
    }
  };

  return {
    handlePaymentSubmit
  };
}
