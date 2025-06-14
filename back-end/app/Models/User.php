<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable ;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $table = 'users';

    /**
     * Quan hệ nhiều-nhiều giữa User và Role thông qua bảng user_role
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }
    /**
     * Quan hệ một-nhiều: User có thể có nhiều Cart
     */
    public function carts()
    {
        return $this->hasMany(Cart::class, 'user_id');
    }
    /**
     * Quan hệ một-nhiều: User có thể có nhiều Order
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }
    /**
     * Quan hệ một-nhiều: User có thể có nhiều Product
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'user_id');
    }

    /**
     * Scope để luôn eager load các quan hệ liên quan
     */
    public function scopeWithRelations($query)
    {
        return $query->with(['roles', 'carts', 'orders', 'products']);
    }

    public function hasRole($roleName)
{
    return $this->roles()->where('name', $roleName)->exists();
}
}
