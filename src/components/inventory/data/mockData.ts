
import { InventoryCategory, InventoryItem, InventoryTransaction, InventoryAlert } from "../types";

// Mock data for categories
export const mockCategories: InventoryCategory[] = [
  { id: "cat-1", name: "Dairy", description: "Milk, cheese, and other dairy products", itemCount: 3 },
  { id: "cat-2", name: "Meat", description: "Beef, chicken, and other meats", itemCount: 5 },
  { id: "cat-3", name: "Produce", description: "Fresh fruits and vegetables", itemCount: 8 },
  { id: "cat-4", name: "Dry Goods", description: "Pasta, rice, and grains", itemCount: 6 },
  { id: "cat-5", name: "Beverages", description: "Drinks and beverage ingredients", itemCount: 4 },
  { id: "cat-6", name: "Cleaning", description: "Cleaning supplies", itemCount: 2 },
  { id: "cat-7", name: "Spices", description: "Herbs, spices, and seasonings", itemCount: 4 },
  { id: "cat-8", name: "Bakery", description: "Bread and baked goods", itemCount: 3 },
];

// Mock data for inventory items
export const mockItems: InventoryItem[] = [
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
  {
    id: "item-5",
    name: "Olive Oil (Extra Virgin)",
    type: "ingredient",
    category: "Dry Goods",
    currentStock: 12,
    unit: "l",
    minStockLevel: 5,
    cost: 12.99,
    imageSrc: "/placeholder.svg",
    status: "in-stock",
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
    lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Pantry Shelf C",
    usedInRecipes: [
      { menuItemId: "menu-8", menuItemName: "Mediterranean Salad", quantityUsed: 0.03 },
      { menuItemId: "menu-9", menuItemName: "Pasta Aglio e Olio", quantityUsed: 0.05 },
    ],
    supplier: "Italian Imports",
    notes: "Premium quality Italian olive oil, cold-pressed",
  },
  {
    id: "item-6",
    name: "Paper Napkins",
    type: "supply",
    category: "Cleaning",
    currentStock: 500,
    unit: "pcs",
    minStockLevel: 200,
    cost: 0.02,
    imageSrc: "/placeholder.svg",
    status: "in-stock",
    lastRestocked: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Storage Room B",
    usedInRecipes: [],
    supplier: "Restaurant Supplies Co.",
    barcode: "SUP-NAP-1234",
  },
  {
    id: "item-7",
    name: "Espresso Machine",
    type: "equipment",
    category: "Beverages",
    currentStock: 1,
    unit: "pcs",
    minStockLevel: 1,
    cost: 1599.99,
    imageSrc: "/placeholder.svg",
    status: "in-stock",
    lastRestocked: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Bar Counter",
    usedInRecipes: [],
    supplier: "Professional Kitchen Equipment",
    barcode: "EQP-ESP-8765",
    notes: "Model: Barista Pro 3000, Last maintenance: 2 weeks ago",
  },
  {
    id: "item-8",
    name: "Cinnamon Powder",
    type: "ingredient",
    category: "Spices",
    currentStock: 0.3,
    unit: "kg",
    minStockLevel: 0.5,
    cost: 8.50,
    imageSrc: "/placeholder.svg",
    status: "low-stock",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    lastRestocked: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Spice Rack",
    usedInRecipes: [
      { menuItemId: "menu-10", menuItemName: "Apple Pie", quantityUsed: 0.01 },
      { menuItemId: "menu-11", menuItemName: "Cinnamon Roll", quantityUsed: 0.015 },
    ],
    supplier: "Global Spice Traders",
  },
  {
    id: "item-9",
    name: "Sourdough Bread",
    type: "ingredient",
    category: "Bakery",
    currentStock: 0,
    unit: "kg",
    minStockLevel: 5,
    cost: 4.99,
    imageSrc: "/placeholder.svg",
    status: "out-of-stock",
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (expired)
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Bakery Display",
    usedInRecipes: [
      { menuItemId: "menu-12", menuItemName: "Avocado Toast", quantityUsed: 0.1 },
      { menuItemId: "menu-13", menuItemName: "Grilled Cheese Sandwich", quantityUsed: 0.2 },
    ],
    supplier: "Local Bakery",
    notes: "Fresh delivered daily, order by 6 PM for next day",
  },
  {
    id: "item-10",
    name: "Fresh Basil",
    type: "ingredient",
    category: "Produce",
    currentStock: 0.8,
    unit: "kg",
    minStockLevel: 1,
    cost: 12.99,
    imageSrc: "/placeholder.svg",
    status: "low-stock",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    createdAt: new Date(),
    updatedAt: new Date(),
    location: "Herb Refrigerator",
    usedInRecipes: [
      { menuItemId: "menu-14", menuItemName: "Margherita Pizza", quantityUsed: 0.02 },
      { menuItemId: "menu-15", menuItemName: "Caprese Salad", quantityUsed: 0.03 },
    ],
    supplier: "Herb Gardens Inc.",
  }
];

// Mock data for transactions
export const mockTransactions: InventoryTransaction[] = [
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

// Mock data for alerts
export const mockAlerts: InventoryAlert[] = [
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
