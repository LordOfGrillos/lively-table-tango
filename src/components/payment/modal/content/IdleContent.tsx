
import React from "react";
import { PaymentMethods } from "../../PaymentMethods";
import { PaymentTip } from "../../PaymentTip";
import { Order } from "@/components/tables/TableActionPanel";
import { PaymentMethod } from "../../PaymentModal";

interface IdleContentProps {
  order: Order;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  tipType: "percent" | "amount";
  tipValue: string;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  handleTipTypeChange: (tipType: "percent" | "amount") => void;
  handleTipValueChange: (value: string) => void;
  handlePaymentSubmit: () => void;
  handleSplitBill: () => void;
  paymentMethods: PaymentMethod[];
}

export function IdleContent({
  order,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  tipType,
  tipValue,
  tipAmount,
  calculateTotalWithTip,
  handleTipTypeChange,
  handleTipValueChange,
  handlePaymentSubmit,
  handleSplitBill,
  paymentMethods
}: IdleContentProps) {
  return (
    <>
      <PaymentMethods
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
      
      <PaymentTip
        order={order}
        tipType={tipType}
        tipValue={tipValue}
        tipAmount={tipAmount}
        calculateTotalWithTip={calculateTotalWithTip}
        handleTipTypeChange={handleTipTypeChange}
        handleTipValueChange={handleTipValueChange}
        handlePaymentSubmit={handlePaymentSubmit}
        handleSplitBill={handleSplitBill}
      />
    </>
  );
}
