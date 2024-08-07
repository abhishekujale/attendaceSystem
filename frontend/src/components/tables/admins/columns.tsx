import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import AdminActions from "@/components/actions/AdminActions"

export type Admin = {
  id: string
  email: string,
}

export const columns: ColumnDef<Admin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, 
  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            className="pl-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        )
    },
  },
  {
    id: "adminActions",
    cell: ({ row }) => (
      <AdminActions {...row.original} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
