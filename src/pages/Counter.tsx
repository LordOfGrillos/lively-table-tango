
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CounterOrderSystem, type CounterOrder } from "@/components/counter/CounterOrderSystem";
import { CafeOrderList } from "@/components/counter/CafeOrderList";
import { InventoryProvider } from "@/components/inventory/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Counter() {
  const [orders, setOrders] = useState<CounterOrder[]>([]);
  
  const handleStatusChange = (orderId: string, newStatus: CounterOrder['status']) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Counter Order System" 
          subtitle="Take orders directly from the counter"
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="order" className="space-y-4">
              <TabsList>
                <TabsTrigger value="order">Nueva Orden</TabsTrigger>
                <TabsTrigger value="log">Registro de Órdenes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="order">
                <InventoryProvider>
                  <CounterOrderSystem onOrderComplete={(order) => setOrders(prev => [...prev, order])} />
                </InventoryProvider>
              </TabsContent>
              
              <TabsContent value="log">
                <CafeOrderList 
                  orders={orders} 
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
