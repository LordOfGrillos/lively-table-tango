
export interface CafeteriaMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  customizable: boolean;
  customizationOptions?: CustomizationCategory[];
}

export interface CustomizationCategory {
  name: string;
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  name: string;
  price: number;
}

// Mock data for cafeteria menu
export function getCafeteriaMenu(): CafeteriaMenuItem[] {
  return [
    {
      id: "coffee-1",
      name: "Espresso",
      description: "Strong and concentrated coffee",
      price: 2.50,
      category: "coffee",
      customizable: true,
      customizationOptions: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.50 },
            { name: "Large", price: 1.00 }
          ]
        },
        {
          name: "Shots",
          required: false,
          options: [
            { name: "Single", price: 0 },
            { name: "Double", price: 1.00 },
            { name: "Triple", price: 2.00 }
          ]
        }
      ]
    },
    {
      id: "coffee-2",
      name: "Latte",
      description: "Espresso with steamed milk",
      price: 3.50,
      category: "coffee",
      customizable: true,
      customizationOptions: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.50 },
            { name: "Large", price: 1.00 }
          ]
        },
        {
          name: "Milk",
          required: true,
          options: [
            { name: "Whole Milk", price: 0 },
            { name: "Skim Milk", price: 0 },
            { name: "Almond Milk", price: 0.75 },
            { name: "Oat Milk", price: 0.75 },
            { name: "Soy Milk", price: 0.75 }
          ]
        },
        {
          name: "Flavor",
          required: false,
          options: [
            { name: "None", price: 0 },
            { name: "Vanilla", price: 0.50 },
            { name: "Caramel", price: 0.50 },
            { name: "Hazelnut", price: 0.50 }
          ]
        }
      ]
    },
    {
      id: "coffee-3",
      name: "Cappuccino",
      description: "Espresso with steamed milk and foam",
      price: 3.75,
      category: "coffee",
      customizable: true,
      customizationOptions: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.50 },
            { name: "Large", price: 1.00 }
          ]
        },
        {
          name: "Milk",
          required: true,
          options: [
            { name: "Whole Milk", price: 0 },
            { name: "Skim Milk", price: 0 },
            { name: "Almond Milk", price: 0.75 },
            { name: "Oat Milk", price: 0.75 },
            { name: "Soy Milk", price: 0.75 }
          ]
        }
      ]
    },
    {
      id: "tea-1",
      name: "Green Tea",
      description: "Refreshing green tea",
      price: 2.75,
      category: "tea",
      customizable: true,
      customizationOptions: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.50 },
            { name: "Large", price: 1.00 }
          ]
        },
        {
          name: "Sweetener",
          required: false,
          options: [
            { name: "None", price: 0 },
            { name: "Sugar", price: 0 },
            { name: "Honey", price: 0.25 },
            { name: "Stevia", price: 0 }
          ]
        }
      ]
    },
    {
      id: "pastry-1",
      name: "Chocolate Croissant",
      description: "Buttery croissant with chocolate filling",
      price: 3.25,
      category: "pastry",
      customizable: false
    },
    {
      id: "pastry-2",
      name: "Blueberry Muffin",
      description: "Moist muffin with fresh blueberries",
      price: 2.95,
      category: "pastry",
      customizable: false
    },
    {
      id: "sandwich-1",
      name: "Turkey & Cheese",
      description: "Turkey, cheese, lettuce and tomato on whole wheat bread",
      price: 6.95,
      category: "sandwich",
      customizable: true,
      customizationOptions: [
        {
          name: "Bread",
          required: true,
          options: [
            { name: "Whole Wheat", price: 0 },
            { name: "White", price: 0 },
            { name: "Sourdough", price: 0 },
            { name: "Rye", price: 0 }
          ]
        },
        {
          name: "Extras",
          required: false,
          options: [
            { name: "Avocado", price: 1.50 },
            { name: "Extra Cheese", price: 1.00 },
            { name: "Bacon", price: 1.50 }
          ]
        }
      ]
    },
    {
      id: "smoothie-1",
      name: "Berry Blast Smoothie",
      description: "Mixed berries, banana, and yogurt",
      price: 5.50,
      category: "smoothie",
      customizable: true,
      customizationOptions: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 1.00 },
            { name: "Large", price: 2.00 }
          ]
        },
        {
          name: "Add-ins",
          required: false,
          options: [
            { name: "Protein Powder", price: 1.50 },
            { name: "Chia Seeds", price: 0.75 },
            { name: "Flax Seeds", price: 0.75 },
            { name: "Spinach", price: 0.50 }
          ]
        }
      ]
    }
  ];
}
