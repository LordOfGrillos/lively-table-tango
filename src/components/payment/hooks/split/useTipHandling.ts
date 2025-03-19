
import { SplitCustomer } from "../../PaymentModal";
import { TipType } from "../useSplitBill";

interface UseTipHandlingProps {
  customers: SplitCustomer[];
}

export function useTipHandling({ customers }: UseTipHandlingProps) {
  const calculateTipAmount = (subtotal: number, tipType: TipType, tipValue: string): number => {
    const value = parseFloat(tipValue) || 0;
    
    if (tipType === "percent") {
      return subtotal * (value / 100);
    } else {
      return value;
    }
  };

  const getCustomerTotalWithTip = (customerId: string): number => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 0;
    
    return customer.total + customer.tipAmount;
  };

  return {
    calculateTipAmount,
    getCustomerTotalWithTip
  };
}
