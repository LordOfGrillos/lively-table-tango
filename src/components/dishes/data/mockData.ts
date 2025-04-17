
import { Dish, Menu } from "../types";
import { generateId } from "@/components/inventory/utils/inventoryHelpers";

export const mockMenus: Menu[] = [
  {
    id: "menu-1",
    name: "Entradas",
    description: "Platillos para comenzar",
    dishes: ["dish-1", "dish-2"],
    isActive: true,
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "menu-2",
    name: "Platos Fuertes",
    description: "Platillos principales",
    dishes: ["dish-3"],
    isActive: true,
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "menu-3",
    name: "Postres",
    description: "Platillos dulces para finalizar",
    dishes: [],
    isActive: true,
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  }
];

export const mockDishes: Dish[] = [
  {
    id: "dish-1",
    name: "Ensalada César",
    description: "Lechuga romana, crutones, aderezo césar y queso parmesano",
    price: 120,
    menuId: "menu-1",
    ingredients: [
      {
        inventoryItemId: "item1",
        name: "Lechuga romana",
        quantity: 0.25,
        unit: "kg"
      },
      {
        inventoryItemId: "item2",
        name: "Queso parmesano",
        quantity: 0.05,
        unit: "kg"
      }
    ],
    preparationTime: 15,
    imageUrl: "/placeholder.svg",
    createdAt: new Date(2023, 2, 10),
    updatedAt: new Date(2023, 2, 10),
    isActive: true
  },
  {
    id: "dish-2",
    name: "Sopa de Tomate",
    description: "Sopa caliente de tomate con albahaca",
    price: 85,
    menuId: "menu-1",
    ingredients: [
      {
        inventoryItemId: "item3",
        name: "Tomate",
        quantity: 0.5,
        unit: "kg"
      },
      {
        inventoryItemId: "item4",
        name: "Albahaca",
        quantity: 0.01,
        unit: "kg"
      }
    ],
    preparationTime: 25,
    imageUrl: "/placeholder.svg",
    createdAt: new Date(2023, 2, 11),
    updatedAt: new Date(2023, 2, 11),
    isActive: true
  },
  {
    id: "dish-3",
    name: "Filete de Res",
    description: "Filete de res a la parrilla con papas y verduras",
    price: 280,
    menuId: "menu-2",
    ingredients: [
      {
        inventoryItemId: "item5",
        name: "Filete de res",
        quantity: 0.25,
        unit: "kg"
      },
      {
        inventoryItemId: "item6",
        name: "Papas",
        quantity: 0.2,
        unit: "kg"
      },
      {
        inventoryItemId: "item7",
        name: "Verduras mixtas",
        quantity: 0.15,
        unit: "kg"
      }
    ],
    preparationTime: 35,
    imageUrl: "/placeholder.svg",
    createdAt: new Date(2023, 2, 12),
    updatedAt: new Date(2023, 2, 12),
    isActive: true
  }
];
