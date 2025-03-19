import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TableManager } from "@/components/tables/TableManager";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Clock, Check, AlertCircle, CreditCard, Wallet, CircleDollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Order, OrderItem } from "@/components/tables/TableActionPanel";
import { MenuList } from "@/components/menu/MenuList";
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

// Function to get the payment method icon
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

export default function Index() {
  const [activeView, setActiveView] = useState<'tables' | 'order'>('tables');
  const [orderMode, setOrderMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(fakeOrders);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  
  const handleCreateNewOrder = () => {
    setOrderMode(true);
    setSelectedTable(null);
    setCustomerName("");
    setCurrentOrderItems([]);
  };
  
  const handleCancelOrder = () => {
    setOrderMode(false);
    setSelectedTable(null);
    setCustomerName("");
    setCurrentOrderItems([]);
  };

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

  const handleAddToOrder = (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => {
    console.log("Adding to order:", item, quantity, customizations);
    
    let itemPrice = item.price;
    
    if (customizations?.extras && customizations.extras.length > 0) {
      const extrasCost = customizations.extras.reduce((total, extra) => total + extra.price, 0);
      itemPrice += extrasCost;
    }
    
    const existingItemIndex = currentOrderItems.findIndex(orderItem => {
      if (orderItem.name !== item.name) return false;
      
      if (!orderItem.customizations && !customizations) return true;
      
      if (!orderItem.customizations || !customizations) return false;
      
      const removedIngredientsMatch = 
        orderItem.customizations.removedIngredients.length === customizations.removedIngredients.length &&
        orderItem.customizations.removedIngredients.every(ing => 
          customizations.removedIngredients.includes(ing)
        );
        
      const extrasMatch = 
        orderItem.customizations.extras.length === customizations.extras.length &&
        orderItem.customizations.extras.every(extra => 
          customizations.extras.some(e => e.name === extra.name && e.price === extra.price)
        );
        
      return removedIngredientsMatch && extrasMatch;
    });
    
    if (existingItemIndex >= 0) {
      const updatedOrder = [...currentOrderItems];
      updatedOrder[existingItemIndex].quantity += quantity;
      setCurrentOrderItems(updatedOrder);
    } else {
      setCurrentOrderItems([
        ...currentOrderItems,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: item.name,
          price: itemPrice,
          quantity,
          status: 'pending',
          customizations
        }
      ]);
    }
    
    const customizationSummary = customizations ? 
      `(${customizations.removedIngredients.length > 0 ? 'Removed items, ' : ''}${customizations.extras.length > 0 ? 'Added extras' : ''})` : '';
    
    toast.success(`${quantity}× ${item.name} ${customizationSummary} added to order`);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setCurrentOrderItems(currentOrderItems.filter(item => item.id !== itemId));
  };
  
  const calculateTotal = () => {
    return currentOrderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleSelectTable = (tableId: string, tableNumber: string) => {
    setSelectedTable(tableId);
    toast.success(`Table ${tableNumber} selected for order`);
  };
  
  const handlePlaceOrder = () => {
    if (!selectedTable) {
      toast.error("Please select a table first");
      return;
    }
    
    if (currentOrderItems.length === 0) {
      toast.error("Please add items to the order");
      return;
    }
    
    const tableNumber = selectedTable.replace('table-', '');
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: selectedTable,
      tableNumber: tableNumber,
      status: 'new',
      customerName: customerName || 'Guest',
      items: currentOrderItems,
      createdAt: new Date(),
      total: calculateTotal()
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    toast.success("Order created successfully", {
      description: `Order for ${customerName || 'Guest'} at Table ${tableNumber} has been placed`
    });
    
    setOrderMode(false);
    setSelectedTable(null);
    setCustomerName("");
    setCurrentOrderItems([]);
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
                    <TabsTrigger value="menu" className="flex-1">
                      2. Select Menu Items
                    </TabsTrigger>
                    <TabsTrigger value="review" className="flex-1">
                      3. Review Order
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Select a Table</h2>
                    <p className="text-gray-500 mb-4">Click on an available table to select it for the new order.</p>
                    
                    <div className="h-[450px] overflow-y-auto">
                      <TableManager onTableSelect={handleSelectTable} />
                    </div>
                    
                    {selectedTable && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800">Table {selectedTable.replace('table-', '')} selected</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="menu" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <div className="mb-6">
                      <h2 className="text-lg font-medium mb-4">Select Menu Items</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer-name">Customer Name</Label>
                          <Input 
                            id="customer-name" 
                            placeholder="Enter customer name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="mb-4"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                          <Input 
                            placeholder="Search menu..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 max-h-[400px] overflow-y-auto pr-2">
                        <MenuList 
                          onAddToOrder={handleAddToOrder} 
                          searchQuery={searchQuery}
                          selectedCategory={selectedCategory}
                        />
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium mb-3">Current Order</h3>
                        
                        <div className="mb-3 max-h-[300px] overflow-y-auto">
                          {currentOrderItems.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                              No items added yet
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {currentOrderItems.map((item, index) => (
                                <div key={index} className="flex justify-between border-b pb-2">
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-gray-500 text-sm">
                                      ${(item.price).toFixed(2)} × {item.quantity}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleRemoveItem(item.id)}
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between font-medium mb-4">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="review" className="bg-white p-6 rounded-lg border animate-fade-in">
                    <h2 className="text-lg font-medium mb-4">Review Order</h2>
                    
                    {!selectedTable && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">Please select a table first</p>
                      </div>
                    )}
                    
                    {currentOrderItems.length === 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">Please add items to the order</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-3">Order Summary</h3>
                      
                      {selectedTable && (
                        <div className="mb-2">
                          <span className="text-gray-500">Table:</span>
                          <span className="ml-2 font-medium">{selectedTable.replace('table-', '')}</span>
                        </div>
                      )}
                      
                      {customerName && (
                        <div className="mb-2">
                          <span className="text-gray-500">Customer:</span>
                          <span className="ml-2 font-medium">{customerName}</span>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <span className="text-gray-500">Items:</span>
                        <span className="ml-2 font-medium">{currentOrderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                      </div>
                      
                      <div className="mb-3 max-h-[200px] overflow-y-auto">
                        {currentOrderItems.map((item, index) => (
                          <div key={index} className="flex justify-between border-b py-2">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500 text-sm">
                                ${(item.price).toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                            <div>
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="default"
                        className="bg-app-purple hover:bg-app-purple/90"
                        onClick={handlePlaceOrder}
                        disabled={!selectedTable || currentOrderItems.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
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
                              
                              {order.status !== 'paid' && (
                                <Button 
                                  className="w-full bg-app-purple hover:bg-app-purple/90"
                                  onClick={() => handleCompleteOrder(order.id)}
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
