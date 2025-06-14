<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'payments';
    protected $fillable = ['order_id', 'payment_method', 'amount', 'payment_status', 'transaction_id', 'paid_at', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ một-nhiều: Payment thuộc về một Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
