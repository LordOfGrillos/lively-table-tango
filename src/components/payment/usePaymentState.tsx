
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
  const [customersPaid, setCustomersPaid] = useState<boolean[]>([]);
  
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
    handlePaymentSubmit: handleSinglePaymentSubmit
  } = usePayment(selectedPaymentMethod, onPaymentComplete, setPaymentStatus);
  
  const {
    cashReceived,
    setCashReceived,
    changeAmount,
    handleCashAmountSubmit,
    handleCashPaymentComplete: handleSingleCashPaymentComplete
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
    handleCustomerTipTypeChange,
    handleCustomerTipValueChange,
    handleCompleteSplit,
    isItemAssignedToCustomer,
    getRemainingAmount,
    getCustomerTotalWithTip
  } = useSplitBill(order, calculateTotalWithTip, setPaymentStatus);

  // Initialize customersPaid array when customers change
  useState(() => {
    if (customers.length > 0 && customersPaid.length !== customers.length) {
      setCustomersPaid(Array(customers.length).fill(false));
    }
  });

  // Handle paying for an individual customer
  const handlePayCustomer = (index: number) => {
    setCurrentCustomerIndex(index);
    setPaymentStatus("customer-payment");
  };

  // Handle payment for current customer
  const handlePaymentSubmit = () => {
    if (paymentStatus === "customer-payment") {
      if (selectedPaymentMethod === "cash") {
        setPaymentStatus("customer-cash-input");
      } else {
        setPaymentStatus("processing");
        
        // Simulate payment processing for non-cash payments
        setTimeout(() => {
          setPaymentStatus("success");
          
          // After showing success message, mark customer as paid
          setTimeout(() => {
            const newCustomersPaid = [...customersPaid];
            newCustomersPaid[currentCustomerIndex] = true;
            setCustomersPaid(newCustomersPaid);
            setPaymentStatus("split-summary");
          }, 1500);
        }, 2000);
      }
    } else {
      handleSinglePaymentSubmit();
    }
  };

  // Handle cash payment for current customer
  const handleCashPaymentComplete = () => {
    if (paymentStatus === "customer-cash-change") {
      const newCustomersPaid = [...customersPaid];
      newCustomersPaid[currentCustomerIndex] = true;
      setCustomersPaid(newCustomersPaid);
      setPaymentStatus("split-summary");
    } else {
      handleSingleCashPaymentComplete();
    }
  };

  // Handle cash amount submit for current customer
  const handleCustomerCashAmountSubmit = () => {
    setPaymentStatus("customer-cash-change");
  };

  // Handle completion of all split payments
  const handleCompleteAllPayments = () => {
    if (customersPaid.every(paid => paid)) {
      onPaymentComplete(selectedPaymentMethod);
    }
  };

  // Get the total for current customer
  const getCurrentCustomerTotal = (): number => {
    if (customers.length > currentCustomerIndex) {
      const customerId = customers[currentCustomerIndex].id;
      return getCustomerTotalWithTip(customerId);
    }
    return 0;
  };

  // Get the tip amount for current customer
  const getCurrentCustomerTipAmount = (): number => {
    if (customers.length > currentCustomerIndex) {
      return customers[currentCustomerIndex].tipAmount;
    }
    return 0;
  };

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
  };
}
