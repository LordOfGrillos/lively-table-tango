
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
import { PaymentSplitSummary } from "./PaymentSplitSummary";
import { usePaymentState } from "./usePaymentState";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

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
  | "customer-cash-change";

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
  } = usePaymentState(order, onPaymentComplete);

  const handleClose = () => {
    if (paymentStatus === "idle" || paymentStatus === "success") {
      onClose();
    }
  };

  const getCurrentCustomerName = () => {
    return customers[currentCustomerIndex]?.name || "";
  };

  const renderCustomerBadge = () => {
    if (!["customer-payment", "customer-cash-input", "customer-cash-change"].includes(paymentStatus)) {
      return null;
    }

    return (
      <Badge className="ml-2 bg-app-purple">
        <User className="h-3 w-3 mr-1" />
        {getCurrentCustomerName()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center">
            <DialogTitle>
              {paymentStatus === "idle" && "Payment"}
              {paymentStatus === "processing" && "Processing Payment"}
              {paymentStatus === "success" && "Payment Successful"}
              {paymentStatus === "cash-input" && "Cash Payment"}
              {paymentStatus === "cash-change" && "Change Due"}
              {paymentStatus === "split-bill" && "Split Bill"}
              {paymentStatus === "split-summary" && "Payment Summary"}
              {paymentStatus === "customer-payment" && `${getCurrentCustomerName()}'s Payment`}
              {paymentStatus === "customer-cash-input" && `${getCurrentCustomerName()}'s Cash Payment`}
              {paymentStatus === "customer-cash-change" && `${getCurrentCustomerName()}'s Change Due`}
            </DialogTitle>
            {renderCustomerBadge()}
          </div>
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
            customerName={paymentStatus === "success" ? undefined : getCurrentCustomerName()}
          />
        )}

        {paymentStatus === "customer-payment" && (
          <>
            <div className="mb-3 p-3 bg-muted/30 rounded-lg flex items-center">
              <User className="h-5 w-5 text-app-purple mr-2" />
              <div>
                <p className="font-medium">{getCurrentCustomerName()}</p>
                <p className="text-xs text-muted-foreground">Customer {currentCustomerIndex + 1} of {customers.length}</p>
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

        {paymentStatus === "customer-cash-input" && (
          <>
            <div className="mb-3 p-3 bg-muted/30 rounded-lg flex items-center">
              <User className="h-5 w-5 text-app-purple mr-2" />
              <div>
                <p className="font-medium">{getCurrentCustomerName()}</p>
                <p className="text-xs text-muted-foreground">Customer {currentCustomerIndex + 1} of {customers.length}</p>
              </div>
            </div>
            
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
        )}

        {paymentStatus === "customer-cash-change" && (
          <>
            <div className="mb-3 p-3 bg-muted/30 rounded-lg flex items-center">
              <User className="h-5 w-5 text-app-purple mr-2" />
              <div>
                <p className="font-medium">{getCurrentCustomerName()}</p>
                <p className="text-xs text-muted-foreground">Customer {currentCustomerIndex + 1} of {customers.length}</p>
              </div>
            </div>
            
            <PaymentCashChange
              order={order}
              tipAmount={customers[currentCustomerIndex]?.tipAmount || 0}
              cashReceived={cashReceived}
              changeAmount={changeAmount}
              calculateTotalWithTip={() => getCustomerTotalWithTip(customers[currentCustomerIndex]?.id)}
              handleCashPaymentComplete={handleCashPaymentComplete}
            />
          </>
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

        {paymentStatus === "split-summary" && (
          <PaymentSplitSummary
            customers={customers}
            currentCustomerIndex={currentCustomerIndex}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
            handlePayCustomer={handlePayCustomer}
            customersPaid={customersPaid}
            handleComplete={handleCompleteAllPayments}
            setPaymentStatus={(status: PaymentStatus) => setPaymentStatus(status)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
