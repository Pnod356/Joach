import { Link } from '@inertiajs/react'
import { FileEditIcon, HandCoinsIcon, ListChecksIcon, ListTodoIcon, Share2Icon, UsersRoundIcon } from 'lucide-react'
import React from 'react'

export default function SidebarRep() {
  const currentRoute = route().current()

  const isActive = (routes = []) => routes.includes(currentRoute)
  const linkClass = (active = false) => `relative flex flex-row items-center h-11 focus:outline-none transition-all duration-200 ease-in-out ${active
    ? 'bg-blue-50 text-blue-700 border-l-4 border-indigo-500 shadow-sm ring-1 ring-blue-100'
    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500'} pr-6`

  return (
    <div className='overflow-hidden flex items-center justify-center basis-32'>
        <div className="flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
            <div className="fixed flex flex-col top-30 left-0 w-80 bg-green-200 h-full border-r">
                <div className="flex items-center justify-center h-14 border-b border-blue-300">
                    <div className="uppercase text-sm text-center">
                        Repertoires
                    </div>
                </div>

                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <Link href={route('vosunites.unitview')} className={linkClass(isActive(['vosunites.unitview']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListTodoIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                S-DAG
                            </span>
                        </Link>
                        <Link href={route('autremembre')} className={linkClass(isActive(['autremembre']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListTodoIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                SGCCC
                            </span>
                        </Link>
                        <Link href={route('touteunite')} className={linkClass(isActive(['touteunite']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListTodoIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                SGDB
                            </span>
                        </Link>
                        <Link href={route('repertoires')} className={linkClass(isActive(['repertoires']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                Service d'Ordre
                            </span>
                        </Link>
                        <Link href={route('senddoc')} className={linkClass(isActive(['senddoc']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <Share2Icon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DREF
                            </span>
                        </Link>
                        <Link href={route('receivedoc')} className={linkClass(isActive(['receivedoc']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <HandCoinsIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DCOB
                            </span>
                        </Link>
                        <Link href={route('archivbygroup')} className={linkClass(isActive(['archivbygroup']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <UsersRoundIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DI
                            </span>
                        </Link>
                        <Link href={route('archivbytype')} className={linkClass(isActive(['archivbytype']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DPC
                            </span>
                        </Link>
                        <Link href={route('repertoires')} className={linkClass(isActive(['repertoires']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DPB
                            </span>
                        </Link>
                        <Link href={route('repertoires')} className={linkClass(isActive(['repertoires']))}>
                            <span className="inline-flex justify-center items-center ml-4">
                                <ListChecksIcon size={15} />
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">
                                DDPP
                            </span>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}
