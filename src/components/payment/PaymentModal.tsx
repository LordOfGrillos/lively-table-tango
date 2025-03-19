
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@/components/tables/TableActionPanel";
import { PaymentMethods } from "./PaymentMethods";
import { PaymentTip } from "./PaymentTip";
import { PaymentProcessing } from "./PaymentProcessing";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentCashInput } from "./PaymentCashInput";
import { PaymentCashChange } from "./PaymentCashChange";
import { PaymentSplitBill } from "./PaymentSplitBill";
import { usePaymentState } from "./usePaymentState";

export type PaymentStatus = 
  "idle" | 
  "processing" | 
  "success" | 
  "cash-input" | 
  "cash-change" | 
  "split-bill";

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface SplitCustomer {
  id: string;
  name: string;
  items: { itemId: string; quantity: number }[];
  total: number;
  tipType: "percent" | "amount";
  tipValue: string;
  tipAmount: number;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onPaymentComplete: (paymentMethod: string) => void;
}

export function PaymentModal({ open, onClose, order, onPaymentComplete }: PaymentModalProps) {
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    cashReceived,
    setCashReceived,
    changeAmount,
    tipType,
    tipValue,
    tipAmount,
    splitType,
    numberOfCustomers,
    customers,
    paymentMethods,
    calculateTotalWithTip,
    handleTipValueChange,
    handleTipTypeChange,
    handlePaymentSubmit,
    handleSplitBill,
    handleCashAmountSubmit,
    handleCashPaymentComplete,
    handleAddCustomer,
    handleRemoveCustomer,
    handleSplitTypeChange,
    handleAssignItemToCustomer,
    handleSetCustomerName,
    handleCustomerTipTypeChange,
    handleCustomerTipValueChange,
    handleCompleteSplit,
    isItemAssignedToCustomer,
    getRemainingAmount,
    getCustomerTotalWithTip,
  } = usePaymentState(order, onPaymentComplete);

  // Handle modal close - only allow closing in idle state
  const handleClose = () => {
    if (paymentStatus === "idle" || paymentStatus === "success") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentStatus === "idle" && "Payment"}
            {paymentStatus === "processing" && "Processing Payment"}
            {paymentStatus === "success" && "Payment Successful"}
            {paymentStatus === "cash-input" && "Cash Payment"}
            {paymentStatus === "cash-change" && "Change Due"}
            {paymentStatus === "split-bill" && "Split Bill"}
          </DialogTitle>
        </DialogHeader>

        {paymentStatus === "idle" && (
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
        )}

        {paymentStatus === "processing" && (
          <PaymentProcessing />
        )}

        {paymentStatus === "success" && (
          <PaymentSuccess
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
          />
        )}

        {paymentStatus === "cash-input" && (
          <PaymentCashInput
            order={order}
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            handleCashAmountSubmit={handleCashAmountSubmit}
            setPaymentStatus={(status: PaymentStatus) => setPaymentStatus(status)}
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
            handleCustomerTipTypeChange={handleCustomerTipTypeChange}
            handleCustomerTipValueChange={handleCustomerTipValueChange}
            isItemAssignedToCustomer={isItemAssignedToCustomer}
            getRemainingAmount={getRemainingAmount}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
            handleCompleteSplit={handleCompleteSplit}
            setPaymentStatus={(status: PaymentStatus) => setPaymentStatus(status)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
