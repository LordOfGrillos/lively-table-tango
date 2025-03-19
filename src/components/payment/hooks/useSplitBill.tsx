
import { useState } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "../PaymentModal";
import { PaymentStatus } from "../PaymentModal";
import { useCustomerManagement } from "./split/useCustomerManagement";
import { useItemAssignment } from "./split/useItemAssignment";
import { useTipHandling } from "./split/useTipHandling";

export type TipType = "percent" | "amount";
export type SplitType = "equal" | "custom";

interface UseSplitBillProps {
  order: Order;
  calculateTotalWithTip: () => number;
  setPaymentStatus: (status: PaymentStatus) => void;
}

export function useSplitBill(
  order: Order, 
  calculateTotalWithTip: () => number, 
  setPaymentStatus: (status: PaymentStatus) => void
) {
  const [splitType, setSplitType] = useState<SplitType>("equal");
  
  // Initialize customer management first
  const customerManagement = useCustomerManagement({
    order,
    splitType
  });
  
  // Get customers from customer management
  const { customers } = customerManagement;
  
  // Initialize tip handling with customers
  const tipHandling = useTipHandling({ 
    customers 
  });
  
  // Then initialize item assignment with both customers and tip handling functions
  const itemAssignment = useItemAssignment({
    order,
    customers,
    setCustomers: customerManagement.setCustomers,
    calculateTipAmount: tipHandling.calculateTipAmount
  });

  // Update the customer management hook to use tip handling
  customerManagement.setTipCalculator(tipHandling.calculateTipAmount);

  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);
    customerManagement.updateCustomersForSplitType(type);
  };

  const handleSplitBill = () => {
    setPaymentStatus("split-bill");
  };

  const handleCompleteSplit = () => {
    setPaymentStatus("idle");
  };

  return {
    splitType,
    numberOfCustomers: customerManagement.numberOfCustomers,
    customers,
    handleSplitBill,
    handleAddCustomer: customerManagement.handleAddCustomer,
    handleRemoveCustomer: customerManagement.handleRemoveCustomer,
    handleSplitTypeChange,
    handleAssignItemToCustomer: itemAssignment.handleAssignItemToCustomer,
    handleSetCustomerName: customerManagement.handleSetCustomerName,
    handleCustomerTipTypeChange: customerManagement.handleCustomerTipTypeChange,
    handleCustomerTipValueChange: customerManagement.handleCustomerTipValueChange,
    handleCompleteSplit,
    isItemAssignedToCustomer: itemAssignment.isItemAssignedToCustomer,
    getRemainingAmount: itemAssignment.getRemainingAmount,
    getCustomerTotalWithTip: tipHandling.getCustomerTotalWithTip
  };
}
