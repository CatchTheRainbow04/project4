<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Lấy giỏ hàng của user hiện tại
     */
    public function index()
    {
        $cart = Cart::with(['items.product' => function($query) {
            $query->withTrashed(); // Để lấy cả sản phẩm đã bị xóa mềm
        }])->where('user_id', Auth::id())->first();

        if (!$cart) {
            return response()->json([
                'items' => [],
                'total' => 0
            ]);
        }

        $total = $cart->items->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'items' => $cart->items,
            'total' => $total
        ]);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Lấy hoặc tạo giỏ hàng cho user
        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            // Nếu có rồi thì cập nhật số lượng
            $cartItem->quantity += $validated['quantity'];
            $cartItem->save();
        } else {
            // Nếu chưa có thì tạo mới
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity']
            ]);
        }

        return response()->json($cartItem->load('product'));
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ
     */    public function updateQuantity(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::where('user_id', Auth::id())->firstOrFail();
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->findOrFail($id);

        $cartItem->update([
            'quantity' => $validated['quantity']
        ]);

        return response()->json($cartItem->load('product'));
    }

    /**
     * Xóa sản phẩm khỏi giỏ
     */    public function removeItem($id)
    {
        $cart = Cart::where('user_id', Auth::id())->firstOrFail();
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->findOrFail($id);
        
        $cartItem->delete();

        return response()->json("Đã xóa sản phẩm", 204);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        if ($cart) {
            $cart->items()->delete();
        }
        return response()->json('Đã xóa toàn bộ sản phẩm trong giỏ hàng', 204);
    }

    /**
     * Chuyển giỏ hàng thành đơn hàng
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cod,banking',
            'note' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $cart = Cart::with('items.product')->where('user_id', Auth::id())->firstOrFail();
            
            if ($cart->items->isEmpty()) {
                return response()->json(['message' => 'Cart is empty'], 400);
            }

            // Tính tổng tiền
            $total = $cart->items->sum(function($item) {
                return $item->quantity * $item->product->price;
            });            // Tạo đơn hàng
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
            // Chuyển các item từ giỏ hàng sang đơn hàng
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price
                ]);
            }

            // Xóa giỏ hàng
            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product')
            ], 201);
        
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed'], 500);
        }
    }

}