<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::all();
        // Thêm image_url cho mỗi slider
        $sliders->transform(function ($slider) {
            $slider->image_url = $slider->image_path ? Storage::url($slider->image_path) : null;
            return $slider;
        });
        return response()->json($sliders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'required|file|image',
        ]);
        $image = $request->file('image_path');
        $imageName = time() . '_' . $image->getClientOriginalName();
        $imagePath = $image->storeAs('sliders', $imageName, 'public');
        $slider = Slider::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image_name' => $imageName,
            'image_path' => $imagePath,
        ]);
        $slider->image_url = Storage::url($slider->image_path);
        return response()->json($slider, 201);
    }

    public function show($id)
    {
        $slider = Slider::findOrFail($id);
        $slider->image_url = $slider->image_path ? Storage::url($slider->image_path) : null;
        return response()->json($slider);
    } 
       public function update(Request $request, $id)
    {
        $slider = Slider::findOrFail($id);
        // Kiểm tra quyền cập nhật
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_path' => 'sometimes|file|image',
        ]);
        // Cập nhật các trường cơ bản
        $updateData = [];
        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        if (isset($validated['description'])) {
            $updateData['description'] = $validated['description'];
        }
        // Nếu có file ảnh mới, xử lý upload
        $updateData['image_name'] = $slider->image_name; // Giữ nguyên tên ảnh cũ nếu không có ảnh mới
        if ($request->hasFile('image_path')) {
            // Xóa ảnh cũ nếu có
            if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
                Storage::disk('public')->delete($slider->image_path);
            }
            $image = $request->file('image_path');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('sliders', $imageName, 'public');
            $updateData['image_name'] = $imageName;
            $updateData['image_path'] = $imagePath;
        }        // Cập nhật slider
        $slider->update($updateData);
        // Cập nhật URL ảnh
        $slider->image_url = $slider->image_path ? Storage::url($slider->image_path) : null;
        return response()->json($slider);
    }

    public function destroy($id)
    {
        $slider = Slider::findOrFail($id);
        // Xóa file ảnh vật lý nếu có
        if ($slider->image_path && Storage::disk('public')->exists($slider->image_path)) {
            Storage::disk('public')->delete($slider->image_path);
        }
        $slider->delete();
        return response()->json(null, 204);
    }
}
