<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'order_items';
    protected $fillable = ['order_id', 'product_id', 'quantity', 'price', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ một-nhiều: OrderItem thuộc về một Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
    /**
     * Quan hệ một-nhiều: OrderItem thuộc về một Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
