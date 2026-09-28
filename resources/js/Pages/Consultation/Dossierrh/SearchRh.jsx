import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarCons from '@/Components/SidebarCons';
import PaginationRh from '@/Components/PaginationRh';
import { Eye, Edit, Search, ArrowLeft, Trash2 } from 'lucide-react';

export default function SearchRh({ users, totalPiecesCount, filters }) {
    const { auth } = usePage().props;
    const canDeletePersonnel = auth?.user?.roles === 'Super'
        || (auth?.user?.roles === 'Admin' && auth?.user?.departement === 'SDAG');
    const formatPersonnelName = (name) => (name || '').replaceAll('_', ' ');

    const handleDelete = (user) => {
        if (window.confirm(`Supprimer le dossier de ${formatPersonnelName(user.name)} ?`)) {
            router.delete(route('dossierrh.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className='flex flex-row justify-between'>
                <Head title={`Recherche : ${filters.search}`} />

                <div className='basis-1/4'>
                    <SidebarCons />
                </div>

                <div className='basis-3/4 mr-10 py-6'>
                    <div className="flex items-center gap-4 mb-6">
                        <Link href={route('dossierrh.list')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800">Résultats de recherche</h2>
                            <p className="text-sm text-gray-500">Pour : <span className="font-bold text-blue-600">"{filters.search}"</span></p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Matricule</th>
                                        <th className="px-6 py-4">Nom et Prénom</th>
                                        <th className="px-6 py-4">Conformité</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.data.length > 0 ? users.data.map(user => {
                                        const validatedCount = user.pieces.length; // Calcul simplifié basé sur le retour controller
                                        const percentage = totalPiecesCount > 0 ? Math.round((validatedCount / totalPiecesCount) * 100) : 0;
                                        const color = percentage === 100 ? 'bg-green-500' : (percentage >= 50 ? 'bg-yellow-400' : 'bg-red-500');

                                        return (
                                            <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4 font-mono font-bold text-gray-700">{user.matricule}</td>
                                                <td className="px-6 py-4 font-medium text-gray-800">{formatPersonnelName(user.name)}</td>
                                                <td className="px-6 py-4 w-64">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div className={`${color} h-full transition-all`} style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-600">{percentage}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <Link href={route('dossierrh.show', user.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link href={route('dossierrh.edit', user.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all">
                                                        <Edit size={18} />
                                                    </Link>
                                                    {canDeletePersonnel && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(user)}
                                                            title="Supprimer"
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Search size={48} className="text-gray-200 mb-4" />
                                                    <p className="text-gray-400 italic">Aucun employé trouvé pour cette recherche.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {users.total > users.per_page && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Total : {users.total} résultats</span>
                                <PaginationRh links={users.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
