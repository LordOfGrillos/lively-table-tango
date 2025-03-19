
import { Order } from "@/components/tables/TableActionPanel";
import { SplitCustomer } from "./PaymentModal";
import { TipType } from "./hooks/useSplitBill";
import { SplitHeader } from "./split/SplitHeader";
import { CustomerList } from "./split/CustomerList";
import { OrderItemList } from "./split/OrderItemList";
import { BillSummary } from "./split/BillSummary";
import { PaymentSplitBillFooter } from "./split/PaymentSplitBillFooter";

interface PaymentSplitBillProps {
  order: Order;
  customers: SplitCustomer[];
  splitType: "equal" | "custom";
  numberOfCustomers: number;
  calculateTotalWithTip: () => number;
  handleSplitTypeChange: (type: "equal" | "custom") => void;
  handleAddCustomer: () => void;
  handleRemoveCustomer: () => void;
  handleAssignItemToCustomer: (itemId: string, customerId: string) => void;
  handleSetCustomerName: (customerId: string, name: string) => void;
  handleCustomerTipTypeChange: (customerId: string, tipType: TipType) => void;
  handleCustomerTipValueChange: (customerId: string, tipValue: string) => void;
  isItemAssignedToCustomer: (itemId: string, customerId: string) => boolean;
  getRemainingAmount: () => number;
  getCustomerTotalWithTip: (customerId: string) => number;
  handleCompleteSplit: () => void;
  setPaymentStatus: (status: string) => void;
}

export function PaymentSplitBill({
  order,
  customers,
  splitType,
  numberOfCustomers,
  calculateTotalWithTip,
  handleSplitTypeChange,
  handleAddCustomer,
  handleRemoveCustomer,
  handleAssignItemToCustomer,
  handleSetCustomerName,
  handleCustomerTipTypeChange,
  handleCustomerTipValueChange,
  isItemAssignedToCustomer,
  getRemainingAmount,
  getCustomerTotalWithTip,
  handleCompleteSplit,
  setPaymentStatus
}: PaymentSplitBillProps) {
  
  // Calculate total assigned in custom split
  const calculateAssignedTotal = () => {
    let total = 0;
    customers.forEach(customer => {
      customer.items.forEach(item => {
        const orderItem = order.items.find(i => i.id === item.itemId);
        if (orderItem) {
          total += orderItem.price * orderItem.quantity;
        }
      });
    });
    return total;
  };

  return (
    <div className="py-4 space-y-4">
      <SplitHeader 
        splitType={splitType}
        numberOfCustomers={numberOfCustomers}
        handleSplitTypeChange={handleSplitTypeChange}
        handleAddCustomer={handleAddCustomer}
        handleRemoveCustomer={handleRemoveCustomer}
      />
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 md:order-2">
          <CustomerList 
            customers={customers}
            order={order}
            splitType={splitType}
            handleSetCustomerName={handleSetCustomerName}
            handleCustomerTipTypeChange={handleCustomerTipTypeChange}
            handleCustomerTipValueChange={handleCustomerTipValueChange}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
          />
          
          <BillSummary 
            order={order}
            customers={customers}
            splitType={splitType}
            getRemainingAmount={getRemainingAmount}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
            calculateAssignedTotal={calculateAssignedTotal}
          />
        </div>
        
        {splitType === "custom" && (
          <div className="space-y-2 md:order-1">
            <OrderItemList 
              order={order}
              customers={customers}
              isItemAssignedToCustomer={isItemAssignedToCustomer}
              handleAssignItemToCustomer={handleAssignItemToCustomer}
            />
          </div>
        )}
      </div>
      
      <PaymentSplitBillFooter 
        splitType={splitType}
        getRemainingAmount={getRemainingAmount}
        handleCompleteSplit={handleCompleteSplit}
        setPaymentStatus={setPaymentStatus}
      />
    </div>
  );
}
