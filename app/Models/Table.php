<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = [
        'name',
        'personas',
        'active',
        // 'status', // Ya no se usa como campo manual
    ];

    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class, 'table_id');
    }

    // Estado derivado dinámicamente
    public function getStatusAttribute()
    {
        return $this->orders()->where('status', 'activo')->exists() ? 'ocupada' : 'libre';
    }
}
