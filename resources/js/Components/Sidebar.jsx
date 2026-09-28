import { Link, usePage } from '@inertiajs/react'
import { FileEditIcon, HomeIcon, UserPlus2 } from 'lucide-react'
import React from 'react'

export default function Sidebar() {
  const user = usePage().props.auth.user
  const currentRoute = route().current()

  const isActive = (routes = []) => routes.includes(currentRoute)
  const linkClass = (active = false) => `relative flex flex-row items-center h-11 focus:outline-none transition-all duration-200 ease-in-out ${active
    ? 'bg-blue-50 text-blue-700 border-l-4 border-indigo-500 shadow-sm ring-1 ring-blue-100'
    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500'} pr-6`

  return (
    <div className='h-screen authenticated-layout text-white mt-5 w-80 sticky top-0'>
        <div className='justify-center items-center border-r'>
            <div className='h-14 border-b border-blue-300'>
                <div className='uppercase tracking-wide truncate text-sm text-center justify-center py-6'>
                    Creations
                </div>
            </div>

            <div className="overflow-y-auto overflow-x-hidden flex-grow">
                <ul className="flex flex-col py-4 space-y-1 text-white">
                    <Link href={route('dashboard')} className={linkClass(isActive(['dashboard']))}>
                        <span className="inline-flex justify-center items-center ml-4">
                            <HomeIcon size={15} />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                            Accueil
                        </span>
                    </Link>

                    {user?.roles !== 'User' && (
                        <Link href={route('typearchives.view')} className={linkClass(isActive(['typearchives.view']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FileEditIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Nouveau Type d'archive
                            </span>
                        </Link>
                    )}

                    {user?.roles !== 'User' && (
                        <Link href={route('emplacement.view')} className={linkClass(isActive(['emplacement.view']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FileEditIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Nouvel Emplacement
                            </span>
                        </Link>
                    )}

                    {user?.roles !== 'User' && (
                        <Link href={route('groupeacces.view')} className={linkClass(isActive(['groupeacces.view']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FileEditIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Nouveau Groupe d'accès
                            </span>
                        </Link>
                    )}

                    <Link href={route('archives.view')} className={linkClass(isActive(['archives.view']))}>
                        <span className="inline-flex justify-center items-center ml-4">
                            <FileEditIcon size={15} />
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                            Nouvelle Archive
                        </span>
                    </Link>

                    {user?.roles === 'Super' && (
                        <Link href={route('dossierrh.create')} className={linkClass(isActive(['dossierrh.create']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <UserPlus2 size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Nouveau Dossier du personnel
                            </span>
                        </Link>
                    )}

                    {user?.departement === 'S-DAG' && (
                        <Link href={route('dossierrh.create')} className={linkClass(isActive(['dossierrh.create']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <UserPlus2 size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Nouveau Dossier du personnel
                            </span>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    </div>
  )
}
