
export type PaymentMethod = "cash" | "card" | "other";

export type RegisterTransaction = {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  timestamp: Date;
  orderId?: string;
  employeeId?: string;
  employeeName?: string;
};

export type CashRegister = {
  id: string;
  name: string;
  location: string;
};

export type RegisterReport = {
  registerId: string;
  registerName: string;
  startDate: Date;
  endDate: Date;
  transactions: RegisterTransaction[];
  totalCash: number;
  totalCard: number;
  totalOther: number;
  totalAmount: number;
};
