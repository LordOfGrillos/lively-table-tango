import { useState } from "react";
import { OrderCart } from "./OrderCart";
import { ProductList } from "./ProductList";
import { CustomerInfo } from "./CustomerInfo";
import { OrderSummary } from "./OrderSummary";
import { PaymentDialog } from "./PaymentDialog";
import { useInventory } from "@/components/inventory/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: Customization[];
};

export type Customization = {
  name: string;
  option: string;
  price: number;
};

export type CounterOrder = {
  id: string;
  customerName: string;
  orderNumber: number;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: Date;
  paidAt: Date | null;
};

interface CounterOrderSystemProps {
  onOrderComplete?: (order: CounterOrder) => void;
}

export function CounterOrderSystem({ onOrderComplete }: CounterOrderSystemProps) {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState(getNextOrderNumber());
  const [activeTab, setActiveTab] = useState("menu");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const inventory = useInventory();

  function getNextOrderNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  const addToOrder = (item: OrderItem) => {
    if (inventory) {
      const requiredIngredients = inventory.items.filter(inventoryItem => 
        inventoryItem.usedInRecipes.some(recipe => recipe.menuItemName === item.name)
      );
      
      const outOfStockIngredients = requiredIngredients.filter(ingredient => 
        ingredient.status === "out-of-stock"
      );
      
      if (outOfStockIngredients.length > 0) {
        toast.error(`Cannot add ${item.name} to order`, {
          description: `Missing ingredient: ${outOfStockIngredients[0].name} is out of stock`
        });
        return;
      }
    }

    const existingItemIndex = currentOrder.findIndex(orderItem => {
      if (orderItem.name !== item.name) return false;
      
      if (orderItem.customizations.length !== item.customizations.length) return false;
      
      return orderItem.customizations.every(c1 => 
        item.customizations.some(c2 => 
          c1.name === c2.name && c1.option === c2.option
        )
      );
    });
    
    if (existingItemIndex >= 0) {
      const newOrder = [...currentOrder];
      newOrder[existingItemIndex].quantity += item.quantity;
      setCurrentOrder(newOrder);
    } else {
      setCurrentOrder([...currentOrder, item]);
    }
    
    toast.success(`Added ${item.name} to order`);
  };

  const removeItem = (itemId: string) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCurrentOrder(currentOrder.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const customizationTotal = item.customizations.reduce(
        (sum, customization) => sum + customization.price, 
        0
      ) * item.quantity;
      
      return total + itemTotal + customizationTotal;
    }, 0);
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    const newOrder: CounterOrder = {
      id: `order-${Date.now()}`,
      customerName: customerName || `Order #${orderNumber}`,
      orderNumber,
      items: currentOrder,
      total: calculateTotal(),
      status: "preparing",
      createdAt: new Date(),
      paidAt: new Date()
    };
    
    onOrderComplete?.(newOrder);
    
    setCurrentOrder([]);
    setCustomerName("");
    setOrderNumber(getNextOrderNumber());
    setIsPaymentOpen(false);
    setActiveTab("menu");
    
    toast.success(`Order #${orderNumber} has been placed!`, {
      description: "Your order is being prepared"
    });
  };

  const handleProceedToPayment = () => {
    if (currentOrder.length === 0) {
      toast.error("Please add items to your order");
      return;
    }
    
    setIsPaymentOpen(true);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-6">
            <TabsTrigger value="menu" className="flex-1">
              Menu
            </TabsTrigger>
            <TabsTrigger value="order" className="flex-1">
              Order Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            <ProductList onAddToOrder={addToOrder} />
          </TabsContent>
          
          <TabsContent value="order" className="space-y-6">
            <CustomerInfo 
              customerName={customerName} 
              orderNumber={orderNumber}
              onNameChange={setCustomerName}
            />
            <OrderSummary 
              items={currentOrder} 
              total={calculateTotal()}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateItemQuantity}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="lg:col-span-1">
        <OrderCart 
          items={currentOrder}
          total={calculateTotal()}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateItemQuantity}
          onProceedToPayment={handleProceedToPayment}
          customerName={customerName}
          orderNumber={orderNumber}
        />
      </div>
      
      <PaymentDialog
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={calculateTotal()}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
