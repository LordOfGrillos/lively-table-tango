
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Order } from "@/components/tables/TableActionPanel";
import { usePaymentState } from "./usePaymentState";
import { ModalTitle } from "./modal/ModalTitle";
import { ModalContent } from "./modal/ModalContent";

export type PaymentStatus = 
  | "idle" 
  | "processing" 
  | "success" 
  | "cash-input" 
  | "cash-change" 
  | "split-bill" 
  | "split-summary" 
  | "customer-payment" 
  | "customer-cash-input" 
  | "customer-cash-change"
  | "customer-success";

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
    currentCustomerIndex,
    customersPaid,
    paymentMethods,
    calculateTotalWithTip,
    getCurrentCustomerTotal,
    getCurrentCustomerTipAmount,
    handleTipValueChange,
    handleTipTypeChange,
    handlePaymentSubmit,
    handleSplitBill,
    handleCashAmountSubmit,
    handleCustomerCashAmountSubmit,
    handleCashPaymentComplete,
    handleAddCustomer,
    handleRemoveCustomer,
    handleSplitTypeChange,
    handleAssignItemToCustomer,
    handleSetCustomerName,
    handleCustomerTipTypeChange,
    handleCustomerTipValueChange,
    handleCompleteSplit,
    handlePayCustomer,
    handleCompleteAllPayments,
    isItemAssignedToCustomer,
    getRemainingAmount,
    getCustomerTotalWithTip,
    getCurrentCustomerName,
    handleReturnToSplitSummary
  } = usePaymentState(order, onPaymentComplete);

  const handleClose = () => {
    if (paymentStatus === "idle" || paymentStatus === "success") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <ModalTitle 
            paymentStatus={paymentStatus} 
            getCurrentCustomerName={getCurrentCustomerName} 
          />
        </DialogHeader>

        <ModalContent 
          paymentStatus={paymentStatus}
          order={order}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          changeAmount={changeAmount}
          tipType={tipType}
          tipValue={tipValue}
          tipAmount={tipAmount}
          customers={customers}
          currentCustomerIndex={currentCustomerIndex}
          customersPaid={customersPaid}
          paymentMethods={paymentMethods}
          calculateTotalWithTip={calculateTotalWithTip}
          getCurrentCustomerName={getCurrentCustomerName}
          handleTipValueChange={handleTipValueChange}
          handleTipTypeChange={handleTipTypeChange}
          handlePaymentSubmit={handlePaymentSubmit}
          handleSplitBill={handleSplitBill}
          handleCashAmountSubmit={handleCashAmountSubmit}
          handleCustomerCashAmountSubmit={handleCustomerCashAmountSubmit}
          handleCashPaymentComplete={handleCashPaymentComplete}
          handleAddCustomer={handleAddCustomer}
          handleRemoveCustomer={handleRemoveCustomer}
          handleSplitTypeChange={handleSplitTypeChange}
          handleAssignItemToCustomer={handleAssignItemToCustomer}
          handleSetCustomerName={handleSetCustomerName}
          handleCustomerTipTypeChange={handleCustomerTipTypeChange}
          handleCustomerTipValueChange={handleCustomerTipValueChange}
          handleCompleteSplit={handleCompleteSplit}
          handlePayCustomer={handlePayCustomer}
          handleCompleteAllPayments={handleCompleteAllPayments}
          isItemAssignedToCustomer={isItemAssignedToCustomer}
          getRemainingAmount={getRemainingAmount}
          getCustomerTotalWithTip={getCustomerTotalWithTip}
          setPaymentStatus={setPaymentStatus}
          splitType={splitType}
          numberOfCustomers={numberOfCustomers}
          handleReturnToSplitSummary={handleReturnToSplitSummary}
        />
      </DialogContent>
    </Dialog>
  );
}
