
import { InventoryItem } from "@/components/inventory/types";

export interface DishIngredient {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  menuId: string | null; // Which menu/category this dish belongs to
  ingredients: DishIngredient[];
  preparationTime: number; // in minutes
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  dishes: string[]; // Array of dish IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DishContextType {
  dishes: Dish[];
  menus: Menu[];
  addDish: (dish: Omit<Dish, "id" | "createdAt" | "updatedAt">) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  addMenu: (menu: Omit<Menu, "id" | "createdAt" | "updatedAt">) => void;
  updateMenu: (id: string, updates: Partial<Menu>) => void;
  deleteMenu: (id: string) => void;
  getDishById: (id: string) => Dish | undefined;
  getMenuById: (id: string) => Menu | undefined;
}
