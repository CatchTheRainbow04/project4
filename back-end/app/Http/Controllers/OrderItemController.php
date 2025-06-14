<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\OrderItem::all());
    }
    public function store(Request $request)
    {
        $orderItem = \App\Models\OrderItem::create($request->all());
        return response()->json($orderItem, 201);
    }
    public function show($id)
    {
        $orderItem = \App\Models\OrderItem::findOrFail($id);
        return response()->json($orderItem);
    }
    public function update(Request $request, $id)
    {
        $orderItem = \App\Models\OrderItem::findOrFail($id);
        $orderItem->update($request->all());
        return response()->json($orderItem);
    }
    public function destroy($id)
    {
        \App\Models\OrderItem::destroy($id);
        return response()->json(null, 204);
    }
}
