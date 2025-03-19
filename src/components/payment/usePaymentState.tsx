
import { useState } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { PaymentStatus } from "./PaymentModal";
import { usePaymentMethods } from "./hooks/usePaymentMethods";
import { useTipCalculation } from "./hooks/useTipCalculation";
import { useCashPayment } from "./hooks/useCashPayment";
import { useSplitBill } from "./hooks/useSplitBill";
import { usePayment } from "./hooks/usePayment";

export function usePaymentState(order: Order, onPaymentComplete: (paymentMethod: string) => void) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  
  // Use specialized hooks
  const { paymentMethods } = usePaymentMethods();
  
  const {
    tipType,
    tipValue,
    tipAmount,
    calculateTotalWithTip,
    handleTipValueChange,
    handleTipTypeChange
  } = useTipCalculation(order);
  
  const {
    handlePaymentSubmit
  } = usePayment(selectedPaymentMethod, onPaymentComplete, setPaymentStatus);
  
  const {
    cashReceived,
    setCashReceived,
    changeAmount,
    handleCashAmountSubmit,
    handleCashPaymentComplete
  } = useCashPayment(calculateTotalWithTip, setPaymentStatus, selectedPaymentMethod, onPaymentComplete);
  
  const {
    splitType,
    numberOfCustomers,
    customers,
    handleSplitBill,
    handleAddCustomer,
    handleRemoveCustomer,
    handleSplitTypeChange,
    handleAssignItemToCustomer,
    handleSetCustomerName,
    handleCompleteSplit,
    isItemAssignedToCustomer,
    getRemainingAmount
  } = useSplitBill(order, calculateTotalWithTip, setPaymentStatus);

  return {
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
    handleCompleteSplit,
    isItemAssignedToCustomer,
    getRemainingAmount,
  };
}
