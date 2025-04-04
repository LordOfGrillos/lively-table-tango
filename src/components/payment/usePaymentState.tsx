import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (customers.length > 0 && customersPaid.length !== customers.length) {
      setCustomersPaid(Array(customers.length).fill(false));
    }
  }, [customers.length]);

  // Reset cash received when customer changes
  useEffect(() => {
    if (paymentStatus === "customer-payment" || paymentStatus === "customer-cash-input") {
      const customerTotal = getCurrentCustomerTotal();
      setCashReceived(customerTotal.toFixed(2));
    }
  }, [currentCustomerIndex, paymentStatus]);

  const getCurrentCustomerName = (): string => {
    if (customers.length > currentCustomerIndex) {
      const name = customers[currentCustomerIndex].name;
      return name ? name : `Customer ${currentCustomerIndex + 1}`;
    }
    return "Customer";
  };

  const handlePayCustomer = (index: number) => {
    setCurrentCustomerIndex(index);
    setPaymentStatus("customer-payment");
  };

  const handlePaymentSubmit = () => {
    if (paymentStatus === "customer-payment") {
      if (selectedPaymentMethod === "cash") {
        setPaymentStatus("customer-cash-input");
      } else {
        setPaymentStatus("processing");
        
        setTimeout(() => {
          setPaymentStatus("customer-success");
          
          setTimeout(() => {
            const newCustomersPaid = [...customersPaid];
            newCustomersPaid[currentCustomerIndex] = true;
            setCustomersPaid(newCustomersPaid);
            setPaymentStatus("split-summary");
          }, 2000);
        }, 1500);
      }
    } else {
      handleSinglePaymentSubmit();
    }
  };

  const handleCashPaymentComplete = () => {
    if (paymentStatus === "customer-cash-change") {
      const newCustomersPaid = [...customersPaid];
      newCustomersPaid[currentCustomerIndex] = true;
      setCustomersPaid(newCustomersPaid);
      setPaymentStatus("customer-success");
      
      setTimeout(() => {
        setPaymentStatus("split-summary");
      }, 2000);
    } else {
      handleSingleCashPaymentComplete();
    }
  };

  const handleCustomerCashAmountSubmit = () => {
    setPaymentStatus("customer-cash-change");
  };

  const handleCompleteAllPayments = () => {
    if (customersPaid.every(paid => paid)) {
      onPaymentComplete(selectedPaymentMethod);
    }
  };

  const getCurrentCustomerTotal = (): number => {
    if (customers.length > currentCustomerIndex) {
      const customerId = customers[currentCustomerIndex].id;
      return getCustomerTotalWithTip(customerId);
    }
    return 0;
  };

  const getCurrentCustomerTipAmount = (): number => {
    if (customers.length > currentCustomerIndex) {
      return customers[currentCustomerIndex].tipAmount;
    }
    return 0;
  };

  const handleReturnToSplitSummary = () => {
    setPaymentStatus("split-summary");
  };

  const handleSplitBillClick = () => {
    setPaymentStatus("split-bill");
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
    handleSplitBill: handleSplitBillClick,
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
    handleReturnToSplitSummary,
  };
}
