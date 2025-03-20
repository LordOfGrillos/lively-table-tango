
import React from "react";
import { PaymentCashInput } from "../../PaymentCashInput";
import { Order } from "@/components/tables/TableActionPanel";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentStatus } from "../../PaymentModal";

interface CashInputContentProps {
  order: Order;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  handleCashAmountSubmit: () => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  paymentStatus: PaymentStatus;
  getCurrentCustomerName?: () => string;
  currentCustomerIndex?: number;
  totalCustomers?: number;
}

export function CashInputContent({
  order,
  tipAmount,
  calculateTotalWithTip,
  cashReceived,
  setCashReceived,
  handleCashAmountSubmit,
  setPaymentStatus,
  paymentStatus,
  getCurrentCustomerName,
  currentCustomerIndex,
  totalCustomers
}: CashInputContentProps) {
  const isCustomerCashInput = paymentStatus === "customer-cash-input";
  
  return (
    <>
      {isCustomerCashInput && getCurrentCustomerName && currentCustomerIndex !== undefined && totalCustomers !== undefined && (
        <CustomerInfo 
          paymentStatus={paymentStatus}
          customerName={getCurrentCustomerName()}
          customerIndex={currentCustomerIndex}
          totalCustomers={totalCustomers}
        />
      )}
      
      <PaymentCashInput
        order={order}
        tipAmount={tipAmount}
        calculateTotalWithTip={calculateTotalWithTip}
        cashReceived={cashReceived}
        setCashReceived={setCashReceived}
        handleCashAmountSubmit={handleCashAmountSubmit}
        setPaymentStatus={(status: PaymentStatus) => {
          if (isCustomerCashInput && status === "idle") {
            setPaymentStatus("customer-payment");
          } else {
            setPaymentStatus(status);
          }
        }}
      />
    </>
  );
}
