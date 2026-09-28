import SidebarCons from '@/Components/SidebarCons'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    ArrowUpDown,
    Bell,
    CheckCircle2,
    Clock,
    Download,
    Edit,
    ExternalLink,
    Eye,
    FileArchive,
    FileArchiveIcon,
    FileIcon,
    FileText,
    FolderMinus,
    FolderOpen,
    List,
    PieChart,
    Plus,
    Search,
    ShieldCheck,
    Users
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StatCard from '@/Components/StatCard';
import EmptyState from '@/Components/EmptyState';

export default function DossierRh({ stats, worstDossiers, recentUsers }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDownloadAll = () => {
        // Redirection vers la route de téléchargement
        window.location.href = route('dossierrh.download-all', user.id);
    };

    const handleDownloadPiece = (pieceId) => {
        window.location.href = route('dossierrh.download-piece', { user: user.id, piece: pieceId });
    };

    const getColorClass = (pct) => {
        if (pct === 100) return 'bg-green-500';
        if (pct >= 50) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            // On utilise maintenant 'dossierrh.search' au lieu de 'dossierrh.list'
            router.get(route('dossierrh.search'), { search: searchTerm });
        }
    };

    return (
        <AuthenticatedLayout>
            <div className='flex flex-row justify-between'>
                <Head title="Dossiers RH" />

                <div className='basis-1/4'>
                    <SidebarCons />
                </div>

                {/* Grille de stats */}
                <div className='basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6'>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-200 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                                Dossiers du Personnel (RH)
                            </h1>
                            <p className="text-blue-200 text-sm md:text-base">
                                Gérez et suivez l'évolution des dossiers de votre personnel en temps réel.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full lg:w-auto shrink-0 gap-3">
                            {/* Formulaire de recherche */}
                            <form onSubmit={handleSearch} className="relative group flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-600 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nom ou matricule..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-sm text-gray-500 placeholder:text-gray-500 focus:bg-white focus:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </form>

                            <Link href={route('dossierrh.list')} className="px-5 py-2.5 bg-white/20 hover:bg-white/20 border border-white/30 rounded-xl font-medium backdrop-blur-sm transition-all text-sm flex items-center gap-2">
                                <List size={18} /> Tous les dossiers
                            </Link>

                            <button onClick={() => window.location.href = route('dossierrh.downloadGeneralReport')} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium backdrop-blur-sm transition-all text-sm flex items-center gap-2">
                                <FileText size={18} /> Rapport
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 py-6 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Users} label="Total Personnel" value={stats.totalUsers} />
                        <StatCard icon={ShieldCheck} label="Dossiers à jour" value={stats.completeDossiersCount} />
                        <StatCard icon={AlertTriangle} label="Incomplets" value={stats.incompleteDossiersCount} />
                        <StatCard
                            icon={PieChart}
                            label="Conformité"
                            value={`${stats.complianceRate}%`}
                            subtitle="globale"
                        />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* Dossiers Prioritaires */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Bell className="text-amber-500" size={20} /> Dossiers Incomplets
                            </h3>
                            <Link href={route('dossierrh.incomplets')} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                Voir plus
                            </Link>
                        </div>
                        <div className="p-6 flex-1">
                            {worstDossiers.length > 0 ? (
                            <div className="space-y-4">
                                {worstDossiers.map((data) => (
                                    <div key={data.id} className={`flex items-center justify-between p-4 rounded-xl border ${data.percentage === 0 ? 'bg-red-50/30 border-red-100' : 'bg-gray-50 border-gray-100'} transition-colors hover:shadow-sm`}>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{data.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Matricule: {data.matricule}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold text-gray-800">{data.percentage}% complété</p>
                                                <p className="text-xs text-red-500">{data.missing_count} pièce(s) manquante(s)</p>
                                            </div>
                                            <Link href={route('dossierrh.show', data.id)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shrink-0">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            ) : (
                                <EmptyState message="Aucun dossier incomplet." submessage="Tout votre personnel est en règle !" />
                            )}
                        </div>
                    </div>

                    {/* Récemment embauchés */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="text-blue-500" size={20} />
                                Récemment enregistrés
                            </h3>
                            <Link href={route('dossierrh')} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                Voir tout
                            </Link>
                        </div>
                        <div className="flex-1">
                            {recentUsers.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {recentUsers.map((user) => (
                                        <li key={user.id} className="p-4 sm:px-6 hover:bg-blue-50/30 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 font-bold shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{user.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Ajouté le {user.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={route('dossierrh.show', user.id)} className="p-2 text-gray-400 hover:text-blue-600">
                                                    <Eye size={18}/>
                                                </Link>
                                                <Link href={route('dossierrh.edit', user.id)} className="p-2 text-gray-400 hover:text-yellow-600">
                                                    <Edit size={18}/>
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                ) : (
                                    <EmptyState message="Aucun employé enregistré." icon={<Users size={48} className="text-gray-200 mb-3" />} />
                                )
                            }
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
