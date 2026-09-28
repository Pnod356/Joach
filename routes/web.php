<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RhController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\DpaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DetteController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArchivesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HistoriqueController;
use App\Http\Controllers\EmplacementController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Controllers\TypeArchiveController;
use App\Http\Controllers\ConsultationsController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/typearchives', [TypeArchiveController::class, 'view'])->name('typearchives.view');
    Route::post('/typearchives', [TypeArchiveController::class, 'store'])->name('typearchives.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/emplacement', [EmplacementController::class, 'view'])->name('emplacement.view');
    Route::post('/emplacement', [EmplacementController::class, 'store'])->name('emplacement.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/groupeacces', [GroupeController::class, 'view'])->name('groupeacces.view');
    Route::post('/groupeacces', [GroupeController::class, 'store'])->name('groupeacces.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/archives', [ArchivesController::class, 'view'])->name('archives.view');
    Route::post('/archives', [ArchivesController::class, 'store'])->name('archives.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/vosunites', [ConsultationsController::class, 'unitview'])->name('vosunites.unitview');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/vosunites/{id}', [ConsultationsController::class, 'viewbyid'])->name('vosunites.viewbyid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/searchview', [ConsultationsController::class, 'searchview'])->name('searchview');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/search', [ConsultationsController::class, 'search'])->name('search');
    Route::get('/search/{id}', [ConsultationsController::class, 'showid'])->name('search.showid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/send', [ShareController::class, 'store'])->name('send.store');
    Route::get('/send/{id}', [ShareController::class, 'senddoc'])->name('send.senddoc');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/send', [ShareController::class, 'sendview'])->name('send.view');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/membres', [ConsultationsController::class, 'membres'])->name('membres');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/membres', [ConsultationsController::class, 'searchmembers'])->name('searchmembers');
    Route::get('/membres/{id}', [ConsultationsController::class, 'membersid'])->name('membres.membersid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/touteunite', [ConsultationsController::class, 'allunit'])->name('touteunite');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/touteunite', [ConsultationsController::class, 'searchallunit'])->name('searchallunit');
    Route::get('/touteunite/{id}', [ConsultationsController::class, 'allunitid'])->name('touteunite.allunitid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/archivbygroup', [ConsultationsController::class, 'bygroup'])->name('archivbygroup');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/archivbygroup', [ConsultationsController::class, 'searchgroup'])->name('searchgroup');
    Route::get('/archivbygroup/{id}', [ConsultationsController::class, 'searchgroupbyid'])->name('archivbygroup.searchgroupbyid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/archivbytype', [ConsultationsController::class, 'bytype'])->name('archivbytype');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/archivbytype', [ConsultationsController::class, 'searchtype'])->name('searchtype');
    Route::get('/archivbytype/{id}', [ConsultationsController::class, 'searchtypebyid'])->name('archivbytype.searchtypebyid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/public', [PublicController::class, 'publicview'])->name('public');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/public', [PublicController::class, 'search'])->name('public.search');
    Route::get('/public/{id}', [PublicController::class, 'showid'])->name('public.showid');
});

Route::get('/compte', function () {
    return Inertia::render('Administration/Comptes');
})->middleware(['auth', 'verified'])->name('compte');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/listaccount', [AdminController::class, 'showaccount'])->name('listaccount');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/journal', [JournalController::class, 'index'])->name('journal');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/journal', [JournalController::class, 'show'])->name('journal.show');
    Route::get('/journal/{id}', [JournalController::class, 'showbyid'])->name('journal.showbyid');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/historique', [HistoriqueController::class, 'index'])->name('historique.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/receivedoc', [ShareController::class, 'receiveview'])->name('receivedoc');
    Route::get('/receivedoc/user', [ShareController::class, 'incomingDocsView'])->name('incoming');
    Route::post('/share/{id}/approve', [ShareController::class, 'approve'])->name('share.approve');
    Route::get('/share/{id}', [ShareController::class, 'showShare'])->name('share.show');
    Route::delete('/share/{id}', [ShareController::class, 'destroy'])->name('share.destroy');
});

Route::get('/repertoires', function () {
    return Inertia::render('Consultation/Repertoires');
})->middleware(['auth', 'verified'])->name('repertoires');

Route::get('/services', function () {
    return Inertia::render('ServicesArchives/Services');
})->middleware(['auth', 'verified'])->name('services');

