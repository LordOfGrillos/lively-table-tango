
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "../../PaymentModal";
import { TipType } from "../useSplitBill";

interface UseItemAssignmentProps {
  order: Order;
  customers: SplitCustomer[];
  setCustomers: (customers: SplitCustomer[]) => void;
  calculateTipAmount: (subtotal: number, tipType: TipType, tipValue: string) => number;
}

export function useItemAssignment({
  order,
  customers,
  setCustomers,
  calculateTipAmount
}: UseItemAssignmentProps) {
  const calculateCustomerTotal = (items: { itemId: string; quantity: number }[], order: Order): number => {
    return items.reduce((total, item) => {
      const orderItem = order.items.find(i => i.id === item.itemId);
      if (orderItem) {
        return total + (orderItem.price * orderItem.quantity);
      }
      return total;
    }, 0);
  };
  
  const handleAssignItemToCustomer = (itemId: string, customerId: string) => {
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

  const isItemAssignedToCustomer = (itemId: string, customerId: string): boolean => {
    const customer = customers.find(c => c.id === customerId);
    return !!customer?.items.some(item => item.itemId === itemId);
  };

  const getRemainingAmount = (): number => {
    const assignedTotal = customers.reduce((sum, customer) => sum + customer.total, 0);
    return parseFloat((order.total - assignedTotal).toFixed(2));
  };

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

  return {
    handleAssignItemToCustomer,
    isItemAssignedToCustomer,
    getRemainingAmount,
    calculateAssignedTotal,
    calculateCustomerTotal
  };
}
