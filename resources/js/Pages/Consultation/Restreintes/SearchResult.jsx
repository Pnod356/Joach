import SidebarCons from '@/Components/SidebarCons'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react'
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, EyeIcon, SendIcon, LockKeyholeOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';

export default function SearchResult({ results, searchParams, useDept }) {
    const handleViewId = (id) => {
        router.visit(`/search/${id}`)
    }

    const isSameDept = useDept === results.departement;

    const canEdit = isSameDept;

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

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
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    ID
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'typearchive',
            header: ({ column }) => (
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Type d'archives
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'description',
            header: ({ column }) => (
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Objet de l'archive
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'date_doc',
            header: ({ column }) => (
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date de signature
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'departement',
            header: ({ column }) => (
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Service Producteur
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
        },
        {
            id: "view",
            header: 'Visualiser',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className='flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded'>
                        <Link href={route('search.showid', { id: item.id })} className='items-center justify-center text-center'
                            onClick={(e) => !canEdit && e.preventDefault()}
                            as={canEdit ? "a" : "span"}
                        >
                            { canEdit ? <EyeIcon size={20} className='text-blue-400' /> : <LockKeyholeOpen size={20} className='text-red-400'/>}
                        </Link>
                    </div>
                )
            },
            size: 28,
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "send",
            header: 'Partager',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className='flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded'>
                        <Link href={route('send.senddoc', { id: item.id })} className='items-center justify-center text-center'>
                            <SendIcon size={20} className='text-blue-400' />
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
        data: results.data, // les données actuelles de la page
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        pageCount: results.last_page, // nombre total de pages
        state: {
            sorting,
            columnFilters,
        },
        // manualPagination: true //indique que la pagination est manuelle/serveur
    })

  return (
    <AuthenticatedLayout>
        <div className="py-3">
            <div className="mx-auto max-w-11xl sm:px-6 lg:px-8">
                <div className="consultation-card overflow-hidden">
                    <div className="p-6 text-green-700 text-xl italic dark:text-green-600 text-center">
                        Mieux se souvenir d'hier aujourd'hui, afin de mieux décider pour demain
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-row gap-4">
            <SidebarCons />
        </div>

        <div className="py-8 ml-60 basis-4/5">
            <div className="mx-auto max-w-11xl sm:px-6 lg:px-88">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-100">
                    <div className="consultation-card-header">
                        <div className="consultation-card-title">Résultats des archives consultables</div>
                        <span className="consultation-card-badge">Vue synthétique</span>
                    </div>
                    <div className="p-6">

                        <Head title='Search Results' />
                        <div className='container mx-auto p-4'>

                            { Object.keys(searchParams).length > 0 && (
                                <div className='mb-4'>
                                    <h1 className='text-xl font-semibold text-teal-400'>
                                        Parametre de recherche
                                    </h1>
                                    <div className='flex flex-row py-2 mx-2 gap-4'>
                                        { Object.entries(searchParams).map(([id, value]) => (
                                            <div key={id} className='text-gray-400 basis-1/4'>
                                                <Input className='mx-2' value={value} disabled/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h1 className='text-2xl font-semibold mb-4'>
                                R&eacute;sultat de la recherche
                            </h1>

                            <div className='w-full p-4 space-y-4'>
                                <div className="flex items-center justify-between">
                                    <Input
                                        type="text"
                                        placeholder="Filter par objet..."
                                        value={(table.getColumn('description')?.getFilterValue() || '')}
                                        onChange={(e) => table.getColumn('description')?.setFilterValue(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md max-w-sm"
                                    />
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

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                                        {table.getFilteredRowModel().rows.length} row(s) shown
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="px-3 py-1 border rounded disabled:opacity-50 bg-teal-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            Pr&eacute;cedent
                                        </Button>
                                        <Button
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                            className="px-3 py-1 border rounded disabled:opacity-50 bg-teal-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            Suivant
                                        </Button>
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
