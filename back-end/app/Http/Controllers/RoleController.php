<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $role =  Role::with('permissions', 'users')->get();
        if ($role->isEmpty()) {
            return response()->json(['message' => 'Không có role nào'], 404);
        }
        return response()->json($role);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'display_name' => 'required|string|max:255',
        ]);
        $role = Role::create($validated);
        return response()->json($role, 201);
    }
    public function show($id)
    {
        $role = Role::with('permissions', 'users')->findOrFail($id);
        return response()->json($role);
    }
    public function update(Request $request, $id)
    {
        $role = Role::with('permissions', 'users')->findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $id,
            'display_name' => 'sometimes|required|string|max:255',
        ]);
        $role->update($validated);
        return response()->json($role);
    }
    public function destroy($id)
    {
        Role::destroy($id);
        return response()->json(null, 204);
    }
    // Gán permission cho role
    public function syncPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $permissionIds = $request->input('permissions', []);
        $role->permissions()->sync($permissionIds);
        return response()->json(['message' => 'Cập nhật quyền cho role thành công']);
    }
    // Gán role cho user
    public function syncUsers(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $userIds = $request->input('users', []);
        $role->users()->sync($userIds);
        return response()->json(['message' => 'Cập nhật role cho user thành công']);
    }
}
