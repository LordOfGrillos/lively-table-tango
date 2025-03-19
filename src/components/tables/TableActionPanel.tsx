
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { TableStatus } from "@/components/tables/TableShape";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { StatusTab, ReservationTab, OrderTab } from "./action-panel";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'pending' | 'cooking' | 'served';
  customizations?: {
    removedIngredients: string[];
    extras: Extra[];
  };
}

export interface Extra {
  name: string;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  status: 'new' | 'in-progress' | 'completed' | 'paid';
  customerName?: string;
  items: OrderItem[];
  createdAt: Date;
  total: number;
  paymentMethod?: string;
  paymentDate?: Date;
}

type TableActionPanelProps = {
  selectedTable?: {
    id: string;
    number: string;
    status: TableStatus;
    capacity: number;
  };
  onClose: () => void;
  onStatusChange: (tableId: string, status: TableStatus) => void;
  onReservationCreate?: (tableId: string, data: any) => void;
  onOrderCreate?: (tableId: string, order: Order) => void;
  onOrderUpdate?: (order: Order) => void;
  existingOrder?: Order | null;
};

export function TableActionPanel({ 
  selectedTable, 
  onClose,
  onStatusChange,
  onReservationCreate,
  onOrderCreate,
  onOrderUpdate,
  existingOrder
}: TableActionPanelProps) {
  const [activeTab, setActiveTab] = useState<string>(existingOrder ? "order" : "status");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!selectedTable) return null;

  const handleCompleteOrder = () => {
    if (!existingOrder || !onOrderUpdate) return;
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = (paymentMethod: string) => {
    if (!existingOrder || !onOrderUpdate) return;
    
    const updatedItems = existingOrder.items.map(item => ({
      ...item,
      status: 'served' as const
    }));
    
    const updatedOrder = {
      ...existingOrder,
      items: updatedItems,
      status: 'paid' as const,
      paymentMethod,
      paymentDate: new Date()
    };
    
    onOrderUpdate(updatedOrder);
    onStatusChange(selectedTable.id, 'available');
    
    setIsPaymentModalOpen(false);
    onClose();
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg p-6 rounded-t-2xl animate-slide-up z-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Table {selectedTable.number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium px-2 py-1 rounded-full
                ${selectedTable.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                ${selectedTable.status === 'reserved' ? 'bg-red-100 text-red-800' : ''}
                ${selectedTable.status === 'filled' ? 'bg-gray-100 text-gray-800' : ''}
                ${selectedTable.status === 'occupied' ? 'bg-amber-100 text-amber-800' : ''}
              `}>
                {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{selectedTable.capacity} seats</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="status">
              Table Status
            </TabsTrigger>
            <TabsTrigger value="order">
              {existingOrder ? "View Order" : "Create Order"}
            </TabsTrigger>
            <TabsTrigger value="reservation">
              Make Reservation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <StatusTab 
              selectedTable={selectedTable} 
              onStatusChange={onStatusChange} 
            />
          </TabsContent>
          
          <TabsContent value="order" className="space-y-4">
            <OrderTab 
              selectedTable={selectedTable}
              existingOrder={existingOrder}
              onOrderCreate={onOrderCreate}
              onOrderUpdate={onOrderUpdate}
              onCompleteOrder={handleCompleteOrder}
            />
          </TabsContent>
          
          <TabsContent value="reservation" className="space-y-4">
            <ReservationTab 
              selectedTable={selectedTable}
              onReservationCreate={onReservationCreate || (() => {})}
              onStatusChange={onStatusChange}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {existingOrder && (
        <PaymentModal
          order={existingOrder}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
