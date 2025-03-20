
import { useState, useEffect } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order } from "@/components/tables/TableActionPanel";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentStatus } from "../../PaymentModal";
import { Banknote } from "lucide-react";

interface CashInputContentProps {
  order: Order;
  tipAmount: number;
  calculateTotalWithTip: () => number;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  handleCashAmountSubmit: () => void;
  setPaymentStatus: (status: string) => void;
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
  const [isValid, setIsValid] = useState(false);
  const totalAmount = calculateTotalWithTip();
  
  const isCustomerPayment = paymentStatus === "customer-cash-input";
  const customerName = isCustomerPayment && getCurrentCustomerName ? getCurrentCustomerName() : "";

  useEffect(() => {
    const parsedCash = parseFloat(cashReceived);
    setIsValid(!isNaN(parsedCash) && parsedCash >= totalAmount);
  }, [cashReceived, totalAmount]);

  const presetAmounts = [
    totalAmount,
    Math.ceil(totalAmount / 5) * 5,
    Math.ceil(totalAmount / 10) * 10,
    Math.ceil(totalAmount / 20) * 20
  ].filter((amount, index, self) => self.indexOf(amount) === index).sort((a, b) => a - b);

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
            Processing Cash Payment for {customerName}
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">
          {isCustomerPayment 
            ? `Enter Cash Amount for ${customerName}`
            : "Enter Cash Amount"
          }
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter the amount of cash received
        </p>
        
        <div className="flex gap-2 items-center">
          <span className="text-lg font-semibold">$</span>
          <Input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            placeholder="0.00"
            className="text-xl font-bold"
          />
        </div>
        
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Total amount to be paid:</span>
          <span className="font-medium">${totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => setCashReceived(amount.toString())}
              className="text-md"
            >
              ${amount.toFixed(2)}
            </Button>
          ))}
        </div>
      </div>
      
      <DialogFooter className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPaymentStatus(isCustomerPayment ? "split-summary" : "idle")}
        >
          Back
        </Button>
        <Button
          className="bg-app-purple hover:bg-app-purple/90"
          onClick={handleCashAmountSubmit}
          disabled={!isValid}
        >
          <Banknote className="mr-2 h-4 w-4" />
          {isCustomerPayment 
            ? `Process ${customerName}'s Cash Payment`
            : "Process Cash Payment"
          }
        </Button>
      </DialogFooter>
    </div>
  );
}
