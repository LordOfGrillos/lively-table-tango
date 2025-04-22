
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign, Check } from "lucide-react";
import { DollarSignInput } from "@/components/payment/DollarSignInput";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentMethod: string) => void;
}

type PaymentStatus = "input" | "processing" | "change" | "success";

export function PaymentDialog({ 
  open, 
  onClose, 
  total, 
  onPaymentComplete 
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("input");
  const [cashReceived, setCashReceived] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);
  
  const handlePaymentSubmit = () => {
    if (paymentMethod === "card") {
      setPaymentStatus("processing");
      
      // Simulate card processing
      setTimeout(() => {
        setPaymentStatus("success");
        
        // Automatically close after success
        setTimeout(() => {
          onPaymentComplete("card");
        }, 2000);
      }, 1500);
    } else {
      // Cash payment
      const cashAmount = parseFloat(cashReceived);
      
      if (isNaN(cashAmount) || cashAmount < total) {
        // Not enough cash
        return;
      }
      
      const change = cashAmount - total;
      setChangeAmount(change);
      setPaymentStatus("change");
    }
  };
  
  const handleCashPaymentComplete = () => {
    setPaymentStatus("success");
    
    // Automatically close after success
    setTimeout(() => {
      onPaymentComplete("cash");
    }, 2000);
  };
  
  const handleDialogClose = () => {
    if (paymentStatus !== "processing") {
      onClose();
      
      // Reset state when dialog closes
      setPaymentStatus("input");
      setCashReceived("");
      setChangeAmount(0);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentStatus === "input" && "Payment"}
            {paymentStatus === "processing" && "Processing Payment"}
            {paymentStatus === "change" && "Change Due"}
            {paymentStatus === "success" && "Payment Completed"}
          </DialogTitle>
        </DialogHeader>
        
        {paymentStatus === "input" && (
          <div className="space-y-6">
            <div className="border-b pb-2">
              <div className="flex justify-between text-lg">
                <span>Total to pay:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Tabs 
              defaultValue="card" 
              onValueChange={(v) => setPaymentMethod(v as "card" | "cash")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="cash">Cash</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="**** **** **** ****" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-app-purple hover:bg-app-purple/90 mt-4"
                  onClick={handlePaymentSubmit}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${total.toFixed(2)}
                </Button>
              </TabsContent>
              
              <TabsContent value="cash" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cash-amount">Cash Received</Label>
                  <DollarSignInput
                    value={cashReceived}
                    onChange={setCashReceived}
                    autoFocus
                  />
                </div>
                
                <Button 
                  className="w-full bg-app-purple hover:bg-app-purple/90 mt-4"
                  onClick={handlePaymentSubmit}
                  disabled={
                    parseFloat(cashReceived) < total || isNaN(parseFloat(cashReceived))
                  }
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Process Cash Payment
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {paymentStatus === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-pulse">
              <CreditCard className="h-16 w-16 text-app-purple" />
            </div>
            <p className="mt-4 text-center">Processing your payment...</p>
          </div>
        )}
        
        {paymentStatus === "change" && (
          <div className="py-6 space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-lg">Change due:</p>
              <p className="text-3xl font-bold text-app-purple">
                ${changeAmount.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">
                Cash received: ${parseFloat(cashReceived).toFixed(2)}
              </p>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCashPaymentComplete}
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Payment
            </Button>
          </div>
        )}
        
        {paymentStatus === "success" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <p className="mt-4 text-center font-medium text-lg">Payment Successful!</p>
            <p className="text-gray-500 text-center mt-1">
              Your order is being prepared
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
