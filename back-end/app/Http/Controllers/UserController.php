<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Lấy danh sách users (Admin only)
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Tìm kiếm theo tên hoặc email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter theo role
        if ($request->has('role')) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Sắp xếp
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return response()->json($query->paginate($request->get('per_page', 15)));
    }

    /**
     * Tạo user mới (Admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        // Gán roles cho user
        $user->roles()->sync($validated['roles']);

        return response()->json($user->load('roles'), 201);
    }

    /**
     * Xem thông tin user
     */
    public function show($id)
    {
        $user = User::with(['roles', 'orders' => function($query) {
            $query->latest()->limit(5); // 5 đơn hàng gần nhất
        }])->findOrFail($id);

        // Chỉ admin hoặc chính user đó mới xem được
        if (Auth::id() !== $user->id && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($user);
    }

    /**
     * Cập nhật thông tin user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Chỉ admin hoặc chính user đó mới cập nhật được
        if (Auth::id() !== $user->id && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => ['sometimes', 'required', Password::defaults()],
            'roles' => 'sometimes|required|array',
            'roles.*' => 'exists:roles,id'
        ]);

        // Cập nhật thông tin cơ bản
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        // Chỉ admin mới được cập nhật roles
        if (isset($validated['roles']) && Auth::user()->hasRole('admin')) {
            $user->roles()->sync($validated['roles']);
        }

        return response()->json($user->load('roles'));
    }

    /**
     * Xóa user (Admin only)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Không cho phép xóa chính mình
        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }

        // Xóa các dữ liệu liên quan
        $user->roles()->detach();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Thống kê về users (Admin only)
     */
    public function statistics()
    {
        $stats = [
            'total_users' => User::count(),
            'users_by_role' => Role::withCount('users')->get(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)
                                        ->whereYear('created_at', now()->year)
                                        ->count()
        ];

        return response()->json($stats);
    }
}
