import { Link, usePage } from '@inertiajs/react'
import { FileEditIcon, HandCoinsIcon, ListChecksIcon, ListTodoIcon, Share2Icon, UsersRoundIcon, HomeIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function SidebarCons() {
    const user = usePage().props.auth.user;
    const { auth } = usePage().props;
    const userRoles = auth.roles;
    const currentRoute = route().current()

    const isActive = (routes = []) => routes.includes(currentRoute)
    const linkClass = (active = false) => `relative flex flex-row items-center h-11 focus:outline-none transition-all duration-200 ease-in-out ${active
        ? 'bg-blue-50 text-blue-700 border-l-4 border-indigo-500 shadow-sm ring-1 ring-blue-100'
        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500'} pr-6`

  return (
    <div className='hidden md:flex items-center justify-center'>
        <div className="flex flex-col flex-auto flex-shrink-0 antialiased bg-transparent text-gray-800">
            <div className="fixed flex flex-col top-0 left-0 w-70 bg-green-200 h-full border-r">
                <div className="flex items-center justify-center h-14 border-b border-blue-300">
                    <div className="uppercase text-xl text-center">
                        Consultations Restreintes
                    </div>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <Link href={route('dashboard')} className={linkClass(isActive(['dashboard']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <HomeIcon size={15} />
                            </span>
                            <span className="ml-2 text-xl tracking-wide truncate">
                                Accueil
                            </span>
                        </Link>

                        <Link href={route('touteunite')} className={linkClass(isActive(['touteunite']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListTodoIcon size={15} />
                            </span>
                            <span className="ml-2 text-xl tracking-wide truncate">
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
                                <span className="ml-2 text-xl tracking-wide truncate">
                                    Archives par Service/Direction
                                </span>
                            </Link>
                        }

                        {user?.roles !== 'Super' && (
                            <Link href={route('send.view')} className={linkClass(isActive(['send.view']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <Share2Icon size={15} />
                                </span>
                                <span className="ml-2 text-xl tracking-wide truncate">
                                    Partages Sortants
                                </span>
                            </Link>
                        )}

                        {user?.roles !== 'Super' && (
                            <Link href={route('receivedoc')} className={linkClass(isActive(['receivedoc']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HandCoinsIcon size={15} />
                                </span>
                                <span className="ml-2 text-xl tracking-wide truncate">
                                    Partages Entrants
                                </span>
                            </Link>
                        )}

                        {user?.roles === 'Super' && (
                            <Link href={route('receivedoc')} className={linkClass(isActive(['receivedoc']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HandCoinsIcon size={15} />
                                </span>
                                <span className="ml-2 text-xl tracking-wide truncate">
                                    Partages
                                </span>
                            </Link>
                        )}

                        {user?.departement !== 'DPC' && (
                            <Link href={route('dpa.view')} className={linkClass(isActive(['dpa.view', 'dpa.entities', 'dpa.details', 'administration.details', 'epa.details', 'ctd.details']))}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <ListChecksIcon size={15} />
                                </span>
                                <span className="ml-2 text-xl tracking-wide truncate">
                                    Dossier Permanent Administration
                                </span>
                            </Link>
                        )}

                        <Link href={route('dossierrh')} className={linkClass(isActive(['dossierrh', 'dossierrh.list', 'dossierrh.incomplets', 'dossierrh.create', 'dossierrh.show', 'dossierrh.edit']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-xl tracking-wide truncate">
                                Dossier du Personnel (RH)
                            </span>
                        </Link>

                        <Link href={route('dette.view')} className={linkClass(isActive(['dette.view', 'dette.details', 'dette.entity.details']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-xl tracking-wide truncate">
                                Dette flottante
                            </span>
                        </Link>
                    </ul>
                </div>

                <div className="p-4 border-t bg-green-100">
                    <div className="text-sm font-medium text-gray-700 truncate">{ user?.name }</div>
                    <div className="text-xs text-gray-600 mb-2 truncate">{ user?.roles }</div>
                    <div className="flex">
                        <Link href={route('profile.edit')} className="text-xs mr-2 text-blue-700">Profil</Link>
                        <Link href={route('logout')} method="post" className="ml-auto text-xs text-red-700">Déconnexion</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
