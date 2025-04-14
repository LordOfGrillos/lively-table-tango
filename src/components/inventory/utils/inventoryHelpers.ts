
import { InventoryAlert, InventoryItem, InventoryItemStatus } from "../types";
import { toast } from "sonner";

// Update the item status based on stock level and expiry date
export const updateItemStatus = (item: InventoryItem): InventoryItemStatus => {
  if (item.currentStock <= 0) return "out-of-stock";
  if (item.currentStock < item.minStockLevel) return "low-stock";
  if (item.expiryDate && new Date() > item.expiryDate) return "expired";
  return "in-stock";
};

// Check for alerts and return new alerts if needed
export const checkForAlerts = (
  item: InventoryItem, 
  existingAlerts: InventoryAlert[]
): InventoryAlert[] => {
  const newAlerts: InventoryAlert[] = [];
  
  // Check for low stock
  if (item.currentStock < item.minStockLevel && item.currentStock > 0) {
    const existingAlert = existingAlerts.find(a => 
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
    const existingAlert = existingAlerts.find(a => 
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
    const existingAlert = existingAlerts.find(a => 
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
    newAlerts.forEach(alert => {
      toast.error(alert.message, {
        description: `Inventory alert for ${alert.itemName}`
      });
    });
  }
  
  return newAlerts;
};

// Generate a unique ID for items, transactions, alerts, etc.
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
