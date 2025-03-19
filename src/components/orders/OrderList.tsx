
import { useState } from "react";
import { Order } from "@/components/tables/TableActionPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, AlertCircle, CreditCard, Wallet, CircleDollarSign } from "lucide-react";
import { toast } from "sonner";

interface OrderListProps {
  orders: Order[];
  onCompleteOrder: (orderId: string) => void;
  onUpdateItemStatus: (orderId: string, itemId: string, status: 'pending' | 'cooking' | 'served') => void;
}

export function OrderList({ orders, onCompleteOrder, onUpdateItemStatus }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-amber-100 text-amber-800";
      case "completed": return "bg-green-100 text-green-800";
      case "paid": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case "served": return <Check className="h-4 w-4 text-green-600" />;
      case "cooking": return <Clock className="h-4 w-4 text-amber-600" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return "Just now";
    if (diffMin === 1) return "1 min ago";
    if (diffMin < 60) return `${diffMin} mins ago`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <Wallet className="h-4 w-4" />;
      default:
        return <CircleDollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map(order => (
        <div 
          key={order.id}
          className={`bg-white rounded-lg border shadow-sm p-5 transition-all cursor-pointer hover:shadow-md ${selectedOrder === order.id ? 'ring-2 ring-app-purple' : ''}`}
          onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">Table #{order.tableNumber}</h3>
                <Badge className={getStatusColor(order.status)}>
                  {order.status === 'paid' ? 'Paid' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-1">{order.customerName}</p>
            </div>
            <div className="text-sm text-gray-500">{formatTimeAgo(order.createdAt)}</div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getItemStatusIcon(item.status)}
                  <span>{item.quantity}× {item.name}</span>
                </div>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between font-medium">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          
          {order.paymentMethod && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span>Paid via:</span>
              <div className="flex items-center gap-1">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </div>
          )}
          
          {selectedOrder === order.id && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {order.status !== 'paid' && order.status !== 'completed' && (
                <div className="grid grid-cols-2 gap-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-24">{item.name}</span>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateItemStatus(
                          order.id, 
                          item.id, 
                          e.target.value as 'pending' | 'cooking' | 'served'
                        )}
                        className="ml-2 text-xs p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="cooking">Cooking</option>
                        <option value="served">Served</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
              
              {order.status !== 'paid' && (
                <Button 
                  className="w-full bg-app-purple hover:bg-app-purple/90"
                  onClick={() => onCompleteOrder(order.id)}
                  disabled={order.status === "completed"}
                >
                  {order.status === "completed" ? "Completed" : "Mark as Completed"}
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
