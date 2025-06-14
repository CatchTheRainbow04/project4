<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'config_key' => 'required|string|max:255',
            'config_value' => 'nullable|string',
        ]);
        $setting = Setting::create($validated);
        return response()->json($setting, 201);
    }

    public function show($id)
    {
        $setting = Setting::findOrFail($id);
        return response()->json($setting);
    }

    public function update(Request $request, $id)
    {
        $setting = Setting::findOrFail($id);
        $validated = $request->validate([
            'config_key' => 'sometimes|required|string|max:255',
            'config_value' => 'nullable|string',
        ]);
        $setting->update($validated);
        return response()->json($setting);
    }

    public function destroy($id)
    {
        $setting = Setting::findOrFail($id);
        $setting->delete();
        return response()->json(null, 204);
    }
}
