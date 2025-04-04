
import { useState, useRef } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "../../PaymentModal";
import { nanoid } from "@/lib/utils";
import { TipType } from "../useSplitBill";

interface UseCustomerManagementProps {
  order: Order;
  splitType: "equal" | "custom";
}

export function useCustomerManagement({ 
  order, 
  splitType
}: UseCustomerManagementProps) {
  const [numberOfCustomers, setNumberOfCustomers] = useState(2);
  const [customers, setCustomers] = useState<SplitCustomer[]>(() => initialCustomers());
  
  // Use a ref to store the tip calculator function that will be set later
  const tipCalculatorRef = useRef<(subtotal: number, tipType: TipType, tipValue: string) => number>(
    // Default implementation until real calculator is provided
    (subtotal, tipType, tipValue) => {
      const value = parseFloat(tipValue) || 0;
      return tipType === "percent" ? subtotal * (value / 100) : value;
    }
  );

  // Function to set the tip calculator from outside
  const setTipCalculator = (calculator: (subtotal: number, tipType: TipType, tipValue: string) => number) => {
    tipCalculatorRef.current = calculator;
  };

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
        tipAmount: tipCalculatorRef.current(equalAmount, customer.tipType, customer.tipValue)
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
        tipAmount: tipCalculatorRef.current(equalAmount, customer.tipType, customer.tipValue)
      }));
      setCustomers(updatedCustomers);
    } else {
      // Remove last customer
      setCustomers(prev => prev.slice(0, -1));
    }
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
        const tipAmount = tipCalculatorRef.current(customer.total, tipType, customer.tipValue);
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
        const tipAmount = tipCalculatorRef.current(customer.total, customer.tipType, tipValue);
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

  const updateCustomersForSplitType = (type: "equal" | "custom") => {
    if (type === "equal") {
      // Update customers with equal amounts
      const equalAmount = order.total / numberOfCustomers;
      const updatedCustomers = customers.map(customer => ({
        ...customer,
        items: [],
        total: equalAmount,
        tipAmount: tipCalculatorRef.current(equalAmount, customer.tipType, customer.tipValue)
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

  return {
    numberOfCustomers,
    customers,
    handleAddCustomer,
    handleRemoveCustomer,
    handleSetCustomerName,
    handleCustomerTipTypeChange,
    handleCustomerTipValueChange,
    setCustomers,
    updateCustomersForSplitType,
    setTipCalculator
  };
}
