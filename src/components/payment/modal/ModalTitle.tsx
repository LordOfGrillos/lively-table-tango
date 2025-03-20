
import React from "react";
import { PaymentStatus } from "../PaymentModal";
import { CreditCard, SplitSquareVertical, User } from "lucide-react";

interface ModalTitleProps {
  paymentStatus: PaymentStatus;
  getCurrentCustomerName?: () => string;
}

export function ModalTitle({ paymentStatus, getCurrentCustomerName }: ModalTitleProps) {
  if (paymentStatus === "processing") {
    return <h2 className="text-xl font-semibold">Processing Payment</h2>;
  }
  
  if (paymentStatus === "success") {
    return <h2 className="text-xl font-semibold">Payment Complete</h2>;
  }
  
  if (paymentStatus === "customer-success") {
    const customerName = getCurrentCustomerName ? getCurrentCustomerName() : "";
    return (
      <h2 className="text-xl font-semibold flex items-center">
        <User className="h-5 w-5 mr-2 text-green-600" />
        {customerName}'s Payment Complete
      </h2>
    );
  }
  
  if (paymentStatus === "split-bill") {
    return (
      <h2 className="text-xl font-semibold flex items-center">
        <SplitSquareVertical className="h-5 w-5 mr-2 text-app-purple" />
        Split Bill
      </h2>
    );
  }
  
  if (paymentStatus === "split-summary") {
    return (
      <h2 className="text-xl font-semibold flex items-center">
        <SplitSquareVertical className="h-5 w-5 mr-2 text-app-purple" />
        Split Bill Summary
      </h2>
    );
  }
  
  if (paymentStatus.startsWith("customer-")) {
    const customerName = getCurrentCustomerName ? getCurrentCustomerName() : "";
    return (
      <h2 className="text-xl font-semibold flex items-center">
        <User className="h-5 w-5 mr-2 text-app-purple" />
        {customerName}'s Payment
      </h2>
    );
  }
  
  return (
    <h2 className="text-xl font-semibold flex items-center">
      <CreditCard className="h-5 w-5 mr-2" />
      Payment
    </h2>
  );
}
