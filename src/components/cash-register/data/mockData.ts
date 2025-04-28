
import { CashRegister, RegisterTransaction } from "../types";

// Mock cash registers
export const mockRegisters: CashRegister[] = [
  {
    id: "register-1",
    name: "Caja Principal",
    location: "Entrada",
    status: "closed" // Added the required status property
  },
  {
    id: "register-2",
    name: "Caja Secundaria",
    location: "Bar",
    status: "closed" // Added the required status property
  },
  {
    id: "register-3",
    name: "Caja 3",
    location: "Terraza",
    status: "closed" // Added the required status property
  }
];

// Generate mock transactions
export const generateMockTransactions = (days: number = 30): RegisterTransaction[] => {
  const transactions: RegisterTransaction[] = [];
  const now = new Date();
  const paymentMethods: ("cash" | "card" | "other")[] = ["cash", "card", "other"];
  const employees = [
    { id: "emp1", name: "Juan Pérez" },
    { id: "emp2", name: "María López" },
    { id: "emp3", name: "Carlos Ruiz" },
  ];
  
  // Generate random transactions for the past `days`
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Generate between 5-15 transactions per day
    const dailyTransactions = Math.floor(Math.random() * 10) + 5;
    
    for (let j = 0; j < dailyTransactions; j++) {
      const hours = Math.floor(Math.random() * 14) + 8; // 8 AM - 10 PM
      const minutes = Math.floor(Math.random() * 60);
      
      const timestamp = new Date(date);
      timestamp.setHours(hours, minutes);
      
      const employeeIndex = Math.floor(Math.random() * employees.length);
      const paymentMethodIndex = Math.floor(Math.random() * paymentMethods.length);
      const amount = Math.random() * 1000 + 50; // Random amount between $50 and $1050
      
      transactions.push({
        id: `tx-${i}-${j}`,
        amount: parseFloat(amount.toFixed(2)),
        paymentMethod: paymentMethods[paymentMethodIndex],
        description: `Orden #${1000 + (i * 10) + j}`,
        timestamp,
        orderId: `order-${1000 + (i * 10) + j}`,
        employeeId: employees[employeeIndex].id,
        employeeName: employees[employeeIndex].name
      });
    }
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: RegisterTransaction[],
  startDate: Date,
  endDate: Date
): RegisterTransaction[] => {
  return transactions.filter(
    (tx) => tx.timestamp >= startDate && tx.timestamp <= endDate
  );
};

// Generate a report from transactions
export const generateReport = (
  registerId: string,
  registerName: string,
  startDate: Date,
  endDate: Date,
  transactions: RegisterTransaction[]
) => {
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startDate,
    endDate
  );
  
  const totalCash = filteredTransactions
    .filter(tx => tx.paymentMethod === "cash")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalCard = filteredTransactions
    .filter(tx => tx.paymentMethod === "card")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalOther = filteredTransactions
    .filter(tx => tx.paymentMethod === "other")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalAmount = totalCash + totalCard + totalOther;
  
  return {
    registerId,
    registerName,
    startDate,
    endDate,
    transactions: filteredTransactions,
    totalCash,
    totalCard,
    totalOther,
    totalAmount,
  };
};
