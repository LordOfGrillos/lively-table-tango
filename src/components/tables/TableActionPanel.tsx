
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TableStatus } from "@/components/tables/TableShape";
import { Calendar, Clock, Users, X, ShoppingCart, Search, List, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuList } from "@/components/menu/MenuList";
import { MenuItemType, ItemCustomization, Extra } from "@/components/menu/MenuItem";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'pending' | 'cooking' | 'served';
  customizations?: {
    removedIngredients: string[];
    extras: Extra[];
  };
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  status: 'new' | 'in-progress' | 'completed';
  customerName?: string;
  items: OrderItem[];
  createdAt: Date;
  total: number;
}

type TableActionPanelProps = {
  selectedTable?: {
    id: string;
    number: string;
    status: TableStatus;
    capacity: number;
  };
  onClose: () => void;
  onStatusChange: (tableId: string, status: TableStatus) => void;
  onReservationCreate?: (tableId: string, data: any) => void;
  onOrderCreate?: (tableId: string, order: Order) => void;
  onOrderUpdate?: (order: Order) => void;
  existingOrder?: Order | null;
};

export function TableActionPanel({ 
  selectedTable, 
  onClose,
  onStatusChange,
  onReservationCreate,
  onOrderCreate,
  onOrderUpdate,
  existingOrder
}: TableActionPanelProps) {
  const [activeTab, setActiveTab] = useState<string>(existingOrder ? "order" : "status");
  const [customerName, setCustomerName] = useState(existingOrder?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>(
    existingOrder?.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      status: item.status,
      customizations: item.customizations
    })) || []
  );

  if (!selectedTable) return null;

  const handleStatusChange = (status: TableStatus) => {
    onStatusChange(selectedTable.id, status);
    
    const statusMessages = {
      available: "Table is now available",
      reserved: "Table has been reserved",
      occupied: "Table is now occupied",
      filled: "Table is now filled"
    };
    
    toast.success(statusMessages[status], {
      description: `Table ${selectedTable.number} status updated`
    });
  };

  const handleCreateReservation = () => {
    if (!customerName) {
      toast.error("Please enter customer name");
      return;
    }
    
    const reservationData = {
      tableId: selectedTable.id,
      customerName,
      customerPhone,
      guestCount,
      date: selectedDate,
      time: selectedTime
    };
    
    onReservationCreate?.(selectedTable.id, reservationData);
    handleStatusChange('reserved');
    
    setCustomerName("");
    setCustomerPhone("");
    setGuestCount(1);
    setSelectedDate("");
    setSelectedTime("");
  };
  
  const handleAddToOrder = (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => {
    let itemPrice = item.price;
    
    if (customizations?.extras && customizations.extras.length > 0) {
      const extrasCost = customizations.extras.reduce((total, extra) => total + extra.price, 0);
      itemPrice += extrasCost;
    }
    
    const existingItemIndex = currentOrder.findIndex(orderItem => {
      if (orderItem.id !== item.id) return false;
      
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
      const updatedOrder = [...currentOrder];
      updatedOrder[existingItemIndex].quantity += quantity;
      setCurrentOrder(updatedOrder);
    } else {
      setCurrentOrder([
        ...currentOrder,
        {
          id: item.id,
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
    
    toast.success(`${quantity}× ${item.name} ${customizationSummary} added to order`, {
      description: `Table ${selectedTable?.number}`
    });
  };
  
  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== itemId));
  };
  
  const handleUpdateItemStatus = (itemId: string, status: 'pending' | 'cooking' | 'served') => {
    const updatedOrder = currentOrder.map(item => 
      item.id === itemId ? { ...item, status } : item
    );
    
    setCurrentOrder(updatedOrder);
    
    if (existingOrder && onOrderUpdate) {
      const updatedExistingOrder = {
        ...existingOrder,
        items: updatedOrder,
        status: status === 'served' && updatedOrder.every(item => item.status === 'served') 
          ? 'completed' 
          : existingOrder.status === 'new' ? 'in-progress' : existingOrder.status
      };
      onOrderUpdate(updatedExistingOrder);
    }
  };
  
  const handleCreateOrder = () => {
    if (currentOrder.length === 0) {
      toast.error("Please add items to the order");
      return;
    }
    
    if (!customerName) {
      toast.error("Please enter customer name");
      return;
    }
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      status: 'new',
      customerName,
      items: currentOrder,
      createdAt: new Date(),
      total: calculateTotal()
    };
    
    onOrderCreate?.(selectedTable.id, newOrder);
    handleStatusChange('occupied');
    
    toast.success("Order created successfully", {
      description: `Table ${selectedTable.number} order placed`
    });
    
    setCurrentOrder([]);
    setCustomerName("");
  };
  
  const handleUpdateOrder = () => {
    if (!existingOrder || !onOrderUpdate) return;
    
    const updatedOrder = {
      ...existingOrder,
      items: currentOrder,
      total: calculateTotal()
    };
    
    onOrderUpdate(updatedOrder);
    
    toast.success("Order updated successfully", {
      description: `Table ${selectedTable.number} order updated`
    });
  };
  
  const handleCompleteOrder = () => {
    if (!existingOrder || !onOrderUpdate) return;
    
    const updatedItems = currentOrder.map(item => ({
      ...item,
      status: 'served' as const
    }));
    
    const updatedOrder = {
      ...existingOrder,
      items: updatedItems,
      status: 'completed' as const
    };
    
    onOrderUpdate(updatedOrder);
    handleStatusChange('available');
    
    toast.success("Order completed", {
      description: `Table ${selectedTable.number} order is now complete`
    });
    
    onClose();
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg p-6 rounded-t-2xl animate-slide-up z-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Table {selectedTable.number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium px-2 py-1 rounded-full
                ${selectedTable.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                ${selectedTable.status === 'reserved' ? 'bg-red-100 text-red-800' : ''}
                ${selectedTable.status === 'filled' ? 'bg-gray-100 text-gray-800' : ''}
                ${selectedTable.status === 'occupied' ? 'bg-amber-100 text-amber-800' : ''}
              `}>
                {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{selectedTable.capacity} seats</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="status">
              Table Status
            </TabsTrigger>
            <TabsTrigger value="order">
              {existingOrder ? "View Order" : "Create Order"}
            </TabsTrigger>
            <TabsTrigger value="reservation">
              Make Reservation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="bg-table-available text-green-800 hover:bg-table-available/80 border-none"
                onClick={() => handleStatusChange('available')}
              >
                Available
              </Button>
              <Button 
                variant="outline"
                className="bg-table-reserved text-red-800 hover:bg-table-reserved/80 border-none"
                onClick={() => handleStatusChange('reserved')}
              >
                Reserved
              </Button>
              <Button 
                variant="outline"
                className="bg-table-filled text-gray-800 hover:bg-table-filled/80 border-none"
                onClick={() => handleStatusChange('filled')}
              >
                Filled
              </Button>
              <Button 
                variant="outline"
                className="bg-table-occupied text-amber-800 hover:bg-table-occupied/80 border-none"
                onClick={() => handleStatusChange('occupied')}
              >
                Occupied
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="order" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search menu..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={undefined}><em>All Categories</em></SelectItem>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Main Courses">Main Courses</SelectItem>
                      <SelectItem value="Sides">Sides</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto pr-2">
                  <MenuList 
                    onAddToOrder={handleAddToOrder} 
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-[300px]">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Current Order
                    </h3>
                    <Badge variant="outline">
                      {currentOrder.reduce((total, item) => total + item.quantity, 0)} items
                    </Badge>
                  </div>
                  
                  {!existingOrder && (
                    <div className="mb-3">
                      <Label htmlFor="customer-name">Customer Name</Label>
                      <Input 
                        id="customer-name" 
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div className="mb-3 max-h-[200px] overflow-y-auto">
                    {currentOrder.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        No items added yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentOrder.map((item, index) => (
                          <Card key={index} className="p-2 text-sm">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-500">
                                  ${(item.price).toFixed(2)} × {item.quantity}
                                </div>
                                
                                {item.customizations && (
                                  <div className="mt-1 text-xs">
                                    {item.customizations.removedIngredients.length > 0 && (
                                      <div className="flex items-center gap-1 text-red-600">
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>No: {item.customizations.removedIngredients.join(", ")}</span>
                                      </div>
                                    )}
                                    
                                    {item.customizations.extras.length > 0 && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Plus className="h-3 w-3" />
                                        <span>
                                          {item.customizations.extras.map(e => `${e.name} (+$${e.price.toFixed(2)})`).join(", ")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            
                            {existingOrder && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <Select 
                                  value={item.status} 
                                  onValueChange={(val: 'pending' | 'cooking' | 'served') => 
                                    handleUpdateItemStatus(item.id, val)
                                  }
                                >
                                  <SelectTrigger className="h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cooking">Cooking</SelectItem>
                                    <SelectItem value="served">Served</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                            
                            {!existingOrder && (
                              <div className="flex justify-end mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-medium mb-4">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  {existingOrder ? (
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="default"
                        className="bg-app-purple hover:bg-app-purple/90 w-full"
                        onClick={handleUpdateOrder}
                        disabled={currentOrder.length === 0}
                      >
                        Update Order
                      </Button>
                      
                      <Button 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 w-full"
                        onClick={handleCompleteOrder}
                        disabled={!currentOrder.every(item => item.status === 'served')}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default"
                      className="bg-app-purple hover:bg-app-purple/90 w-full"
                      onClick={handleCreateOrder}
                      disabled={currentOrder.length === 0 || !customerName}
                    >
                      <List className="mr-2 h-4 w-4" />
                      Place Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reservation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input 
                  id="customer-name" 
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone Number</Label>
                <Input 
                  id="customer-phone" 
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guest-count">Number of Guests</Label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <Select 
                    value={guestCount.toString()} 
                    onValueChange={(val) => setGuestCount(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: selectedTable.capacity}, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservation-date">Reservation Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <Input 
                    id="reservation-date" 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservation-time">Reservation Time</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <Input 
                    id="reservation-time" 
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                variant="default"
                className="bg-app-purple hover:bg-app-purple/90"
                onClick={handleCreateReservation}
              >
                Create Reservation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
