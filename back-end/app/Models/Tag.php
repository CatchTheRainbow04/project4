<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'tags';
    protected $fillable = ['name', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ nhiều-nhiều giữa Tag và Product thông qua bảng product_tags
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_tags');
    }
}
