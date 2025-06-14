<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Xử lý thanh toán cho đơn hàng
     */
    public function processPayment(Request $request, $orderId)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|string',
            'amount' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $order = Order::findOrFail($orderId);
            
            // Kiểm tra số tiền thanh toán
            if ($validated['amount'] != $order->total_price) {
                return response()->json([
                    'message' => 'Payment amount does not match order total'
                ], 400);
            }

            // Tạo payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $order->payment_method,
                'amount' => $validated['amount'],
                'transaction_id' => $validated['transaction_id'],
                'payment_status' => 'completed',
                'paid_at' => now()
            ]);

            // Cập nhật trạng thái thanh toán của đơn hàng
            $order->update([
                'payment_status' => 'completed'
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment processed successfully',
                'payment' => $payment,
                'order' => $order
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Payment processing failed'], 500);
        }
    }

    /**
     * Xem lịch sử thanh toán
     */
    public function index(Request $request)
    {
        $query = Payment::with('order');

        // Filter theo trạng thái
        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
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

        return response()->json($query->paginate($request->get('per_page', 15)));
    }

    /**
     * Xem chi tiết thanh toán
     */
    public function show($id)
    {
        $payment = Payment::with('order.items.product')
            ->findOrFail($id);
        return response()->json($payment);
    }
}
