
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { SplitCustomer } from "./PaymentModal";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Check, Banknote, ArrowRight, X, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentSplitSummaryProps {
  customers: SplitCustomer[];
  currentCustomerIndex: number;
  getCustomerTotalWithTip: (customerId: string) => number;
  handlePayCustomer: (index: number) => void;
  customersPaid: boolean[];
  handleComplete: () => void;
  setPaymentStatus: (status: string) => void;
}

export function PaymentSplitSummary({
  customers,
  currentCustomerIndex,
  getCustomerTotalWithTip,
  handlePayCustomer,
  customersPaid,
  handleComplete,
  setPaymentStatus
}: PaymentSplitSummaryProps) {
  const allPaid = customersPaid.every(paid => paid);
  const totalBill = customers.reduce((sum, customer) => sum + getCustomerTotalWithTip(customer.id), 0);
  const totalPaid = customers.reduce((sum, customer, index) => 
    sum + (customersPaid[index] ? getCustomerTotalWithTip(customer.id) : 0), 0);
  
  return (
    <div className="space-y-6">
      <Card className="border-app-purple shadow-sm">
        <CardHeader className="bg-app-purple/10 border-b border-app-purple/20 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-app-purple">Split Bill Summary</CardTitle>
              <CardDescription>
                Select a customer to process their payment
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total Bill</div>
              <div className="text-lg font-bold">${totalBill.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 pt-2 border-t border-app-purple/10">
            <div className="text-sm">
              <span className="text-muted-foreground">Paid: </span>
              <span className="font-medium">${totalPaid.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Remaining: </span>
              <span className="font-medium">${(totalBill - totalPaid).toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Progress: </span>
              <span className="font-medium">{customersPaid.filter(p => p).length}/{customers.length} customers</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 divide-y">
          {customers.map((customer, index) => {
            const isPaid = customersPaid[index];
            const total = getCustomerTotalWithTip(customer.id);
            
            return (
              <div 
                key={customer.id} 
                className={`p-4 ${isPaid ? 'bg-green-50' : ''} ${!isPaid ? 'hover:bg-slate-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${isPaid ? 'bg-green-100' : 'bg-app-purple/10'}`}>
                      <User className={`h-4 w-4 ${isPaid ? 'text-green-600' : 'text-app-purple'}`} />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {customer.name}
                        {isPaid && (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <Check className="h-3 w-3 mr-1" /> Paid
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>Subtotal: ${customer.total.toFixed(2)}</span>
                        <span className="mx-1">•</span>
                        <span>Tip: ${customer.tipAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-lg">
                      ${total.toFixed(2)}
                    </span>
                    
                    {!isPaid && (
                      <Button 
                        onClick={() => handlePayCustomer(index)}
                        className="bg-app-purple hover:bg-app-purple/90"
                      >
                        Pay Now <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setPaymentStatus("split-bill")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Edit Split
          </Button>
          <Button
            className={`${allPaid ? 'bg-green-600 hover:bg-green-700' : 'bg-app-purple hover:bg-app-purple/90'}`}
            onClick={handleComplete}
            disabled={!allPaid}
          >
            {allPaid ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete All Payments
              </>
            ) : (
              <>
                {customersPaid.filter(p => p).length}/{customers.length} Paid
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
