
import { useState } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "../PaymentModal";
import { PaymentStatus } from "../PaymentModal";
import { nanoid } from "@/lib/utils";

export type TipType = "percent" | "amount";

export type SplitType = "equal" | "custom";

interface UseSplitBillProps {
  order: Order;
  calculateTotalWithTip: () => number;
  setPaymentStatus: (status: PaymentStatus) => void;
}

export function useSplitBill(order: Order, calculateTotalWithTip: () => number, setPaymentStatus: (status: PaymentStatus) => void) {
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [numberOfCustomers, setNumberOfCustomers] = useState(2);
  const [customers, setCustomers] = useState<SplitCustomer[]>(initialCustomers());

  // Create initial customers
  function initialCustomers(): SplitCustomer[] {
    return Array.from({ length: 2 }, (_, i) => ({
      id: `customer-${nanoid()}`,
      name: `Customer ${i + 1}`,
      items: [],
      total: splitType === "equal" ? order.total / 2 : 0,
      tipType: "percent" as TipType,
      tipValue: "15",
      tipAmount: splitType === "equal" ? (order.total / 2) * 0.15 : 0,
    }));
  }

  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);

    if (type === "equal") {
      // Update customers with equal amounts
      const equalAmount = order.total / numberOfCustomers;
      const updatedCustomers = customers.map(customer => ({
        ...customer,
        items: [],
        total: equalAmount,
        tipAmount: calculateTipAmount(equalAmount, customer.tipType, customer.tipValue)
      }));
      setCustomers(updatedCustomers);
    } else {
      // Reset item assignments for custom split
      const resetCustomers = customers.map(customer => ({
        ...customer,
        items: [],
        total: 0,
        tipAmount: 0
      }));
      setCustomers(resetCustomers);
    }
  };

  const handleAddCustomer = () => {
    if (numberOfCustomers >= 8) return;
    
    setNumberOfCustomers(prev => prev + 1);
    const newCustomer: SplitCustomer = {
      id: `customer-${nanoid()}`,
      name: `Customer ${numberOfCustomers + 1}`,
      items: [],
      total: splitType === "equal" ? order.total / (numberOfCustomers + 1) : 0,
      tipType: "percent" as TipType,
      tipValue: "15",
      tipAmount: splitType === "equal" ? (order.total / (numberOfCustomers + 1)) * 0.15 : 0,
    };
    
    if (splitType === "equal") {
      // Recalculate equal amounts
      const equalAmount = order.total / (numberOfCustomers + 1);
      const updatedCustomers = customers.map(customer => ({
        ...customer,
        total: equalAmount,
        tipAmount: calculateTipAmount(equalAmount, customer.tipType, customer.tipValue)
      }));
      setCustomers([...updatedCustomers, newCustomer]);
    } else {
      setCustomers(prev => [...prev, newCustomer]);
    }
  };

  const handleRemoveCustomer = () => {
    if (numberOfCustomers <= 2) return;
    
    setNumberOfCustomers(prev => prev - 1);
    
    if (splitType === "equal") {
      // Recalculate equal amounts
      const equalAmount = order.total / (numberOfCustomers - 1);
      const updatedCustomers = customers.slice(0, -1).map(customer => ({
        ...customer,
        total: equalAmount,
        tipAmount: calculateTipAmount(equalAmount, customer.tipType, customer.tipValue)
      }));
      setCustomers(updatedCustomers);
    } else {
      // Reassign items from removed customer
      const customerToRemove = customers[customers.length - 1];
      setCustomers(prev => prev.slice(0, -1));
    }
  };

  const calculateTipAmount = (subtotal: number, tipType: TipType, tipValue: string): number => {
    const value = parseFloat(tipValue) || 0;
    
    if (tipType === "percent") {
      return subtotal * (value / 100);
    } else {
      return value;
    }
  };

  const handleAssignItemToCustomer = (itemId: string, customerId: string) => {
    if (splitType !== "custom") return;
    
    // Get the item from the order
    const orderItem = order.items.find(item => item.id === itemId);
    if (!orderItem) return;
    
    // Check if item is already assigned to this customer
    const customerHasItem = customers.find(c => 
      c.id === customerId && c.items.some(i => i.itemId === itemId)
    );
    
    if (customerHasItem) {
      // Remove item from this customer
      const updatedCustomers = customers.map(customer => {
        if (customer.id === customerId) {
          const updatedItems = customer.items.filter(item => item.itemId !== itemId);
          const updatedTotal = calculateCustomerTotal(updatedItems, order);
          return {
            ...customer,
            items: updatedItems,
            total: updatedTotal,
            tipAmount: calculateTipAmount(updatedTotal, customer.tipType, customer.tipValue)
          };
        }
        return customer;
      });
      setCustomers(updatedCustomers);
    } else {
      // Remove item from any other customer first
      const customersWithoutItem = customers.map(customer => {
        if (customer.items.some(item => item.itemId === itemId)) {
          const updatedItems = customer.items.filter(item => item.itemId !== itemId);
          const updatedTotal = calculateCustomerTotal(updatedItems, order);
          return {
            ...customer,
            items: updatedItems,
            total: updatedTotal,
            tipAmount: calculateTipAmount(updatedTotal, customer.tipType, customer.tipValue)
          };
        }
        return customer;
      });
      
      // Add item to selected customer
      const updatedCustomers = customersWithoutItem.map(customer => {
        if (customer.id === customerId) {
          const updatedItems = [
            ...customer.items,
            { itemId, quantity: orderItem.quantity }
          ];
          const updatedTotal = calculateCustomerTotal(updatedItems, order);
          return {
            ...customer,
            items: updatedItems,
            total: updatedTotal,
            tipAmount: calculateTipAmount(updatedTotal, customer.tipType, customer.tipValue)
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
    }
  };

  const calculateCustomerTotal = (items: { itemId: string; quantity: number }[], order: Order): number => {
    return items.reduce((total, item) => {
      const orderItem = order.items.find(i => i.id === item.itemId);
      if (orderItem) {
        return total + (orderItem.price * orderItem.quantity);
      }
      return total;
    }, 0);
  };

  const handleSetCustomerName = (customerId: string, name: string) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId ? { ...customer, name } : customer
    );
    setCustomers(updatedCustomers);
  };

  const handleCustomerTipTypeChange = (customerId: string, tipType: TipType) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        const tipAmount = calculateTipAmount(customer.total, tipType, customer.tipValue);
        return { 
          ...customer, 
          tipType, 
          tipAmount 
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  const handleCustomerTipValueChange = (customerId: string, tipValue: string) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        const tipAmount = calculateTipAmount(customer.total, customer.tipType, tipValue);
        return { 
          ...customer, 
          tipValue, 
          tipAmount 
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  const isItemAssignedToCustomer = (itemId: string, customerId: string): boolean => {
    const customer = customers.find(c => c.id === customerId);
    return !!customer?.items.some(item => item.itemId === itemId);
  };

  const getRemainingAmount = (): number => {
    if (splitType === "equal") return 0;
    
    const assignedTotal = customers.reduce((sum, customer) => sum + customer.total, 0);
    return parseFloat((order.total - assignedTotal).toFixed(2));
  };

  const getCustomerTotalWithTip = (customerId: string): number => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 0;
    
    return customer.total + customer.tipAmount;
  };

  const handleCompleteSplit = () => {
    setPaymentStatus("idle");
  };

  const handleSplitBill = () => {
    setPaymentStatus("split-bill");
  };

  return {
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
  };
}
