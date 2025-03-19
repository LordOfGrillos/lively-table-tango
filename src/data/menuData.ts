
import { MenuItemType } from "../components/menu/MenuItem";

export const menuItems: MenuItemType[] = [
  // Appetizers
  {
    id: "app-1",
    name: "Calamari",
    description: "Crispy fried calamari served with marinara sauce",
    price: 12.99,
    category: "Appetizers",
    ingredients: ["Squid", "Flour", "Salt", "Pepper", "Marinara Sauce"]
  },
  {
    id: "app-2",
    name: "Bruschetta",
    description: "Toasted bread topped with tomatoes, garlic, and basil",
    price: 9.99,
    category: "Appetizers",
    ingredients: ["Bread", "Tomatoes", "Garlic", "Basil", "Olive Oil", "Balsamic Glaze"]
  },
  {
    id: "app-3",
    name: "Spinach & Artichoke Dip",
    description: "Creamy dip served with tortilla chips",
    price: 10.99,
    category: "Appetizers",
    ingredients: ["Cream Cheese", "Spinach", "Artichoke", "Garlic", "Parmesan", "Tortilla Chips"]
  },
  
  // Main Courses
  {
    id: "main-1",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 24.99,
    category: "Main Courses",
    ingredients: ["Salmon", "Lemon", "Butter", "Garlic", "Herbs", "Seasonal Vegetables"]
  },
  {
    id: "main-2",
    name: "Ribeye Steak",
    description: "12oz ribeye steak cooked to perfection with mashed potatoes",
    price: 32.99,
    category: "Main Courses",
    ingredients: ["Ribeye Beef", "Salt", "Pepper", "Garlic Butter", "Mashed Potatoes", "Herbs"]
  },
  {
    id: "main-3",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast topped with marinara and mozzarella, served with pasta",
    price: 18.99,
    category: "Main Courses",
    ingredients: ["Chicken Breast", "Breadcrumbs", "Marinara Sauce", "Mozzarella", "Parmesan", "Pasta"]
  },
  {
    id: "main-4",
    name: "Vegetable Pasta",
    description: "Fettuccine with seasonal vegetables in a light cream sauce",
    price: 16.99,
    category: "Main Courses",
    ingredients: ["Fettuccine Pasta", "Zucchini", "Bell Peppers", "Mushrooms", "Cream", "Parmesan"]
  },
  
  // Sides
  {
    id: "side-1",
    name: "Garlic Mashed Potatoes",
    description: "Creamy potatoes with roasted garlic",
    price: 5.99,
    category: "Sides",
    ingredients: ["Potatoes", "Butter", "Cream", "Roasted Garlic", "Chives"]
  },
  {
    id: "side-2",
    name: "Seasonal Vegetables",
    description: "Steamed vegetables with herb butter",
    price: 4.99,
    category: "Sides",
    ingredients: ["Broccoli", "Carrots", "Zucchini", "Herb Butter", "Salt", "Pepper"]
  },
  {
    id: "side-3",
    name: "House Salad",
    description: "Mixed greens with house dressing",
    price: 5.99,
    category: "Sides",
    ingredients: ["Mixed Greens", "Tomatoes", "Cucumber", "Red Onion", "Croutons", "House Dressing"]
  },
  
  // Desserts
  {
    id: "dessert-1",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with vanilla ice cream",
    price: 8.99,
    category: "Desserts",
    ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Vanilla Ice Cream"]
  },
  {
    id: "dessert-2",
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 8.99,
    category: "Desserts",
    ingredients: ["Cream Cheese", "Sugar", "Eggs", "Graham Cracker Crust", "Berry Compote"]
  },
  
  // Beverages
  {
    id: "bev-1",
    name: "Soft Drinks",
    description: "Coke, Diet Coke, Sprite, or Ginger Ale",
    price: 2.99,
    category: "Beverages",
    ingredients: ["Soda", "Ice"]
  },
  {
    id: "bev-2",
    name: "Iced Tea",
    description: "Freshly brewed unsweetened iced tea",
    price: 2.99,
    category: "Beverages",
    ingredients: ["Tea", "Ice", "Lemon"]
  },
  {
    id: "bev-3",
    name: "Coffee",
    description: "Regular or decaf coffee",
    price: 3.49,
    category: "Beverages",
    ingredients: ["Coffee", "Cream", "Sugar"]
  },
  {
    id: "bev-4",
    name: "Red Wine",
    description: "House red wine by the glass",
    price: 8.99,
    category: "Beverages",
    ingredients: ["Red Wine"]
  },
  {
    id: "bev-5",
    name: "White Wine",
    description: "House white wine by the glass",
    price: 8.99,
    category: "Beverages",
    ingredients: ["White Wine"]
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
