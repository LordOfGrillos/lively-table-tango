
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenOrdersPanel } from "./KitchenOrdersPanel";
import { BarOrdersPanel } from "./BarOrdersPanel";
import { CafeOrdersPanel } from "./CafeOrdersPanel";
import { mockOrders } from "./data/mockOrders";
import { KitchenOrder } from "./types";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle, ChefHat } from "lucide-react";

export function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Stats for dashboard
  const getStats = () => {
    return {
      waiting: orders.filter(o => o.status === "waiting").length,
      inProgress: orders.filter(o => o.status === "in-progress").length,
      ready: orders.filter(o => o.status === "ready").length,
      lateOrders: orders.filter(o => {
        if (!o.estimatedPrepTime) return false;
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - o.createdAt.getTime()) / 60000);
        return diffInMinutes > o.estimatedPrepTime && 
               (o.status === "waiting" || o.status === "in-progress");
      }).length
    };
  };
  
  const stats = getStats();
  
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
    
    toast.success("Orden marcada como en preparación");
  };
  
  const handleMarkAsReady = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "ready", completedAt: new Date() } 
          : order
      )
    );
    
    // Alerta de sonido para notificar que la orden está lista
    const audio = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    audio.play();
    
    toast.success("Orden lista para entregar - ¡Mesero notificado!");
  };
  
  const handleMarkAsDelivered = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "delivered" } 
          : order
      )
    );
    
    toast.success("Orden entregada con éxito");
    
    // Después de 5 segundos, remover la orden de la lista
    setTimeout(() => {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    }, 5000);
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Esperando</p>
              <p className="text-3xl font-bold text-blue-800">{stats.waiting}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full border border-blue-200">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">En Preparación</p>
              <p className="text-3xl font-bold text-amber-800">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full border border-amber-200">
              <ChefHat className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Listas</p>
              <p className="text-3xl font-bold text-green-800">{stats.ready}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full border border-green-200">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br from-${stats.lateOrders > 0 ? 'red' : 'gray'}-50 to-${stats.lateOrders > 0 ? 'red' : 'gray'}-100 border-${stats.lateOrders > 0 ? 'red' : 'gray'}-200`}>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className={`text-sm font-medium text-${stats.lateOrders > 0 ? 'red' : 'gray'}-600 mb-1`}>Atrasadas</p>
              <p className={`text-3xl font-bold text-${stats.lateOrders > 0 ? 'red' : 'gray'}-800`}>{stats.lateOrders}</p>
            </div>
            <div className={`p-3 bg-${stats.lateOrders > 0 ? 'red' : 'gray'}-100 rounded-full border border-${stats.lateOrders > 0 ? 'red' : 'gray'}-200`}>
              <AlertTriangle className={`h-8 w-8 text-${stats.lateOrders > 0 ? 'red' : 'gray'}-600`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="h-[calc(100%-120px)] flex flex-col bg-white rounded-lg shadow-sm" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center p-4 border-b">
          <TabsList className="grid grid-cols-4 w-2/3 h-12">
            <TabsTrigger value="all" className="text-base">Todas las Órdenes</TabsTrigger>
            <TabsTrigger value="kitchen" className="text-base">Cocina</TabsTrigger>
            <TabsTrigger value="bar" className="text-base">Bar</TabsTrigger>
            <TabsTrigger value="cafe" className="text-base">Café</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-base">Esperando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-base">En Preparación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-base">Listo</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full p-4">
            <div className="grid grid-cols-3 gap-6 h-full">
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
          
          <TabsContent value="kitchen" className="h-full p-4">
            <KitchenOrdersPanel 
              orders={filterOrdersByDepartment("kitchen")}
              onMarkInProgress={handleMarkInProgress}
              onMarkAsReady={handleMarkAsReady}
              onMarkAsDelivered={handleMarkAsDelivered}
              fullWidth
            />
          </TabsContent>
          
          <TabsContent value="bar" className="h-full p-4">
            <BarOrdersPanel 
              orders={filterOrdersByDepartment("bar")}
              onMarkInProgress={handleMarkInProgress}
              onMarkAsReady={handleMarkAsReady}
              onMarkAsDelivered={handleMarkAsDelivered}
              fullWidth
            />
          </TabsContent>
          
          <TabsContent value="cafe" className="h-full p-4">
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
