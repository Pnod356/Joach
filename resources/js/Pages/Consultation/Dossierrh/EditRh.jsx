import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarCons from '@/Components/SidebarCons';
import { toast } from 'sonner';

export default function EditRh({ user, availablePieces, existingPieces }) {
    // Formulaire 1 : Infos Générales
    const infoForm = useForm({
        name: user.name,
        matricule: user.matricule,
    });

    // Formulaire 2 : Pièces (Logique complexe)
    const piecesForm = useForm({
        selectedPieces: Object.keys(existingPieces).reduce((acc, id) => ({ ...acc, [id]: true }), {}),
        existingPieces: existingPieces, // { pieceId: [paths] }
        newPieceFiles: {},              // { pieceId: [File objects] }
        filesToDelete: [],
    });

    // --- Handlers ---

    const submitInfo = (e) => {
        e.preventDefault();

        infoForm.patch(route('dossierrh.updateInfo', user.id), {
            onSuccess: () => toast.success('Informations personnelles mises à jour.'),
        });
    };

    const handleFileChange = (pieceId, files) => {
        piecesForm.setData('newPieceFiles', {
            ...piecesForm.data.newPieceFiles,
            [pieceId]: Array.from(files)
        });
    };

    const stageForDeletion = (pieceId, index) => {
        const path = piecesForm.data.existingPieces[pieceId][index];

        // Ajouter à la corbeille
        const newFilesToDelete = [...piecesForm.data.filesToDelete, path];

        // Retirer de la vue locale
        const updatedExisting = { ...piecesForm.data.existingPieces };
        updatedExisting[pieceId] = updatedExisting[pieceId].filter((_, i) => i !== index);

        piecesForm.setData({
            ...piecesForm.data,
            existingPieces: updatedExisting,
            filesToDelete: newFilesToDelete
        });
    };

    const submitPieces = (e) => {
        e.preventDefault();

        // Inertia nécessite _method: 'PUT' pour les uploads de fichiers en POST
        piecesForm.post(route('dossierrh.updatePieces', user.id), {
            forceFormData: true,
            onSuccess: () => {
                piecesForm.reset('newPieceFiles');
                toast.success('Le dossier a été mis à jour avec succès.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className='flex flex-row justify-between'>
                <Head title={`Éditer ${user.name}`} />

                <div className='basis-1/4'>
                    <SidebarCons />
                </div>

                <div className='basis-3/4 mr-10 py-6'>
                    <div className="max-w-7xl mx-auto p-4 lg:p-8">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Édition du dossier</h2>
                                <p className="text-gray-500 text-sm">Employé : {user.name} ({user.matricule})</p>
                            </div>
                            <Link href={route('dossierrh.list')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                Retour à la liste
                            </Link>
                        </div>

                        {/* FORMULAIRE 1 : INFOS */}
                        <form onSubmit={submitInfo} className="mb-10">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Nom et Prénom</label>
                                        <input
                                            type="text"
                                            value={infoForm.data.name}
                                            onChange={e => infoForm.setData('name', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Matricule</label>
                                        <input
                                            type="text"
                                            value={infoForm.data.matricule}
                                            onChange={e => infoForm.setData('matricule', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 text-right">
                                    <button disabled={infoForm.processing} className="bg-green-200 text-white px-4 py-2 rounded-lg">
                                        {infoForm.processing ? 'Enregistrement...' : 'Enregistrer les infos'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* FORMULAIRE 2 : PIÈCES */}
                        <form onSubmit={submitPieces}>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {availablePieces.map(piece => (
                                        <div key={piece.id} className={`border rounded-xl p-5 ${piecesForm.data.selectedPieces[piece.id] ? 'bg-blue-50/30 border-blue-400' : 'bg-gray-50'}`}>
                                            <label className="flex gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!piecesForm.data.selectedPieces[piece.id]}
                                                    onChange={e => piecesForm.setData('selectedPieces', {
                                                        ...piecesForm.data.selectedPieces,
                                                        [piece.id]: e.target.checked
                                                    })}
                                                    className="rounded text-blue-600"
                                                />
                                                <span className="font-bold text-sm">{piece.name}</span>
                                            </label>

                                            {piecesForm.data.selectedPieces[piece.id] && (
                                                <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                                    {/* Fichiers existants */}
                                                    {piecesForm.data.existingPieces[piece.id]?.map((path, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-white p-2 mb-2 rounded border text-xs">
                                                            <span className="truncate w-32">{path.split('/').pop()}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => stageForDeletion(piece.id, idx)}
                                                                className="text-red-500"
                                                            > Supprimer </button>
                                                        </div>
                                                    ))}

                                                    {/* Input Upload */}
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={e => handleFileChange(piece.id, e.target.files)}
                                                        className="text-xs mt-2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-4 flex justify-between items-center">
                                    <span className="text-amber-600 text-sm">
                                        {piecesForm.data.filesToDelete.length > 0 && `${piecesForm.data.filesToDelete.length} fichier(s) à supprimer`}
                                    </span>
                                    <button disabled={piecesForm.processing} className="bg-green-300 text-white px-4 py-2 rounded-lg">
                                        Valider les pièces
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

