
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TableManager } from "@/components/tables/TableManager";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Clock, Check, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Order, OrderItem } from "@/components/tables/TableActionPanel";

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
    status: "completed",
    createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    total: 47.96
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
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  
  const handleCreateNewOrder = () => {
    setOrderMode(true);
  };
  
  const handleCancelOrder = () => {
    setOrderMode(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-amber-100 text-amber-800";
      case "completed": return "bg-green-100 text-green-800";
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
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {orderMode ? (
          <>
            <Header 
              title="New Order" 
              actionButton={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleCancelOrder}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              }
            />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="flex w-full mb-8">
                    <TabsTrigger value="table" className="flex-1">
                      1. Choose a Table
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="flex-1">
                      2. Choose a Customer
                    </TabsTrigger>
                    <TabsTrigger value="menu" className="flex-1">
                      3. Select Menu
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select a Table</h2>
                    <p className="text-gray-500 mb-4">Select a table for the new order.</p>
                    
                    <div className="h-[450px] overflow-y-auto">
                      <TableManager />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customer" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select a Customer</h2>
                    <p className="text-gray-500">Customer selection will be implemented here.</p>
                  </TabsContent>
                  
                  <TabsContent value="menu" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select Menu Items</h2>
                    <p className="text-gray-500">Menu selection will be implemented here.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
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
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                          
                          {selectedOrder === order.id && (
                            <div className="mt-4 pt-4 border-t space-y-3">
                              {order.status !== 'completed' && (
                                <div className="grid grid-cols-2 gap-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                      <span className="truncate max-w-24">{item.name}</span>
                                      <select
                                        value={item.status}
                                        onChange={(e) => handleUpdateItemStatus(
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
                              
                              <Button 
                                className="w-full bg-app-purple hover:bg-app-purple/90"
                                onClick={() => handleCompleteOrder(order.id)}
                                disabled={order.status === "completed"}
                              >
                                {order.status === "completed" ? "Completed" : "Mark as Completed"}
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
