import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarCons from '@/Components/SidebarCons';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import PaginationRh from '@/Components/PaginationRh';
import { ArrowLeft, AlertTriangle, ArrowUpDown, Download, Eye, Search, SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function IncompleteDossiers({ incompleteUsers, totalPiecesCount, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [completion, setCompletion] = useState(filters.completion || '');
    const [sortDirection, setSortDirection] = useState('asc');
    const isFirstRender = useRef(true);

    const updateFilters = debounce((values) => {
        router.get(route('dossierrh.incomplets'), values, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, 300);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        updateFilters({ search, completion });
    }, [search, completion]);

    const handleExport = () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set('search', search.trim());
        if (completion) params.set('completion', completion);

        const query = params.toString();
        window.location.href = `${route('dossierrh.incomplets.export')}${query ? `?${query}` : ''}`;
    };

    const formatPersonnelName = (name) => (name || '').replaceAll('_', ' ');
    const sortedUsers = [...incompleteUsers.data].sort((a, b) => {
        const nameA = formatPersonnelName(a.name).toLocaleLowerCase();
        const nameB = formatPersonnelName(b.name).toLocaleLowerCase();

        return sortDirection === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    return (
        <AuthenticatedLayout>
            <div className="flex flex-row justify-between">
                <Head title="Dossiers incomplets" />

                <div className="basis-1/4">
                    <SidebarCons />
                </div>

                <div className="basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <AlertTriangle className="text-amber-500" size={20} />
                                    Dossiers incomplets
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {incompleteUsers.total} personnel{incompleteUsers.total > 1 ? 's' : ''} concerné{incompleteUsers.total > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleExport}
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                >
                                    <Download size={17} /> Exporter Excel
                                </button>
                                <Link href={route('dossierrh.list')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-bold flex items-center gap-2">
                                    <ArrowLeft size={20} className="text-gray-600" />
                                    Retour
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-b border-gray-100 flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Nom, prénom ou matricule..."
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="relative md:w-64">
                                <SlidersHorizontal size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={completion}
                                    onChange={(event) => setCompletion(event.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="">Tous les incomplets</option>
                                    <option value="zero">0 % complété</option>
                                    <option value="low">1 à 49 %</option>
                                    <option value="medium">50 à 79 %</option>
                                    <option value="high">80 à 99 %</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Matricule</th>
                                        <th className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => setSortDirection((previous) => previous === 'asc' ? 'desc' : 'asc')}
                                                className="flex items-center gap-2 font-bold text-gray-600 hover:text-amber-600 transition-colors"
                                            >
                                                Nom et Prénom
                                                <ArrowUpDown size={14} />
                                                <span className="sr-only">
                                                    {sortDirection === 'asc' ? 'Tri décroissant' : 'Tri croissant'}
                                                </span>
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">État</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedUsers.length > 0 ? sortedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-700">{user.matricule}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{formatPersonnelName(user.name)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {user.missing_count}/{totalPiecesCount} pièce(s) manquante(s)
                                                <div className="text-xs text-amber-600 mt-1">{user.percentage}% complété</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('dossierrh.show', user.id)} className="p-2 text-blue-600 hover:text-blue-700 transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                                                Aucun dossier incomplet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-3">
                            <span className="text-sm text-gray-500">
                                Affichage de <b>{incompleteUsers.from || 0}</b> à <b>{incompleteUsers.to || 0}</b> sur <b>{incompleteUsers.total}</b> dossiers
                            </span>
                            <PaginationRh links={incompleteUsers.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
