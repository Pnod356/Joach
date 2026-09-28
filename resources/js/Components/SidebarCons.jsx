import { Link, usePage } from '@inertiajs/react'
import { HandCoinsIcon, HomeIcon, SearchIcon, UserCircle2, DollarSign, FolderClockIcon, Share2Icon, UsersRoundIcon } from 'lucide-react'
import React from 'react'

export default function SidebarCons() {
    const user = usePage().props.auth.user;
    const currentRoute = route().current();

    const isActive = (routes = []) => routes.includes(currentRoute);
    const linkClass = (active = false) => `relative flex flex-row items-center h-11 focus:outline-none transition-all duration-200 ease-in-out ${active
        ? 'bg-white text-blue-700 border-l-4 border-indigo-500 shadow-sm ring-1 ring-blue-100'
        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500'} pr-6`;

    return (
        <div className='h-screen authenticated-layout mt-5 w-80 sticky top-0'>
            <div className='justify-center items-center border-r'>
                <div className='h-14 border-b border-blue-300'>
                    <div className='uppercase tracking-wide truncate text-sm text-center justify-center py-6'>
                        Consultations Restreintes
                    </div>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1 text-white">
                        <Link href={route('dashboard')} className={linkClass(isActive(['dashboard']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <HomeIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                Accueil
                            </span>
                        </Link>

                        <Link href={route('touteunite')} className={linkClass(isActive(['touteunite']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <SearchIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                Recherche
                            </span>
                        </Link>

                        { user.roles !== 'Super' ?
                            <span></span>
                            :
                            <Link href={route('archivbygroup')} className={linkClass(isActive(['archivbygroup']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <UsersRoundIcon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Archives par unité
                                </span>
                            </Link>
                        }

                        {user?.roles !== 'Super' && (
                            <Link href={route('send.view')} className={linkClass(isActive(['send.view']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Share2Icon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Partages Sortants
                                </span>
                            </Link>
                        )}

                        {user?.roles !== 'Super' && (
                            <Link href={route('incoming')} className={linkClass(isActive(['incoming']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HandCoinsIcon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Partages Entrants
                                </span>
                            </Link>
                        )}

                        {user?.roles === 'Super' && (
                            <Link href={route('receivedoc')} className={linkClass(isActive(['receivedoc']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HandCoinsIcon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Partages
                                </span>
                            </Link>
                        )}

                        {user?.roles === 'Super' && (
                            <Link href={route('dpa.view')} className={linkClass(isActive(['dpa.view', 'dpa.entities', 'dpa.details', 'administration.details', 'epa.details', 'ctd.details']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <FolderClockIcon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dossier Permanent Administration
                                </span>
                            </Link>
                        )}

                        {user?.roles === 'Super' && (
                            <Link href={route('dossierrh')} className={linkClass(isActive(['dossierrh', 'dossierrh.list', 'dossierrh.incomplets', 'dossierrh.create', 'dossierrh.show', 'dossierrh.edit']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <UserCircle2 size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dossier du Personnel (RH)
                                </span>
                            </Link>
                        )}

                        {user?.roles === 'Super' && (
                            <Link href={route('dette.view')} className={linkClass(isActive(['dette.view', 'dette.details', 'dette.entity.details']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <DollarSign size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dette flottante
                                </span>
                            </Link>
                        )}

                        {user?.departement === 'DPC' && user?.departement === 'DCOB' && (
                            <Link href={route('dpa.view')} className={linkClass(isActive(['dpa.view', 'dpa.entities', 'dpa.details', 'administration.details', 'epa.details', 'ctd.details']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <FolderClockIcon size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dossier Permanent Administration
                                </span>
                            </Link>
                        )}

                        {user?.departement === 'S-DAG' && (
                            <Link href={route('dossierrh')} className={linkClass(isActive(['dossierrh', 'dossierrh.list', 'dossierrh.incomplets', 'dossierrh.create', 'dossierrh.show', 'dossierrh.edit']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <UserCircle2 size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dossier du Personnel (RH)
                                </span>
                            </Link>
                        )}

                        {user?.departement === 'DPC' && user?.departement === 'DCOB' && (
                            <Link href={route('dette.view')} className={linkClass(isActive(['dette.view', 'dette.details', 'dette.entity.details']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <DollarSign size={15} />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate font-semibold">
                                    Dette flottante
                                </span>
                            </Link>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    );
}
