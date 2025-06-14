<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'roles';

    protected $fillable = [
        'name',
        'display_name',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Quan hệ nhiều-nhiều giữa Role và User thông qua bảng user_role
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }
    /**
     * Quan hệ nhiều-nhiều giữa Role và Permission thông qua bảng permission_role
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }
}
