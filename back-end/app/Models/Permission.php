<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'permissions';
    protected $fillable = ['name', 'display_name', 'parent_id', 'key_code', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * Quan hệ nhiều-nhiều giữa Permission và Role thông qua bảng permission_role
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'permission_role');
    }
    /**
     * Quan hệ cha-con: Permission có thể có một permission cha
     */
    public function parent()
    {
        return $this->belongsTo(Permission::class, 'parent_id');
    }
    /**
     * Quan hệ cha-con: Permission có thể có nhiều permission con
     */
    public function children()
    {
        return $this->hasMany(Permission::class, 'parent_id');
    }
}