Route::get('/securite', function () {
    return Inertia::render('Administration/Security');
})->middleware(['auth', 'verified'])->name('securite');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/statistiques', [StatistiqueController::class, 'diskSpace'])->name('statistiques');
});

Route::get('/backup', function () {
    return Inertia::render('Administration/Backup');
})->middleware(['auth', 'verified'])->name('backup');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dpa', [DpaController::class, 'view'])->name('dpa.view');
    Route::get('/dpa/entities/{type}', [DpaController::class, 'listEntities'])->name('dpa.entities');
    Route::get('/dpa/details/{type}', [DpaController::class, 'details'])->name('dpa.details');
    Route::get('/dpa/administration/details', [DpaController::class, 'details'])->defaults('type', 'administration')->name('administration.details');
    Route::get('/dpa/epa/details', [DpaController::class, 'details'])->defaults('type', 'epa')->name('epa.details');
    Route::get('/dpa/ctd/details', [DpaController::class, 'details'])->defaults('type', 'ctd')->name('ctd.details');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dette', [DetteController::class, 'view'])->name('dette.view');
    Route::get('/dette/details/{type}', [DetteController::class, 'details'])->name('dette.details');
    Route::get('/dette/details/{detteType}/{entityGroup}/{item}', [DetteController::class, 'entityDetails'])->name('dette.entity.details');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // ... autres routes
    Route::get('/passwords', [AdminController::class, 'passwordRequests'])->name('password.requests');
    Route::get('/passwords/{user}/password', [AdminController::class, 'showPasswordForm'])->name('admin.password.edit');
    Route::put('/passwords/{user}/password', [AdminController::class, 'updatePassword'])->name('admin.password.update');
    Route::get('/securite/connections', [AdminController::class, 'suspiciousConnections'])->name('suspicious.connections');
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/dossierrh', [ArchivesController::class, 'createrh'])->name('dossierrh.createrh');
//     Route::post('/dossierrh', [ArchivesController::class, 'storerh'])->name('dossierrh.storerh');
//     Route::get('/dossierrh/view', [ArchivesController::class, 'viewdossiersrh'])->name('dossierrh.view');
// });

Route::middleware(['auth', 'verified'])->group(function() {
    // 1. Les routes fixes (statiques) en premier
    Route::get('/dossierrh', [DashboardController::class, 'index'])->name('dossierrh');
    Route::get('/dossierrh/list', [DashboardController::class, 'listview'])->name('dossierrh.list'); // Déplacé ici
    Route::get('/dossierrh/incomplets', [DashboardController::class, 'incompleteDossiers'])->name('dossierrh.incomplets');
    Route::get('/dossierrh/report/general', [DashboardController::class, 'downloadGeneralReport'])->name('dossierrh.downloadGeneralReport');
    Route::get('/dossierrh/create', [RhController::class, 'create'])->name('dossierrh.create');
    Route::post('/dossierrh/store', [RhController::class, 'store'])->name('dossierrh.store');
    Route::get('/dossierrh/search', [DashboardController::class, 'search'])->name('dossierrh.search');

    // 2. Les routes avec paramètres dynamiques ensuite
    Route::get('/dossierrh/{rhusers}', [RhController::class, 'show'])->name('dossierrh.show');
    Route::get('/dossierrh/{rhusers}/edit', [RhController::class, 'edit'])->name('dossierrh.edit'); // Ajout du préfixe /dossierrh/

    // Simplification des routes de téléchargement et d'update
    Route::get('/dossierrh/{rhusers}/download-all', [RhController::class, 'downloadFullDossier'])->name('dossierrh.download-all');
    Route::get('/dossierrh/{rhusers}/download-piece/{pieceId}', [RhController::class, 'downloadPiece'])->name('dossierrh.download-piece');
    Route::patch('/dossierrh/{rhusers}/update-info', [RhController::class, 'updateInfo'])->name('dossierrh.updateInfo');
    Route::post('/dossierrh/{rhusers}/update-pieces', [RhController::class, 'updatePieces'])->name('dossierrh.updatePieces');
    Route::post('/dossierrh/{rhusers}/upload/{pieceId}', [RhController::class, 'uploadPiece'])->name('dossierrh.upload-piece');

});

require __DIR__.'/auth.php';
