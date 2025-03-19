
import { MenuItemType } from "../components/menu/MenuItem";

export const menuItems: MenuItemType[] = [
  // Appetizers
  {
    id: "app-1",
    name: "Calamari",
    description: "Crispy fried calamari served with marinara sauce",
    price: 12.99,
    category: "Appetizers"
  },
  {
    id: "app-2",
    name: "Bruschetta",
    description: "Toasted bread topped with tomatoes, garlic, and basil",
    price: 9.99,
    category: "Appetizers"
  },
  {
    id: "app-3",
    name: "Spinach & Artichoke Dip",
    description: "Creamy dip served with tortilla chips",
    price: 10.99,
    category: "Appetizers"
  },
  
  // Main Courses
  {
    id: "main-1",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 24.99,
    category: "Main Courses"
  },
  {
    id: "main-2",
    name: "Ribeye Steak",
    description: "12oz ribeye steak cooked to perfection with mashed potatoes",
    price: 32.99,
    category: "Main Courses"
  },
  {
    id: "main-3",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast topped with marinara and mozzarella, served with pasta",
    price: 18.99,
    category: "Main Courses"
  },
  {
    id: "main-4",
    name: "Vegetable Pasta",
    description: "Fettuccine with seasonal vegetables in a light cream sauce",
    price: 16.99,
    category: "Main Courses"
  },
  
  // Sides
  {
    id: "side-1",
    name: "Garlic Mashed Potatoes",
    description: "Creamy potatoes with roasted garlic",
    price: 5.99,
    category: "Sides"
  },
  {
    id: "side-2",
    name: "Seasonal Vegetables",
    description: "Steamed vegetables with herb butter",
    price: 4.99,
    category: "Sides"
  },
  {
    id: "side-3",
    name: "House Salad",
    description: "Mixed greens with house dressing",
    price: 5.99,
    category: "Sides"
  },
  
  // Desserts
  {
    id: "dessert-1",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with vanilla ice cream",
    price: 8.99,
    category: "Desserts"
  },
  {
    id: "dessert-2",
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 8.99,
    category: "Desserts"
  },
  
  // Beverages
  {
    id: "bev-1",
    name: "Soft Drinks",
    description: "Coke, Diet Coke, Sprite, or Ginger Ale",
    price: 2.99,
    category: "Beverages"
  },
  {
    id: "bev-2",
    name: "Iced Tea",
    description: "Freshly brewed unsweetened iced tea",
    price: 2.99,
    category: "Beverages"
  },
  {
    id: "bev-3",
    name: "Coffee",
    description: "Regular or decaf coffee",
    price: 3.49,
    category: "Beverages"
  },
  {
    id: "bev-4",
    name: "Red Wine",
    description: "House red wine by the glass",
    price: 8.99,
    category: "Beverages"
  },
  {
    id: "bev-5",
    name: "White Wine",
    description: "House white wine by the glass",
    price: 8.99,
    category: "Beverages"
  }
];

// Group menu items by category
export const getMenuByCategory = () => {
  const categories: Record<string, MenuItemType[]> = {};
  
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  
  return categories;
};
