import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MenuItemType, ItemCustomization } from "@/components/menu/MenuItem";
import { OrderItem, Order } from "@/components/tables/TableActionPanel";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableManager } from "@/components/tables/TableManager";
import { MenuList } from "@/components/menu/MenuList";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useInventory } from "@/components/inventory/InventoryContext";

interface OrderCreationProps {
  onCancel: () => void;
  onOrderCreate: (order: Order) => void;
}

export function OrderCreation({ onCancel, onOrderCreate }: OrderCreationProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  
  const inventory = useInventory && useInventory();

  const handleSelectTable = (tableId: string, tableNumber: string) => {
    setSelectedTable(tableId);
    toast.success(`Table ${tableNumber} selected for order`);
  };

  const handleAddToOrder = (item: MenuItemType, quantity: number, customizations?: ItemCustomization) => {
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
      
      const insufficientStockIngredients = requiredIngredients.filter(ingredient => {
        const recipe = ingredient.usedInRecipes.find(r => r.menuItemName === item.name);
        if (!recipe) return false;
        
        return ingredient.currentStock < (recipe.quantityUsed * quantity);
      });
      
      if (insufficientStockIngredients.length > 0) {
        toast.error(`Cannot add ${quantity}× ${item.name} to order`, {
          description: `Insufficient stock of ${insufficientStockIngredients[0].name}`
        });
        return;
      }
    }
    
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

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      toast.error("Please select a table first");
      return;
    }
    
    if (currentOrderItems.length === 0) {
      toast.error("Please add items to the order");
      return;
    }
    
    if (inventory) {
      let canPlaceOrder = true;
      
      for (const orderItem of currentOrderItems) {
        const requiredIngredients = inventory.items.filter(inventoryItem => 
          inventoryItem.usedInRecipes.some(recipe => recipe.menuItemName === orderItem.name)
        );
        
        const outOfStockIngredients = requiredIngredients.filter(ingredient => 
          ingredient.status === "out-of-stock"
        );
        
        if (outOfStockIngredients.length > 0) {
          toast.error(`Cannot place order`, {
            description: `${outOfStockIngredients[0].name} is now out of stock`
          });
          canPlaceOrder = false;
          break;
        }
        
        const insufficientStockIngredients = requiredIngredients.filter(ingredient => {
          const recipe = ingredient.usedInRecipes.find(r => r.menuItemName === orderItem.name);
          if (!recipe) return false;
          
          return ingredient.currentStock < (recipe.quantityUsed * orderItem.quantity);
        });
        
        if (insufficientStockIngredients.length > 0) {
          toast.error(`Cannot place order`, {
            description: `Insufficient stock of ${insufficientStockIngredients[0].name}`
          });
          canPlaceOrder = false;
          break;
        }
      }
      
      if (!canPlaceOrder) return;
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
    
    onOrderCreate(newOrder);
    
    toast.success("Order created successfully", {
      description: `Order for ${customerName || 'Guest'} at Table ${tableNumber} has been placed`
    });
  };

  return (
    <>
      <Header 
        title="New Order" 
        actionButton={
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onCancel}
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
                                🗑️
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
  );
}
