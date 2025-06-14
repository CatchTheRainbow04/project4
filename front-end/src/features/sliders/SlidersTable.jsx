import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import axiosClient from "../../services/axiosClient";

// Skeleton component cho layout ngang
const SliderSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
    <div className="flex gap-4 p-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="flex gap-2 mt-3">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

function SlidersTable({ onEditSlider }) {
  const [sliders, setSliders] = useState([]);
  const [filteredSliders, setFilteredSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage] = useState(4); // Hiển thị 4 sliders mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const { value } = e.target;
    debouncedSearch(value);
  };

  const fetchSliders = () => {
    setLoading(true);
    axiosClient.get("/sliders")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setSliders(data);
        setFilteredSliders(data);
      })
      .catch(() => {
        setSliders([]);
        setFilteredSliders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Filter and sort sliders with pagination
  const { paginatedSliders, totalPages, totalItems } = React.useMemo(() => {
    let result = [...sliders];

    // Filter by search
    if (search) {
      result = result.filter(slider =>
        slider.name.toLowerCase().includes(search.toLowerCase()) ||
        (slider.description && slider.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    const total = result.length;
    const pages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = result.slice(startIndex, endIndex);

    return {
      paginatedSliders: paginated,
      totalPages: pages,
      totalItems: total
    };
  }, [sliders, search, sortBy, currentPage, itemsPerPage]);

  // Handle page change with smooth transition
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 150);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa slider này?")) {
      try {
        await axiosClient.delete(`/sliders/${id}`);
        fetchSliders();
      } catch {
        alert("Xóa thất bại!");
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); 
           i <= Math.min(totalPages - 1, currentPage + delta); 
           i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-sm text-gray-600">
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} sliders
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isTransitioning}
            className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={page === '...' || isTransitioning}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isTransitioning}
            className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Sau →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Danh sách slider</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm slider..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SliderSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              {paginatedSliders.map(slider => (
                <motion.div
                  key={slider.id}
                  variants={itemVariants}
                  onClick={(e) => { e.stopPropagation(); onEditSlider(slider); }}
                  className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 relative group flex-shrink-0">
                      {slider.image_url ? (
                        <img
                          src={slider.image_url.startsWith('http')
                            ? slider.image_url
                            : `http://127.0.0.1:8000${slider.image_url}`}
                          alt={slider.name}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">
                            {slider.name}
                          </h3>
                          <span className="text-xs text-gray-400 shrink-0">
                            #{slider.id}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 mb-3">
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {slider.description || "Không có mô tả"}
                          </p>
                        </div>
                      </div>

                      
                      </div>
                    </div>
                  
                </motion.div>
              ))}

              {paginatedSliders.length < 4 && (
                [...Array(4 - paginatedSliders.length)].map((_, index) => (
                  <div key={`empty-${index}`} className="invisible">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="flex gap-4 p-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {paginatedSliders.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64 bg-gray-50 rounded-lg"
            >
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg">Không tìm thấy slider nào</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {!loading && <Pagination />}
    </div>
  );
}

export default SlidersTable;