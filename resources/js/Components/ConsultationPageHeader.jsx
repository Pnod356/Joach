import React from 'react';
import { ChevronRight, ClipboardList } from 'lucide-react';

const consultationRoutes = [
    'vosunites',
    'search',
    'membres',
    'touteunite',
    'archivbygroup',
    'archivbytype',
    'public',
    'historique',
    'receivedoc',
    'incoming',
    'send',
    'share',
    'dpa',
    'dette',
    'dossierrh',
];

const pageDefinitions = [
    { prefixes: ['dossierrh'], title: 'Dossiers du personnel (RH)', subtitle: 'Consultez et suivez les dossiers administratifs du personnel.' },
    { prefixes: ['public'], title: 'Consultation publique', subtitle: 'Recherchez les archives accessibles à tous les utilisateurs.' },
    { prefixes: ['historique'], title: 'Historique des consultations', subtitle: 'Retrouvez les actions et consultations récentes.' },
    { prefixes: ['touteunite', 'search'], title: 'Recherche d’archives', subtitle: 'Filtrez les archives selon vos critères de consultation.' },
    { prefixes: ['archivbygroup'], title: 'Archives par unité', subtitle: 'Explorez les archives regroupées par service producteur.' },
    { prefixes: ['archivbytype'], title: 'Archives par type', subtitle: 'Consultez les documents classés par type d’archive.' },
    { prefixes: ['membres'], title: 'Membres et archives', subtitle: 'Consultez les archives associées aux membres.' },
    { prefixes: ['send', 'incoming', 'receivedoc', 'share'], title: 'Partages de documents', subtitle: 'Gérez les documents partagés entrants et sortants.' },
    { prefixes: ['dpa'], title: 'Dossier permanent administration', subtitle: 'Consultez les dossiers permanents de l’administration.' },
    { prefixes: ['dette'], title: 'Dette flottante', subtitle: 'Consultez et suivez les dossiers de dette flottante.' },
];

export default function ConsultationPageHeader() {
    const currentRoute = route().current() || '';
    const isConsultation = consultationRoutes.some((prefix) => currentRoute === prefix || currentRoute.startsWith(`${prefix}.`));

    if (!isConsultation) {
        return null;
    }

    const definition = pageDefinitions.find(({ prefixes }) =>
        prefixes.some((prefix) => currentRoute === prefix || currentRoute.startsWith(`${prefix}.`))
    ) || {
        title: 'Consultations',
        subtitle: 'Accédez aux archives et aux informations disponibles.',
    };

    return (
        <section className="consultation-page-header" aria-labelledby="consultation-page-title">
            <div className="consultation-breadcrumb" aria-label="Fil d’Ariane">
                <ClipboardList size={15} aria-hidden="true" />
                <span>Consultations</span>
                <ChevronRight size={14} aria-hidden="true" />
                <span className="font-medium text-slate-700">{definition.title}</span>
            </div>
            <div className="mt-3">
                <p className="consultation-page-kicker">Espace de consultation</p>
                <h2 id="consultation-page-title" className="consultation-page-title">{definition.title}</h2>
                <p className="consultation-page-subtitle">{definition.subtitle}</p>
            </div>
        </section>
    );
}
