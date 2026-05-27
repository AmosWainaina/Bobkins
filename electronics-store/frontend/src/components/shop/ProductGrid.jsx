import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../services/api';
import ProductCard from '../common/ProductCard';
import QuickViewModal from './QuickViewModal';



const ProductGrid = ({
  initialFilters,
  sortBy,
  pageSize = 20,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [quickView, setQuickView] = useState({ open: false, product: null });

  const queryString = useMemo(() => {
    const f = initialFilters || {};
    const params = new URLSearchParams();

    // Note: Backend product endpoint supports some filter fields.
    if (f.category) params.append('category__slug', f.category);
    if (f.brand) params.append('brand__slug', f.brand);
    if (f.rating && f.rating >= 3) params.append('rating__gte', f.rating);
    if (f.minPrice != null) params.append('price__gte', f.minPrice);
    if (f.maxPrice != null) params.append('price__lte', f.maxPrice);

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        params.append('ordering', 'price');
        break;
      case 'price_desc':
        params.append('ordering', '-price');
        break;
      case 'popular':
        params.append('ordering', '-rating');
        break;
      case 'latest':
        params.append('ordering', '-created_at');
        break;
      default:
        params.append('ordering', '-created_at');
        break;
    }

    params.append('page', page);
    params.append('page_size', pageSize);
    return params.toString();
  }, [initialFilters, sortBy, page, pageSize]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/?${queryString}`);
        const data = res.data;
        const results = data?.results || [];

        if (!mounted) return;

        if (page === 1) {
          setProducts(results);
        } else {
          setProducts((prev) => [...prev, ...results]);
        }

        // Detect pagination
        setHasMore(Boolean(data?.next));
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setHasMore(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [queryString]);

  // Reset page when filters/sort change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [initialFilters, sortBy]);

  return (
    <div>
      <div className="min-h-[420px]">
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden"
              >
                <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4" />
                  <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <div
                    onDoubleClick={() => setQuickView({ open: true, product: p })}
                  >
                    <ProductCard product={p} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center">
        {hasMore && !loading && (
          <button
            onClick={() => setPage((x) => x + 1)}
           className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl hover:scale-[1.03] transition-all duration-300"
          >
            Load more
          </button>
        )}
        {!hasMore && !loading && products.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">No products found.</div>
        )}
      </div>

      <QuickViewModal
        open={quickView.open}
        onClose={() => setQuickView({ open: false, product: null })}
        product={quickView.product}
      />
    </div>
  );
};

export default ProductGrid;

