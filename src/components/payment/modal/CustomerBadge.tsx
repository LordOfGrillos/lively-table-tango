
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { PaymentStatus } from "../PaymentModal";

interface CustomerBadgeProps {
  paymentStatus: PaymentStatus;
  customerName: string;
}

export function CustomerBadge({ paymentStatus, customerName }: CustomerBadgeProps) {
  const isCustomerPaymentStatus = ["customer-payment", "customer-cash-input", "customer-cash-change"].includes(paymentStatus as string);
  
  if (!isCustomerPaymentStatus) {
    return null;
  }

  return (
    <Badge className="ml-2 bg-app-purple">
      <User className="h-3 w-3 mr-1" />
      {customerName}
    </Badge>
  );
}
