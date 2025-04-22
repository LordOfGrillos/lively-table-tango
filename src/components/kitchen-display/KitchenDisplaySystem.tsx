
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenOrdersPanel } from "./KitchenOrdersPanel";
import { BarOrdersPanel } from "./BarOrdersPanel";
import { CafeOrdersPanel } from "./CafeOrdersPanel";
import { mockOrders } from "./data/mockOrders";
import { KitchenOrder } from "./types";
import { toast } from "sonner";

export function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filterOrdersByDepartment = (department: string) => {
    if (department === "all") return orders;
    return orders.filter(order => order.department === department);
  };
  
  const handleMarkInProgress = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "in-progress", startedAt: new Date() } 
          : order
      )
    );
    
    toast.success("Order marked as in progress");
  };
  
  const handleMarkAsReady = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "ready", completedAt: new Date() } 
          : order
      )
    );
    
    toast.success("Order marked as ready");
  };
  
  const handleMarkAsDelivered = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "delivered" } 
          : order
      )
    );
    
    toast.success("Order marked as delivered");
    
    // After 5 seconds, remove the order from the list
    setTimeout(() => {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }, 5000);
  };

  return (
    <div className="h-full p-4">
      <Tabs defaultValue="all" className="h-full flex flex-col" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-4 w-2/3">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="cafe">Cafe</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">Waiting</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full">
            <div className="grid grid-cols-3 gap-4 h-full">
              <KitchenOrdersPanel 
                orders={filterOrdersByDepartment("kitchen")}
                onMarkInProgress={handleMarkInProgress}
                onMarkAsReady={handleMarkAsReady}
                onMarkAsDelivered={handleMarkAsDelivered}
              />
              <BarOrdersPanel 
                orders={filterOrdersByDepartment("bar")}
                onMarkInProgress={handleMarkInProgress}
                onMarkAsReady={handleMarkAsReady}
                onMarkAsDelivered={handleMarkAsDelivered}
              />
              <CafeOrdersPanel 
                orders={filterOrdersByDepartment("cafe")}
                onMarkInProgress={handleMarkInProgress}
                onMarkAsReady={handleMarkAsReady}
                onMarkAsDelivered={handleMarkAsDelivered}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="kitchen" className="h-full">
            <KitchenOrdersPanel 
              orders={filterOrdersByDepartment("kitchen")}
              onMarkInProgress={handleMarkInProgress}
              onMarkAsReady={handleMarkAsReady}
              onMarkAsDelivered={handleMarkAsDelivered}
              fullWidth
            />
          </TabsContent>
          
          <TabsContent value="bar" className="h-full">
            <BarOrdersPanel 
              orders={filterOrdersByDepartment("bar")}
              onMarkInProgress={handleMarkInProgress}
              onMarkAsReady={handleMarkAsReady}
              onMarkAsDelivered={handleMarkAsDelivered}
              fullWidth
            />
          </TabsContent>
          
          <TabsContent value="cafe" className="h-full">
            <CafeOrdersPanel 
              orders={filterOrdersByDepartment("cafe")}
              onMarkInProgress={handleMarkInProgress}
              onMarkAsReady={handleMarkAsReady}
              onMarkAsDelivered={handleMarkAsDelivered}
              fullWidth
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
