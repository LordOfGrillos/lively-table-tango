
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoProps {
  customerName: string;
  orderNumber: number;
  onNameChange: (name: string) => void;
}

export function CustomerInfo({ 
  customerName, 
  orderNumber, 
  onNameChange 
}: CustomerInfoProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="order-number">Order Number</Label>
            <Input
              id="order-number"
              value={`#${orderNumber}`}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="customer-name">Customer Name (Optional)</Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used for calling the customer when the order is ready
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
