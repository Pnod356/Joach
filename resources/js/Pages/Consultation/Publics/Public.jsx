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
import SidebarPub from '@/Components/SidebarPub';

export default function Publics({ types }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        typearchive: '',
        description: '',
        date_doc: '',
        created_at: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();

        post(route('public.search'));
    }

  return (
    <AuthenticatedLayout>

        <div className='flex flex-row justify-between'>

            <div className='basis-1/4'>
                <SidebarPub />
            </div>

            <div className="basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-100">
                        <div className="p-6 border-sky-200 creation-title font-bold">

                            <div className="">
                                <div className="mx-auto max-w-15xl sm:px-6 lg:px-8">
                                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-100">
                                        <div className="p-6 border-sky-200 creation-title font-bold">
                                            Recherche
                                        </div>

                                        <form onSubmit={handleSearch}>

                                            <div className="mx-8 gap-4 text-gray-600">
                                                <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                                    <Label htmlFor="typearchive">
                                                        Type de texte:
                                                        <span className="text-red-500">
                                                            &nbsp;*
                                                        </span>
                                                    </Label>
                                                    <Select
                                                        defaultValue="Constitutions"
                                                        name="typearchive"
                                                        // Use the `onValueChange` prop to update Inertia's form data
                                                        onValueChange={(value) => setData('typearchive', value)}
                                                        // Set the currently selected value based on the form data
                                                        value={data.typearchive}
                                                    >
                                                        <SelectTrigger id="typearchive">
                                                            <SelectValue placeholder="Selectionner le type d'archive..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="CONSTITUTION">Constitution</SelectItem>
                                                            <SelectItem value="LOIS">Lois</SelectItem>
                                                            <SelectItem value="ORDONNANCES">Ordonnances</SelectItem>
                                                            <SelectItem value="DECRETS">Décrets</SelectItem>
                                                            <SelectItem value="ARRETES">Arretés</SelectItem>
                                                            <SelectItem value="DECISIONS">Décisions</SelectItem>
                                                            <SelectItem value="CIRCULAIRES">Circulaires</SelectItem>
                                                            <SelectItem value="STRATEGIES">Stratégies</SelectItem>
                                                            <SelectItem value="INSTRUCTIONS">Instructions</SelectItem>
                                                        </SelectContent>

                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="mx-8 py-2 w-90 text-gray-600">
                                                <div className="inline-flex relative">
                                                    <InputLabel htmlFor="description" value="Objet"/>
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

                                                <div className='basis-1/2'>
                                                    <div className="text-gray-600">
                                                        <div className="inline-flex relative">
                                                            <InputLabel htmlFor="date_doc" value="Date de signature:"/>
                                                        </div>

                                                        <TextInput
                                                            id="date_doc"
                                                            type="text"
                                                            name="date_doc"
                                                            value={data.date_doc}
                                                            className="mt-1 block w-full"
                                                            autoComplete="date_doc"
                                                            isFocused={true}
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
                                                            name="created_at"
                                                            value={data.created_at}
                                                            className="mt-1 block w-full"
                                                            onChange={(e) => setData('created_at', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="flex flex-row py-2 my-4 mx-8 gap-4">
                                                <div className="basis-1/2">

                                                </div>
                                                <div className="basis-1/2 flex justify-end">
                                                    <SubmitButton>
                                                        <Search size={20}/> &nbsp;&nbsp;Rechercher
                                                    </SubmitButton>
                                                </div>
                                            </div>
                                        </form>

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
