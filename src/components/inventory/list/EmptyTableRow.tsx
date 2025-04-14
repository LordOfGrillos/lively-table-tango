
import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyTableRow() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
        No inventory items found. Try adjusting your search.
      </TableCell>
    </TableRow>
  );
}
