import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Filters from '../components/shop/Filters';
import ProductGrid from '../components/shop/ProductGrid';

const Shop = () => {
  const [filters, setFilters] = useState({
    category: null,
    brand: null,
    rating: 0,
    minPrice: null,
    maxPrice: null,
  });

  const [sortBy, setSortBy] = useState('latest');

  const priceBounds = useMemo(() => ({ minPrice: 0, maxPrice: 5000 }), []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Shop</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Filter, compare, and find your next premium electronics.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Filters
              filters={filters}
              setFilters={setFilters}
              minPrice={priceBounds.minPrice}
              maxPrice={priceBounds.maxPrice}
            />

            <div className="mt-4 bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-bold dark:text-white">Sort</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-3 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most popular</option>
                <option value="price_asc">Price low to high</option>
                <option value="price_desc">Price high to low</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-9">
            <ProductGrid initialFilters={filters} sortBy={sortBy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

