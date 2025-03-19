
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
import { Calendar, Clock, Users } from "lucide-react";
import { TableStatus } from "@/components/tables/TableShape";
import { toast } from "sonner";

interface ReservationTabProps {
  selectedTable: {
    id: string;
    number: string;
    status: TableStatus;
    capacity: number;
  };
  onReservationCreate: (tableId: string, data: any) => void;
  onStatusChange: (tableId: string, status: TableStatus) => void;
}

export function ReservationTab({ 
  selectedTable, 
  onReservationCreate, 
  onStatusChange 
}: ReservationTabProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

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
    
    setCustomerName("");
    setCustomerPhone("");
    setGuestCount(1);
    setSelectedDate("");
    setSelectedTime("");
  };

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

  return (
    <div className="space-y-4">
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
  );
}
