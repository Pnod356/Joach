import { Link, usePage } from '@inertiajs/react'
import { FolderOpen } from 'lucide-react'
import React from 'react'

export default function SidebarArchive() {
  const currentRoute = route().current()

  const isActive = (routes = []) => routes.includes(currentRoute)
  const linkClass = (active = false) => `relative flex flex-row items-center h-11 focus:outline-none transition-all duration-200 ease-in-out ${active
    ? 'bg-blue-50 text-blue-700 border-l-4 border-indigo-500 shadow-sm ring-1 ring-blue-100'
    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500'} pr-6`

  return (
    <div className='overflow-hidden flex items-center justify-center basis-32'>
        <div className="flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
            <div className="fixed flex flex-col top-30 left-0 w-64 bg-green-200 h-full border-r">
                <div className="flex items-center justify-center h-14 border-b border-blue-300">
                    <div className="uppercase text-sm text-center">
                        Service d'Archives
                    </div>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Communications R&eacute;ussites
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Communications Sans Suite
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Transferts
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Eliminations
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Rapports
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Cadre de classement
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Reglement interieur
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Procedures d'archivage
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Procedures de nommages
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Procedures de tri archives intermediaires
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Calendrier de conservation
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Instruments de recherche
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Tableau de concordance
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Registres
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Etiquettes
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Bordereau de communication
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Bordereau de transfert
                            </span>
                        </Link>
                        <Link href={route('services')} className={linkClass(isActive(['services']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <FolderOpen size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Model PV Elimination
                            </span>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
