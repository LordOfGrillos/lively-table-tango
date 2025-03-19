
import { SplitCustomer } from "../PaymentModal";
import { Order } from "@/components/tables/TableActionPanel";
import { CustomerItem } from "./CustomerItem";
import { TipType } from "../hooks/useSplitBill";

interface CustomerListProps {
  customers: SplitCustomer[];
  order: Order;
  splitType: "equal" | "custom";
  handleSetCustomerName: (customerId: string, name: string) => void;
  handleCustomerTipTypeChange: (customerId: string, tipType: TipType) => void;
  handleCustomerTipValueChange: (customerId: string, tipValue: string) => void;
  getCustomerTotalWithTip: (customerId: string) => number;
}

export function CustomerList({
  customers,
  order,
  splitType,
  handleSetCustomerName,
  handleCustomerTipTypeChange,
  handleCustomerTipValueChange,
  getCustomerTotalWithTip
}: CustomerListProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Customers</h4>
      <div className="border rounded-lg bg-muted/20 divide-y">
        {customers.map((customer, index) => (
          <CustomerItem
            key={customer.id}
            customer={customer}
            index={index}
            order={order}
            splitType={splitType}
            handleSetCustomerName={handleSetCustomerName}
            handleCustomerTipTypeChange={handleCustomerTipTypeChange}
            handleCustomerTipValueChange={handleCustomerTipValueChange}
            getCustomerTotalWithTip={getCustomerTotalWithTip}
          />
        ))}
      </div>
    </div>
  );
}
