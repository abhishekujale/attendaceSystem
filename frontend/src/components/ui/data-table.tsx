import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import { Trash } from "lucide-react";
import { useSetRecoilState } from "recoil";
import { confrimationDialog } from "../../store/dialogAtom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey: string | string[];
    onDelete?: (rows: Row<TData>[]) => void;
    disabled?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    onDelete,
    disabled,
}: DataTableProps<TData, TValue>) {
    const setConfirmDialogue = useSetRecoilState(confrimationDialog);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedFilterKey, setSelectedFilterKey] = React.useState<string>(
        Array.isArray(filterKey) ? filterKey[0] : filterKey
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        table.getColumn(selectedFilterKey)?.setFilterValue(value);
    };

    const isEvenRow = (index: number) => index % 2 === 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                {Array.isArray(filterKey) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' className="max-w-xs">
                                Filter by {selectedFilterKey}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {filterKey.map((key) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setSelectedFilterKey(key)}
                                >
                                    {key}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <Input
                    placeholder={`Filter ${selectedFilterKey}...`}
                    value={(table.getColumn(selectedFilterKey)?.getFilterValue() as string) ?? ""}
                    onChange={handleFilterChange}
                    className="max-w-sm ml-2"
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        disabled={disabled}
                        size="sm"
                        variant="outline"
                        className="ml-auto font-normal text-xs"
                        onClick={() => {
                            setConfirmDialogue((prev) => ({
                                ...prev,
                                primaryAction: () => {
                                    onDelete?.(table.getFilteredSelectedRowModel().rows);
                                    table.resetRowSelection();
                                },
                                isOpen: true,
                                title: "Are you sure?",
                                message: "You are about to perform bulk delete",
                            }));
                        }}
                    >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={isEvenRow(index) ? "bg-white" : "bg-gray-100"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-gray-500">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}