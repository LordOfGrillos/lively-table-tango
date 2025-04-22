
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { CounterOrderSystem, type CounterOrder } from "@/components/counter/CounterOrderSystem";
import { CafeOrderList } from "@/components/counter/CafeOrderList";
import { InventoryProvider } from "@/components/inventory/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Counter() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CounterOrder[]>([]);
  
  const handleStatusChange = (orderId: string, newStatus: CounterOrder['status']) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filter out orders with "pending" status and map CounterOrder to CafeOrder
  const cafeOrders = orders
    .filter(order => order.status !== "pending")
    .map(order => ({
      ...order,
      status: order.status as "preparing" | "ready" | "completed"
    }));

  const handleExit = () => {
    navigate('/');  // Navigate back to the main dashboard
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Cafeteria Order System" 
          subtitle="Manage counter orders"
          actionButton={
            <Button 
              variant="destructive" 
              onClick={handleExit}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          }
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
                  orders={cafeOrders} 
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
