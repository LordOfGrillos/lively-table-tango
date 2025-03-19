
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuList } from "@/components/menu/MenuList";
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { Order, OrderItem } from "../TableActionPanel";
import { OrderSummary } from "./OrderSummary";
import { toast } from "sonner";

interface OrderTabProps {
  selectedTable: {
    id: string;
    number: string;
  };
  existingOrder?: Order | null;
  onOrderCreate?: (tableId: string, order: Order) => void;
  onOrderUpdate?: (order: Order) => void;
  onCompleteOrder: () => void;
}

export function OrderTab({
  selectedTable,
  existingOrder,
  onOrderCreate,
  onOrderUpdate,
  onCompleteOrder
}: OrderTabProps) {
  const [customerName, setCustomerName] = useState(existingOrder?.customerName || "");
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
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      status: 'new',
      customerName: customerName || 'Guest',
      items: currentOrder,
      createdAt: new Date(),
      total: calculateTotal()
    };
    
    onOrderCreate?.(selectedTable.id, newOrder);
    
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
  
  return (
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
        <OrderSummary 
          currentOrder={currentOrder}
          isExistingOrder={!!existingOrder}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          calculateTotal={calculateTotal}
          onUpdateItemStatus={handleUpdateItemStatus}
          onRemoveItem={handleRemoveItem}
          onUpdateOrder={handleUpdateOrder}
          onCompleteOrder={onCompleteOrder}
          onCreateOrder={handleCreateOrder}
        />
      </div>
    </div>
  );
}
