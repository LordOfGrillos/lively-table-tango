
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { 
  InventoryItem, 
  InventoryTransaction, 
  InventoryAlert, 
  InventoryCategory,
  InventoryContextType
} from "../types";
import { 
  mockItems, 
  mockTransactions, 
  mockAlerts, 
  mockCategories 
} from "../data/mockData";
import { 
  updateItemStatus, 
  checkForAlerts, 
  generateId 
} from "../utils/inventoryHelpers";

// Create context with default undefined value
export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Context provider component
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with mock data
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(mockTransactions);
  const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);
  const [categories, setCategories] = useState<InventoryCategory[]>(mockCategories);

  // Initialize alerts on component mount
  useEffect(() => {
    // Check for alerts for each item
    items.forEach(item => {
      const newAlerts = checkForAlerts(item, alerts);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
      }
    });
  }, []);

  const addItem = (itemData: Omit<InventoryItem, "id" | "status" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newItem: InventoryItem = {
      ...itemData,
      id: generateId("item"),
      status: itemData.currentStock < itemData.minStockLevel 
        ? itemData.currentStock <= 0 ? "out-of-stock" : "low-stock" 
        : "in-stock",
      createdAt: now,
      updatedAt: now
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Add transaction
    const newTransaction: InventoryTransaction = {
      id: generateId("tx"),
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
    const newAlerts = checkForAlerts(newItem, alerts);
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
    }
    
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
          const newAlerts = checkForAlerts(updatedItem, alerts);
          if (newAlerts.length > 0) {
            setAlerts(prev => [...prev, ...newAlerts]);
          }
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
      id: generateId("tx"),
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
    const newAlerts = checkForAlerts(updatedItems[itemIndex], alerts);
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
    }
    
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
            id: generateId("cat"),
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
