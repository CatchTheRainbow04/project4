<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'orders';
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'shipping_address',
        'order_status',
        'total_price',
        'payment_status',
        'payment_method',
        'note',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * Quan hệ một-nhiều: Order thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    /**
     * Quan hệ một-nhiều: Order có thể có nhiều OrderItem
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
    /**
     * Quan hệ một-một: Order có thể có một Payment
     */
    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }
}
