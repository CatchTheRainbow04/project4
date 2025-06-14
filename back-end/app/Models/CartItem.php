<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CartItem extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'cart_items';
    protected $fillable = ['cart_id', 'product_id', 'quantity', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ một-nhiều: CartItem thuộc về một Cart
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }
    /**
     * Quan hệ một-nhiều: CartItem thuộc về một Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
