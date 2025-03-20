
import React from "react";
import { PaymentCashChange } from "../../PaymentCashChange";
import { Order } from "@/components/tables/TableActionPanel";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentStatus } from "../../PaymentModal";

interface CashChangeContentProps {
  order: Order;
  tipAmount: number;
  cashReceived: string;
  changeAmount: number;
  calculateTotalWithTip: () => number;
  handleCashPaymentComplete: () => void;
  paymentStatus: PaymentStatus;
  getCurrentCustomerName?: () => string;
  currentCustomerIndex?: number;
  totalCustomers?: number;
}

export function CashChangeContent({
  order,
  tipAmount,
  cashReceived,
  changeAmount,
  calculateTotalWithTip,
  handleCashPaymentComplete,
  paymentStatus,
  getCurrentCustomerName,
  currentCustomerIndex,
  totalCustomers
}: CashChangeContentProps) {
  return (
    <>
      {paymentStatus === "customer-cash-change" && getCurrentCustomerName && currentCustomerIndex !== undefined && totalCustomers !== undefined && (
        <CustomerInfo 
          paymentStatus={paymentStatus}
          customerName={getCurrentCustomerName()}
          customerIndex={currentCustomerIndex}
          totalCustomers={totalCustomers}
        />
      )}
      
      <PaymentCashChange
        order={order}
        tipAmount={tipAmount}
        cashReceived={cashReceived}
        changeAmount={changeAmount}
        calculateTotalWithTip={calculateTotalWithTip}
        handleCashPaymentComplete={handleCashPaymentComplete}
      />
    </>
  );
}
