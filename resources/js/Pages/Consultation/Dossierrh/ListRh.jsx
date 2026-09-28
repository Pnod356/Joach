import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import PaginationRh from '@/Components/PaginationRh';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarRh from '@/Components/SidebarRh'; // Correction du Sidebar pour rester cohérent avec DossierRh
import { ArrowLeft, ArrowUpDown, Edit, EyeIcon, Trash2Icon } from 'lucide-react';
import SidebarCons from '@/Components/SidebarCons';

export default function ListRh({ users, availablePieces, totalPiecesCount, filters }) {
    const { auth, flash } = usePage().props;
    const canDeletePersonnel = auth?.user?.roles === 'Super'
        || (auth?.user?.roles === 'Admin' && auth?.user?.departement === 'SDAG');
    const [search, setSearch] = useState(filters.search || '');
    const [pieceFilterId, setPieceFilterId] = useState(filters.pieceFilterId || '');
    const [pieceFilterStatus, setPieceFilterStatus] = useState(filters.pieceFilterStatus || '');
    const [sortDirection, setSortDirection] = useState('asc');

    // Ref pour éviter le premier rendu du useEffect
    const isFirstRender = useRef(true);

    // État pour la modale
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // --- LOGIQUE DE RECHERCHE CORRIGÉE ---
    const updateFilters = debounce((values) => {
        // Correction ici : on pointe vers 'dossierrh.list' et non 'dossierrh'
        router.get(route('dossierrh.list'), values, {
            preserveState: true,
            replace: true,
            preserveScroll: true // Optionnel : évite de remonter en haut de page à chaque frappe
        });
    }, 300);

    useEffect(() => {
        // Empêche la redirection au chargement initial de la page
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        updateFilters({ search, pieceFilterId, pieceFilterStatus });
    }, [search, pieceFilterId, pieceFilterStatus]);

    // --- LOGIQUE DE SUPPRESSION ---
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const executeDelete = () => {
        // Assurez-vous que cette route existe dans votre web.php
        router.delete(route('dossierrh.destroy', userToDelete.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const formatPersonnelName = (name) => (name || '').replaceAll('_', ' ');

    const sortedUsers = [...users.data].sort((a, b) => {
        const valueA = formatPersonnelName(a.name).toLocaleLowerCase();
        const valueB = formatPersonnelName(b.name).toLocaleLowerCase();

        return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    });

    return (
        <AuthenticatedLayout>
            <div className='flex flex-row justify-between'>
                <Head title="Liste du personnel" />

                <div className='basis-1/4'>
                    <SidebarCons />
                </div>

                <div className='basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6'>
                    <div className="p-6 rounded-2xl min-h-screen shadow-sm">

                        {flash.message && (
                            <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
                                <i className="fas fa-check-circle"></i> {flash.message}
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header & Filtres */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    <i className="fas fa-users text-blue-500 mr-2"></i> Liste du personnel
                                </h3>
                                <div className="flex gap-3">
                                    <Link href={route('dossierrh')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-bold flex items-center gap-2">
                                        <ArrowLeft size={20} className="text-gray-600" />
                                        Retour à la liste
                                    </Link>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-b">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher nom ou matricule..."
                                    className="border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg p-2 text-sm outline-none transition-all"
                                />
                                <select
                                    value={pieceFilterId}
                                    onChange={(e) => setPieceFilterId(e.target.value)}
                                    className="border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg p-2 text-sm outline-none cursor-pointer"
                                >
                                    <option value="">-- Filtrer par pièce --</option>
                                    {availablePieces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <select
                                    value={pieceFilterStatus}
                                    onChange={(e) => setPieceFilterStatus(e.target.value)}
                                    disabled={!pieceFilterId}
                                    className="border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg p-2 text-sm outline-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">-- Statut --</option>
                                    <option value="has">✔️ Dossier avec cette pièce</option>
                                    <option value="missing">❌ Dossier sans cette pièce</option>
                                </select>
                            </div>

                            {/* Tableau */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                                        <tr>
                                            <th className="px-6 py-4">Matricule</th>
                                            <th className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                                    className="flex items-center gap-2 font-bold text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    Nom et Prénom
                                                    <ArrowUpDown size={14} />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4">Progression</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedUsers.length > 0 ? sortedUsers.map(user => {
                                            const validatedCount = user.pieces.filter(p => {
                                                if (p.status !== 'Obligatoire') return false;
                                                try {
                                                    const paths = typeof p.pivot.file_paths === 'string'
                                                        ? JSON.parse(p.pivot.file_paths || '[]')
                                                        : p.pivot.file_paths;
                                                    return Array.isArray(paths) && paths.length > 0;
                                                } catch (e) { return false; }
                                            }).length;

                                            const percentage = totalPiecesCount > 0 ? Math.round((validatedCount / totalPiecesCount) * 100) : 0;
                                            const color = percentage === 100 ? 'bg-green-500' : (percentage >= 50 ? 'bg-yellow-400' : 'bg-red-500');

                                            return (
                                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4 font-mono font-bold text-gray-700">{user.matricule}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-800">{formatPersonnelName(user.name)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-[10px] font-bold mb-1 flex justify-between text-gray-500">
                                                            <span>{percentage}%</span>
                                                            <span>{validatedCount}/{totalPiecesCount} pièces</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div className={`${color} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        <Link href={route('dossierrh.show', user.id)} title="Voir" className="p-2 text-blue-600 hover:text-blue-600 transition-colors">
                                                            <EyeIcon className='w-5 h-5' />
                                                        </Link>
                                                        <Link href={route('dossierrh.edit', user.id)} title="Modifier" className="p-2 text-yellow-600 hover:text-yellow-600 transition-colors">
                                                            <Edit className='w-5 h-5' />
                                                        </Link>
                                                        {canDeletePersonnel && (
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmDelete(user)}
                                                                title="Supprimer"
                                                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                                            >
                                                                <Trash2Icon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                                                    Aucun résultat trouvé pour cette recherche.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <span className="text-sm text-gray-500">
                                            Affichage de <b>{users.from || 0}</b> à <b>{users.to || 0}</b> sur <b>{users.total}</b> dossiers
                                        </span>
                                        <PaginationRh links={users.links} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal de suppression */}
                        {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-red-100">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-exclamation-triangle text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-black mb-2 text-center text-gray-800">Confirmer la suppression ?</h3>
                                    <p className="text-gray-500 text-center text-sm mb-6">
                                        Êtes-vous sûr de vouloir supprimer le personnel <span className="font-bold text-gray-800">{userToDelete?.name}</span> ? Les pièces jointes seront conservées.
                                    </p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">Annuler</button>
                                        <button onClick={executeDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
