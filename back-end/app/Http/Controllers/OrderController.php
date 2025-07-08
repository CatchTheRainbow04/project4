<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng (có phân trang và filter)
     */
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'user', 'payment']);

        // Filter theo trạng thái
        if ($request->has('status')) {
            $query->where('order_status', $request->status);
        }

        // Filter theo phương thức thanh toán
        if ($request->has('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Filter theo khoảng thời gian
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Tìm kiếm theo tên khách hàng, số điện thoại, email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        // Sắp xếp
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return response()->json($query->paginate($request->get('per_page', 15)));
    }

    /**
     * Xem chi tiết đơn hàng
     */
    public function show($id)
    {
        $order = Order::with(['items.product', 'user', 'payment'])
            ->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,processing,completed,cancelled',
            'note' => 'nullable|string'
        ]);

        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json($order->load(['items.product', 'user', 'payment']));
    }

    /**
     * Thống kê đơn hàng
     */
    public function statistics(Request $request)
    {
        // Thống kê theo khoảng thời gian
        $query = Order::query();
        
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $statistics = [
            'total_orders' => $query->count(),
            'total_revenue' => $query->sum('total_price'),
            'status_count' => $query->selectRaw('order_status, count(*) as count')
                ->groupBy('order_status')
                ->get(),
            'payment_method_count' => $query->selectRaw('payment_method, count(*) as count')
                ->groupBy('payment_method')
                ->get()
        ];

        return response()->json($statistics);
    }

        public function buyNow(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'customer_name' => 'required|string|max:255',
        'customer_phone' => 'required|string|max:20',
        'customer_email' => 'required|email',
        'shipping_address' => 'required|string',
        'payment_method' => 'required|in:cod,banking',
        'note' => 'nullable|string'
    ]);

    try {
        DB::beginTransaction();

        $product = Product::findOrFail($validated['product_id']);
        $total = $product->price * $validated['quantity'];

        $order = Order::create([
            'user_id' => Auth::id(),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
            'shipping_address' => $validated['shipping_address'],
            'order_status' => $validated['payment_method'] === 'cod' ? 'pending' : 'waiting_payment',
            'total_price' => $total,
            'payment_status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'note' => $validated['note'] ?? null
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $validated['quantity'],
            'price' => $product->price
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Buy now order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Buy now failed'], 500);
    }
}
}
