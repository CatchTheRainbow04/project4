<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function index()
    {
        return response()->json(ProductImage::all());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image_path' => 'required|file|image',
        ]);
        $image = $request->file('image_path');
        $imagePath = $image->store('products/images', 'public');
        $imageName = $image->getClientOriginalName();
        $productImage = ProductImage::create([
            'product_id' => $validated['product_id'],
            'image_path' => $imagePath,
            'image_name' => $imageName,
        ]);
        return response()->json($productImage, 201);
    }
    public function show($id)
    {
        $productImage = ProductImage::findOrFail($id);
        return response()->json($productImage);
    }
    public function update(Request $request, $id)
    {
        $productImage = ProductImage::findOrFail($id);
        $validated = $request->validate([
            'image_path' => 'sometimes|file|image',
        ]);
        $updateData = [];
        if ($request->hasFile('image_path')) {
            // Xóa file ảnh cũ nếu tồn tại
            if ($productImage->image_path && \Storage::disk('public')->exists($productImage->image_path)) {
                \Storage::disk('public')->delete($productImage->image_path);
            }
            $image = $request->file('image_path');
            $imagePath = $image->store('products/images', 'public');
            $imageName = $image->getClientOriginalName();
            $updateData['image_path'] = $imagePath;
            $updateData['image_name'] = $imageName;
        }
        $productImage->update($updateData);
        return response()->json($productImage);
    }

    public function destroy($id)
    {
        $productImage = ProductImage::findOrFail($id);
        // Xóa file ảnh vật lý trước khi xóa record
        if ($productImage->image_path && \Storage::disk('public')->exists($productImage->image_path)) {
            \Storage::disk('public')->delete($productImage->image_path);
        }
        $productImage->delete();
        return response()->json(null, 204);
    }
}
