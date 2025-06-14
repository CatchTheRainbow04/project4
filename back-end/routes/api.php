<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Các route công khai (không cần đăng nhập)
Route::post('/register', [AuthController::class, 'register']); // Đăng ký tài khoản mới
Route::post('/login', [AuthController::class, 'login']); // Đăng nhập, trả về token

// Route công khai cho danh mục
Route::get('/categories', [CategoryController::class, 'index']); // Lấy danh sách danh mục
Route::get('/categories-tree', [CategoryController::class, 'tree']); // Lấy danh sách danh mục dạng tree
Route::get('/categories-dropdown', [CategoryController::class, 'dropdown']); // Lấy danh sách danh mục dạng dropdown

// Route công khai cho sản phẩm
Route::get('/products', [ProductController::class, 'index']); // Lấy danh sách sản phẩm
Route::get('/products/{id}', [ProductController::class, 'show']); // Lấy chi tiết sản phẩm

// Route công khai cho sliders
Route::get('/sliders', [SliderController::class, 'index']); // Lấy danh sách sliders
Route::get('/sliders/{id}', [SliderController::class, 'show']); // Lấy chi tiết slider (nếu cần)

// Các route yêu cầu đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']); // Đăng xuất
    Route::get('/me', [AuthController::class, 'me']); // Lấy thông tin user đang đăng nhập
    Route::put('/me', [AuthController::class, 'update']); // Cập nhật thông tin user

    // Route resource cho category (CRUD, trừ index)
    Route::apiResource('categories', CategoryController::class)->except(['index']);

    // Route resource cho product (CRUD, trừ index và show)
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Route resource cho slider (CRUD, trừ index và show)
    Route::apiResource('sliders', SliderController::class)->except(['index', 'show']);

    // Các route khác giữ nguyên
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    Route::get('parent-permissions', [PermissionController::class, 'getParentPermissions']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'syncPermissions']);
    Route::post('roles/{role}/users', [RoleController::class, 'syncUsers']);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('product-images', ProductImageController::class);
    Route::apiResource('settings', SettingController::class);

    // Giỏ hàng
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart/items', [CartController::class, 'addToCart']);
    Route::patch('cart/items/{id}', [CartController::class, 'updateQuantity']);
    Route::delete('cart/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('cart', [CartController::class, 'clear']);
    Route::post('cart/checkout', [CartController::class, 'checkout']);

    // Quản lý đơn hàng
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::put('orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::get('orders-statistics', [OrderController::class, 'statistics']);

    // Quản lý thanh toán
    Route::get('payments', [PaymentController::class, 'index']);
    Route::get('payments/{id}', [PaymentController::class, 'show']);
    Route::post('orders/{orderId}/process-payment', [PaymentController::class, 'processPayment']);

    // Quản lý users
    Route::apiResource('users', UserController::class)->except(['index', 'show']); // Chỉ cho phép admin quản lý users
    Route::get('users', [UserController::class, 'index']); // Lấy danh sách users (Admin only)
    Route::get('users/{id}', [UserController::class, 'show']); // Lấy chi tiết user (Admin only)
    Route::put('users/{id}', [UserController::class, 'update']); // Cập nhật thông tin user (Admin only)
    Route::delete('users/{id}', [UserController::class, 'destroy']); // Xóa user (Admin only)
    // Thống kê về users (Admin only)
    Route::get('users-statistics', [UserController::class, 'statistics']);
});