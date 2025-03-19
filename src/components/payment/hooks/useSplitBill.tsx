
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

  // Initialize tip handling (must be first because others depend on it)
  const tipHandling = useTipHandling({ customers });
  
  // Initialize customer management
  const customerManagement = useCustomerManagement({
    order,
    splitType,
    calculateTipAmount: tipHandling.calculateTipAmount
  });
  
  const { customers } = customerManagement;
  
  // Initialize item assignment
  const itemAssignment = useItemAssignment({
    order,
    customers,
    setCustomers: customerManagement.setCustomers,
    calculateTipAmount: tipHandling.calculateTipAmount
  });

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
