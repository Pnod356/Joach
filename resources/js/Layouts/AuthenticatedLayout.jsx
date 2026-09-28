import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    BellMinusIcon,
    ChevronDownIcon,
    LogOutIcon,
    SquarePenIcon,
    ListTodo,
    Settings2,
    ChartSplineIcon,
    ScrollTextIcon,
    UserRoundIcon,
    HardDriveDownloadIcon,
    NotebookIcon,
    SearchCheck,
    StickyNoteIcon,
    FolderInput,
    ShieldAlertIcon,
    Fingerprint,
    UserPlus2,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Toaster } from '@/Components/ui/sonner';


export default function AuthenticatedLayout({ children, hideHeader = false }) {
    const page = usePage();
    const user = page.props.auth.user;
    const { auth } = page.props;
    const userRoles = auth.roles;

    const getCurrentPath = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname || '/';
            return path.replace(/\/+$/, '') || '/';
        }

        return (page.url || '/').replace(/\/+$/, '') || '/';
    };

    const [currentPath, setCurrentPath] = useState(getCurrentPath);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        const syncPath = () => setCurrentPath(getCurrentPath());
        const handleNavigation = () => syncPath();

        syncPath();

        if (typeof router.on === 'function') {
            router.on('finish', handleNavigation);
            router.on('navigate', handleNavigation);
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', handleNavigation);
            window.addEventListener('pageshow', handleNavigation);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('popstate', handleNavigation);
                window.removeEventListener('pageshow', handleNavigation);
            }

            if (typeof router.off === 'function') {
                router.off('finish', handleNavigation);
                router.off('navigate', handleNavigation);
            }
        };
    }, [page.url]);

    const isActivePath = (href, exact = false) => {
        if (!href) return false;

        const normalizedHref = href.replace(/\/+$/, '') || '/';
        const normalizedPath = currentPath || '/';

        return exact
            ? normalizedPath === normalizedHref
            : normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
    };

    const isHomeActive = isActivePath(route('dashboard'), true) || currentPath === '/';
    const isCreationsActive = [
        route('typearchives.view'),
        route('emplacement.view'),
        route('groupeacces.view'),
        route('archives.view'),
        route('dossierrh.create'),
    ].some((href) => isActivePath(href));
    const isConsultationsActive = [
        route('public'),
        route('touteunite'),
        route('historique.index'),
    ].some((href) => isActivePath(href));
    const isServicesActive = isActivePath(route('services'), true);
    const isReglementationActive = [
        'documents/Loi_001_Regissant_Archives_Cameroun_24072024.pdf',
        'documents/Loi_2000-010_19-dec_Regissant_Archives_Cameroun.pdf',
        'documents/Loi_Cybersecurite_Criminalite.pdf',
        'documents/Loi_Commerce_Electronique.pdf',
        'documents/LOI_COMMUNICATIONS_ ELECTRONIQUES.pdf',
        'documents/Decret_Archive.pdf',
    ].some((href) => currentPath.includes(href));
    const isOrganigrammeActive = [
        'documents/ORGANIGRAMME_DGB.pdf',
        'documents/DECRET_066_PORTANT_ORGANISATION_MINFI_28022013_PR.pdf',
    ].some((href) => currentPath.includes(href));
    const isOrganisationActive = [
        'documents/Rapport_Audit_Archivage-Novembre-2019.pdf',
        'documents/Réseau_Archivage_DGB.pdf',
    ].some((href) => currentPath.includes(href));
    const isAdminActive = [
        route('password.requests'),
        route('suspicious.connections'),
        route('statistiques'),
        route('journal'),
        route('compte'),
        route('backup'),
    ].some((href) => isActivePath(href));

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-200">

            { !hideHeader && (
            <header className="border-b px-4 md:px-6 authenticated-layout">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#" className="text-foreground">
                                        <Link href={route('dashboard')}>
                                            <img src="images/head.png" alt="" className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200 rounded-full"/>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem className="md:hidden">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger className="hover:text-foreground">
                                        <BreadcrumbEllipsis />
                                        <span className="sr-only">Toggle menu</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('dashboard')}
                                                className={cn("w-full", isHomeActive && "font-semibold text-red-400 text-primary underline decoration-2 underline-offset-4")}
                                            >
                                                Accueil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="#">Projects</a>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbItem className="max-md:hidden text-white">
                                    <BreadcrumbLink
                                        href={route('dashboard')}
                                        className={cn("text-white", isHomeActive && "font-semibold text-yellow-300 underline decoration-2 underline-offset-4")}
                                    >
                                        Accueil
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="max-md:hidden">
                                    {" "}
                                    /{" "}
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn("h-auto p-0 hover:bg-transparent text-white", isCreationsActive && "text-yellow-300 underline decoration-2 underline-offset-4")}
                                            >
                                                <BreadcrumbLink>
                                                    Créations
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            { user.roles !== 'Super' && user.roles !== 'Admin' ?
                                                <span></span>
                                                :
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <SquarePenIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('typearchives.view')}>
                                                                Type d'archives
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            }

                                            <DropdownMenuSeparator />
                                            { user.roles !== 'Super' && user.roles !== 'Admin' ?
                                                <span></span>
                                                :
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <SquarePenIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('emplacement.view')}>
                                                                Emplacements
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            }

                                            <DropdownMenuSeparator />
                                            { user.roles !== 'Super' && user.roles !== 'Admin' ?
                                                <span></span>
                                                :
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <SquarePenIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('groupeacces.view')}>
                                                                Groupes d'accès
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            }

                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <SquarePenIcon size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href={route('archives.view')}>
                                                            Archives
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />
                                            { user.roles !== 'Super' && user.roles !== 'Admin' ?
                                                <span></span>
                                                :
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <UserPlus2 size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('dossierrh.create')}>
                                                                Nouveau Dossier RH
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            }
                                        </DropdownMenuContent>

                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn("h-auto p-0 hover:bg-transparent text-white", isConsultationsActive && "text-yellow-300 underline decoration-2 underline-offset-4")}
                                            >
                                                <BreadcrumbLink>
                                                    Consultations
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href={route('public')}>
                                                            Publiques
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <FolderInput size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href={route('touteunite')}>
                                                            Restreintes
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <StickyNoteIcon size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href={route('historique.index')}>
                                                            Historique
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className={cn("h-auto p-0 hover:bg-transparent text-white", isReglementationActive && "text-yellow-300 underline decoration-2 underline-offset-4")}>
                                                <BreadcrumbLink>
                                                    Réglementation Archives
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Loi_001_Regissant_Archives_Cameroun_24072024.pdf" target="_blank">
                                                            Loi sur les archives 2024
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Loi_2000-010_19-dec_Regissant_Archives_Cameroun.pdf" target="_blank">
                                                            Loi sur les archives 2000
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Loi_Cybersecurite_Criminalite.pdf" target="_blank">
                                                            Loi sur la Cybersécurité et Cybercriminalité
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Loi_Commerce_Electronique.pdf" target="_blank">
                                                            Loi sur le Commerce Électronique
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                             <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/LOI_COMMUNICATIONS_ ELECTRONIQUES.pdf" target="_blank">
                                                            Loi sur le Communication Électronique
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Decret_Archive.pdf" target="_blank">
                                                            Decret sur les archives
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className={cn("h-auto p-0 hover:bg-transparent text-white", isOrganigrammeActive && "text-yellow-300 underline decoration-2 underline-offset-4")}>
                                                <BreadcrumbLink>
                                                    Organigramme DGB
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/ORGANIGRAMME_DGB.pdf" target="_blank">
                                                            Organigramme DGB
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/DECRET_066_PORTANT_ORGANISATION_MINFI_28022013_PR.pdf" target="_blank">
                                                            Organigramme DGB Décret
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className={cn("h-auto p-0 hover:bg-transparent text-white", isOrganisationActive && "text-yellow-300 underline decoration-2 underline-offset-4")}>
                                                <BreadcrumbLink>
                                                    Organisation des archives de la DGB
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Rapport_Audit_Archivage-Novembre-2019.pdf" target="_blank">
                                                            Rapport d'audit des archives de la DGB
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ListTodo size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href="documents/Réseau_Archivage_DGB.pdf" target="_blank">
                                                            Reseau des référents des archives de la DGB
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                { user.roles !== 'Super' ?
                                    <BreadcrumbItem className="max-md:hidden text-white">
                                        <BreadcrumbLink
                                            href={route('services')}
                                            className={cn("text-white", isServicesActive && "font-semibold text-yellow-300 underline decoration-2 underline-offset-4")}
                                        >

                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    :
                                    <BreadcrumbItem className="max-md:hidden text-white">
                                        <BreadcrumbLink
                                            href={route('services')}
                                            className={cn("text-white", isServicesActive && "font-semibold text-yellow-300 underline decoration-2 underline-offset-4")}
                                        >
                                            Service Archives
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                }

                                <BreadcrumbSeparator> / </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn("h-auto p-0 hover:bg-transparent text-white", isAdminActive && "text-yellow-300 underline decoration-2 underline-offset-4")}
                                            >
                                                <BreadcrumbLink>
                                                    Administration
                                                </BreadcrumbLink>
                                                <ChevronDownIcon
                                                    size={16}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="max-w-64">
                                            <DropdownMenuGroup>
                                                { user.roles !== 'Super' ?
                                                    <span></span>
                                                    :
                                                    <DropdownMenuItem>
                                                        <ShieldAlertIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('password.requests')}>
                                                                Mot de passe oubli&eacute;
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                }
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                { user.roles !== 'Super' ?
                                                    <span></span>
                                                    :
                                                    <DropdownMenuItem>
                                                        <Fingerprint size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('suspicious.connections')}>
                                                                Connexion suspecte
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                }
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <ChartSplineIcon size={16} className="opacity-60" aria-hidden="true" />
                                                    <span>
                                                        <BreadcrumbLink href={route('statistiques')}>
                                                            Statistiques
                                                        </BreadcrumbLink>
                                                    </span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                { user.roles !== 'Super' && user.roles !== 'Admin' ?
                                                    <span></span>
                                                    :
                                                    <DropdownMenuItem>
                                                        <ScrollTextIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('journal')}>
                                                                Journal
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                }
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                { user.roles !== 'Super' ?
                                                    <span></span>
                                                    :
                                                    <DropdownMenuItem>
                                                        <UserRoundIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('compte')}>
                                                                Compte utilisateur
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                }
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            { user.roles !== 'Super' ?
                                                <span></span>
                                                :
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <HardDriveDownloadIcon size={16} className="opacity-60" aria-hidden="true" />
                                                        <span>
                                                            <BreadcrumbLink href={route('backup')}>
                                                                Sauvegarde
                                                            </BreadcrumbLink>
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            }
                                            <DropdownMenuSeparator />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Notification */}
                        <BellMinusIcon className="text-white" />
                        {/* User menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                    <Avatar>
                                        <AvatarImage src="images/placeholder.png" alt="Profile image" />
                                        <AvatarFallback>KK</AvatarFallback>
                                    </Avatar>
                                    <ChevronDownIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-64">
                                <DropdownMenuLabel className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium text-foreground">
                                        { user.name }
                                    </span>
                                    <span className="truncate text-xs font-normal text-muted-foreground">
                                        { user.email }
                                    </span>
                                    <span className="truncate text-xs font-normal text-muted-foreground">
                                        { user.roles }
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <SquarePenIcon size={16} className="opacity-60" aria-hidden="true" />
                                        <Link href={route('profile.edit')}>
                                            <span>Editer</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                                    <Link href={route('logout')} method='post'>
                                        <span>Deconnexion</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            ) }

            <main>{children}</main>
            <Toaster />
        </div>
    );
}
