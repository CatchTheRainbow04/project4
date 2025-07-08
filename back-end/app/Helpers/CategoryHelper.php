<?php

use App\Models\Category;

if (!function_exists('getAllCategoryIds')) {
    function getAllCategoryIds(Category $category)
    {
        $ids = [$category->id];

        foreach ($category->children as $child) {
            $ids = array_merge($ids, getAllCategoryIds($child));
        }

        return $ids;
    }
}