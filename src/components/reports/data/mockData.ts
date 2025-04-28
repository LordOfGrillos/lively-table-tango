
import { Order } from "../types";

export const mockOrders: Order[] = [
  {
    id: "ORD-12345",
    tableId: "t12",
    tableNumber: "12",
    customerName: "Juan Pérez",
    items: [
      { id: "item-1", name: "Salmón a la Parrilla", quantity: 1, price: 245.99, status: "served" },
      { id: "item-2", name: "Ensalada César", quantity: 1, price: 120.99, status: "served" },
      { id: "item-3", name: "Agua Mineral", quantity: 2, price: 45.99, status: "served" }
    ],
    status: "paid",
    createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    total: 458.96,
    paymentMethod: "tarjeta",
    paymentDate: new Date(Date.now() - 5 * 60000) // 5 minutes ago
  },
  {
    id: "ORD-12346",
    tableId: "t13",
    tableNumber: "05",
    customerName: "Maria González",
    items: [
      { id: "item-4", name: "Ribeye", quantity: 1, price: 325.99, status: "cooking" },
      { id: "item-5", name: "Puré de Papa", quantity: 1, price: 85.99, status: "pending" },
      { id: "item-6", name: "Vino Tinto", quantity: 1, price: 195.99, status: "served" }
    ],
    status: "in-progress",
    createdAt: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    total: 607.97
  },
  {
    id: "ORD-12347",
    tableId: "t14",
    tableNumber: "08",
    customerName: "Carlos Martínez",
    items: [
      { id: "item-7", name: "Spaghetti Carbonara", quantity: 1, price: 189.99, status: "pending" },
      { id: "item-8", name: "Pan de Ajo", quantity: 1, price: 65.99, status: "pending" },
      { id: "item-9", name: "Tiramisú", quantity: 1, price: 99.99, status: "pending" },
      { id: "item-10", name: "Limonada", quantity: 2, price: 39.99, status: "pending" }
    ],
    status: "created",
    createdAt: new Date(), // Just now
    total: 435.95
  },
  {
    id: "ORD-12348",
    tableId: "t15",
    tableNumber: "03",
    customerName: "Laura Rodríguez",
    items: [
      { id: "item-11", name: "Pizza Margherita", quantity: 1, price: 169.99, status: "cooking" },
      { id: "item-12", name: "Ensalada Caprese", quantity: 1, price: 119.99, status: "served" },
      { id: "item-13", name: "Pastel de Queso", quantity: 1, price: 89.99, status: "pending" },
      { id: "item-14", name: "Cerveza Artesanal", quantity: 2, price: 79.99, status: "served" }
    ],
    status: "in-progress",
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    total: 539.95
  },
  {
    id: "ORD-12349",
    tableId: "t16",
    tableNumber: "10",
    customerName: "Roberto Sánchez",
    items: [
      { id: "item-15", name: "Tacos de Camarón", quantity: 3, price: 89.99, status: "served" },
      { id: "item-16", name: "Guacamole", quantity: 1, price: 79.99, status: "served" },
      { id: "item-17", name: "Margarita", quantity: 2, price: 109.99, status: "served" }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    total: 489.95,
    paymentMethod: "efectivo",
    paymentDate: new Date(Date.now() - 10 * 60000) // 10 minutes ago
  },
  {
    id: "ORD-12350",
    tableId: "t17",
    tableNumber: "07",
    customerName: "Ana López",
    items: [
      { id: "item-18", name: "Sushi Variado", quantity: 1, price: 299.99, status: "served" },
      { id: "item-19", name: "Edamame", quantity: 1, price: 69.99, status: "served" },
      { id: "item-20", name: "Sake", quantity: 1, price: 149.99, status: "served" }
    ],
    status: "cancelled",
    createdAt: new Date(Date.now() - 60 * 60000), // 60 minutes ago
    total: 519.97
  }
];

export const brands = [
  { id: "brand-1", name: "Restaurante Principal" },
  { id: "brand-2", name: "Cafetería" },
  { id: "brand-3", name: "Bar de Copas" }
];

export const channels = [
  { id: "channel-1", name: "Punto de Venta" },
  { id: "channel-2", name: "Uber Eats" },
  { id: "channel-3", name: "DiDi Food" },
  { id: "channel-4", name: "Rappi" }
];

export const orderTypes = [
  { id: "type-1", name: "Delivery" },
  { id: "type-2", name: "Comer aquí" },
  { id: "type-3", name: "Para llevar" },
  { id: "type-4", name: "Recogida" }
];

export const statuses = [
  { id: "status-1", name: "Completada", color: "green" },
  { id: "status-2", name: "Cancelada", color: "red" },
  { id: "status-3", name: "En progreso", color: "yellow" },
  { id: "status-4", name: "Nueva", color: "blue" },
  { id: "status-5", name: "Pagada", color: "green" }
];
