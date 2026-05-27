import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { API_URL } from '../../services/api';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/categories/`);
        const data = res.data?.results || res.data || [];
        if (mounted) setCategories(data);
      } catch (e) {
        // keep UI resilient
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2400,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Shop by Category</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Explore futuristic categories</p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {(categories || []).map((c) => (
              <motion.a  className="group px-2"
                key={c.id}
                whileHover={{ scale: 1.03, y: -3 }}
                href={`/shop?category=${c.slug}`}
                className="px-2"
              >
                <div className="h-20 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-sm flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 px-2">
                    {c.name}
                  </span>
                </div>
              </motion.a>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default CategorySlider;

