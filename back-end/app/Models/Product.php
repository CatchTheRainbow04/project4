<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'products';
    protected $fillable = ['name', 'price', 'feature_image_path', 'feature_image_name', 'user_id', 'category_id', 'content', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ nhiều-nhiều giữa Product và Tag thông qua bảng product_tags
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tags');
    }
    /**
     * Quan hệ một-nhiều: Product có thể có nhiều ProductImage
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
    /**
     * Quan hệ nhiều-nhiều: Product thuộc về một User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    /**
     * Quan hệ nhiều-nhiều: Product thuộc về một Category
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Lấy URL public cho ảnh đại diện sản phẩm
     */
    public function getFeatureImageUrlAttribute()
    {
        return $this->feature_image_path ? Storage::url($this->feature_image_path) : null;
    }
}
