
import React from "react";
import { PaymentStatus } from "../PaymentModal";
import { CreditCard, SplitSquareVertical, User, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="h-5 w-5 mr-2 text-green-600" />
          {customerName}'s Payment Complete
        </h2>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Individual Payment
        </Badge>
      </div>
    );
  }
  
  if (paymentStatus === "split-bill") {
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <SplitSquareVertical className="h-5 w-5 mr-2 text-app-purple" />
          Split Bill Configuration
        </h2>
        <Badge variant="outline" className="bg-app-purple/10 text-app-purple border-app-purple/20">
          Split Mode
        </Badge>
      </div>
    );
  }
  
  if (paymentStatus === "split-summary") {
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <SplitSquareVertical className="h-5 w-5 mr-2 text-app-purple" />
          Bill Split Summary
        </h2>
        <Badge variant="outline" className="bg-app-purple/10 text-app-purple border-app-purple/20">
          Split Mode
        </Badge>
      </div>
    );
  }
  
  if (paymentStatus === "customer-payment") {
    const customerName = getCurrentCustomerName ? getCurrentCustomerName() : "";
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="h-5 w-5 mr-2 text-app-purple" />
          {customerName}'s Payment
        </h2>
        <Badge variant="outline" className="bg-app-purple/10 text-app-purple border-app-purple/20">
          Individual Payment
        </Badge>
      </div>
    );
  }
  
  if (paymentStatus === "customer-cash-input") {
    const customerName = getCurrentCustomerName ? getCurrentCustomerName() : "";
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Banknote className="h-5 w-5 mr-2 text-app-purple" />
          {customerName}'s Cash Payment
        </h2>
        <Badge variant="outline" className="bg-app-purple/10 text-app-purple border-app-purple/20">
          Individual Payment
        </Badge>
      </div>
    );
  }
  
  if (paymentStatus === "customer-cash-change") {
    const customerName = getCurrentCustomerName ? getCurrentCustomerName() : "";
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Banknote className="h-5 w-5 mr-2 text-green-600" />
          {customerName}'s Change Due
        </h2>
        <Badge variant="outline" className="bg-app-purple/10 text-app-purple border-app-purple/20">
          Individual Payment
        </Badge>
      </div>
    );
  }
  
  return (
    <h2 className="text-xl font-semibold flex items-center">
      <CreditCard className="h-5 w-5 mr-2" />
      Payment
    </h2>
  );
}
