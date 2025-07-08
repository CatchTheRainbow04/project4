import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

function SliderForm({ initialData = {}, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");

  useEffect(() => {
    setName(initialData.name || "");
    setDescription(initialData.description || "");
    setImage(null);
    setImageName("");
    setImageUrl(initialData.image_url || "");
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : "");
    setImageUrl(file ? URL.createObjectURL(file) : initialData.image_url || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image_path", image);
    }
    console.log("Form data:", name, description, imageName, imageUrl);
    try {
      if (initialData.id) {
        await axiosClient.post(
          `/sliders/${initialData.id}?_method=PUT`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axiosClient.post("/sliders", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success(
        initialData.id ? "Cập nhật slider thành công!" : "Tạo mới slider thành công!"
      );
      if (onCancel) onCancel();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        alert(Object.values(err.response.data.errors).join("\n"));
      } else {
        alert("Lưu slider thất bại!");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa slider này?")) return;
    try {
      await axiosClient.delete(`/sliders/${initialData.id}`);
      alert("Đã xóa thành công!");
      if (onCancel) onCancel();
    } catch {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:border rounded-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-7xl mx-auto p-8"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-5 grid-rows-5 gap-4 min-h-[400px]">
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tên slider
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 placeholder-gray-400 dark:placeholder-gray-500"
              required
              placeholder="Nhập tên slider"
            />
          </div>
          <div className="col-span-3 row-span-2 col-start-1 row-start-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 resize-none"
              placeholder="Nhập mô tả về slider"
              rows={4}
            />
          </div>
          <div className="col-span-2 col-start-4 row-start-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Ảnh slider
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="col-span-2 row-span-3 col-start-4 row-start-2 border rounded-md">
            {imageUrl && !image ? (
              <img
                src={
                  imageUrl.startsWith("http")
                    ? imageUrl
                    : `http://127.0.0.1:8000${imageUrl}`
                }
                alt="Ảnh slider"
                className="w-full h-full object-contain rounded-md"
              />
            ) : image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview ảnh slider"
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm dark:text-gray-300">
                Chưa có ảnh slider
              </div>
            )}
          </div>
          {initialData.id && (
<div className="col-start-2 row-start-4 flex items-end">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Xóa
            </button>
          </div>
          )}
          
          <div className="col-start-3 row-start-4 flex items-end">
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {initialData.id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
          <div className={`flex items-end ${initialData.id ? 'col-start-1 row-start-4' : 'col-start-2 row-start-4'}`}>
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SliderForm;
