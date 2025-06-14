<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'product_images';
    protected $fillable = [
        'image_path',
        'image_name',
        'product_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Quan hệ một-nhiều: ProductImage thuộc về một Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Lấy URL public cho ảnh chi tiết sản phẩm
     */
    public function getImageUrlAttribute()
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }
}
