import SidebarCons from '@/Components/SidebarCons'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react';
import React, { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, EyeIcon, SendIcon } from "lucide-react"
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
import SidebarPub from '@/Components/SidebarPub';

export default function PublicResult({ results, searchParams = {} }) {
    const formatDisplayText = (value) => String(value ?? '').replace(/_/g, ' ')

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const currentPage = results.current_page ?? 1;
    const lastPage = results.last_page ?? 1;
    const perPage = results.per_page ?? 10;

    const goToPage = (page) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        router.post(route('public.search'), {
            ...searchParams,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const changePerPage = (value) => {
        router.post(route('public.search'), {
            ...searchParams,
            per_page: Number(value),
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const searchQuery = new URLSearchParams(searchParams).toString();

    const pageItems = useMemo(() => {
        if (lastPage <= 7) {
            return Array.from({ length: lastPage }, (_, index) => index + 1);
        }

        const pages = new Set([1, lastPage, currentPage]);

        if (currentPage > 2) pages.add(currentPage - 1);
        if (currentPage < lastPage - 1) pages.add(currentPage + 1);

        const orderedPages = [...pages].sort((a, b) => a - b);
        return orderedPages.reduce((items, page, index) => {
            if (index > 0 && page - orderedPages[index - 1] > 1) {
                items.push('ellipsis-' + page);
            }
            items.push(page);
            return items;
        }, []);
    }, [currentPage, lastPage]);

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
            cell: ({ getValue }) => (
                <span className="whitespace-normal break-words text-left">
                    {formatDisplayText(getValue())}
                </span>
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
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <Link
                        href={`${route('public.showid', { id: item.id })}${searchQuery ? `?${searchQuery}` : ''}`}
                        className="inline-block max-w-full whitespace-normal break-words text-left text-blue-600 underline decoration-blue-600 hover:text-blue-800 hover:decoration-blue-800"
                    >
                        {formatDisplayText(item.description)}
                    </Link>
                )
            },
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
            accessorKey: 'emplacement',
            header: ({ column }) => (
                <Button
                    className="flex items-center gap-2 px-2 py-1 bg-white text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Emplacement Physique
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            ),
            cell: ({ getValue }) => (
                <span className="whitespace-normal break-words text-left">
                    {formatDisplayText(getValue())}
                </span>
            ),
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
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        // manualPagination: true //indique que la pagination est manuelle/serveur
    })

  return (
    <AuthenticatedLayout>
        <Head title='Search Results' />

        <div className='flex flex-row justify-between'>

            <div className='basis-1/4'>
                <SidebarPub />
            </div>

            <div className="basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-100">
                        <div className="p-6 border-sky-200 creation-title font-bold">

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

                                <div className='flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between'>
                                    <h1 className='text-2xl font-semibold'>
                                        R&eacute;sultat de la recherche
                                    </h1>
                                    <span className='text-sm font-medium text-gray-600'>
                                        Nombre de documents : {results.total ?? 0}
                                    </span>
                                </div>

                                <div className='w-full p-4 space-y-4'>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <Input
                                            type="text"
                                            placeholder="Filter par objet..."
                                            value={(table.getColumn('description')?.getFilterValue() || '')}
                                            onChange={(e) => table.getColumn('description')?.setFilterValue(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md max-w-sm"
                                        />
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <label htmlFor="per-page">Documents par page :</label>
                                            <Select value={String(perPage)} onValueChange={changePerPage}>
                                                <SelectTrigger id="per-page" className="w-24 bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[10, 25, 50, 80, 100].map((size) => (
                                                        <SelectItem key={size} value={String(size)}>
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
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
                                                                    <TableCell key={cell.id} className="align-top whitespace-normal break-words max-w-[280px]">
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

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-sm text-gray-600">
                                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                                            {table.getFilteredRowModel().rows.length} row(s) shown
                                        </div>
                                        <nav className="flex items-center gap-1" aria-label="Pagination">
                                            <Button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 border rounded disabled:opacity-50 bg-teal-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600"
                                            >
                                                Pr&eacute;cedent
                                            </Button>
                                            {pageItems.map((page) => page.toString().startsWith('ellipsis-') ? (
                                                <span key={page} className="px-2 text-gray-500" aria-hidden="true">
                                                    …
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    aria-current={page === currentPage ? 'page' : undefined}
                                                    className={`min-w-9 px-2 py-1 border rounded hover:bg-gray-50 hover:text-gray-600 ${page === currentPage ? 'bg-teal-500 text-white' : 'bg-white text-gray-600'}`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                            <Button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === lastPage}
                                                className="px-3 py-1 border rounded disabled:opacity-50 bg-teal-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600"
                                            >
                                                Suivant
                                            </Button>
                                        </nav>
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
