<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng (có phân trang và filter)
     */
    public function index(Request $request)
    {
        $query = Order::with(["items.product", "user", "payment"]);

        // Filter theo trạng thái
        if ($request->has("status") && $request->status !== '') {
            $query->where("order_status", $request->status);
        }

        // Filter theo phương thức thanh toán
        if ($request->has("payment_method") && $request->payment_method !== '') {
            $query->where("payment_method", $request->payment_method);
        }

        // Filter theo khoảng thời gian
        if ($request->has("from_date") && $request->from_date !== '') {
            $query->whereDate("created_at", ">=", $request->from_date);
        }
        if ($request->has("to_date") && $request->to_date !== '') {
            $query->whereDate("created_at", "<=", $request->to_date);
        }

        // Tìm kiếm theo tên khách hàng, số điện thoại, email
        if ($request->has("search") && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("customer_name", "like", "%{$search}%")
                    ->orWhere("customer_phone", "like", "%{$search}%")
                    ->orWhere("customer_email", "like", "%{$search}%");
            });
        }

        // Sắp xếp với validation
        $allowedSortFields = ['id', 'created_at', 'updated_at', 'total_price', 'order_status', 'customer_name'];
        $sortField = $request->get("sort_field", "created_at");
        $sortDirection = $request->get("sort_direction", "desc");
        
        // Validate sort field
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = "created_at";
        }
        
        // Validate sort direction
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = "desc";
        }

        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get("per_page", 15);
        // Validate per_page
        if (!is_numeric($perPage) || $perPage < 1 || $perPage > 100) {
            $perPage = 15;
        }

        return response()->json($query->paginate($perPage));
    }

    /**
     * Xem chi tiết đơn hàng
     */
    public function show($id)
    {
        $order = Order::with(["items.product", "user", "payment"])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate(
            [
                "order_status" => "required|in:pending,processing,completed,cancelled",
                "note" => "nullable|string",
            ],
            [
                "order_status.required" => "Trạng thái đơn hàng là bắt buộc",
                "order_status.in" => "Trạng thái đơn hàng không hợp lệ",
            ]
        );

        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json($order->load(["items.product", "user", "payment"]));
    }

    /**
     * Thống kê đơn hàng
     */
    public function statistics(Request $request)
    {
        $query = Order::query();

        if ($request->has("from_date") && $request->from_date !== '') {
            $query->whereDate("created_at", ">=", $request->from_date);
        }
        if ($request->has("to_date") && $request->to_date !== '') {
            $query->whereDate("created_at", "<=", $request->to_date);
        }

        $statistics = [
            "total_orders" => $query->count(),
            "total_revenue" => $query->sum("total_price"),
            "average_order_value" => $query->avg("total_price"),
            "status_count" => $query
                ->selectRaw("order_status, count(*) as count")
                ->groupBy("order_status")
                ->get(),
            "payment_method_count" => $query
                ->selectRaw("payment_method, count(*) as count")
                ->groupBy("payment_method")
                ->get(),
            "daily_revenue" => $query
                ->selectRaw("DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as orders")
                ->groupBy("date")
                ->orderBy("date", "desc")
                ->limit(30)
                ->get(),
        ];

        return response()->json($statistics);
    }

    public function buyNow(Request $request)
    {
        $validated = $request->validate(
            [
                "product_id" => "required|exists:products,id",
                "quantity" => "required|integer|min:1",
                "customer_name" => "required|string|max:255",
                "customer_phone" => "required|string|max:20",
                "customer_email" => "required|email",
                "shipping_address" => "required|string",
                "payment_method" => "required|in:cod,banking",
                "note" => "nullable|string",
            ],
            [
                "product_id.required" => "Sản phẩm là bắt buộc",
                "product_id.exists" => "Sản phẩm không tồn tại",
                "quantity.required" => "Số lượng là bắt buộc",
                "quantity.integer" => "Số lượng phải là số nguyên",
                "quantity.min" => "Số lượng tối thiểu là 1",
                "customer_name.required" => "Tên khách hàng là bắt buộc",
                "customer_phone.required" => "Số điện thoại là bắt buộc",
                "customer_email.required" => "Email là bắt buộc",
                "shipping_address.required" => "Địa chỉ giao hàng là bắt buộc",
                "payment_method.required" => "Phương thức thanh toán là bắt buộc",
                "payment_method.in" => "Phương thức thanh toán không hợp lệ",
            ]
        );

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($validated["product_id"]);
            $total = $product->price * $validated["quantity"];

            $order = Order::create([
                "user_id" => Auth::id(),
                "customer_name" => $validated["customer_name"],
                "customer_phone" => $validated["customer_phone"],
                "customer_email" => $validated["customer_email"],
                "shipping_address" => $validated["shipping_address"],
                "order_status" => $validated["payment_method"] === "cod" ? "pending" : "waiting_payment",
                "total_price" => $total,
                "payment_status" => "pending",
                "payment_method" => $validated["payment_method"],
                "note" => $validated["note"] ?? null,
            ]);

            OrderItem::create([
                "order_id" => $order->id,
                "product_id" => $product->id,
                "quantity" => $validated["quantity"],
                "price" => $product->price,
            ]);

            DB::commit();

            return response()->json([
                "message" => "Buy now order created successfully",
                "order" => $order->load("items.product"),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "message" => "Buy now failed",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy đơn hàng của user hiện tại với đầy đủ tính năng filter/sort
     */
    public function myOrders(Request $request)
    {
        $query = Order::with(["items.product", "payment","items"])->where("user_id", Auth::id());

        // Filter theo trạng thái
        if ($request->has("status") && $request->status !== '') {
            $query->where("order_status", $request->status);
        }

        // Filter theo phương thức thanh toán
        if ($request->has("payment_method") && $request->payment_method !== '') {
            $query->where("payment_method", $request->payment_method);
        }

        // Filter theo khoảng thời gian
        if ($request->has("from_date") && $request->from_date !== '') {
            $query->whereDate("created_at", ">=", $request->from_date);
        }
        if ($request->has("to_date") && $request->to_date !== '') {
            $query->whereDate("created_at", "<=", $request->to_date);
        }

        // Tìm kiếm theo thông tin đơn hàng
        if ($request->has("search") && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("customer_name", "like", "%{$search}%")
                    ->orWhere("customer_phone", "like", "%{$search}%")
                    ->orWhere("customer_email", "like", "%{$search}%")
                    ->orWhere("id", "like", "%{$search}%");
            });
        }

        // Sắp xếp với validation
        $allowedSortFields = ['id', 'created_at', 'updated_at', 'total_price', 'order_status'];
        $sortField = $request->get("sort_field", "created_at");
        $sortDirection = $request->get("sort_direction", "desc");
        
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = "created_at";
        }
        
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = "desc";
        }

        $query->orderBy($sortField, $sortDirection);

        // Phân trang với validation
        $perPage = $request->get("per_page", 10);
        if (!is_numeric($perPage) || $perPage < 1 || $perPage > 50) {
            $perPage = 10;
        }

        return response()->json($query->paginate($perPage));
    }

    /**
     * Hủy đơn hàng
     */
    public function cancelOrder(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $order = Order::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        // Chỉ cho phép hủy đơn hàng ở trạng thái pending
        if ($order->order_status !== 'pending') {
            return response()->json([
                'message' => 'Không thể hủy đơn hàng ở trạng thái này'
            ], 400);
        }

        $order->update([
            'order_status' => 'cancelled',
            'note' => $validated['reason'] ?? 'Khách hàng hủy đơn hàng'
        ]);

        return response()->json([
            'message' => 'Đơn hàng đã được hủy thành công',
            'order' => $order->load(['items.product', 'payment'])
        ]);
    }
}