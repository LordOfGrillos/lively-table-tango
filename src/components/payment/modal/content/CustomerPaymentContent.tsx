
import React from "react";
import { PaymentMethods } from "../../PaymentMethods";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "../CustomerInfo";
import { PaymentMethod } from "../../PaymentModal";
import { CreditCard, Banknote, ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CustomerPaymentContentProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  paymentMethods: PaymentMethod[];
  handlePaymentSubmit: () => void;
  setPaymentStatus: (status: string) => void;
  customerSubtotal: number;
  customerTipAmount: number;
  customerTotal: number;
  getCurrentCustomerName: () => string;
  currentCustomerIndex: number;
  totalCustomers: number;
}

export function CustomerPaymentContent({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentMethods,
  handlePaymentSubmit,
  setPaymentStatus,
  customerSubtotal,
  customerTipAmount,
  customerTotal,
  getCurrentCustomerName,
  currentCustomerIndex,
  totalCustomers
}: CustomerPaymentContentProps) {
  const customerName = getCurrentCustomerName();

  return (
    <div className="space-y-6">
      {/* Customer Banner - Highly visible indicator */}
      <Card className="border-app-purple">
        <CardHeader className="bg-app-purple text-white py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-1.5">
                <User className="h-5 w-5 text-app-purple" />
              </div>
              <div>
                <CardTitle>{customerName}'s Payment</CardTitle>
                <CardDescription className="text-white/80">
                  Processing payment for customer {currentCustomerIndex + 1} of {totalCustomers}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-white text-app-purple border-white">
              ${customerTotal.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      {/* Payment Methods Selection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethods
            paymentMethods={paymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
        </CardContent>
      </Card>
      
      {/* Payment Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Payment Summary</CardTitle>
          <CardDescription>
            {customerName}'s portion of the bill
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${customerSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tip:</span>
            <span>${customerTipAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total:</span>
            <span>${customerTotal.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 pt-4">
          <Button 
            variant="outline"
            onClick={() => setPaymentStatus("split-summary")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Split Summary
          </Button>
          
          {selectedPaymentMethod === "cash" ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePaymentSubmit}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Process Cash Payment
            </Button>
          ) : (
            <Button 
              className="bg-app-purple hover:bg-app-purple/90 text-white"
              onClick={handlePaymentSubmit}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Process Card Payment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
