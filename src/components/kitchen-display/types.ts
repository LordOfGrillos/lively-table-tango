
export type KitchenOrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  modifiers?: string[];
};

export type KitchenOrder = {
  id: string;
  tableNumber: string;
  orderNumber: number;
  items: KitchenOrderItem[];
  status: "waiting" | "in-progress" | "ready" | "delivered";
  priority: "normal" | "high" | "rush";
  department: "kitchen" | "bar" | "cafe";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedPrepTime?: number; // in minutes
  expanded?: boolean; // Nueva propiedad para controlar la visualización expandida
};
