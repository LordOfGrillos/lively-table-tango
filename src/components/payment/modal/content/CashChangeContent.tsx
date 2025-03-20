
import React from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "../CustomerInfo";
import { ArrowRight, Check, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CashChangeContentProps {
  order: Order;
  tipAmount: number;
  cashReceived: string;
  changeAmount: number;
  calculateTotalWithTip: () => number;
  handleCashPaymentComplete: () => void;
  paymentStatus: string;
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
  const total = calculateTotalWithTip();
  const isForCustomer = paymentStatus === "customer-cash-change";
  const customerName = isForCustomer && getCurrentCustomerName ? getCurrentCustomerName() : "";

  return (
    <div className="py-4 space-y-6">
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
    
      <div className="space-y-5">
        <div className="text-center space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Paid:</div>
            <div className="text-2xl font-semibold">${cashReceived}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Total Due:</div>
            <div className="text-2xl font-semibold">${total.toFixed(2)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Change Due:</div>
            <div className="text-4xl font-bold text-green-600">${changeAmount.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-8"
            onClick={handleCashPaymentComplete}
          >
            <Check className="mr-2 h-5 w-5" />
            {isForCustomer ? `Mark ${customerName}'s Payment Complete` : "Complete Cash Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
