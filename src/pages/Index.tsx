
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TableManager } from "@/components/tables/TableManager";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, OrderItem } from "@/components/tables/TableActionPanel";
import { toast } from "sonner";
import { OrderCreation } from "@/components/orders/OrderCreation";
import { OrderList } from "@/components/orders/OrderList";

// Sample order data
const fakeOrders: Order[] = [
  {
    id: "order-1",
    tableId: "t12",
    tableNumber: "12",
    customerName: "John Smith",
    items: [
      { id: "item-1", name: "Grilled Salmon", quantity: 1, price: 24.99, status: "served" },
      { id: "item-2", name: "Caesar Salad", quantity: 1, price: 12.99, status: "served" },
      { id: "item-3", name: "Sparkling Water", quantity: 2, price: 4.99, status: "served" }
    ],
    status: "paid",
    createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    total: 47.96,
    paymentMethod: "card",
    paymentDate: new Date(Date.now() - 5 * 60000) // 5 minutes ago
  },
  {
    id: "order-2",
    tableId: "t13",
    tableNumber: "05",
    customerName: "Emma Johnson",
    items: [
      { id: "item-4", name: "Ribeye Steak", quantity: 1, price: 32.99, status: "cooking" },
      { id: "item-5", name: "Garlic Mashed Potatoes", quantity: 1, price: 8.99, status: "pending" },
      { id: "item-6", name: "Red Wine", quantity: 1, price: 12.99, status: "served" }
    ],
    status: "in-progress",
    createdAt: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    total: 54.97
  },
  {
    id: "order-3",
    tableId: "t14",
    tableNumber: "08",
    customerName: "Maria Garcia",
    items: [
      { id: "item-7", name: "Spaghetti Carbonara", quantity: 1, price: 18.99, status: "pending" },
      { id: "item-8", name: "Garlic Bread", quantity: 1, price: 6.99, status: "pending" },
      { id: "item-9", name: "Tiramisu", quantity: 1, price: 9.99, status: "pending" },
      { id: "item-10", name: "Iced Tea", quantity: 2, price: 3.99, status: "pending" }
    ],
    status: "new",
    createdAt: new Date(), // Just now
    total: 43.95
  },
  {
    id: "order-4",
    tableId: "t15",
    tableNumber: "03",
    customerName: "Alex Chen",
    items: [
      { id: "item-11", name: "Margherita Pizza", quantity: 1, price: 16.99, status: "cooking" },
      { id: "item-12", name: "Caprese Salad", quantity: 1, price: 11.99, status: "served" },
      { id: "item-13", name: "Cheesecake", quantity: 1, price: 8.99, status: "pending" },
      { id: "item-14", name: "Craft Beer", quantity: 2, price: 7.99, status: "served" }
    ],
    status: "in-progress",
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    total: 53.95
  }
];

export default function Index() {
  const [activeView, setActiveView] = useState<'tables' | 'order'>('tables');
  const [orderMode, setOrderMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  
  const handleCreateNewOrder = () => {
    setOrderMode(true);
  };
  
  const handleCancelOrder = () => {
    setOrderMode(false);
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Mark all items as served
          const updatedItems = order.items.map(item => ({
            ...item,
            status: 'served' as const
          }));
          
          return {
            ...order,
            items: updatedItems,
            status: 'completed' as const
          };
        }
        return order;
      })
    );
    
    const orderToComplete = orders.find(o => o.id === orderId);
    
    toast.success("Order marked as completed", {
      description: `Order for Table #${orderToComplete?.tableNumber} has been completed`
    });
  };
  
  const handleUpdateItemStatus = (orderId: string, itemId: string, newStatus: 'pending' | 'cooking' | 'served') => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Update the specific item status
          const updatedItems = order.items.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
          );
          
          // Check if all items are served to update order status
          const allServed = updatedItems.every(item => item.status === 'served');
          
          return {
            ...order,
            items: updatedItems,
            status: allServed ? 'completed' : (order.status === 'new' ? 'in-progress' : order.status)
          };
        }
        return order;
      })
    );
  };

  const handleCreateOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    setOrderMode(false);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {orderMode ? (
          <OrderCreation 
            onCancel={handleCancelOrder}
            onOrderCreate={handleCreateOrder}
          />
        ) : (
          <>
            <Header 
              title="Table Management" 
              subtitle="Manage your restaurant tables"
              actionButton={
                <Button 
                  className="bg-app-purple hover:bg-app-purple/90 flex items-center gap-2"
                  onClick={handleCreateNewOrder}
                >
                  <Plus className="h-4 w-4" />
                  New Order
                </Button>
              }
            />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="tables" className="w-full" onValueChange={(v) => setActiveView(v as 'tables' | 'order')}>
                  <TabsList className="w-full max-w-md mx-auto flex mb-8">
                    <TabsTrigger value="tables" className="flex-1">
                      Table View
                    </TabsTrigger>
                    <TabsTrigger value="order" className="flex-1">
                      Order View
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tables" className="animate-fade-in outline-none">
                    <TableManager />
                  </TabsContent>
                  
                  <TabsContent value="order" className="animate-fade-in outline-none">
                    <OrderList 
                      orders={orders}
                      onCompleteOrder={handleCompleteOrder}
                      onUpdateItemStatus={handleUpdateItemStatus}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
