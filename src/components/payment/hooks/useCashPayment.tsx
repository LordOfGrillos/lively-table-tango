
import { useState } from "react";
import { PaymentStatus } from "../PaymentModal";

export function useCashPayment(
  calculateTotalWithTip: () => number,
  setPaymentStatus: React.Dispatch<React.SetStateAction<PaymentStatus>>,
  selectedPaymentMethod: string,
  onPaymentComplete: (paymentMethod: string) => void
) {
  const [cashReceived, setCashReceived] = useState<string>("");
  const [changeAmount, setChangeAmount] = useState<number>(0);
  
  const handleCashAmountSubmit = () => {
    const receivedAmount = parseFloat(cashReceived);
    const totalWithTip = calculateTotalWithTip();
    
    if (isNaN(receivedAmount) || receivedAmount < totalWithTip) {
      return; // Don't proceed if invalid amount or less than total with tip
    }
    
    const change = receivedAmount - totalWithTip;
    setChangeAmount(change);
    setPaymentStatus("cash-change");
  };
  
  const handleCashPaymentComplete = () => {
    setPaymentStatus("success");
    
    // After showing success message, close modal and notify parent
    setTimeout(() => {
      onPaymentComplete(selectedPaymentMethod);
    }, 1500);
  };

  return {
    cashReceived,
    setCashReceived,
    changeAmount,
    handleCashAmountSubmit,
    handleCashPaymentComplete
  };
}
