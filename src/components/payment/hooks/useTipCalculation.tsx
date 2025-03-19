
import { useState } from "react";
import { Order } from "@/components/tables/TableActionPanel";

export type TipType = "percent" | "amount";

export function useTipCalculation(order: Order) {
  const [tipType, setTipType] = useState<TipType>("percent");
  const [tipValue, setTipValue] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<number>(0);
  
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

  return {
    tipType,
    tipValue,
    tipAmount,
    calculateTotalWithTip,
    handleTipValueChange,
    handleTipTypeChange
  };
}
