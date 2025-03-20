
import React from "react";
import { PaymentStatus, SplitCustomer, PaymentMethod } from "../PaymentModal";
import { PaymentProcessing } from "../PaymentProcessing";
import { PaymentSuccess } from "../PaymentSuccess";
import { PaymentSplitBill } from "../PaymentSplitBill";
import { PaymentSplitSummary } from "../PaymentSplitSummary";
import { Order } from "@/components/tables/TableActionPanel";
import { IdleContent } from "./content/IdleContent";
import { CustomerPaymentContent } from "./content/CustomerPaymentContent";
import { CashInputContent } from "./content/CashInputContent";
import { CashChangeContent } from "./content/CashChangeContent";

interface ModalContentProps {
  paymentStatus: PaymentStatus;
  order: Order;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  cashReceived: string;
  setCashReceived: (amount: string) => void;
  changeAmount: number;
  tipType: "percent" | "amount";
  tipValue: string;
  tipAmount: number;
  customers: SplitCustomer[];
  currentCustomerIndex: number;
  customersPaid: boolean[];
  paymentMethods: PaymentMethod[];
  calculateTotalWithTip: () => number;
  getCurrentCustomerName: () => string;
  handleTipValueChange: (value: string) => void;
  handleTipTypeChange: (tipType: "percent" | "amount") => void;
  handlePaymentSubmit: () => void;
  handleSplitBill: () => void;
  handleCashAmountSubmit: () => void;
  handleCustomerCashAmountSubmit: () => void;
  handleCashPaymentComplete: () => void;
  handleAddCustomer: () => void;
  handleRemoveCustomer: () => void;
  handleSplitTypeChange: (type: "equal" | "custom") => void;
  handleAssignItemToCustomer: (itemId: string, customerId: string) => void;
  handleSetCustomerName: (customerId: string, name: string) => void;
  handleCustomerTipTypeChange: (customerId: string, tipType: "percent" | "amount") => void;
  handleCustomerTipValueChange: (customerId: string, value: string) => void;
  handleCompleteSplit: () => void;
  handlePayCustomer: (index: number) => void;
  handleCompleteAllPayments: () => void;
  isItemAssignedToCustomer: (itemId: string, customerId: string) => boolean;
  getRemainingAmount: () => number;
  getCustomerTotalWithTip: (customerId: string) => number;
  setPaymentStatus: (status: PaymentStatus) => void;
  splitType: "equal" | "custom";
  numberOfCustomers: number;
}

export function ModalContent({
  paymentStatus,
  order,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cashReceived,
  setCashReceived,
  changeAmount,
  tipType,
  tipValue,
  tipAmount,
  customers,
  currentCustomerIndex,
  customersPaid,
  paymentMethods,
  calculateTotalWithTip,
  getCurrentCustomerName,
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
  setPaymentStatus,
  splitType,
  numberOfCustomers
}: ModalContentProps) {
  
  const renderContentByStatus = () => {
    switch (paymentStatus) {
      case "idle":
        return (
          <IdleContent
            order={order}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            tipType={tipType}
            tipValue={tipValue}
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            handleTipTypeChange={handleTipTypeChange}
            handleTipValueChange={handleTipValueChange}
            handlePaymentSubmit={handlePaymentSubmit}
            handleSplitBill={handleSplitBill}
            paymentMethods={paymentMethods}
          />
        );
      
      case "processing":
        return <PaymentProcessing />;
      
      case "success":
        return (
          <PaymentSuccess
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            customerName={paymentStatus.startsWith("customer") ? getCurrentCustomerName() : undefined}
          />
        );
      
      case "customer-payment":
        return (
          <CustomerPaymentContent
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            paymentMethods={paymentMethods}
            handlePaymentSubmit={handlePaymentSubmit}
            setPaymentStatus={setPaymentStatus}
            customerSubtotal={customers[currentCustomerIndex]?.total || 0}
            customerTipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
            customerTotal={getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
            getCurrentCustomerName={getCurrentCustomerName}
            currentCustomerIndex={currentCustomerIndex}
            totalCustomers={customers.length}
          />
        );
      
      case "cash-input":
        return (
          <CashInputContent
            order={order}
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            handleCashAmountSubmit={handleCashAmountSubmit}
            setPaymentStatus={setPaymentStatus}
            paymentStatus={paymentStatus}
          />
        );
      
      case "cash-change":
        return (
          <CashChangeContent
            order={order}
            tipAmount={tipAmount}
            cashReceived={cashReceived}
            changeAmount={changeAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            handleCashPaymentComplete={handleCashPaymentComplete}
            paymentStatus={paymentStatus}
          />
        );
      
      case "customer-cash-input":
        return (
          <CashInputContent
            order={order}
            tipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
            calculateTotalWithTip={() => getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            handleCashAmountSubmit={handleCustomerCashAmountSubmit}
            setPaymentStatus={setPaymentStatus}
            paymentStatus={paymentStatus}
            getCurrentCustomerName={getCurrentCustomerName}
            currentCustomerIndex={currentCustomerIndex}
            totalCustomers={customers.length}
          />
        );
      
      case "customer-cash-change":
        return (
          <CashChangeContent
            order={order}
            tipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
            cashReceived={cashReceived}
            changeAmount={changeAmount}
            calculateTotalWithTip={() => getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
            handleCashPaymentComplete={handleCashPaymentComplete}
            paymentStatus={paymentStatus}
            getCurrentCustomerName={getCurrentCustomerName}
            currentCustomerIndex={currentCustomerIndex}
            totalCustomers={customers.length}
          />
        );
      
      case "split-bill":
        return (
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
            setPaymentStatus={(status: string) => setPaymentStatus(status as PaymentStatus)}
          />
        );
      
      case "split-summary":
        return (
          <PaymentSplitSummary
            customers={customers}
            currentCustomerIndex={currentCustomerIndex}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
            handlePayCustomer={handlePayCustomer}
            customersPaid={customersPaid}
            handleComplete={handleCompleteAllPayments}
            setPaymentStatus={(status: string) => setPaymentStatus(status as PaymentStatus)}
          />
        );
      
      default:
        return null;
    }
  };

  return renderContentByStatus();
}
