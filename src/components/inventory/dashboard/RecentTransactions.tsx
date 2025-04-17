import { format } from "date-fns";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryTransaction } from "../types";

interface RecentTransactionsProps {
  transactions: InventoryTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate();
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "addition":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "reduction":
      case "order-usage":
      case "waste":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <MoreHorizontal className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "addition":
        return "Stock Added";
      case "reduction":
        return "Manual Reduction";
      case "order-usage":
        return "Used in Order";
      case "waste":
        return "Waste";
      case "adjustment":
        return "Adjustment";
      default:
        return "Unknown";
    }
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/inventory?tab=history')}>
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No recent transactions</p>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                  tx.type === "addition" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {getTransactionTypeIcon(tx.type)}
                </div>
                
                <div>
                  <p className="font-medium">{tx.itemName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{getTransactionTypeText(tx.type)}</span>
                    <span className="mx-1">•</span>
                    <span>{format(tx.date, "MMM d, h:mm a")}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-medium ${
                  tx.type === "addition" ? "text-green-600" : "text-red-600"
                }`}>
                  {tx.type === "addition" ? "+" : "-"}{tx.quantity} units
                </p>
                <p className="text-xs text-gray-500">
                  {tx.previousStock} → {tx.newStock}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
