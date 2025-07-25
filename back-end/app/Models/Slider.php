<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Slider extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'sliders';
    protected $fillable = ['name', 'description', 'image_name', 'image_path', 'created_at', 'updated_at', 'deleted_at'];
}
