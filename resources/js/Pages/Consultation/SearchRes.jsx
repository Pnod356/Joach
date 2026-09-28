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

export default function VosCreation({ types }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        typearchive: '',
        description: '',
        date_doc: '',
        created_at: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();

        post(route('search'));
    }

  return (
    <AuthenticatedLayout hideHeader={true}>


        <SidebarCons />

        <div className="py-8 md:pl-64 pl-4">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="">
                            <div className="mx-auto max-w-15xl sm:px-6 lg:px-8">
                                <div className="consultation-card overflow-hidden">
                                    <div className="consultation-card-header">
                                        <div className="consultation-card-title">Critères de recherche</div>
                                        <span className="consultation-card-badge">Archives</span>
                                    </div>

                                    <form onSubmit={handleSearch}>

                                        <div className='mx-8 gap-4 text-gray-600'>
                                            <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                                <Label htmlFor="typearchive">
                                                    Type d'archives:
                                                    <span className="text-red-500">
                                                        &nbsp;*
                                                    </span>
                                                </Label>

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
                                                        <InputLabel htmlFor="created_at" value="Date de création:"/>
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
    </AuthenticatedLayout>
  )
}
