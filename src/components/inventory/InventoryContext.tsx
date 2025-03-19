
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Inventory item types
export type InventoryItemStatus = "in-stock" | "low-stock" | "out-of-stock" | "expired";
export type InventoryItemType = "ingredient" | "supply" | "equipment";
export type InventoryUnit = "kg" | "g" | "l" | "ml" | "pcs" | "box" | "unit";

// Recipe connection type
export type RecipeIngredientUsage = {
  menuItemId: string;
  menuItemName: string;
  quantityUsed: number;
};

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryItemType;
  category: string;
  currentStock: number;
  unit: InventoryUnit;
  minStockLevel: number;
  cost: number;
  imageSrc?: string;
  status: InventoryItemStatus;
  expiryDate?: Date;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  barcode?: string;
  usedInRecipes: RecipeIngredientUsage[];
  supplier?: string;
  notes?: string;
}

// Inventory transaction for history tracking
export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "addition" | "reduction" | "adjustment" | "waste" | "order-usage";
  quantity: number;
  previousStock: number;
  newStock: number;
  date: Date;
  performedBy: string;
  notes?: string;
  orderId?: string;
  cost?: number;
}

// Alerts and notifications
export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: "low-stock" | "out-of-stock" | "expiry" | "suspicious-activity";
  message: string;
  date: Date;
  isRead: boolean;
  severity: "low" | "medium" | "high";
}

// Categories for organizing inventory
export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
}

// Context type definition
interface InventoryContextType {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  alerts: InventoryAlert[];
  categories: InventoryCategory[];
  addItem: (item: Omit<InventoryItem, "id" | "status" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  updateStock: (id: string, quantity: number, type: "add" | "reduce", notes?: string) => void;
  markAlertAsRead: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  getItemsByCategory: (category: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
}

// Create context with default value
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Mock data for demo purposes
const mockCategories: InventoryCategory[] = [
  { id: "cat-1", name: "Dairy", description: "Milk, cheese, and other dairy products", itemCount: 3 },
  { id: "cat-2", name: "Meat", description: "Beef, chicken, and other meats", itemCount: 5 },
  { id: "cat-3", name: "Produce", description: "Fresh fruits and vegetables", itemCount: 8 },
  { id: "cat-4", name: "Dry Goods", description: "Pasta, rice, and grains", itemCount: 6 },
  { id: "cat-5", name: "Beverages", description: "Drinks and beverage ingredients", itemCount: 4 },
  { id: "cat-6", name: "Cleaning", description: "Cleaning supplies", itemCount: 2 },
];

const mockItems: InventoryItem[] = [
  {
    id: "item-1",
    name: "Whole Milk",
    type: "ingredient",
    category: "Dairy",
    currentStock: 15,
    unit: "l",
    minStockLevel: 10,
    cost: 2.50,
    imageSrc: "/placeholder.svg",
    status: "in-stock",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    lastRestocked: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Fridge 1",
    usedInRecipes: [
      { menuItemId: "menu-1", menuItemName: "Cappuccino", quantityUsed: 0.2 },
      { menuItemId: "menu-2", menuItemName: "Latte", quantityUsed: 0.3 },
    ],
    supplier: "Local Dairy Farm",
  },
  {
    id: "item-2",
    name: "Chicken Breast",
    type: "ingredient",
    category: "Meat",
    currentStock: 8,
    unit: "kg",
    minStockLevel: 10,
    cost: 7.99,
    imageSrc: "/placeholder.svg",
    status: "low-stock",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Freezer 2",
    usedInRecipes: [
      { menuItemId: "menu-3", menuItemName: "Chicken Pasta", quantityUsed: 0.25 },
      { menuItemId: "menu-4", menuItemName: "Chicken Sandwich", quantityUsed: 0.15 },
    ],
    supplier: "Premium Meats",
  },
  {
    id: "item-3",
    name: "Tomatoes",
    type: "ingredient",
    category: "Produce",
    currentStock: 20,
    unit: "kg",
    minStockLevel: 5,
    cost: 3.99,
    imageSrc: "/placeholder.svg",
    status: "in-stock",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Fridge 3",
    usedInRecipes: [
      { menuItemId: "menu-5", menuItemName: "Tomato Soup", quantityUsed: 0.5 },
      { menuItemId: "menu-6", menuItemName: "Pasta Sauce", quantityUsed: 0.3 },
    ],
    supplier: "Fresh Farms",
  },
  {
    id: "item-4",
    name: "Coffee Beans",
    type: "ingredient",
    category: "Beverages",
    currentStock: 2,
    unit: "kg",
    minStockLevel: 5,
    cost: 15.99,
    imageSrc: "/placeholder.svg",
    status: "low-stock",
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Dry Storage",
    usedInRecipes: [
      { menuItemId: "menu-1", menuItemName: "Cappuccino", quantityUsed: 0.02 },
      { menuItemId: "menu-2", menuItemName: "Latte", quantityUsed: 0.02 },
      { menuItemId: "menu-7", menuItemName: "Espresso", quantityUsed: 0.015 },
    ],
    supplier: "Coffee Importers Inc.",
  },
];

const mockTransactions: InventoryTransaction[] = [
  {
    id: "tx-1",
    itemId: "item-1",
    itemName: "Whole Milk",
    type: "addition",
    quantity: 10,
    previousStock: 5,
    newStock: 15,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    performedBy: "John Doe",
    notes: "Weekly delivery",
    cost: 25.00,
  },
  {
    id: "tx-2",
    itemId: "item-4",
    itemName: "Coffee Beans",
    type: "reduction",
    quantity: 3,
    previousStock: 5,
    newStock: 2,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    performedBy: "Jane Smith",
    notes: "Normal usage",
  },
  {
    id: "tx-3",
    itemId: "item-2",
    itemName: "Chicken Breast",
    type: "order-usage",
    quantity: 2,
    previousStock: 10,
    newStock: 8,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    performedBy: "System",
    orderId: "order-123",
  },
];

const mockAlerts: InventoryAlert[] = [
  {
    id: "alert-1",
    itemId: "item-2",
    itemName: "Chicken Breast",
    type: "low-stock",
    message: "Chicken Breast is below minimum stock level (8 kg < 10 kg)",
    date: new Date(),
    isRead: false,
    severity: "medium",
  },
  {
    id: "alert-2",
    itemId: "item-4",
    itemName: "Coffee Beans",
    type: "low-stock",
    message: "Coffee Beans is below minimum stock level (2 kg < 5 kg)",
    date: new Date(),
    isRead: false,
    severity: "high",
  },
];

// Context provider component
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(mockTransactions);
  const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);
  const [categories, setCategories] = useState<InventoryCategory[]>(mockCategories);

