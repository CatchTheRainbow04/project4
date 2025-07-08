<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Tag;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input("q");

        $products = Product::with(["images", "tags", "user", "category"])
            ->where("name", "like", "%" . $query . "%")
            ->orWhere("content", "like", "%" . $query . "%")
            ->get();
        $products->transform(function ($product) {
            $product->feature_image_url = $product->feature_image_path
                ? Storage::url($product->feature_image_path)
                : null;
            if ($product->images) {
                $product->images->transform(function ($img) {
                    $img->image_url = $img->image_path
                        ? Storage::url($img->image_path)
                        : null;
                    return $img;
                });
            }
            return $product;
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        $validated = $request->validate(
            [
                "name" => "required|string|max:255",
                "price" => "required|numeric",
                "feature_image_path" => "required|file|image",
                "category_id" => "required|exists:categories,id",
                "content" => "nullable|string",
                "tags" => "array",
                "tags.*" => "string",
                "images" => "array",
                "images.*" => "file|image",
            ],
            [
                "name.required" => "Tên sản phẩm là bắt buộc.",
                "price.required" => "Giá sản phẩm là bắt buộc.",
                "feature_image_path.required" => "Ảnh đại diện là bắt buộc.",
                "category_id.required" => "Danh mục sản phẩm là bắt buộc.",
            ]
        );

        try {
            // Xử lý upload ảnh đại diện với tên gốc (có thêm timestamp để tránh trùng)
            $featureImage = $request->file("feature_image_path");
            $featureImageName =
                time() . "_" . $featureImage->getClientOriginalName();
            $featureImagePath = $featureImage->storeAs(
                "products/feature",
                $featureImageName,
                "public"
            );

            // Lấy user_id từ user đăng nhập
            $userId = $request->user()->id;

            // Tạo sản phẩm
            $product = Product::create([
                "name" => $validated["name"],
                "price" => $validated["price"],
                "feature_image_path" => $featureImagePath,
                "feature_image_name" => $featureImageName,
                "user_id" => $userId,
                "category_id" => $validated["category_id"],
                "content" => $validated["content"] ?? null,
            ]);

            // Xử lý tags
            $tagIds = [];
            if (!empty($validated["tags"])) {
                foreach ($validated["tags"] as $tagName) {
                    $tag = Tag::firstOrCreate(["name" => $tagName]);
                    $tagIds[] = $tag->id;
                }
                $product->tags()->sync($tagIds);
            }

            // Xử lý upload nhiều ảnh chi tiết với tên gốc (có thêm timestamp)
            if ($request->hasFile("images")) {
                foreach ($request->file("images") as $image) {
                    $imageName = time() . "_" . $image->getClientOriginalName();
                    $imagePath = $image->storeAs(
                        "products/images",
                        $imageName,
                        "public"
                    );
                    ProductImage::create([
                        "product_id" => $product->id,
                        "image_path" => $imagePath,
                        "image_name" => $imageName,
                    ]);
                }
            }

            DB::commit();
            $product->load(["images", "tags", "user", "category"]);
            $product->feature_image_url = $product->feature_image_path
                ? Storage::url($product->feature_image_path)
                : null;
            if ($product->images) {
                $product->images->transform(function ($img) {
                    $img->image_url = $img->image_path
                        ? Storage::url($img->image_path)
                        : null;
                    return $img;
                });
            }
            return response()->json($product, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $product = Product::with([
            "images",
            "tags",
            "user",
            "category",
        ])->findOrFail($id);
        $product->feature_image_url = $product->feature_image_path
            ? Storage::url($product->feature_image_path)
            : null;
        if ($product->images) {
            $product->images->transform(function ($img) {
                $img->image_url = $img->image_path
                    ? Storage::url($img->image_path)
                    : null;
                return $img;
            });
        }
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        DB::beginTransaction();
        try {
            $validated = $request->validate(
                [
                    "name" => "sometimes|required|string|max:255",
                    "price" => "sometimes|required|numeric",
                    "feature_image_path" => "sometimes|file|image",
                    "category_id" => "sometimes|required|exists:categories,id",
                    "content" => "nullable|string",
                    "tags" => "array",
                    "tags.*" => "string",
                    "images" => "array",
                    "images.*" => "file|image",
                ],
                [
                    "name.required" => "Tên sản phẩm là bắt buộc.",
                    "price.required" => "Giá sản phẩm là bắt buộc.",
                    "feature_image_path.required" =>
                        "Ảnh đại diện là bắt buộc.",
                    "category_id.required" => "Danh mục sản phẩm là bắt buộc.",
                ]
            );

            // Cập nhật các trường cơ bản
            $updateData = array_filter([
                "name" => $validated["name"] ?? $product->name,
                "price" => $validated["price"] ?? $product->price,
                "category_id" =>
                    $validated["category_id"] ?? $product->category_id,
                "content" => $validated["content"] ?? $product->content,
            ]);

            // Nếu có upload ảnh đại diện mới, xóa ảnh cũ trước khi lưu ảnh mới
            if ($request->hasFile("feature_image_path")) {
                // Xóa file ảnh cũ nếu tồn tại
                if (
                    $product->feature_image_path &&
                    Storage::disk("public")->exists(
                        $product->feature_image_path
                    )
                ) {
                    Storage::disk("public")->delete(
                        $product->feature_image_path
                    );
                }
                $featureImage = $request->file("feature_image_path");
                $featureImageName =
                    time() . "_" . $featureImage->getClientOriginalName();
                $featureImagePath = $featureImage->storeAs(
                    "products/feature",
                    $featureImageName,
                    "public"
                );
                $updateData["feature_image_path"] = $featureImagePath;
                $updateData["feature_image_name"] = $featureImageName;
            }

            $product->update($updateData);

            // Xử lý tags
            if (isset($validated["tags"])) {
                $tagIds = [];
                foreach ($validated["tags"] as $tagName) {
                    $tag = Tag::firstOrCreate(["name" => $tagName]);
                    $tagIds[] = $tag->id;
                }
                $product->tags()->sync($tagIds);
            }

            // Xử lý upload nhiều ảnh chi tiết mới (nếu có)
            if ($request->hasFile("images")) {
                // Xóa toàn bộ ảnh chi tiết cũ trước khi thêm mới
                $oldImages = $product->images;
                foreach ($oldImages as $img) {
                    if (
                        $img->image_path &&
                        Storage::disk("public")->exists($img->image_path)
                    ) {
                        Storage::disk("public")->delete($img->image_path);
                    }
                    $img->delete();
                }
                foreach ($request->file("images") as $image) {
                    $imageName = time() . "_" . $image->getClientOriginalName();
                    $imagePath = $image->storeAs(
                        "products/images",
                        $imageName,
                        "public"
                    );
                    ProductImage::create([
                        "product_id" => $product->id,
                        "image_path" => $imagePath,
                        "image_name" => $imageName,
                    ]);
                }
            }

            DB::commit();
            $product->load(["images", "tags", "user", "category"]);
            $product->feature_image_url = $product->feature_image_path
                ? Storage::url($product->feature_image_path)
                : null;
            if ($product->images) {
                $product->images->transform(function ($img) {
                    $img->image_url = $img->image_path
                        ? Storage::url($img->image_path)
                        : null;
                    return $img;
                });
            }
            return response()->json($product);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(null, 204);
    }

    public function getProductsByCategory($categoryId)
    {
        $category = Category::with("children")->findOrFail($categoryId);

        $allCategoryIds = getAllCategoryIds($category);

        $products = Product::whereIn("category_id", $allCategoryIds)->get();

        return response()->json($products);
    }
}
