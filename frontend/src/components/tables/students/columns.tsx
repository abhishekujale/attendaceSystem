import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import { StudentRaw } from "@/pages/EventPage"

export const columns: ColumnDef<StudentRaw>[] = [
  {
    accessorKey: "prn",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            className="pl-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            PRN
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        )
    },
  },
  {
    accessorKey: "emailId",
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
    accessorKey: "name",
    header: ({ column }) => {
        return (
        <Button
            variant="ghost"
            className="pl-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Student Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        )
    },
  },
  {
    accessorKey: "branch",
    header: () => {
        return (
            <div>
                Branch
            </div>
        )
    },
  },
  
]
