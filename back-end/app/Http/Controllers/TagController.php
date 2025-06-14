<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    public function index()
    {
        return response()->json(Tag::all());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags',
        ]);
        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }
    public function show($id)
    {
        $tag = Tag::findOrFail($id);
        return response()->json($tag);
    }
    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:tags,name,' . $id,
        ]);
        $tag->update($validated);
        return response()->json($tag);
    }
    public function destroy($id)
    {
        Tag::destroy($id);
        return response()->json(null, 204);
    }
}
