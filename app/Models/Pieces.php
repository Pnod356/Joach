<?php

namespace App\Models;

use App\Models\Docrh;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pieces extends Model
{
    /** @use HasFactory<\Database\Factories\PieceFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
        'user_id',
    ];

    public function docrhs()
    {
        return $this->belongsToMany(Docrh::class, 'piecerhs', 'docrh_id', 'piece_id')
                    ->withPivot('file_paths')
                    ->withTimestamps();
    }
}
