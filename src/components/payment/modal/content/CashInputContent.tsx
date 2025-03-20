
import React, { useEffect } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "../CustomerInfo";
import { ArrowLeft, User, Banknote } from "lucide-react";
import { DollarSignInput } from "../../DollarSignInput";
import { Badge } from "@/components/ui/badge";

interface CashInputContentProps {
  order: Order;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  handleCashAmountSubmit: () => void;
  setPaymentStatus: (status: string) => void;
  paymentStatus: string;
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
  const total = calculateTotalWithTip();
  const isForCustomer = paymentStatus === "customer-cash-input";
  const customerName = isForCustomer && getCurrentCustomerName ? getCurrentCustomerName() : "";
  
  // Set initial cash amount to match the total
  useEffect(() => {
    if (!cashReceived) {
      setCashReceived(total.toFixed(2));
    }
  }, [total, cashReceived, setCashReceived]);

  return (
    <div className="py-4 space-y-4">
      {isForCustomer && getCurrentCustomerName && (
        <div className="bg-app-purple/10 rounded-lg p-4 mb-2 border border-app-purple/30">
          <div className="flex items-center gap-3">
            <div className="bg-app-purple rounded-full p-2">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cash Payment For:</p>
              <p className="font-semibold text-lg text-app-purple">{customerName}</p>
            </div>
            {currentCustomerIndex !== undefined && totalCustomers && (
              <Badge variant="outline" className="ml-auto">
                Customer {currentCustomerIndex + 1} of {totalCustomers}
              </Badge>
            )}
          </div>
        </div>
      )}
    
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">${total.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {isForCustomer ? `${customerName}'s Total Amount Due` : "Total Amount Due"}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${(total - tipAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tip:</span>
            <span>${tipAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <label className="text-sm font-medium block mb-2">Cash Received:</label>
          <DollarSignInput
            value={cashReceived}
            onChange={setCashReceived}
            placeholder="0.00"
            className="text-2xl font-bold text-center"
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline"
            onClick={() => setPaymentStatus(isForCustomer ? "customer-payment" : "idle")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCashAmountSubmit}
            disabled={parseFloat(cashReceived) < total}
          >
            <Banknote className="mr-2 h-4 w-4" />
            Calculate Change
          </Button>
        </div>
      </div>
    </div>
  );
}
