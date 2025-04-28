
export interface Order {
  id: string;
  tableId?: string;
  tableNumber?: string;
  customerName?: string;
  items: OrderItem[];
  status: string;
  createdAt: Date;
  paymentDate?: Date;
  paymentMethod?: string;
  total: number;
  tip?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'cooking' | 'served';
  options?: string;
  notes?: string;
}
