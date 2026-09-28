<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Sharedoc;
use App\Models\Typedocs;
use App\Models\Accessgroup;
use App\Models\Docarchives;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class ConsultationsController extends Controller
{
    public function searchview(): Response
    {
        $type = Typedocs::latest()->get();

        return Inertia::render('Consultation/SearchRes', [
            'types' => $type,
        ]);
    }

    public function search(Request $request): Response
    {
        $user = Auth::user();
        $query = Docarchives::query();

        if ($user->roles !== 'Super') {
            $query->where('departement', $user->departement);
        }

        $query->when($request->input('description'), function ($q, $description) {
            foreach (explode(' ', $description) as $term) {
                $q->whereRaw('LOWER(description) LIKE ?', ['%' . Str::lower($term) . '%']);
            }
        })
                    ->when($request->input('typearchive'), fn($q, $typearchive) => $q->where('typearchive', 'like', '%' . $typearchive . '%'))
                    ->when($request->input('date_doc'), fn($q, $date_doc) => $q->where('date_doc', 'like', '%' . $date_doc . '%'))
                    ->when($request->input('created_at'), fn($q, $created_at) => $q->where('created_at', 'like', '%' . $created_at . '%'));
        // add more filter

        $results = $query->paginate(25)->withQueryString();

        return Inertia::render('Consultation/Restreintes/SearchResult', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function unitview(): Response
    {
        $units = Docarchives::all();

        return Inertia::render('Consultation/CreationUnite', [
            'units' => $units
        ]);
    }

    public function showid($id): Response
    {
        $elements = Docarchives::findOrFail($id);

        if (!$elements) {
            // Handle case where item is not found, e.g., redirect or show 404
            abort(404);
        }

        return Inertia::render('Consultation/Mycreations', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath)
        ]);
    }

    public function membres(Request $request): Response
    {
        $type = Typedocs::latest()->get();

        // on recupere les documents dont l'utilisateur appartient a un departement specifique
        $documents = Docarchives::with('user')->whereHas('user', function($query) use ($request) {
            // on filtre ici (ex: passé par un paramètre d'URL ?departement=DGB)
            if ($request->has('departement')) {
                $query->where('departement', $request->departement);
            }
        })->get();

        // suppression des doublons d'utilisateurs
        $uniqueusers = $documents->unique('user_id')->values()->all();

        return Inertia::render('Consultation/AutreMembres', [
            'documents' => $uniqueusers,
            'types' => $type,
        ]);
    }

    public function members(): Response
    {
        $type = Typedocs::latest()->get();

        // recuperer les données avec la relation chargée
        $documents = Docarchives::with('user')->get();

        // Appliquer unique() sur la collection pour supprimer les doublons, basé sur l'attribut id
        $uniqueusers = $documents->unique('user_id');

        $uniqueusers = $uniqueusers->values()->all();

        return Inertia::render('Consultation/AutreMembres', [
            'documents' => $uniqueusers,
            'types' => $type,
        ]);
    }

    public function searchmembers(Request $request): Response
    {
        $user = Auth::user();
        $query = Docarchives::query();

        if ($user->roles !== 'Super') {
            $query->where('departement', $user->departement);
        }

        $query->when($request->input('description'), function ($q, $description) {
            foreach (explode(' ', $description) as $term) {
                $q->whereRaw('LOWER(description) LIKE ?', ['%' . Str::lower($term) . '%']);
            }
        })
                    ->when($request->input('typearchive'), fn($q, $typearchive) => $q->where('typearchive', 'like', '%' . $typearchive . '%'))
                    ->when($request->input('date_doc'), fn($q, $date_doc) => $q->where('date_doc', 'like', '%' . $date_doc . '%'))
                    ->when($request->input('users_name'), fn($q, $users_name) => $q->where('user_id', 'like', '%' . $users_name . '%'))
                    ->when($request->input('created_at'), fn($q, $created_at) => $q->where('created_at', 'like', '%' . $created_at . '%'));
        // add more filter

        $results = $query->paginate(25)->withQueryString();

        return Inertia::render('Consultation/Restreintes/SearchMembers', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function membersid($id): Response
    {
        $elements = Docarchives::findOrFail($id);

        if (!$elements) {
            // Handle case where item is not found, e.g., redirect or show 404
            abort(404);
        }

        return Inertia::render('Consultation/MembersId', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath)
        ]);
    }

    public function allunit(): Response
    {
        $type = Typedocs::latest()->get();

        return Inertia::render('Consultation/TouteUnite', [
            'types' => $type
        ]);
    }

    public function searchallunit(Request $request): Response
    {
        $user = Auth::user();
        $query = Docarchives::query();

        if ($user->roles !== 'Super') {
            $query->where('departement', $user->departement);
        }

        $query->when($request->input('description'), function ($q, $description) {
            foreach (explode(' ', $description) as $term) {
                $q->whereRaw('LOWER(description) LIKE ?', ['%' . Str::lower($term) . '%']);
            }
        })
                    ->when($request->input('typearchive'), fn($q, $typearchive) => $q->where('typearchive', 'like', '%' . $typearchive . '%'))
                    ->when($request->input('date_doc'), fn($q, $date_doc) => $q->where('date_doc', 'like', '%' . $date_doc . '%'))
                    ->when($request->input('departement'), fn($q, $departement) => $q->where('departement', 'like', '%' . $departement . '%'));
        // add more filter
        $results = $query->get();

        return Inertia::render('Consultation/Restreintes/SearchAllUnit', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function allunitid($id, Request $request): Response
    {
        $elements = Docarchives::findOrFail($id);

        if (!$elements) {
            // Handle case where item is not found, e.g., redirect or show 404
            abort(404);
        }

        return Inertia::render('Consultation/AllUnitView', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath),
            'searchParams' => $request->only(['description', 'typearchive', 'date_doc', 'departement'])
        ]);
    }

    public function bygroup(): Response
    {
        $department = Accessgroup::latest()->get();

        // Appliquer unique() sur la collection pour supprimer les doublons, basé sur l'attribut id
        $uniqueusers = $department->unique('sigle');

        // reinitialiser les clés de la collection (Optionnel mais recommandé)
        $uniqueusers = $uniqueusers->values()->all();

        return Inertia::render('Consultation/ArchivByGroup', [
            'departments' => $uniqueusers
        ]);
    }

    public function searchgroup(Request $request): Response
    {
        $user = Auth::user();
        $query = Docarchives::query();

        if ($user->roles !== 'Super') {
            $query->where('departement', $user->departement);
        }

        $query->when($request->input('departement'), fn($q, $departement) => $q->where('departement', 'like', '%' . $departement . '%'));

        $results = $query->get();

        return Inertia::render('Consultation/Restreintes/ArchivResult', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function searchgroupbyid($id): Response
    {
        $elements = Docarchives::findOrFail($id);

        if (!$elements) {
            // Handle case where item is not found, e.g., redirect or show 404
            abort(404);
        }

        return Inertia::render('Consultation/ViewArchivById', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath)
        ]);
    }

    public function bytype(): Response
    {
        $type = Typedocs::latest()->get();

        return Inertia::render('Consultation/ArchivByType', [
            'types' => $type
        ]);
    }

    public function searchtype(Request $request): Response
    {
        $user = Auth::user();
        $query = Docarchives::query();

        if ($user->roles !== 'Super') {
            $query->where('departement', $user->departement);
        }

        $query->when($request->input('typearchive'), fn($q, $typearchive) => $q->where('typearchive', 'like', '%' . $typearchive . '%'));
        // add more filter

        $results = $query->paginate(25)->withQueryString();

        return Inertia::render('Consultation/Restreintes/ArchivType', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function searchtypebyid($id): Response
    {
        $elements = Docarchives::findOrFail($id);

        if (!$elements) {
            // Handle case where item is not found, e.g., redirect or show 404
            abort(404);
        }

        return Inertia::render('Consultation/ArchivTypeId', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath)
        ]);
    }

}
