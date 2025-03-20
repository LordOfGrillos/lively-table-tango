
import React from "react";
import { PaymentMethods } from "../../PaymentMethods";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentMethod } from "../../PaymentModal";
import { CreditCard, Banknote, ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const customerName = getCurrentCustomerName();

  return (
    <>
      <div className="bg-app-purple/10 rounded-lg p-4 mb-6 border border-app-purple/30">
        <div className="flex items-center gap-3">
          <div className="bg-app-purple rounded-full p-2">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Now Processing Payment For:</p>
            <p className="font-semibold text-lg text-app-purple">{customerName}</p>
          </div>
          <Badge variant="outline" className="ml-auto">
            Customer {currentCustomerIndex + 1} of {totalCustomers}
          </Badge>
        </div>
      </div>
      
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
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Split Summary
          </Button>
          
          {selectedPaymentMethod === "cash" ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePaymentSubmit}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Process Cash Payment
            </Button>
          ) : (
            <Button 
              className="bg-app-purple hover:bg-app-purple/90 text-white"
              onClick={handlePaymentSubmit}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Process Card Payment
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
