<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json(Permission::all());
    }
    public function store(Request $request)
    {
        $validated = $request->validate(
        [
            'name' => 'required|string|max:255|unique:permissions,name',
            'display_name' => 'required|string|max:255',
            'key_code' => 'required|string|max:255|unique:permissions,key_code',
            'parent_id' => 'nullable|exists:permissions,id',
        ],
        [
            'name.required' => 'Tên quyền là bắt buộc.',
            'name.unique' => 'Tên quyền đã tồn tại.',
            'display_name.required' => 'Tên hiển thị là bắt buộc.',
            'key_code.required' => 'Mã quyền là bắt buộc.',
            'key_code.unique' => 'Mã quyền đã tồn tại.',
            'parent_id.exists' => 'Quyền cha không hợp lệ.',
        ]
    );
        $permission = Permission::create($validated);
        return response()->json($permission, 201);
    }
    public function show($id)
    {
        $permission = Permission::with('roles', 'parent', 'children')->findOrFail($id);
        return response()->json($permission);
    }
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:permissions,name,' . $id,
            'display_name' => 'sometimes|required|string|max:255',
            'key_code' => 'sometimes|required|string|max:255|unique:permissions,key_code,' . $id,
            'parent_id' => 'nullable|exists:permissions,id',
        ],
        [
            'name.required' => 'Tên quyền là bắt buộc.',
            'name.unique' => 'Tên quyền đã tồn tại.',
            'display_name.required' => 'Tên hiển thị là bắt buộc.',
            'key_code.required' => 'Mã quyền là bắt buộc.',
            'key_code.unique' => 'Mã quyền đã tồn tại.',
            'parent_id.exists' => 'Quyền cha không hợp lệ.',
        ]);
        $permission->update($validated);
        return response()->json($permission);
    }
    public function destroy($id)
    {
        Permission::destroy($id);
        return response()->json(null, 204);
    }

    /**
     * Lấy danh sách permission gốc (parent_id = null)
     */
    public function getParentPermissions()
    {
        $permissions = Permission::whereNull('parent_id')
            ->select('id', 'name', 'display_name', 'key_code')
            ->get();
            
        return response()->json($permissions);
    }
}
