<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'categories';
    protected $fillable = ['name', 'parent_id', 'slug', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ cha-con: Category có thể có một category cha
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
    /**
     * Quan hệ cha-con: Category có thể có nhiều category con
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
    /**
     * Quan hệ một-nhiều: Category có thể có nhiều Product
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
