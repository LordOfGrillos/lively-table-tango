
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Order } from "@/components/tables/TableActionPanel";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentStatus } from "../../PaymentModal";
import { Banknote, PiggyBank } from "lucide-react";

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
  const totalAmount = calculateTotalWithTip();
  
  const isCustomerPayment = paymentStatus === "customer-cash-change";
  const customerName = isCustomerPayment && getCurrentCustomerName ? getCurrentCustomerName() : "";

  return (
    <div className="py-4 space-y-4">
      {isCustomerPayment && getCurrentCustomerName && currentCustomerIndex !== undefined && totalCustomers !== undefined && (
        <CustomerInfo 
          paymentStatus={paymentStatus}
          customerName={customerName}
          customerIndex={currentCustomerIndex}
          totalCustomers={totalCustomers}
        />
      )}
      
      {isCustomerPayment && (
        <div className="bg-muted/30 rounded-lg p-3 mb-4 border">
          <p className="font-semibold text-center text-app-purple">
            Completing Cash Payment for {customerName}
          </p>
        </div>
      )}
      
      <div className="space-y-3 text-center">
        <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
          <PiggyBank className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-medium mt-4">
          {isCustomerPayment 
            ? `Give ${customerName} their change`
            : "Give change to customer"
          }
        </h3>
        
        <div className="text-center text-4xl font-bold my-6 text-green-600">
          ${changeAmount.toFixed(2)}
        </div>
        
        <div className="space-y-2 text-sm text-left bg-muted/20 p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Total amount due:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cash received:</span>
            <span>${parseFloat(cashReceived).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Change to give:</span>
            <span>${changeAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button
          className="bg-green-600 hover:bg-green-700 w-full py-6 text-lg"
          onClick={handleCashPaymentComplete}
        >
          <Banknote className="mr-2 h-5 w-5" />
          {isCustomerPayment 
            ? `Complete ${customerName}'s Payment`
            : "Complete Payment"
          }
        </Button>
      </DialogFooter>
    </div>
  );
}