  const updateItemStatus = (item: InventoryItem): InventoryItemStatus => {
    if (item.currentStock <= 0) return "out-of-stock";
    if (item.currentStock < item.minStockLevel) return "low-stock";
    if (item.expiryDate && new Date() > item.expiryDate) return "expired";
    return "in-stock";
  };

  const checkForAlerts = (item: InventoryItem) => {
    const newAlerts: InventoryAlert[] = [];
    
    // Check for low stock
    if (item.currentStock < item.minStockLevel && item.currentStock > 0) {
      const existingAlert = alerts.find(a => 
        a.itemId === item.id && a.type === "low-stock" && !a.isRead
      );
      
      if (!existingAlert) {
        newAlerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          itemId: item.id,
          itemName: item.name,
          type: "low-stock",
          message: `${item.name} is below minimum stock level (${item.currentStock} ${item.unit} < ${item.minStockLevel} ${item.unit})`,
          date: new Date(),
          isRead: false,
          severity: item.currentStock < item.minStockLevel / 2 ? "high" : "medium",
        });
      }
    }
    
    // Check for out of stock
    if (item.currentStock <= 0) {
      const existingAlert = alerts.find(a => 
        a.itemId === item.id && a.type === "out-of-stock" && !a.isRead
      );
      
      if (!existingAlert) {
        newAlerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          itemId: item.id,
          itemName: item.name,
          type: "out-of-stock",
          message: `${item.name} is out of stock! Please restock soon.`,
          date: new Date(),
          isRead: false,
          severity: "high",
        });
      }
    }
    
    // Check for expiry
    if (item.expiryDate && new Date() > new Date(item.expiryDate)) {
      const existingAlert = alerts.find(a => 
        a.itemId === item.id && a.type === "expiry" && !a.isRead
      );
      
      if (!existingAlert) {
        newAlerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          itemId: item.id,
          itemName: item.name,
          type: "expiry",
          message: `${item.name} has expired! Please remove from inventory.`,
          date: new Date(),
          isRead: false,
          severity: "high",
        });
      }
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
      newAlerts.forEach(alert => {
        toast.error(alert.message, {
          description: `Inventory alert for ${alert.itemName}`
        });
      });
    }
  };

  const addItem = (itemData: Omit<InventoryItem, "id" | "status" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newItem: InventoryItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: itemData.currentStock < itemData.minStockLevel 
        ? itemData.currentStock <= 0 ? "out-of-stock" : "low-stock" 
        : "in-stock",
      createdAt: now,
      updatedAt: now
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Add transaction
    const newTransaction: InventoryTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      itemId: newItem.id,
      itemName: newItem.name,
      type: "addition",
      quantity: newItem.currentStock,
      previousStock: 0,
      newStock: newItem.currentStock,
      date: now,
      performedBy: "Staff", // Would be replaced with actual user in a real system
      notes: "Initial inventory",
      cost: newItem.cost * newItem.currentStock
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Check for alerts
    checkForAlerts(newItem);
    
    // Update category count
    updateCategoryItemCount(itemData.category);
    
    toast.success(`${newItem.name} added to inventory`, {
      description: `Initial stock: ${newItem.currentStock} ${newItem.unit}`
    });
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          ...updates,
          updatedAt: new Date(),
        };
        
        // Recalculate status if stock related fields were updated
        if ('currentStock' in updates || 'minStockLevel' in updates || 'expiryDate' in updates) {
          updatedItem.status = updateItemStatus(updatedItem);
          checkForAlerts(updatedItem);
        }
        
        // If category changed, update category counts
        if (updates.category && updates.category !== item.category) {
          updateCategoryItemCount(item.category, -1);
          updateCategoryItemCount(updates.category);
        }
        
        return updatedItem;
      }
      return item;
    }));
    
    toast.success(`Inventory item updated`, {
      description: `Changes saved successfully`
    });
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) return;
    
    setItems(prev => prev.filter(item => item.id !== id));
    updateCategoryItemCount(itemToDelete.category, -1);
    
    toast.success(`${itemToDelete.name} removed from inventory`, {
      description: `Item has been deleted`
    });
  };

  const updateStock = (id: string, quantity: number, type: "add" | "reduce", notes?: string) => {
    let updatedItems = [...items];
    const itemIndex = updatedItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return;
    
    const item = updatedItems[itemIndex];
    const previousStock = item.currentStock;
    let newStock: number;
    
    if (type === "add") {
      newStock = previousStock + quantity;
    } else {
      newStock = Math.max(0, previousStock - quantity);
      if (newStock < previousStock - quantity) {
        toast.warning(`Cannot reduce ${item.name} below zero`, {
          description: `Stock set to 0 ${item.unit}`
        });
      }
    }
    
    // Update the item
    updatedItems[itemIndex] = {
      ...item,
      currentStock: newStock,
      status: newStock <= 0 ? "out-of-stock" : newStock < item.minStockLevel ? "low-stock" : "in-stock",
      lastRestocked: type === "add" ? new Date() : item.lastRestocked,
      updatedAt: new Date()
    };
    
    setItems(updatedItems);
    
    // Create transaction record
    const newTransaction: InventoryTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      itemId: id,
      itemName: item.name,
      type: type === "add" ? "addition" : "reduction",
      quantity,
      previousStock,
      newStock,
      date: new Date(),
      performedBy: "Staff", // Would be replaced with actual user in a real system
      notes,
      cost: type === "add" ? item.cost * quantity : undefined
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Check for alerts after stock update
    checkForAlerts(updatedItems[itemIndex]);
    
    if (type === "add") {
      toast.success(`Stock increased for ${item.name}`, {
        description: `Added ${quantity} ${item.unit}, new total: ${newStock} ${item.unit}`
      });
    } else {
      toast.info(`Stock reduced for ${item.name}`, {
        description: `Removed ${quantity} ${item.unit}, remaining: ${newStock} ${item.unit}`
      });
    }
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  const getLowStockItems = () => {
    return items.filter(item => item.status === "low-stock" || item.status === "out-of-stock");
  };

  const updateCategoryItemCount = (categoryName: string, change: number = 1) => {
    setCategories(prev => {
      const categoryIndex = prev.findIndex(cat => cat.name === categoryName);
      
      if (categoryIndex === -1) {
        // If category doesn't exist, create it
        if (change > 0) {
          return [...prev, {
            id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: categoryName,
            itemCount: change
          }];
        }
        return prev;
      }
      
      // Update existing category
      const updated = [...prev];
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        itemCount: Math.max(0, updated[categoryIndex].itemCount + change)
      };
      return updated;
    });
  };

  // Update App.tsx to handle inventory deduction from orders
  // This would ideally be implemented in the order processing logic

  const value = {
    items,
    transactions,
    alerts,
    categories,
    addItem,
    updateItem,
    deleteItem,
    updateStock,
    markAlertAsRead,
    getItemById,
    getItemsByCategory,
    getLowStockItems
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
