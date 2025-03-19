
import { useState } from "react";
import { MenuSection } from "./components/MenuSection";
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { Order, OrderItem } from "../TableActionPanel";
import { OrderSummary } from "./OrderSummary";
import { toast } from "sonner";
import { 
  calculateItemPrice, 
  findExistingItemIndex, 
  createCustomizationSummary,
  calculateOrderTotal
} from "./utils/orderUtils";

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
    const itemPrice = calculateItemPrice(item, customizations);
    const existingItemIndex = findExistingItemIndex(currentOrder, item, customizations);
    
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
    
    const customizationSummary = createCustomizationSummary(customizations);
    
    toast.success(`${quantity}× ${item.name} ${customizationSummary} added to order`, {
      description: `Table ${selectedTable?.number}`
    });
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
      total: calculateOrderTotal(currentOrder)
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
      total: calculateOrderTotal(currentOrder)
    };
    
    onOrderUpdate(updatedOrder);
    
    toast.success("Order updated successfully", {
      description: `Table ${selectedTable.number} order updated`
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <MenuSection onAddToOrder={handleAddToOrder} />
      </div>
      
      <div className="w-full sm:w-[300px]">
        <OrderSummary 
          currentOrder={currentOrder}
          isExistingOrder={!!existingOrder}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          calculateTotal={() => calculateOrderTotal(currentOrder)}
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
