
import React from "react";
import { CreditCard, Wallet, CircleDollarSign } from "lucide-react";
import { PaymentMethod } from "../PaymentModal";

export function usePaymentMethods() {
  // Define payment methods with JSX icons
  const paymentMethods: PaymentMethod[] = [
    {
      id: "cash",
      name: "Cash",
      icon: <Wallet className="h-6 w-6" />,
      description: "Pay with cash at the table"
    },
    {
      id: "card",
      name: "Card",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Pay with credit or debit card"
    },
    {
      id: "other",
      name: "Other",
      icon: <CircleDollarSign className="h-6 w-6" />,
      description: "Other payment methods"
    }
  ];

  return { paymentMethods };
}
