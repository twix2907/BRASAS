<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'table_id',
        'user_id',
        'type',
        'notes',
        'status',
        'total',
        'client_name',
        'delivery_location',
    ];

    // Relación: un pedido tiene muchos items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relación: un pedido pertenece a una mesa
    public function table()
    {
        return $this->belongsTo(\App\Models\Table::class);
    }

    // Relación: un pedido pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
