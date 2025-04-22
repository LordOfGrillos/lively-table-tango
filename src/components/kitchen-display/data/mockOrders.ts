
import { KitchenOrder } from "../types";

// Helper to create dates that are a specific number of minutes in the past
const minutesAgo = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

export const mockOrders: KitchenOrder[] = [
  // Kitchen Orders
  {
    id: "ko-1",
    tableNumber: "12",
    orderNumber: 1001,
    items: [
      { id: "item-1", name: "Grilled Chicken", quantity: 2, notes: "No sauce" },
      { id: "item-2", name: "Caesar Salad", quantity: 1, modifiers: ["Extra dressing", "No croutons"] },
    ],
    status: "waiting",
    priority: "high",
    department: "kitchen",
    createdAt: minutesAgo(25),
    estimatedPrepTime: 15
  },
  {
    id: "ko-2",
    tableNumber: "5",
    orderNumber: 1002,
    items: [
      { id: "item-3", name: "Ribeye Steak", quantity: 1, notes: "Medium rare" },
      { id: "item-4", name: "Mashed Potatoes", quantity: 1 },
    ],
    status: "in-progress",
    priority: "normal",
    department: "kitchen",
    createdAt: minutesAgo(15),
    startedAt: minutesAgo(10),
    estimatedPrepTime: 20
  },
  {
    id: "ko-3",
    tableNumber: "8",
    orderNumber: 1003,
    items: [
      { id: "item-5", name: "Fish & Chips", quantity: 1 },
    ],
    status: "ready",
    priority: "normal",
    department: "kitchen",
    createdAt: minutesAgo(30),
    startedAt: minutesAgo(25),
    completedAt: minutesAgo(5),
    estimatedPrepTime: 15
  },
  
  // Bar Orders
  {
    id: "bo-1",
    tableNumber: "3",
    orderNumber: 1004,
    items: [
      { id: "item-6", name: "Margarita", quantity: 2 },
      { id: "item-7", name: "Beer", quantity: 1, notes: "Draft" },
    ],
    status: "waiting",
    priority: "normal",
    department: "bar",
    createdAt: minutesAgo(8),
    estimatedPrepTime: 5
  },
  {
    id: "bo-2",
    tableNumber: "9",
    orderNumber: 1005,
    items: [
      { id: "item-8", name: "Wine", quantity: 2, notes: "Red, house" },
    ],
    status: "in-progress",
    priority: "rush",
    department: "bar",
    createdAt: minutesAgo(12),
    startedAt: minutesAgo(10),
    estimatedPrepTime: 3
  },
  
  // Cafe Orders
  {
    id: "co-1",
    tableNumber: "15",
    orderNumber: 1006,
    items: [
      { id: "item-9", name: "Cappuccino", quantity: 1 },
      { id: "item-10", name: "Cheesecake", quantity: 1 },
    ],
    status: "waiting",
    priority: "high",
    department: "cafe",
    createdAt: minutesAgo(18),
    estimatedPrepTime: 10
  },
  {
    id: "co-2",
    tableNumber: "7",
    orderNumber: 1007,
    items: [
      { id: "item-11", name: "Espresso", quantity: 2 },
      { id: "item-12", name: "Croissant", quantity: 2 },
    ],
    status: "ready",
    priority: "normal",
    department: "cafe",
    createdAt: minutesAgo(22),
    startedAt: minutesAgo(20),
    completedAt: minutesAgo(3),
    estimatedPrepTime: 7
  },
];
