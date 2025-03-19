
import React from "react";
import { User } from "lucide-react";
import { PaymentStatus } from "../PaymentModal";

interface CustomerInfoProps {
  paymentStatus: PaymentStatus;
  customerName: string;
  customerIndex: number;
  totalCustomers: number;
}

export function CustomerInfo({ paymentStatus, customerName, customerIndex, totalCustomers }: CustomerInfoProps) {
  const showCustomerInfo = ["customer-payment", "customer-cash-input", "customer-cash-change"].includes(paymentStatus as string);
  
  if (!showCustomerInfo) {
    return null;
  }

  return (
    <div className="mb-3 p-3 bg-muted/30 rounded-lg flex items-center">
      <User className="h-5 w-5 text-app-purple mr-2" />
      <div>
        <p className="font-medium">{customerName}</p>
        <p className="text-xs text-muted-foreground">Customer {customerIndex + 1} of {totalCustomers}</p>
      </div>
    </div>
  );
}
