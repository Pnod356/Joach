import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

import {
    BellMinusIcon,
    ChevronDownIcon,
    LogOutIcon,
    SquarePenIcon,
    ListTodo,
    ChartSplineIcon,
    ScrollTextIcon,
    UserRoundIcon,
    HardDriveDownloadIcon,
    StickyNoteIcon,
    FolderInput,
    ShieldAlertIcon,
    Fingerprint,
    UserPlus2,
    BookOpenIcon,
    Building2Icon,
    FileTextIcon,
    ShieldIcon
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Toaster } from '@/Components/ui/sonner';
import ConsultationPageHeader from '@/Components/ConsultationPageHeader';
import { cn } from '@/lib/utils';

export default function AuthenticatedLayout({ children, hideHeader = false }) {
    const page = usePage();
    const user = page.props.auth.user;

    const isSuperOrAdmin = user.roles === 'Super' || user.roles === 'Admin';
    const isSuper = user.roles === 'Super';

    // --- Détection dynamique des états actifs par section ---
    const isAccueilActive = route().current('dashboard');

    const isCreationsActive =
        route().current('typearchives.*') ||
        route().current('emplacement.*') ||
        route().current('groupeacces.*') ||
        route().current('archives.*') ||
        route().current('dossierrh.create');

    const isConsultationsActive =
        route().current('public') ||
        route().current('touteunite') ||
        route().current('historique.*') ||
        route().current('consultations.*') ||
        route().current('dossierrh.*') ||
        route().current('dette.*') ||
        route().current('dpa.*');

    const isAdministrationActive =
        route().current('password.*') ||
        route().current('suspicious.*') ||
        route().current('statistiques') ||
        route().current('journal') ||
        route().current('compte') ||
        route().current('backup');

    return (
        <div className="min-h-screen overflow-x-hidden bg-gray-100 dark:bg-gray-900">

            {!hideHeader && (
            /* Ajout de 'sticky top-0 z-50' pour figer le header en haut de la page */
            <header className="sticky top-0 z-50 border-b bg-teal-800 text-white px-4 md:px-6 shadow-md">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* Logo & Navigation Principale */}
                    <div className="flex items-center gap-6">
                        <Link href={route('dashboard')} className="flex items-center gap-2">
                            <img src="/images/head.png" alt="Logo" className="h-9 w-auto rounded-full" />
                            <span className="font-bold text-lg hidden lg:inline-block">DGB Archives</span>
                        </Link>

                        {/* Navigation Supérieure */}
                        <nav className="hidden md:flex items-center gap-1">

                            {/* 1. Accueil */}
                            <Link
                                href={route('dashboard')}
                                className={cn(
                                    "px-3 py-2 text-base font-medium rounded-md transition hover:bg-teal-700",
                                    isAccueilActive
                                        ? "bg-teal-900 text-white font-semibold shadow-inner"
                                        : "text-teal-100"
                                )}
                            >
                                Accueil
                            </Link>

                            {/* 2. Créations */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "text-base gap-1 hover:bg-teal-700 hover:text-white",
                                            isCreationsActive
                                                ? "bg-teal-900 text-white font-semibold shadow-inner"
                                                : "text-teal-100"
                                        )}
                                    >
                                        Créations <ChevronDownIcon size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {isSuperOrAdmin && (
                                        <>
                                            <DropdownMenuItem asChild className={cn(route().current('typearchives.view') && "bg-accent font-medium")}>
                                                <Link href={route('typearchives.view')} className="flex items-center gap-2">
                                                    <SquarePenIcon size={16} className="opacity-70" />
                                                    Type d'archives
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className={cn(route().current('emplacement.view') && "bg-accent font-medium")}>
                                                <Link href={route('emplacement.view')} className="flex items-center gap-2">
                                                    <SquarePenIcon size={16} className="opacity-70" />
                                                    Emplacements
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className={cn(route().current('groupeacces.view') && "bg-accent font-medium")}>
                                                <Link href={route('groupeacces.view')} className="flex items-center gap-2">
                                                    <SquarePenIcon size={16} className="opacity-70" />
                                                    Groupes d'accès
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem asChild className={cn(route().current('archives.view') && "bg-accent font-medium")}>
                                        <Link href={route('archives.view')} className="flex items-center gap-2">
                                            <SquarePenIcon size={16} className="opacity-70" />
                                            Archives
                                        </Link>
                                    </DropdownMenuItem>
                                    {isSuperOrAdmin && (
                                        <DropdownMenuItem asChild className={cn(route().current('dossierrh.create') && "bg-accent font-medium")}>
                                            <Link href={route('dossierrh.create')} className="flex items-center gap-2">
                                                <UserPlus2 size={16} className="opacity-70" />
                                                Nouveau Dossier RH
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 3. Consultations */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "text-base gap-1 hover:bg-teal-700 hover:text-white",
                                            isConsultationsActive
                                                ? "bg-teal-900 text-white font-semibold shadow-inner"
                                                : "text-teal-100"
                                        )}
                                    >
                                        Consultations <ChevronDownIcon size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuItem asChild className={cn(route().current('public') && "bg-accent font-medium")}>
                                        <Link href={route('public')} className="flex items-center gap-2">
                                            <ListTodo size={16} className="opacity-70" />
                                            Publiques
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className={cn(route().current('touteunite') && "bg-accent font-medium")}>
                                        <Link href={route('touteunite')} className="flex items-center gap-2">
                                            <FolderInput size={16} className="opacity-70" />
                                            Restreintes
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className={cn(route().current('historique.index') && "bg-accent font-medium")}>
                                        <Link href={route('historique.index')} className="flex items-center gap-2">
                                            <StickyNoteIcon size={16} className="opacity-70" />
                                            Historique
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 4. Centre de Documentation */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-teal-100 hover:bg-teal-700 hover:text-white text-base gap-1">
                                        Documentation <ChevronDownIcon size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-72">
                                    <DropdownMenuLabel>Réglementation Archives</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <a href="/documents/Loi_001_Regissant_Archives_Cameroun_24072024.pdf" target="_blank" className="flex items-center gap-2">
                                            <BookOpenIcon size={16} className="opacity-70" /> Loi Archives 2024
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/documents/Loi_2000-010_19-dec_Regissant_Archives_Cameroun.pdf" target="_blank" className="flex items-center gap-2">
                                            <BookOpenIcon size={16} className="opacity-70" /> Loi Archives 2000
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/documents/Loi_Cybersecurite_Criminalite.pdf" target="_blank" className="flex items-center gap-2">
                                            <ShieldIcon size={16} className="opacity-70" /> Cybersécurité
                                        </a>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Organisation & Gouvernance</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <a href="/documents/ORGANIGRAMME_DGB.pdf" target="_blank" className="flex items-center gap-2">
                                            <Building2Icon size={16} className="opacity-70" /> Organigramme DGB
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/documents/Rapport_Audit_Archivage-Novembre-2019.pdf" target="_blank" className="flex items-center gap-2">
                                            <FileTextIcon size={16} className="opacity-70" /> Audit des archives
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 5. Administration */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "text-base gap-1 hover:bg-teal-700 hover:text-white",
                                            isAdministrationActive
                                                ? "bg-teal-900 text-white font-semibold shadow-inner"
                                                : "text-teal-100"
                                        )}
                                    >
                                        Administration <ChevronDownIcon size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {isSuper && (
                                        <>
                                            <DropdownMenuItem asChild className={cn(route().current('password.requests') && "bg-accent font-medium")}>
                                                <Link href={route('password.requests')} className="flex items-center gap-2">
                                                    <ShieldAlertIcon size={16} className="opacity-70" /> Mot de passe oublié
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className={cn(route().current('suspicious.connections') && "bg-accent font-medium")}>
                                                <Link href={route('suspicious.connections')} className="flex items-center gap-2">
                                                    <Fingerprint size={16} className="opacity-70" /> Connexions suspectes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem asChild className={cn(route().current('statistiques') && "bg-accent font-medium")}>
                                        <Link href={route('statistiques')} className="flex items-center gap-2">
                                            <ChartSplineIcon size={16} className="opacity-70" /> Statistiques
                                        </Link>
                                    </DropdownMenuItem>
                                    {isSuperOrAdmin && (
                                        <DropdownMenuItem asChild className={cn(route().current('journal') && "bg-accent font-medium")}>
                                            <Link href={route('journal')} className="flex items-center gap-2">
                                                <ScrollTextIcon size={16} className="opacity-70" /> Journal
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {isSuper && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild className={cn(route().current('compte') && "bg-accent font-medium")}>
                                                <Link href={route('compte')} className="flex items-center gap-2">
                                                    <UserRoundIcon size={16} className="opacity-70" /> Comptes utilisateurs
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className={cn(route().current('backup') && "bg-accent font-medium")}>
                                                <Link href={route('backup')} className="flex items-center gap-2">
                                                    <HardDriveDownloadIcon size={16} className="opacity-70" /> Sauvegardes
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>

                    {/* Partie Droite : Notifications & Profil Utilisateur */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-teal-700">
                            <BellMinusIcon className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-1 hover:bg-teal-700 rounded-full flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/images/placeholder.png" alt="Profile" />
                                        <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <ChevronDownIcon size={14} className="text-white opacity-80" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="flex flex-col">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    <span className="mt-1 text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 px-1.5 py-0.5 rounded w-fit font-semibold">
                                        {user.roles}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="flex items-center gap-2">
                                        <SquarePenIcon size={16} className="opacity-70" /> Éditer le profil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-2 text-red-600">
                                        <LogOutIcon size={16} /> Déconnexion
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            )}

            {/* Zone de contenu principal */}
            <main className="relative min-h-[calc(100vh-4rem)] w-full px-2 pb-8 pt-4 sm:px-4 lg:px-6">
                <div className="mx-auto w-full max-w-[1800px]">
                    {/* Header dynamique propre à la vue en cours */}
                    <ConsultationPageHeader />
                    <div className="consultation-page-transition mt-4">
                        {children}
                    </div>
                </div>
            </main>
            <Toaster />
        </div>
    );
}
