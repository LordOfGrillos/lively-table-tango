
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Order } from "@/components/tables/TableActionPanel";
import { PaymentMainView } from "./PaymentMainView";
import { PaymentSplitBill } from "./PaymentSplitBill";
import { PaymentCashInput } from "./PaymentCashInput";
import { PaymentCashChange } from "./PaymentCashChange";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentProcessing } from "./PaymentProcessing";
import { usePaymentState } from "./usePaymentState";

export interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentMethod: string) => void;
}

export type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

export type SplitCustomer = {
  id: string;
  name: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
  total: number;
};

export function PaymentModal({ order, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const {
    paymentStatus,
    selectedPaymentMethod,
    tipAmount,
    cashReceived,
    changeAmount,
    customers,
    splitType,
    numberOfCustomers,
    calculateTotalWithTip,
    setPaymentStatus,
    handleSplitBill,
    handlePaymentSubmit,
    handleCashAmountSubmit,
    handleCashPaymentComplete,
    handleCompleteSplit,
    handleTipValueChange,
    handleTipTypeChange,
    setCashReceived,
    handleSplitTypeChange,
    handleAddCustomer,
    handleRemoveCustomer,
    handleAssignItemToCustomer,
    handleSetCustomerName,
    isItemAssignedToCustomer,
    getRemainingAmount,
    setSelectedPaymentMethod,
  } = usePaymentState(order, onPaymentComplete);

  // Create a wrapper function to handle type conversion
  const handleSetPaymentStatus = (status: string) => {
    // Type assertion to ensure status is a valid PaymentStatus
    setPaymentStatus(status as "idle" | "processing" | "success" | "cash-input" | "cash-change" | "split-bill");
  };

  const getDialogTitle = () => {
    switch (paymentStatus) {
      case "success":
        return "Payment Successful";
      case "cash-input":
        return "Enter Cash Amount";
      case "cash-change":
        return "Payment Change";
      case "split-bill":
        return "Split Bill";
      default:
        return "Complete Payment";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-md", { "sm:max-w-3xl": paymentStatus === "split-bill" })}>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          {paymentStatus !== "success" && 
           paymentStatus !== "cash-input" && 
           paymentStatus !== "cash-change" && 
           paymentStatus !== "split-bill" && (
            <div className="text-sm text-muted-foreground">
              Complete the payment for order #{order.tableNumber}
            </div>
          )}
        </DialogHeader>
        
        {paymentStatus === "idle" && (
          <PaymentMainView 
            order={order}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            handleTipValueChange={handleTipValueChange}
            handleTipTypeChange={handleTipTypeChange}
            handleSplitBill={handleSplitBill}
            handlePaymentSubmit={handlePaymentSubmit}
            onClose={onClose}
          />
        )}
        
        {paymentStatus === "split-bill" && (
          <PaymentSplitBill
            order={order}
            customers={customers}
            splitType={splitType}
            numberOfCustomers={numberOfCustomers}
            calculateTotalWithTip={calculateTotalWithTip}
            handleSplitTypeChange={handleSplitTypeChange}
            handleAddCustomer={handleAddCustomer}
            handleRemoveCustomer={handleRemoveCustomer}
            handleAssignItemToCustomer={handleAssignItemToCustomer}
            handleSetCustomerName={handleSetCustomerName}
            isItemAssignedToCustomer={isItemAssignedToCustomer}
            getRemainingAmount={getRemainingAmount}
            handleCompleteSplit={handleCompleteSplit}
            setPaymentStatus={handleSetPaymentStatus}
          />
        )}
        
        {paymentStatus === "cash-input" && (
          <PaymentCashInput 
            order={order}
            tipAmount={tipAmount}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            calculateTotalWithTip={calculateTotalWithTip}
            handleCashAmountSubmit={handleCashAmountSubmit}
            setPaymentStatus={handleSetPaymentStatus}
          />
        )}
        
        {paymentStatus === "cash-change" && (
          <PaymentCashChange 
            order={order}
            tipAmount={tipAmount}
            cashReceived={cashReceived}
            changeAmount={changeAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            handleCashPaymentComplete={handleCashPaymentComplete}
          />
        )}
        
        {paymentStatus === "processing" && <PaymentProcessing />}
        
        {paymentStatus === "success" && (
          <PaymentSuccess 
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
