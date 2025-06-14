import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import CreatableSelect from "react-select/creatable";
import Stack from "../../ReactbitsComponents/Stack/Stack";

function ProductForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [categoryId, setCategoryId] = useState(initialData.category_id || "");
  const [featureImage, setFeatureImage] = useState(null);
  const [featureImageName, setFeatureImageName] = useState(
    initialData.feature_image_name || ""
  );
  const [featureImagePath, setFeatureImagePath] = useState(
    initialData.feature_image_url || ""
  );
  const [content, setContent] = useState(initialData.content || "");
  const [dropdown, setDropdown] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    initialData.tags ? initialData.tags.map((t) => t.name) : []
  );
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const [detailImages, setDetailImages] = useState([]);

  useEffect(() => {
    setName(initialData.name || "");
    setPrice(initialData.price || "");
    setCategoryId(initialData.category_id || "");
    setFeatureImageName(initialData.feature_image_name || "");
    setFeatureImagePath(initialData.feature_image_url || "");
    setContent(initialData.content || "");
    setSelectedTags(
      initialData.tags ? initialData.tags.map((t) => t.name) : []
    );
    // Hiển thị preview các ảnh chi tiết nếu có (chỉ khi edit)
    setDetailImages([]); // reset file input
  }, [initialData]);

  useEffect(() => {
    setLoadingDropdown(true);
    axiosClient
      .get("/categories-dropdown")
      .then((res) => {
        setDropdown(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setDropdown([]))
      .finally(() => setLoadingDropdown(false));
    axiosClient
      .get("/tags")
      .then((res) => {
        setTags(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTags([]));
  }, []);
//
  const images = initialData.images
    ? initialData.images.map((img) => ({
        id: img.id,
        img: img.image_url.startsWith("http")
          ? img.image_url
          : `http://127.0.0.1:8000${img.image_url}`,
      }))
    : [];
    //
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    // Xóa ảnh chi tiết
    try {
      await axiosClient.delete(`/products/${id}`);
      alert("Đã xóa thành công!");
      if (onCancel) onCancel();
    } catch {
      alert("Xóa thất bại!");
    }
  };

  // Helper: chuyển tags về dạng {value, label} cho react-select
  const tagOptions = tags.map((tag) => ({ value: tag.name, label: tag.name }));

  // Khi chọn tag (multi)
  const handleTagSelectChange = (selected) => {
    setSelectedTags(selected ? selected.map((option) => option.value) : []);
  };

  // Khi tạo tag mới: chỉ thêm vào selectedTags, không gọi API ngay
  const handleCreateTag = (inputValue) => {
    setSelectedTags((prev) => [...prev, inputValue]);
    // Nếu tag chưa có trong options thì thêm vào options tạm thời
    if (!tags.some((t) => t.name === inputValue)) {
      setTags((prev) => [...prev, { id: null, name: inputValue }]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFeatureImage(file);
    setFeatureImageName(file ? file.name : "");
  };

  // Khi chọn nhiều ảnh chi tiết
  const handleDetailImagesChange = (e) => {
    setDetailImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category_id", categoryId || "");
    formData.append("content", content);
    if (featureImage) {
      formData.append("feature_image_path", featureImage);
    }
    if (initialData.id) {
      formData.append("id", initialData.id);
    }
    selectedTags.forEach((tagName) => formData.append("tags[]", tagName));
    detailImages.forEach((file) => formData.append("images[]", file));
    try {
      if (initialData.id) {
        await axiosClient.post(
          `/products/${initialData.id}?_method=PUT`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (onCancel) onCancel();
      } else {
        await axiosClient.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (onCancel) onCancel(); // callback để reload bảng hoặc đóng form
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        alert(Object.values(err.response.data.errors).join("\n"));
      } else {
        alert("Lưu sản phẩm thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-7xl mx-auto p-8"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-7 grid-rows-9 gap-4 min-h-[600px]">
          {/* Vị trí 1: Tên sản phẩm */}
          <div className="col-span-5">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2  placeholder-gray-400 dark:placeholder-gray-500"
              required
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Vị trí 2: Giá */}
          <div className="col-span-5 col-start-1 row-start-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Giá
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required
              min={0}
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          {/* Vị trí 3: Danh mục */}
          <div className="col-span-5 col-start-1 row-start-3">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Danh mục
            </label>
            <select
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingDropdown}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {dropdown.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vị trí 4: Mô tả chi tiết */}
          <div className="col-span-5 row-span-5 col-start-1 row-start-4 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Mô tả chi tiết
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 resize-none"
              placeholder="Nhập mô tả chi tiết về sản phẩm"
            />
          </div>

          {/* Vị trí 5: Input chọn ảnh đại diện */}
          <div className="col-span-2 col-start-6 row-start-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {/* {featureImageName && (
              <p className="mt-1 text-xs text-gray-500 truncate">Đã chọn: {featureImageName}</p>
            )} */}
          </div>

          {/* Vị trí 6: Preview ảnh đại diện */}
          <div className="col-span-2 row-span-3 col-start-6 row-start-2 border border-gray-200 rounded-lg p-2 bg-gray-50">
            {featureImagePath && !featureImage ? (
              <img
                src={
                  featureImagePath.startsWith("http")
                    ? featureImagePath
                    : `http://127.0.0.1:8000${featureImagePath}`
                }
                alt="Ảnh đại diện"
                className="w-full h-full object-contain rounded"
              />
            ) : featureImage ? (
              <img
                src={URL.createObjectURL(featureImage)}
                alt="Preview ảnh đại diện"
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm dark:text-gray-300">
                Chưa có ảnh đại diện
              </div>
            )}
          </div>

          {/* Vị trí 7: Input chọn ảnh chi tiết */}
          <div className="col-span-2 col-start-6 row-start-5">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Ảnh chi tiết
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleDetailImagesChange}
              className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Vị trí 8: Stack ảnh chi tiết (dành cho Reactbits) */}
          <div className="col-span-2 row-span-3 col-start-6 row-start-6 p-2">
            <div className="w-full h-full">
              {/* Hiển thị ảnh chi tiết hiện tại khi edit */}
              {initialData.images &&
              initialData.images.length > 0 &&
              !detailImages.length ? (
                <div className="grid grid-cols-2 gap-1 w-full h-[260px]">
                  <Stack
                    randomRotation={true}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    cardDimensions={{ width: 250, height: 250 }}
                    cardsData={images}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Khu vực Reactbits Stack
                </div>
              )}
            </div>
          </div>

          {/* Vị trí 11: Tags */}
          <div className="col-span-7 col-start-1 row-start-9">
            <div className="grid grid-cols-7 grid-rows-1 gap-4 items-end">
              <div className="col-span-4">
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Tags
                </label>
                <CreatableSelect
                  isMulti
                  options={tagOptions}
                  value={selectedTags.map((tagName) => ({
                    value: tagName,
                    label: tagName,
                  }))}
                  onChange={handleTagSelectChange}
                  onCreateOption={handleCreateTag}
                  placeholder="Chọn hoặc nhập tag mới..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-start-5">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Hủy
                </button>
              </div>
              <div className="col-start-6">
                <button
                  type="submit"
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {initialData.id ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
              <div className="col-start-7">
              {initialData.id && (<button
                type="button"
                  onClick={() =>{handleDelete(initialData.id)} }
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Xóa
                </button>)}
                
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;