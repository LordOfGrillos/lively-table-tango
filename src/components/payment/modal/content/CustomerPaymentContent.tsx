
import React from "react";
import { PaymentMethods } from "../../PaymentMethods";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentMethod } from "../../PaymentModal";

interface CustomerPaymentContentProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  paymentMethods: PaymentMethod[];
  handlePaymentSubmit: () => void;
  setPaymentStatus: (status: string) => void;
  customerSubtotal: number;
  customerTipAmount: number;
  customerTotal: number;
  getCurrentCustomerName: () => string;
  currentCustomerIndex: number;
  totalCustomers: number;
}

export function CustomerPaymentContent({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentMethods,
  handlePaymentSubmit,
  setPaymentStatus,
  customerSubtotal,
  customerTipAmount,
  customerTotal,
  getCurrentCustomerName,
  currentCustomerIndex,
  totalCustomers
}: CustomerPaymentContentProps) {
  return (
    <>
      <CustomerInfo 
        paymentStatus="customer-payment"
        customerName={getCurrentCustomerName()}
        customerIndex={currentCustomerIndex}
        totalCustomers={totalCustomers}
      />
      
      <PaymentMethods
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
      
      <div className="py-4 space-y-4">
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>${customerSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tip:</span>
            <span>${customerTipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${customerTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline"
            onClick={() => setPaymentStatus("split-summary")}
          >
            Back
          </Button>
          <Button 
            className="bg-app-purple hover:bg-app-purple/90 text-white"
            onClick={handlePaymentSubmit}
          >
            Pay {getCurrentCustomerName()}'s Bill
          </Button>
        </div>
      </div>
    </>
  );
}
