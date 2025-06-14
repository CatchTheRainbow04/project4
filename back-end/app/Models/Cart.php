<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cart extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'carts';
    protected $fillable = ['user_id', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ một-nhiều: Cart thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    /**
     * Quan hệ một-nhiều: Cart có thể có nhiều CartItem
     */
    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }
}
