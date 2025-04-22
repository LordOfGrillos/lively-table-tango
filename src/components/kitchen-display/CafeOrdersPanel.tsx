
import { KitchenOrder } from "./types";
import { OrderCard } from "./OrderCard";
import { cn } from "@/lib/utils";

interface CafeOrdersPanelProps {
  orders: KitchenOrder[];
  onMarkInProgress: (orderId: string) => void;
  onMarkAsReady: (orderId: string) => void;
  onMarkAsDelivered: (orderId: string) => void;
  fullWidth?: boolean;
}

export function CafeOrdersPanel({ 
  orders, 
  onMarkInProgress, 
  onMarkAsReady, 
  onMarkAsDelivered,
  fullWidth = false
}: CafeOrdersPanelProps) {
  // Sort orders by priority and then by age (oldest first)
  const sortedOrders = [...orders].sort((a, b) => {
    const priorityOrder = { rush: 0, high: 1, normal: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by creation time (oldest first)
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
  
  return (
    <div className={cn(
      "flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full",
      fullWidth ? "col-span-3" : ""
    )}>
      <div className="bg-purple-800 text-white py-2 px-4 font-bold text-lg">
        Cafe ({orders.length})
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sortedOrders.length > 0 ? (
          sortedOrders.map(order => (
            <OrderCard 
              key={order.id}
              order={order}
              onMarkInProgress={onMarkInProgress}
              onMarkAsReady={onMarkAsReady}
              onMarkAsDelivered={onMarkAsDelivered}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No pending cafe orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
