
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TableStatus } from "@/components/tables/TableShape";
import { Calendar, Clock, Users, X } from "lucide-react";
import { toast } from "sonner";

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
};

export function TableActionPanel({ 
  selectedTable, 
  onClose,
  onStatusChange,
  onReservationCreate
}: TableActionPanelProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (!selectedTable) return null;

  const handleStatusChange = (status: TableStatus) => {
    onStatusChange(selectedTable.id, status);
    
    const statusMessages = {
      available: "Table is now available",
      reserved: "Table has been reserved",
      occupied: "Table is now occupied",
      filled: "Table is now filled"
    };
    
    toast.success(statusMessages[status], {
      description: `Table ${selectedTable.number} status updated`
    });
  };

  const handleCreateReservation = () => {
    if (!customerName) {
      toast.error("Please enter customer name");
      return;
    }
    
    const reservationData = {
      tableId: selectedTable.id,
      customerName,
      customerPhone,
      guestCount,
      date: selectedDate,
      time: selectedTime
    };
    
    onReservationCreate?.(selectedTable.id, reservationData);
    handleStatusChange('reserved');
    
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setGuestCount(1);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg p-6 rounded-t-2xl animate-slide-up z-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Table {selectedTable.number}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-sm font-medium
                  ${selectedTable.status === 'available' ? 'text-green-700' : ''}
                  ${selectedTable.status === 'reserved' ? 'text-red-700' : ''}
                  ${selectedTable.status === 'filled' ? 'text-gray-700' : ''}
                  ${selectedTable.status === 'occupied' ? 'text-amber-700' : ''}
                `}>
                  {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Capacity</span>
                <span className="text-sm font-medium">{selectedTable.capacity} seats</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Change Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="bg-table-available text-green-800 hover:bg-table-available/80 border-none"
                  onClick={() => handleStatusChange('available')}
                >
                  Available
                </Button>
                <Button 
                  variant="outline"
                  className="bg-table-reserved text-red-800 hover:bg-table-reserved/80 border-none"
                  onClick={() => handleStatusChange('reserved')}
                >
                  Reserved
                </Button>
                <Button 
                  variant="outline"
                  className="bg-table-filled text-gray-800 hover:bg-table-filled/80 border-none"
                  onClick={() => handleStatusChange('filled')}
                >
                  Filled
                </Button>
                <Button 
                  variant="outline"
                  className="bg-table-occupied text-amber-800 hover:bg-table-occupied/80 border-none"
                  onClick={() => handleStatusChange('occupied')}
                >
                  Occupied
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-medium">Make Reservation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input 
                  id="customer-name" 
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone Number</Label>
                <Input 
                  id="customer-phone" 
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guest-count">Number of Guests</Label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <Select 
                    value={guestCount.toString()} 
                    onValueChange={(val) => setGuestCount(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: selectedTable.capacity}, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservation-date">Reservation Date</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <Input 
                    id="reservation-date" 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservation-time">Reservation Time</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <Input 
                    id="reservation-time" 
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                variant="default"
                className="bg-app-purple hover:bg-app-purple/90"
                onClick={handleCreateReservation}
              >
                Create Reservation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
