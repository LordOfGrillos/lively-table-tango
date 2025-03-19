
import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { PaymentStatus } from "../PaymentModal";
import { CustomerBadge } from "./CustomerBadge";

interface ModalTitleProps {
  paymentStatus: PaymentStatus;
  getCurrentCustomerName: () => string;
}

export function ModalTitle({ paymentStatus, getCurrentCustomerName }: ModalTitleProps) {
  const getTitle = () => {
    switch (paymentStatus) {
      case "idle": return "Payment";
      case "processing": return "Processing Payment";
      case "success": return "Payment Successful";
      case "cash-input": return "Cash Payment";
      case "cash-change": return "Change Due";
      case "split-bill": return "Split Bill";
      case "split-summary": return "Payment Summary";
      case "customer-payment": return `${getCurrentCustomerName()}'s Payment`;
      case "customer-cash-input": return `${getCurrentCustomerName()}'s Cash Payment`;
      case "customer-cash-change": return `${getCurrentCustomerName()}'s Change Due`;
      default: return "Payment";
    }
  };

  return (
    <div className="flex items-center">
      <DialogTitle>{getTitle()}</DialogTitle>
      <CustomerBadge paymentStatus={paymentStatus} customerName={getCurrentCustomerName()} />
    </div>
  );
}
