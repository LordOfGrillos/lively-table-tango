
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useInventory } from "../InventoryContext";
import { Card } from "@/components/ui/card";
import { format, subDays } from "date-fns";

interface InventoryValueChartProps {
  className?: string;
}

export function InventoryValueChart({ className }: InventoryValueChartProps) {
  const { transactions } = useInventory();
  
  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const days = 7;
    const currentValue = transactions.reduce((acc, tx) => {
      if (tx.type === "addition") {
        return acc + (tx.cost || 0);
      } else if (tx.type === "reduction" || tx.type === "order-usage") {
        return acc - (tx.cost || 0);
      }
      return acc;
    }, 0);
    
    // Create an array of the last 7 days
    const data = Array.from({ length: days }).map((_, index) => {
      const date = subDays(new Date(), days - 1 - index);
      const day = format(date, "MMM dd");
      
      // Calculate historical value based on transactions
      const dayTransactions = transactions.filter(tx => 
        format(tx.date, "MMM dd") === day
      );
      
      const dayValue = dayTransactions.reduce((acc, tx) => {
        if (tx.type === "addition") {
          return acc + (tx.cost || 0);
        } else if (tx.type === "reduction" || tx.type === "order-usage") {
          return acc - (tx.cost || 0);
        }
        return acc;
      }, 0);
      
      return {
        day,
        value: index === days - 1 ? currentValue : currentValue - dayValue,
      };
    });
    
    return data;
  }, [transactions]);
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
