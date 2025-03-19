import React from "react";
import { PaymentStatus, SplitCustomer, PaymentMethod } from "../PaymentModal";
import { PaymentMethods } from "../PaymentMethods";
import { PaymentTip } from "../PaymentTip";
import { PaymentProcessing } from "../PaymentProcessing";
import { PaymentSuccess } from "../PaymentSuccess";
import { PaymentCashInput } from "../PaymentCashInput";
import { PaymentCashChange } from "../PaymentCashChange";
import { PaymentSplitBill } from "../PaymentSplitBill";
import { PaymentSplitSummary } from "../PaymentSplitSummary";
import { CustomerInfo } from "./CustomerInfo";
import { Order } from "@/components/tables/TableActionPanel";

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
  
  const renderCustomerInfo = () => {
    return (
      <CustomerInfo 
        paymentStatus={paymentStatus}
        customerName={getCurrentCustomerName()}
        customerIndex={currentCustomerIndex}
        totalCustomers={customers.length}
      />
    );
  };

  const renderContentByStatus = () => {
    switch (paymentStatus) {
      case "idle":
        return (
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
          <>
            {renderCustomerInfo()}
            
            <PaymentMethods
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
            
            <div className="py-4 space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subtotal:</span>
                  <span>${customers[currentCustomerIndex]?.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tip:</span>
                  <span>${customers[currentCustomerIndex]?.tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${getCustomerTotalWithTip(customers[currentCustomerIndex]?.id).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="bg-muted px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => setPaymentStatus("split-summary")}
                >
                  Back
                </button>
                <button 
                  className="bg-app-purple hover:bg-app-purple/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={handlePaymentSubmit}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </>
        );
      
      case "cash-input":
        return (
          <PaymentCashInput
            order={order}
            tipAmount={tipAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            handleCashAmountSubmit={handleCashAmountSubmit}
            setPaymentStatus={(status: PaymentStatus) => setPaymentStatus(status)}
          />
        );
      
      case "cash-change":
        return (
          <PaymentCashChange
            order={order}
            tipAmount={tipAmount}
            cashReceived={cashReceived}
            changeAmount={changeAmount}
            calculateTotalWithTip={calculateTotalWithTip}
            handleCashPaymentComplete={handleCashPaymentComplete}
          />
        );
      
      case "customer-cash-input":
        return (
          <>
            {renderCustomerInfo()}
            
            <PaymentCashInput
              order={order}
              tipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
              calculateTotalWithTip={() => getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
              cashReceived={cashReceived}
              setCashReceived={setCashReceived}
              handleCashAmountSubmit={handleCustomerCashAmountSubmit}
              setPaymentStatus={(status: PaymentStatus) => {
                if (status === "idle") {
                  setPaymentStatus("customer-payment");
                } else {
                  setPaymentStatus(status);
                }
              }}
            />
          </>
        );
      
      case "customer-cash-change":
        return (
          <>
            {renderCustomerInfo()}
            
            <PaymentCashChange
              order={order}
              tipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
              cashReceived={cashReceived}
              changeAmount={changeAmount}
              calculateTotalWithTip={() => getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
              handleCashPaymentComplete={handleCashPaymentComplete}
            />
          </>
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
