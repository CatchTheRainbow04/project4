<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Category;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any categories.
     */
    public function viewAny(User $user)
    {
        return true; // Cho phép tất cả user đã đăng nhập xem danh sách
    }

    /**
     * Determine whether the user can view the category.
     */
    public function view(User $user, Category $category)
    {
        return true; // Cho phép tất cả user đã đăng nhập xem chi tiết
    }

    /**
     * Determine whether the user can create categories.
     */
    public function create(User $user)
    {
        // Ví dụ: chỉ cho phép user có role 'admin' tạo category
        return $user->roles()->where('name', 'admin')->exists();
    }

    /**
     * Determine whether the user can update the category.
     */
    public function update(User $user, Category $category)
    {
        // Ví dụ: chỉ cho phép user có role 'admin' cập nhật category
        return $user->roles()->where('name', 'admin')->exists();
    }

    /**
     * Determine whether the user can delete the category.
     */
    public function delete(User $user, Category $category)
    {
        // Ví dụ: chỉ cho phép user có role 'admin' xóa category
        return $user->roles()->where('name', 'admin')->exists();
    }
}
