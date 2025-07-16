<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validate();

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "password" => Hash::make($validated["password"]),
        ]);
        // Gán role có id = 2 (customer)
        $customerRole = Role::where("name", "customer")->first();
        if ($customerRole) {
            $user->roles()->attach($customerRole->id);
        }
        $token = $user->createToken("api-token")->plainTextToken;
        return response()->json(
            ["user" => $user, "access_token" => $token],
            201
        );
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);
        $user = User::where("email", $credentials["email"])->first();
        if (!$user || !Hash::check($credentials["password"], $user->password)) {
            return response()->json(
                ["message" => "Thông tin đăng nhập không đúng"],
                401
            );
        }
        $token = $user->createToken("api-token")->plainTextToken;
        return response()->json(["user" => $user, "access_token" => $token]);
    }

    public function logout(Request $request)
    {
        $request
            ->user()
            ->currentAccessToken()
            ->delete();
        return response()->json(["message" => "Đăng xuất thành công"]);
    }

    public function me(Request $request)
    {
        $user = User::with(["roles", "carts", "orders", "products"])->find(
            $request->user()->id
        );
        return response()->json([
            "user" => $user,
        ]);
    }

    public function updateUser(Request $request)
    {
        $user = $request->user();

        // Validate tùy trường hợp
        $validated = $request->validate([
            "name" => "sometimes|string|max:255",
            "email" =>
                "sometimes|email|max:255|unique:users,email," . $user->id,
            "birthday" => "nullable|date",
            "phone" => "nullable|string|max:20",
            "province" => "nullable|string|max:100",
            "district" => "nullable|string|max:100",
            "ward" => "nullable|string|max:100",
            "address_detail" => "nullable|string|max:255",
        ]);

        // Gán các thông tin khác nếu có
        $fields = [
            "name",
            "email",
            "birthday",
            "phone",
            "province",
            "district",
            "ward",
            "address_detail",
        ];
        foreach ($fields as $field) {
            if (isset($validated[$field])) {
                $user->$field = $validated[$field];
            }
        }

        $user->save();

        return response()->json([
            "message" => "Cập nhật thông tin thành công",
            "user" => $user,
        ]);
    }
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            "old_password" => "required|string",
            "password" => "required|string|min:6|confirmed",
        ]);

        // Kiểm tra mật khẩu cũ có đúng không
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(
                [
                    "message" => "Mật khẩu cũ không đúng",
                ],
                400
            );
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            "message" => "Đổi mật khẩu thành công",
            "user" => $user,
        ]);
    }
}
