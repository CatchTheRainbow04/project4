<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryController extends Controller
{
    use HandlesAuthorization;

    public function index()
    {
        return response()->json(Category::all());
    }
    public function store(Request $request)
    {
        $this->authorize('create', Category::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        $validated['slug'] = \Str::slug($validated['name']);
        $category = Category::create($validated);
        return response()->json($category, 201);
    }
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $this->authorize('update', $category);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        if (isset($validated['name'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }
        $category->update($validated);
        return response()->json($request->all());
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $this->authorize('delete', $category);
        $category->delete();
        return response()->json(null, 204);
    }

    public function recursiveList($parentId = null, $prefix = '')
    {
        $categories = Category::where('parent_id', $parentId)->get();

        $result = [];

        foreach ($categories as $category) {
            $result[] = [
                'id' => $category->id,
                'name' => $prefix . $category->name
            ];

            // Đệ quy con
            $children = $this->recursiveList($category->id, $prefix . '— ');
            $result = array_merge($result, $children);
        }

        return $result;
    }

    public function dropdown()
    {
        $data = $this->recursiveList();
        return response()->json($data);
    }

    // Lấy danh sách category đệ quy (cha - con)
    public function tree()
    {
        $categories = Category::all();

        $tree = $this->buildTree($categories);

        return response()->json($tree);
    }

    private function buildTree($categories, $parentId = null)
    {
        $branch = [];

        foreach ($categories as $category) {
            if ($category->parent_id === $parentId) {
                $children = $this->buildTree($categories, $category->id);
                if ($children) {
                    $category->children = $children;
                }
                $branch[] = $category;
            }
        }

        return $branch;
    }
}
