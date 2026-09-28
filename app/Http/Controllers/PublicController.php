<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Typedocs;
use App\Models\Docarchives;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PublicController extends Controller
{
    public function publicview(): Response
    {
        $type = Typedocs::latest()->get();

        return Inertia::render('Consultation/Publics/Public', [
            'types' => $type
        ]);
    }

    public function search(Request $request): Response
    {
        $user = Auth::user();

        // filter based on from fields
        $query = Docarchives::query()
                    ->where('departement', 'PUBLIC')
                    ->when($request->input('description'), fn($q, $description) => $q->whereRaw('LOWER(description) LIKE ?', ['%' . mb_strtolower($description) . '%']))
                    ->when($request->input('typearchive'), fn($q, $typearchive) => $q->where('typearchive', 'like', '%' . $typearchive . '%'))
                    ->when($request->input('date_doc'), fn($q, $date_doc) => $q->where('date_doc', 'like', '%' . $date_doc . '%'))
                    ->when($request->input('created_at'), fn($q, $created_at) => $q->where('created_at', 'like', '%' . $created_at . '%'));
        // add more filter

        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 80, 100], true) ? $perPage : 10;

        $results = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Consultation/Publics/PublicResult', [
            'results' => $results,
            'searchParams' => $request->all()
        ]);
    }

    public function showid(Request $request, $id): Response
    {
        $elements = Docarchives::where('departement', 'PUBLIC')->findOrFail($id);

        return Inertia::render('Consultation/Mycreations', [
            'elements' => $elements,
            'paths' => Storage::url($elements->filepath),
            'searchParams' => $request->query(),
        ]);
    }
}
