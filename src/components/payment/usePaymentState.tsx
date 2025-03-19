import { useState } from "react";
import { Order, OrderItem } from "@/components/tables/TableActionPanel";
import { CreditCard, Wallet, CircleDollarSign } from "lucide-react";
import { SplitCustomer, PaymentMethod, PaymentStatus } from "./PaymentModal";

type TipType = "percent" | "amount";
type SplitType = "equal" | "custom";

export function usePaymentState(order: Order, onPaymentComplete: (paymentMethod: string) => void) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [changeAmount, setChangeAmount] = useState<number>(0);
  
  // Tip state
  const [tipType, setTipType] = useState<TipType>("percent");
  const [tipValue, setTipValue] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<number>(0);
  
  // Split bill state
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(2);
  const [customers, setCustomers] = useState<SplitCustomer[]>([
    { id: "c1", name: "Customer 1", items: [], total: 0 },
    { id: "c2", name: "Customer 2", items: [], total: 0 }
  ]);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  
  // Define payment methods with JSX icons
  const paymentMethods: PaymentMethod[] = [
    {
      id: "cash",
      name: "Cash",
      icon: <Wallet className="h-6 w-6" />,
      description: "Pay with cash at the table"
    },
    {
      id: "card",
      name: "Card",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Pay with credit or debit card"
    },
    {
      id: "other",
      name: "Other",
      icon: <CircleDollarSign className="h-6 w-6" />,
      description: "Other payment methods"
    }
  ];
  
  // Calculate the total with tip
  const calculateTotalWithTip = () => {
    return order.total + tipAmount;
  };
  
  // Calculate tip amount based on type and value
  const calculateTipAmount = (type: TipType, value: string): number => {
    if (!value || isNaN(parseFloat(value))) return 0;
    
    if (type === "percent") {
      const percentage = parseFloat(value);
      return (percentage / 100) * order.total;
    } else {
      return parseFloat(value);
    }
  };
  
  // Handle tip value change
  const handleTipValueChange = (value: string) => {
    setTipValue(value);
    const calculatedTipAmount = calculateTipAmount(tipType, value);
    setTipAmount(calculatedTipAmount);
  };
  
  // Handle tip type change
  const handleTipTypeChange = (value: string) => {
    if (value === "percent" || value === "amount") {
      setTipType(value);
      // Recalculate tip amount with new type
      const calculatedTipAmount = calculateTipAmount(value as TipType, tipValue);
      setTipAmount(calculatedTipAmount);
    }
  };
  
  const handlePaymentSubmit = () => {
    if (selectedPaymentMethod === "cash") {
      setPaymentStatus("cash-input");
    } else {
      setPaymentStatus("processing");
      
      // Simulate payment processing for non-cash payments
      setTimeout(() => {
        setPaymentStatus("success");
        
        // After showing success message, close modal and notify parent
        setTimeout(() => {
          onPaymentComplete(selectedPaymentMethod);
        }, 1500);
      }, 2000);
    }
  };
  
  const handleSplitBill = () => {
    // Initialize equal split
    if (splitType === "equal") {
      const equalAmount = calculateTotalWithTip() / numberOfCustomers;
      const updatedCustomers = Array.from({ length: numberOfCustomers }, (_, i) => ({
        id: `c${i+1}`,
        name: `Customer ${i+1}`,
        items: [],
        total: parseFloat(equalAmount.toFixed(2))
      }));
      setCustomers(updatedCustomers);
    } else {
      // For custom split, start with empty assignments
      const updatedCustomers = Array.from({ length: numberOfCustomers }, (_, i) => ({
        id: `c${i+1}`,
        name: `Customer ${i+1}`,
        items: [],
        total: 0
      }));
      setCustomers(updatedCustomers);
    }
    
    setPaymentStatus("split-bill");
  };
  
  const handleCashAmountSubmit = () => {
    const receivedAmount = parseFloat(cashReceived);
    const totalWithTip = calculateTotalWithTip();
    
    if (isNaN(receivedAmount) || receivedAmount < totalWithTip) {
      return; // Don't proceed if invalid amount or less than total with tip
    }
    
    const change = receivedAmount - totalWithTip;
    setChangeAmount(change);
    setPaymentStatus("cash-change");
  };
  
  const handleCashPaymentComplete = () => {
    setPaymentStatus("success");
    
    // After showing success message, close modal and notify parent
    setTimeout(() => {
      onPaymentComplete(selectedPaymentMethod);
    }, 1500);
  };
  
  // Functions for split bill
  const handleAddCustomer = () => {
    if (numberOfCustomers < 8) {
      setNumberOfCustomers(prev => prev + 1);
      const updatedCustomers = [
        ...customers,
        { id: `c${numberOfCustomers + 1}`, name: `Customer ${numberOfCustomers + 1}`, items: [], total: 0 }
      ];
      setCustomers(updatedCustomers);
      
      // Recalculate totals for equal split
      if (splitType === "equal") {
        const equalAmount = calculateTotalWithTip() / (numberOfCustomers + 1);
        setCustomers(updatedCustomers.map(c => ({ ...c, total: parseFloat(equalAmount.toFixed(2)) })));
      }
    }
  };
  
  const handleRemoveCustomer = () => {
    if (numberOfCustomers > 2) {
      setNumberOfCustomers(prev => prev - 1);
      const updatedCustomers = customers.slice(0, -1);
      setCustomers(updatedCustomers);
      
      // Recalculate totals for equal split
      if (splitType === "equal") {
        const equalAmount = calculateTotalWithTip() / (numberOfCustomers - 1);
        setCustomers(updatedCustomers.map(c => ({ ...c, total: parseFloat(equalAmount.toFixed(2)) })));
      }
    }
  };
  
  const handleSplitTypeChange = (type: SplitType) => {
    setSplitType(type);
    
    if (type === "equal") {
      const equalAmount = calculateTotalWithTip() / numberOfCustomers;
      setCustomers(customers.map(c => ({ ...c, items: [], total: parseFloat(equalAmount.toFixed(2)) })));
    } else {
      // Reset totals for custom split
      setCustomers(customers.map(c => ({ ...c, items: [], total: 0 })));
    }
  };
  
  const handleAssignItemToCustomer = (itemId: string, customerId: string) => {
    // Only for custom split
    if (splitType !== "custom") return;
    
    const item = order.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if the item is already assigned to any customer
    const isAssigned = customers.some(c => c.items.some(i => i.itemId === itemId));
    
    // Create new customer state
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        // If item already assigned to this customer, remove it
        if (customer.items.some(i => i.itemId === itemId)) {
          return {
            ...customer,
            items: customer.items.filter(i => i.itemId !== itemId),
            total: parseFloat((customer.total - (item.price * item.quantity)).toFixed(2))
          };
        }
        // Otherwise, add it to this customer
        return {
          ...customer,
          items: [...customer.items, { itemId, quantity: item.quantity }],
          total: parseFloat((customer.total + (item.price * item.quantity)).toFixed(2))
        };
      }
      // If item was previously assigned to another customer, remove it
      else if (isAssigned && customer.items.some(i => i.itemId === itemId)) {
        return {
          ...customer,
          items: customer.items.filter(i => i.itemId !== itemId),
          total: parseFloat((customer.total - (item.price * item.quantity)).toFixed(2))
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
  };
  
  const handleSetCustomerName = (customerId: string, name: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, name } : c
    ));
  };
  
  const handleCompleteSplit = () => {
    // Validate that all items are assigned in custom split
    if (splitType === "custom") {
      const allItemsAssigned = order.items.every(item => 
        customers.some(c => c.items.some(i => i.itemId === item.id))
      );
      
      if (!allItemsAssigned) {
        // In a real app, you might show a warning here
        console.warn("Not all items are assigned to customers");
      }
    }
    
    // Return to payment method selection
    setPaymentStatus("idle");
  };
  
  // Helper function to check if an item is assigned to a customer
  const isItemAssignedToCustomer = (itemId: string, customerId: string) => {
    return customers.find(c => c.id === customerId)?.items.some(i => i.itemId === itemId) || false;
  };
  
  // Calculate total assigned in custom split
  const calculateAssignedTotal = () => {
    let total = 0;
    customers.forEach(customer => {
      customer.items.forEach(item => {
        const orderItem = order.items.find(i => i.id === item.itemId);
        if (orderItem) {
          total += orderItem.price * orderItem.quantity;
        }
      });
    });
    return total;
  };
  
  const getRemainingAmount = () => {
    if (splitType === "equal") return 0;
    return parseFloat((order.total - calculateAssignedTotal()).toFixed(2));
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
