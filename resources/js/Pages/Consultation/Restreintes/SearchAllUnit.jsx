import SidebarCons from '@/Components/SidebarCons'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EyeIcon, SendIcon, Share } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/Components/ui/input';

export default function SearchAllUnit({ results, searchParams }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const buildDetailHref = (itemId) => {
        const queryParams = Object.entries(searchParams || {}).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        const queryString = new URLSearchParams(queryParams).toString();

        return route('touteunite.allunitid', { id: itemId }) + (queryString ? `?${queryString}` : '');
    };

    const columns = [
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
            size: 28,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'description',
            header: ({ column }) => (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Objet de l'archive
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                const description = item.description ? item.description.replace(/_/g, ' ') : '';

                if (item.format === 'Document PDF' || item.format === 'Document Papier') {
                    return (
                        <a href={buildDetailHref(item.id)} className='text-blue-500 hover:text-blue-700 hover:underline whitespace-normal'>
                            {description}
                        </a>
                    );
                }
                return <div className="whitespace-normal">{description}</div>;
            },
        },
        {
            accessorKey: 'date_doc',
            header: ({ column }) => (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Sign&eacute;
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        // {
        //     id: "view",
        //     header: 'Visualiser',
        //     cell: ({ row }) => {
        //         const item = row.original;
        //         if (item.format === 'Document Papier') {
        //             return (
        //                 <div className='flex items-center justify-center text-center'>
        //                     <Link href={route('touteunite.allunitid', { id: item.id })}>
        //                         <EyeIcon size={20} className='text-blue-400' />
        //                     </Link>
        //                 </div>
        //             );
        //         }
        //         return null;
        //     },
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            id: "send",
            header: '',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className='flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded'>
                        <Link href={route('send.senddoc', { id: item.id })} className='items-center justify-center text-center'>
                            <Share size={20} className='text-blue-400' />
                        </Link>
                    </div>
                )
            },
            size: 28,
            enableSorting: false,
            enableHiding: false,
        }
    ]

    const table = useReactTable({
        data: results,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

  return (
    <AuthenticatedLayout>

        <div className="flex flex-row justify-between">
            <Head title='Search Results' />

            <div className='basis-1/4'>
                <SidebarCons />
            </div>

            <div className='basis-3/4 mr-24 py-6'>
                <div className="py-8">
                    <div className="w-full overflow-hidden bg-gray-100 sm:rounded-lg dark:bg-gray-100">
                        <div className="">
                            <div className="border-sky-200 p-6 creation-title font-bold">

                                <div className='container w-full'>

                                    <div className='flex flex-row gap-2 justify-between items-start mb-4'>
                                        <div>
                                            <h1 className='text-2xl font-semibold mb-2'>
                                                R&eacute;sultat de la recherche
                                            </h1>
                                            {(searchParams?.typearchive || searchParams?.departement) && (
                                                <div className="text-sm text-gray-600 mt-2 space-y-1">
                                                    {searchParams?.typearchive && (
                                                        <p><strong>Type d'archive :</strong> {searchParams.typearchive}</p>
                                                    )}
                                                    {searchParams?.departement && (
                                                        <p><strong>Département :</strong> {searchParams.departement}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className='text-sm text-gray-500 shrink-0 mt-1'>
                                            {results.length} archive(s) trouvée(s).
                                        </div>
                                    </div>

                                    <div className='max-w-7xl mx-auto p-4 space-y-4'>
                                        <div className="flex items-center py-4 gap-4">
                                            <Input
                                                placeholder="Filtrer par objet..."
                                                value={(table.getColumn("description")?.getFilterValue() || "")}
                                                onChange={(event) =>
                                                    table.getColumn("description")?.setFilterValue(event.target.value)
                                                }
                                                className="max-w-sm bg-white"
                                            />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="ml-auto">
                                                        Colonnes
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {table
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                                                    {column.id}
                                                                </DropdownMenuCheckboxItem>
                                                            );
                                                        })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className='rounded-md border overflow-hidden'>
                                            <Table>
                                                <TableHeader>
                                                    { table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={headerGroup.id}>
                                                            { headerGroup.headers.map((header) => (
                                                                <TableHead key={header.id}>
                                                                    {
                                                                        flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )
                                                                    }
                                                                </TableHead>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableHeader>
                                                <TableBody>
                                                    { table.getRowModel().rows.length ? (
                                                        table.getRowModel().rows.map((row) => (
                                                            <TableRow key={row.id} className='text-gray-600'>
                                                                {
                                                                    row.getVisibleCells().map((cell) => (
                                                                        <TableCell key={cell.id}>
                                                                            {
                                                                                flexRender(
                                                                                    cell.column.columnDef.cell,
                                                                                    cell.getContext()
                                                                                )
                                                                            }
                                                                        </TableCell>
                                                                    ))
                                                                }
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={columns.length} className='h-24 text-center'>
                                                                Aucun resultat.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex-1 text-sm text-muted-foreground">
                                                {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                                                {table.getFilteredRowModel().rows.length} ligne(s) selectionnée(s).
                                            </div>
                                            <div className="flex items-center space-x-6 lg:space-x-8">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-medium">Lignes par page</p>
                                                    <Select
                                                        value={`${table.getState().pagination.pageSize}`}
                                                        onValueChange={(value) => {
                                                            table.setPageSize(Number(value));
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 w-[70px]">
                                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                                                        </SelectTrigger>
                                                        <SelectContent side="top">
                                                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                                    {pageSize}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                                    Page {table.getState().pagination.pageIndex + 1} sur{" "}
                                                    {table.getPageCount()}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                                                        <span className="sr-only">Première page</span>
                                                        <ChevronsLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                                        <span className="sr-only">Page précédente</span>
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                                        <span className="sr-only">Page suivante</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="hidden h-8 w-8 p-0 lg:flex"
                                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                                        disabled={!table.getCanNextPage()}
                                                    >
                                                        <span className="sr-only">Dernière page</span>
                                                        <ChevronsRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>
  )
}
