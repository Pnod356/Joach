import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Edit, FileArchive, Download,
    CheckCircle2, AlertCircle, ExternalLink, FileText, Search, Filter,
    AlertCircleIcon
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SidebarCons from '@/Components/SidebarCons';

export default function ShowRh({ user, stats, piecesPossedees, piecesManquantes }) {
    const { flash } = usePage().props;
    // États pour la recherche et le filtre
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'validated', 'missing'
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Logique de filtrage combinée
    const filteredResults = useMemo(() => {
        let results = [];

        // 1. Fusionner ou choisir les listes selon le statut
        if (filterStatus === 'all' || filterStatus === 'validated') {
            results = [...results, ...piecesPossedees.map(p => ({ ...p, status: 'validated' }))];
        }
        if (filterStatus === 'all' || filterStatus === 'missing') {
            results = [...results, ...piecesManquantes.map(p => ({ ...p, status: 'missing' }))];
        }

        // 2. Appliquer la recherche textuelle
        return results.filter(piece =>
            piece.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, filterStatus, piecesPossedees, piecesManquantes]);

    const downloadAll = () => {
        window.location.href = route('dossierrh.download-all', user.id);
    };

    const downloadPiece = (pieceId) => {
        window.location.href = route('dossierrh.download-piece', [user.id, pieceId]);
    };

    const handleViewPdf = (e, fileUrl) => {
        e.preventDefault();

        setSelectedPdf(`/storage/${fileUrl}`);
    }

    return (
        <AuthenticatedLayout>
            <div className='flex flex-row justify-between'>
                <Head title={`Dossier de ${user.name}`} />

                <div className='basis-1/4'>
                    <SidebarCons />
                </div>

                <div className='basis-3/4 mr-10 py-6'>
                    <div className="max-w-7xl mx-auto p-4 lg:p-8">

                        {/* Header existant... */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <Link href={route('dossierrh.list')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-2 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500">Matricule : <span className="font-semibold text-gray-700">{user.matricule}</span> | {user.email}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={downloadAll} className="px-4 py-2 bg-green-400 hover:bg-green-200 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                                    <FileArchive className="w-4 h-4" /> Tout télécharger (.zip)
                                </button>
                            </div>
                        </div>

                        {/* Barre de recherche et Filtres */}
                        <div className="mb-6 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un document..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setFilterStatus('validated')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'validated' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Validés
                                </button>
                                <button
                                    onClick={() => setFilterStatus('missing')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'missing' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Manquants
                                </button>
                            </div>
                        </div>

                        {/* Grille de documents dynamique */}
                        <div className='flex flex-row gap-4'>
                            <div className='basis-1/4'>
                                {/* Grille de documents dynamique */}
                                <div className='flex flex-row gap-4 h-[800px]'> {/* Ajout d'une hauteur fixe pour que l'iframe soit visible */}
                                    <div className='overflow-y-auto pr-2'> {/* Scroll local pour la liste si elle est longue */}
                                        <div className="grid grid-cols-1 gap-4">
                                            {filteredResults.length > 0 ? (
                                                filteredResults.map((piece) => (
                                                    <div key={piece.id} className={`bg-white border ${piece.status === 'validated' ? 'border-green-200' : 'border-gray-200 border-dashed'} rounded-xl p-5 shadow-sm relative overflow-hidden`}>
                                                        {piece.status === 'validated' ? (
                                                            <>
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <h4 className="font-bold text-gray-800 text-sm">{piece.name}</h4>
                                                                    <button onClick={() => downloadPiece(piece.id)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg">
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {piece.files.map((file, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={(e) => handleViewPdf(e, file)}
                                                                            className={`w-full flex items-center gap-2 p-2 rounded text-sm transition-colors ${selectedPdf === `/storage/${file}` ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-blue-100 text-gray-700'}`}
                                                                        >
                                                                            <FileText className={`${selectedPdf === `/storage/${file}` ? 'text-white' : 'text-red-500'} w-4 h-4`} />
                                                                            <span className="truncate">Voir le document</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            /* ... (reste du code pour les documents manquants) */
                                                            <div className="flex items-start gap-3 opacity-70">
                                                                <AlertCircle className="text-red-400 w-5 h-5 mt-0.5" />
                                                                <div>
                                                                    <h4 className="font-bold text-gray-600 text-sm">{piece.name}</h4>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10">Aucun résultat</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='basis-3/4'>
                                {/* Section Iframe Dynamique */}
                                <div className='bg-gray-100 h-full rounded-xl overflow-hidden border border-gray-200'>
                                    {selectedPdf ? (
                                        <iframe
                                            src={selectedPdf}
                                            title="Aperçu du document"
                                            width="100%"
                                            height="100%"
                                            className="w-full h-full"
                                            style={{ border: 'none' }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                                            <p>Cliquez sur un document pour l'afficher ici</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Missing Pieces */}
                        {/*{piecesManquantes.length > 0 && (
                            <div className='py-4'>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 opacity-80">
                                    <AlertCircleIcon className="text-red-400 w-5 h-5" /> Pièces manquantes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {piecesManquantes.map((piece) => (
                                        <div key={piece.id} className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-4 opacity-70">
                                            <h4 className="text-sm font-bold text-gray-600">{piece.name}</h4>
                                            {piece.description && <p className="text-xs text-gray-500 mt-1">{piece.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
