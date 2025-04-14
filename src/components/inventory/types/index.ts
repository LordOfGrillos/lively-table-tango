
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
export interface InventoryContextType {
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
