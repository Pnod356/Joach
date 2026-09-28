import SidebarCons from '@/Components/SidebarCons'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SubmitButton from '@/Components/SubmitBtn';
import { Search, SearchCheckIcon, SearchCodeIcon, SearchSlashIcon, SquarePen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/Components/ui/label';
import Textarea from '@/Components/Textarea';

export default function AllUnit({ types }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        typearchive: '',
        description: '',
        date_doc: '',
        departement: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();

        post(route('searchallunit'));
    }

  return (
    <AuthenticatedLayout>
        <div className="flex flex-row justify-between">

            <div className='basis-1/4'>
                <SidebarCons />
            </div>

            <div className='basis-3/4 mr-10 py-6'>
                <div className="py-8">
                    <div className="max-w-7xl sm:px-6 lg:px-88">

                        <div className="overflow-hidden bg-white sm:rounded-lg dark:bg-gray-100">

                            <form onSubmit={handleSearch}>
                                <div className="gap-4 m-8 border-sky-200 font-bold">
                                    Par Type d'archives
                                </div>

                                <div className='mx-8 gap-2 text-gray-600'>
                                    <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-1 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                        <Select
                                            // Use the `onValueChange` prop to update Inertia's form data
                                            onValueChange={(value) => setData('typearchive', value)}
                                            // Set the currently selected value based on the form data
                                            value={data.typearchive}
                                        >
                                            <SelectTrigger id="typearchive">
                                                {/* The SelectValue displays the currently selected item's text */}
                                                <SelectValue placeholder="Selectionner le type d'archive..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((role) => (
                                                    <SelectItem key={role.id} value={String(role.intitule)}>
                                                        {role.intitule}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                </div>

                                <div className="gap-4 m-8 border-sky-200 font-bold">
                                    Multicrit&egrave;res
                                </div>

                                <div className="mx-8 py-2 w-90 text-gray-600">
                                    <div className="inline-flex relative">
                                        <InputLabel htmlFor="description" value="Objet de l'archive:"/>
                                    </div>

                                    <Textarea
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        autoComplete="description"
                                        isFocused={true}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-row py-2 my-4 mx-8 gap-4'>

                                    <div className='basis-1/2 text-gray-600'>
                                        <div className="text-gray-600">
                                            <div className="inline-flex relative">
                                                <InputLabel htmlFor="date_doc" value="Date de signature:"/>
                                            </div>

                                            <TextInput
                                                id="date_doc"
                                                type="date"
                                                name="date_doc"
                                                value={data.date_doc}
                                                className="mt-1 block w-full"
                                                autoComplete="date_doc"
                                                isFocused={true}
                                                placeholder="Objet de l'archive"
                                                onChange={(e) => setData('date_doc', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className='basis-1/2'>
                                        <div className="text-gray-600">
                                            <div className="inline-flex relative">
                                                <InputLabel htmlFor="created_at" value="Producteur:"/>
                                            </div>

                                            <TextInput
                                                id="created_at"
                                                name="departement"
                                                value={data.departement}
                                                className="mt-1 block w-full"
                                                placeholder='Producteur'
                                                onChange={(e) => setData('departement', e.target.value)}
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="flex flex-row py-2 my-4 mx-8 gap-4">
                                    <div className="basis-1/2">

                                    </div>
                                    <div className="basis-1/2 flex justify-end gap-2">
                                        <SubmitButton>
                                            <Search size={20}/> &nbsp;&nbsp;Rechercher
                                        </SubmitButton>
                                        {/* <Link
                                            href={route('archives.view')}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            Voir plus
                                        </Link> */}
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>
  )
}
