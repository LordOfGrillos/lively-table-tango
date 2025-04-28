
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
  initialAmount?: number;
  status: "open" | "closed";
  openedAt?: Date;
  closedAt?: Date;
  openedBy?: string;
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

export type CashMovement = {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal";
  reason: string;
  timestamp: Date;
  employeeId?: string;
  employeeName?: string;
  registerId: string;
};

export type CashCount = {
  bills1000: number;
  bills500: number;
  bills200: number;
  bills100: number;
  bills50: number;
  bills20: number;
  coins10: number;
  coins5: number;
  coins2: number;
  coins1: number;
  coins50c: number;
  totalAmount: number;
};

export type RegisterCut = {
  id: string;
  registerId: string;
  registerName: string;
  openTimestamp: Date;
  closeTimestamp: Date;
  openedBy: string;
  closedBy: string;
  initialAmount: number;
  expectedCash: number;
  declaredCash: number;
  difference: number;
  transactions: RegisterTransaction[];
  cashMovements: CashMovement[];
  status: "pending" | "completed";
  isEndOfDay: boolean;
  cashCount?: CashCount;
  ordersSummary: {
    open: number;
    closed: number;
    cancelled: number;
  };
  salesByPaymentMethod: {
    method: PaymentMethod | string;
    count: number;
    amount: number;
    declared?: number;
    difference?: number;
  }[];
  salesByOrderType: {
    type: string;
    count: number;
    amount: number;
  }[];
  salesByBrand: {
    brand: string;
    count: number;
    amount: number;
  }[];
  serviceFees: {
    count: number;
    amount: number;
  };
  cancelledItems: {
    count: number;
    amount: number;
  };
  salesSummary: {
    grossSales: number;
    discounts: number;
    serviceFees: number;
    totalSales: number;
    taxes: number;
    netSales: number;
  };
  integrationSales?: {
    provider: string;
    count: number;
    amount: number;
  }[];
};
