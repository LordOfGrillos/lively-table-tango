
import { KitchenOrder } from "./types";
import { OrderCard } from "./OrderCard";
import { cn } from "@/lib/utils";

interface KitchenOrdersPanelProps {
  orders: KitchenOrder[];
  onMarkInProgress: (orderId: string) => void;
  onMarkAsReady: (orderId: string) => void;
  onMarkAsDelivered: (orderId: string) => void;
  fullWidth?: boolean;
}

export function KitchenOrdersPanel({ 
  orders, 
  onMarkInProgress, 
  onMarkAsReady, 
  onMarkAsDelivered,
  fullWidth = false
}: KitchenOrdersPanelProps) {
  // Sort orders by priority (rush > high > normal) and then by age (oldest first)
  const sortedOrders = [...orders].sort((a, b) => {
    // First, sort by status to keep waiting orders at the top
    if (a.status === "waiting" && b.status !== "waiting") return -1;
    if (a.status !== "waiting" && b.status === "waiting") return 1;
    if (a.status === "in-progress" && b.status === "ready") return -1;
    if (a.status === "ready" && b.status === "in-progress") return 1;
    
    // For orders with same status, sort by priority
    const priorityOrder = { rush: 0, high: 1, normal: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by creation time (oldest first)
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
  
  // Determine oldest waiting or in-progress order
  const oldestActiveOrderIndex = sortedOrders.findIndex(
    order => order.status === "waiting" || order.status === "in-progress"
  );
  
  return (
    <div className={cn(
      "flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full",
      fullWidth ? "col-span-3" : ""
    )}>
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-4 font-bold text-lg flex items-center justify-between">
        <span>Cocina ({orders.length})</span>
        {orders.length > 0 && orders.some(o => o.priority === "rush") && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            ¡URGENTE!
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order, index) => (
            <OrderCard 
              key={order.id}
              order={order}
              onMarkInProgress={onMarkInProgress}
              onMarkAsReady={onMarkAsReady}
              onMarkAsDelivered={onMarkAsDelivered}
              isOldest={oldestActiveOrderIndex === index}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No hay órdenes pendientes en cocina</p>
          </div>
        )}
      </div>
    </div>
  );
}
