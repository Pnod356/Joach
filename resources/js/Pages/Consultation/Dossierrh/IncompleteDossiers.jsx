import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarCons from '@/Components/SidebarCons';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle, Eye } from 'lucide-react';

export default function IncompleteDossiers({ incompleteUsers, totalPiecesCount }) {
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
                                    {incompleteUsers.length} personnel concerné{incompleteUsers.length > 1 ? 's' : ''}
                                </p>
                            </div>
                            <Link href={route('dossierrh')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-bold flex items-center gap-2">
                                <ArrowLeft size={20} className="text-gray-600" />
                                Retour
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Matricule</th>
                                        <th className="px-6 py-4">Nom et Prénom</th>
                                        <th className="px-6 py-4">État</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {incompleteUsers.length > 0 ? incompleteUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-700">{user.matricule}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
