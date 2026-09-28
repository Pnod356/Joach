import BreadCrumb from '@/Components/BreadCrumb';
import SidebarCons from '@/Components/SidebarCons'
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
import { Label } from '@/Components/ui/label';
import { Link, router } from '@inertiajs/react';
import { ArrowBigLeftDashIcon, BackpackIcon, FileX2 } from 'lucide-react';

export default function AllUnitView({ elements, paths, searchParams = {} }) {
    const dateFormat = new Date(elements.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleBackToResults = () => {
        const hasSearchParams = Object.values(searchParams || {}).some((value) => value !== '' && value !== null && value !== undefined);

        if (hasSearchParams) {
            router.post(route('searchallunit'), searchParams);
            return;
        }

        router.visit(route('touteunite'));
    };

  return (
    <AuthenticatedLayout>

        <div className='flex flex-row justify-between'>
            <div className='basis-1/4'>
                <SidebarCons />
            </div>

            <div className='basis-3/4 mr-10 lg:mr-10 md:mr-10 sm:mr-10 py-6'>
                <div className="overflow-hidden bg-gray-100 shadow-sm sm:rounded-lg dark:bg-gray-100">
                    <div className="border-sky-200 creation-title font-bold">

                        <div className='flex flex-row items-center justify-between gap-4 mt-2'>
                            <span className="text-sm text-gray-500">
                                Métadonnées de l'archive
                            </span>
                            <button
                                type="button"
                                onClick={handleBackToResults}
                                className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                            >
                                <ArrowBigLeftDashIcon className="h-4 w-4" />
                                Retour au tableau
                            </button>
                        </div>

                        <div className='flex flex-row gap-4 mt-4'>
                            <BackpackIcon className="h-6 w-6 text-gray-600" />
                            <span className="text-lg font-semibold text-gray-800 whitespace-normal break-words">
                                {elements.description ? elements.description.replace(/_/g, ' ') : ''}
                            </span>
                        </div>

                        <div class="py-5">
                            <div className='flex flex-row py-2 my-4 mx-2 gap-4'>
                                <div className="basis-1/4">
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Type d'archives
                                        </Label>
                                        <Input value={elements.typearchive} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Date de signature
                                        </Label>
                                        <Input value={elements.date_doc} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Format du document
                                        </Label>
                                        <Input value={elements.format} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Emplacement physique
                                        </Label>
                                        <Input value={elements.emplacement} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Emplacement virtuel
                                        </Label>
                                        <Input value={elements.emplacement2} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Rayon
                                        </Label>
                                        <Input value={elements.rayon} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Travee
                                        </Label>
                                        <Input value={elements.travee} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Cote Référent
                                        </Label>
                                        <Input value={elements.cote} className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Cote Archive
                                        </Label>
                                        <Input value='' className='text-gray-600' disabled/>
                                    </div>
                                    <div className='py-1'>
                                        <Label className='py-4'>
                                            Date de creation
                                        </Label>
                                        <Input value={dateFormat} className='text-gray-600' disabled/>
                                    </div>
                                </div>
                                <div className="basis-3/4">
                                    {elements.format === 'Document PDF' && (
                                        <div className='max-w-11xl mx-auto'>
                                            <div className="aspect-[3/4] w-full rounded-lg overflow-hidden">
                                                {/* Use an iframe for native browser PDF preview.
                                                    The 'type="application/pdf"' and 'height/width' attributes are important.
                                                */}
                                                <iframe
                                                    src={ paths }
                                                    title="Aperçu du document PDF"
                                                    width="100%"
                                                    height="100%"
                                                    type="application/pdf"
                                                    className="w-full h-full"
                                                    style={{ border: 'none' }}
                                                >
                                                    {/* Fallback content for browsers that can't render the iframe */}
                                                    <p>Your browser does not support PDF viewing. <a href={elements.filepath} target="_blank" rel="noopener noreferrer">Download the PDF</a> instead.</p>
                                                </iframe>
                                            </div>
                                        </div>
                                    )}

                                    {elements.format === 'Document Papier' && (
                                        <div className='bg-slate-600 rounded-lg items-center justify-center w-full h-full'>
                                            <div className='flex flex-row gap-4 justify-center py-72'>
                                                <FileX2 className='text-center text-red-300' />
                                                <p className='text-gray-300 text-center'>
                                                    Document Physique
                                                </p>
                                            </div>
                                        </div>
                                    )}

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
