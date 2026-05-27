import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySlider from '../components/home/CategorySlider';
import toast from 'react-hot-toast';
import { API_URL } from '../services/api';

const Home = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const [f, t, n] = await Promise.all([
          axios.get(`${API_URL}/products/?is_featured=true&page=1`),
          axios.get(`${API_URL}/products/?ordering=-rating&page=1`),
          axios.get(`${API_URL}/products/?ordering=-created_at&page=1`),
        ]);

        if (!mounted) return;
        setFeatured(f.data?.results || f.data || []);
        setTrending(t.data?.results || t.data || []);
        setNewArrivals(n.data?.results || n.data || []);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load products');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [API_URL]);

  return (
    <div className="min-h-screen">
      <HeroSection isLoading={isLoading} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Featured Electronics</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Premium picks hand-curated for you</p>
        </motion.div>

        <div className="mt-6">
          <FeaturedProducts loading={isLoading} products={featured} title="Featured" />
        </div>

        <div className="mt-12">
          <CategorySlider />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeaturedProducts loading={isLoading} products={trending} title="Trending" subtitle="High-demand electronics & accessories" />
          <FeaturedProducts loading={isLoading} products={newArrivals} title="New Arrivals" subtitle="Fresh drops just landed" />
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 border-t border-b border-gray-200/40 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { k: 'Fast Delivery', v: '2-5 business days' },
              { k: 'Secure Payments', v: 'OTP + JWT protected checkout' },
              { k: 'Premium Support', v: 'Live chat & quick resolution' },
            ].map((x) => (
              <motion.div
                key={x.k}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 p-6 shadow-lg"
              >
                <h3 className="font-semibold text-lg dark:text-white">{x.k}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{x.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

