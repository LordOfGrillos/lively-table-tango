
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
    <div className="mb-4 p-4 bg-app-purple/15 rounded-lg flex items-center border-2 border-app-purple shadow-md">
      <div className="bg-app-purple rounded-full p-2 mr-3">
        <User className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-app-purple text-lg">{customerName}</p>
        <p className="text-sm text-muted-foreground">Customer {customerIndex + 1} of {totalCustomers}</p>
      </div>
    </div>
  );
}
