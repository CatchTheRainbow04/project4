import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

const TagsTable = ({onEditTag}) => {
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    const res = await axiosClient.get("/tags");
    setTags(res.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async (data) => {
    try {
      await axiosClient.post("/tags", data);
      fetchTags();
    } catch (error) {
      alert("Tên tag đã tồn tại hoặc không hợp lệ.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Tags</h2>
      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} onClick={() => onEditTag(tag)}>
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
