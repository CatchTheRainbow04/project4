<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {  
        return [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'feature_image_path' => 'sometimes|file|image',
            'category_id' => 'sometimes|required|exists:categories,id',
            'content' => 'nullable|string',
            'tags' => 'array',
            'tags.*' => 'string',
            'images' => 'array',
            'images.*' => 'file|image',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.string' => 'Tên sản phẩm phải là chuỗi.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',

            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'price.numeric' => 'Giá sản phẩm phải là số.',

            'feature_image_path.required' => 'Vui lòng chọn ảnh đại diện cho sản phẩm.',
            'feature_image_path.image' => 'Ảnh đại diện phải là hình ảnh hợp lệ.',

            'category_id.required' => 'Danh mục sản phẩm là bắt buộc.',
            'category_id.exists' => 'Danh mục được chọn không hợp lệ.',

            'content.string' => 'Mô tả sản phẩm phải là chuỗi văn bản.',

            'tags.array' => 'Tags phải là một mảng.',
            'tags.*.string' => 'Mỗi tag phải là chuỗi.',

            'images.array' => 'Ảnh chi tiết phải là một mảng.',
            'images.*.image' => 'Mỗi ảnh chi tiết phải là hình ảnh hợp lệ.',
        ];
    }
}