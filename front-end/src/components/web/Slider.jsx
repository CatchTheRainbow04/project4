import React, { useState, useEffect } from "react";
import sliderApi from "../../services/sliderApi"; // điều chỉnh nếu cần
import "../../styles/user/css/Slider.css"; // CSS riêng

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Tự động chuyển slide
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await sliderApi.getAll();
        setSlides(res.data);
      } catch (err) {
        console.error("Lỗi khi tải slider:", err);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="slider-container">
      <div className="slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
            style={{
              backgroundImage: `url(${slide.image_path.startsWith("http") ? slide.image_path : `http://127.0.0.1:8000/storage/${slide.image_path}`})`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
