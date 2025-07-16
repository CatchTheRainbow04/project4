import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TagsTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await axiosClient.get("/tags");
      setTags(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi tải danh sách tags!");
      }
      setTags([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Tags</h2>
      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 dark:text-black">ID</th>
            <th className="border p-2 dark:text-black">Tên</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} onClick={() => navigate(`/dashboard/tags/edit/${tag.id}`)} className="cursor-pointer hover:bg-gray-50 hover:text-black">
              <td className="border p-2">{tag.id}</td>
              <td className="border p-2">{tag.name}</td>
            </tr>
          ))}
          {tags.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                Không có tag nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TagsTable;
