
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
      { 
        id: "item-1", 
        name: "Pollo a la Plancha", 
        quantity: 2, 
        notes: "Sin salsa",
        recipe: {
          ingredients: [
            { name: "Pechuga de pollo", quantity: "200", unit: "g" },
            { name: "Sal", quantity: "5", unit: "g" },
            { name: "Pimienta negra", quantity: "2", unit: "g" },
            { name: "Aceite de oliva", quantity: "15", unit: "ml" },
            { name: "Romero fresco", quantity: "3", unit: "g" },
            { name: "Ajo", quantity: "5", unit: "g" }
          ],
          instructions: "Sazonar el pollo con sal y pimienta. Calentar el aceite en la plancha. Cocinar el pollo 5 minutos por cada lado hasta que esté dorado. Añadir el romero y el ajo los últimos 2 minutos."
        }
      },
      { 
        id: "item-2", 
        name: "Ensalada César", 
        quantity: 1, 
        modifiers: ["Extra aderezo", "Sin crutones"],
        recipe: {
          ingredients: [
            { name: "Lechuga romana", quantity: "150", unit: "g" },
            { name: "Aderezo César", quantity: "45", unit: "ml" },
            { name: "Queso parmesano", quantity: "20", unit: "g" },
            { name: "Crutones", quantity: "30", unit: "g" },
            { name: "Anchoas", quantity: "10", unit: "g" }
          ],
          instructions: "Lavar y cortar la lechuga. Mezclar con el aderezo. Añadir el queso y los crutones al servir."
        }
      },
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
      { 
        id: "item-3", 
        name: "Ribeye", 
        quantity: 1, 
        notes: "Término medio",
        recipe: {
          ingredients: [
            { name: "Corte Ribeye", quantity: "350", unit: "g" },
            { name: "Sal gruesa", quantity: "8", unit: "g" },
            { name: "Pimienta negra", quantity: "4", unit: "g" },
            { name: "Mantequilla", quantity: "25", unit: "g" },
            { name: "Romero", quantity: "5", unit: "g" },
            { name: "Ajo", quantity: "10", unit: "g" }
          ],
          instructions: "Dejar el corte a temperatura ambiente 30 minutos. Sazonar generosamente. Sellar en sartén muy caliente 3 minutos por lado. Añadir mantequilla, romero y ajo. Cocinar hasta término medio (55°C). Reposar 5 minutos antes de servir."
        }
      },
      { 
        id: "item-4", 
        name: "Puré de Papas", 
        quantity: 1,
        recipe: {
          ingredients: [
            { name: "Papas russet", quantity: "250", unit: "g" },
            { name: "Mantequilla", quantity: "50", unit: "g" },
            { name: "Crema", quantity: "60", unit: "ml" },
            { name: "Sal", quantity: "5", unit: "g" },
            { name: "Pimienta blanca", quantity: "2", unit: "g" }
          ],
          instructions: "Cocer las papas en agua con sal hasta que estén suaves. Escurrir y hacer puré. Incorporar mantequilla y crema caliente. Sazonar con sal y pimienta."
        }
      },
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
      { 
        id: "item-5", 
        name: "Fish & Chips", 
        quantity: 1,
        recipe: {
          ingredients: [
            { name: "Filete de pescado", quantity: "200", unit: "g" },
            { name: "Harina", quantity: "100", unit: "g" },
            { name: "Cerveza", quantity: "150", unit: "ml" },
            { name: "Papas", quantity: "200", unit: "g" },
            { name: "Sal", quantity: "6", unit: "g" },
            { name: "Polvo para hornear", quantity: "5", unit: "g" }
          ],
          instructions: "Preparar rebozado con harina, cerveza y polvo para hornear. Rebozar el pescado y freír a 180°C por 4-5 minutos. Freír las papas por separado hasta que estén doradas."
        }
      },
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
      { 
        id: "item-6", 
        name: "Margarita", 
        quantity: 2,
        recipe: {
          ingredients: [
            { name: "Tequila", quantity: "60", unit: "ml" },
            { name: "Triple sec", quantity: "30", unit: "ml" },
            { name: "Jugo de limón", quantity: "30", unit: "ml" },
            { name: "Sal", quantity: "5", unit: "g" },
            { name: "Hielo", quantity: "120", unit: "g" }
          ],
          instructions: "Escarchar el borde del vaso con sal. En una coctelera con hielo, mezclar tequila, triple sec y jugo de limón. Agitar y servir en el vaso con hielo."
        }
      },
      { 
        id: "item-7", 
        name: "Cerveza", 
        quantity: 1, 
        notes: "De barril",
        recipe: {
          ingredients: [
            { name: "Cerveza de barril", quantity: "330", unit: "ml" }
          ],
          instructions: "Servir en vaso inclinado para minimizar espuma."
        }
      },
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
      { 
        id: "item-8", 
        name: "Vino", 
        quantity: 2, 
        notes: "Tinto, de la casa",
        recipe: {
          ingredients: [
            { name: "Vino tinto de la casa", quantity: "175", unit: "ml" }
          ],
          instructions: "Servir en copa de vino tinto. Temperatura ideal: 16-18°C."
        }
      },
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
      { 
        id: "item-9", 
        name: "Cappuccino", 
        quantity: 1,
        recipe: {
          ingredients: [
            { name: "Café espresso", quantity: "30", unit: "ml" },
            { name: "Leche", quantity: "120", unit: "ml" },
            { name: "Espuma de leche", quantity: "60", unit: "ml" },
            { name: "Cacao en polvo", quantity: "2", unit: "g" }
          ],
          instructions: "Preparar el espresso. Calentar y espumar la leche. Verter la leche sobre el espresso y finalizar con la espuma. Espolvorear cacao."
        }
      },
      { 
        id: "item-10", 
        name: "Cheesecake", 
        quantity: 1,
        recipe: {
          ingredients: [
            { name: "Porción de Cheesecake", quantity: "1", unit: "porción" },
            { name: "Salsa de frutos rojos", quantity: "30", unit: "ml" },
            { name: "Hojas de menta", quantity: "1", unit: "unidad" }
          ],
          instructions: "Servir la porción de cheesecake refrigerada. Decorar con salsa de frutos rojos y una hoja de menta."
        }
      },
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
      { 
        id: "item-11", 
        name: "Espresso", 
        quantity: 2,
        recipe: {
          ingredients: [
            { name: "Café molido", quantity: "18", unit: "g" },
            { name: "Agua", quantity: "60", unit: "ml" }
          ],
          instructions: "Moler el café a punto fino. Extraer el espresso a 9 bar de presión durante 25-30 segundos."
        }
      },
      { 
        id: "item-12", 
        name: "Croissant", 
        quantity: 2,
        recipe: {
          ingredients: [
            { name: "Croissant", quantity: "1", unit: "unidad" },
            { name: "Mantequilla", quantity: "10", unit: "g" },
            { name: "Mermelada", quantity: "15", unit: "g" }
          ],
          instructions: "Calentar el croissant en el horno a 160°C por 2 minutos. Servir con mantequilla y mermelada aparte."
        }
      },
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
