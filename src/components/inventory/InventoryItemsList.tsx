
import { useState } from "react";
import { useInventory, InventoryItem } from "./context";
import { Table, TableBody } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { EditItemDialog } from "./dialogs/EditItemDialog";
import { StockAdjustmentDialog } from "./dialogs/StockAdjustmentDialog";
import { DeleteConfirmDialog } from "./dialogs/DeleteConfirmDialog";
import { SearchAndFilterBar } from "./list/SearchAndFilterBar";
import { InventoryTableHeader } from "./list/InventoryTableHeader";
import { InventoryTableRow } from "./list/InventoryTableRow";
import { EmptyTableRow } from "./list/EmptyTableRow";

export function InventoryItemsList() {
  const { items } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // State for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockAdjustmentType, setStockAdjustmentType] = useState<"add" | "reduce">("add");

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items based on current sort settings
  const sortedItems = [...filteredItems].sort((a, b) => {
    let valueA: any = a[sortBy as keyof InventoryItem];
    let valueB: any = b[sortBy as keyof InventoryItem];

    // Handle special cases
    if (sortBy === "status") {
      const statusOrder = {
        "out-of-stock": 0,
        "low-stock": 1,
        "expired": 2,
        "in-stock": 3,
      };
      valueA = statusOrder[a.status as keyof typeof statusOrder];
      valueB = statusOrder[b.status as keyof typeof statusOrder];
    }

    if (valueA === undefined) return 0;
    if (valueB === undefined) return 0;

    // Compare values
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Toggle sort order and field
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle edit item
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  // Handle stock adjustment
  const handleStockAdjustment = (item: InventoryItem, type: "add" | "reduce") => {
    setSelectedItem(item);
    setStockAdjustmentType(type);
    setStockDialogOpen(true);
  };

  // Handle delete item
  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <SearchAndFilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Items Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <InventoryTableHeader toggleSort={toggleSort} />
            <TableBody>
              {sortedItems.length === 0 ? (
                <EmptyTableRow />
              ) : (
                sortedItems.map((item) => (
                  <InventoryTableRow
                    key={item.id}
                    item={item}
                    handleEditItem={handleEditItem}
                    handleStockAdjustment={handleStockAdjustment}
                    handleDeleteItem={handleDeleteItem}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Item Dialog */}
      {selectedItem && (
        <EditItemDialog 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
          item={selectedItem} 
        />
      )}

      {/* Stock Adjustment Dialog */}
      {selectedItem && (
        <StockAdjustmentDialog 
          open={stockDialogOpen} 
          onOpenChange={setStockDialogOpen} 
          item={selectedItem} 
          adjustmentType={stockAdjustmentType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedItem && (
        <DeleteConfirmDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen} 
          item={selectedItem} 
        />
      )}
    </div>
  );
}
