import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../common/ProductCard';

const skeletons = Array.from({ length: 8 });

const FeaturedProducts = ({ title, subtitle, products = [], loading = false }) => {
  const safeProducts = Array.isArray(products) ? products : [];

  const gridItems = useMemo(() => {
    if (loading) return skeletons;
    return safeProducts;
  }, [loading, safeProducts]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {!loading && safeProducts.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">{safeProducts.length} items</span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {gridItems.map((p, idx) =>
          loading ? (
            <motion.div
              key={`sk-${idx}`}
              initial={{ opacity: 0.4 }}
              animate-pulse opacity-70
             className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            >
              <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4" />
                <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full" />
              </div>

               <div >
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                > </motion.section>
               </div>
              
            </motion.div>
          ) : (
            <ProductCard key={p.id ?? `${p.slug}-${idx}`} product={p} />
          )
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;

