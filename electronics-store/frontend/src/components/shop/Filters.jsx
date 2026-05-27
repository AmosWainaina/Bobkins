import React from 'react';

const Filters = ({
  filters,
  setFilters,
  minPrice,
  maxPrice,
  ratingOptions = [0, 3, 4, 5],
}) => {
  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-bold dark:text-white">Filters</h3>

      {/* Category */}
      <label className="mt-4 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Category
      </label>
      <select
        value={filters.category || ''}
        onChange={(e) => update({ category: e.target.value || null })}
        className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
      >
        <option value="">All Categories</option>
      </select>

      {/* Brand */}
      <label className="mt-4 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Brand
      </label>
      <select
        value={filters.brand || ''}
        onChange={(e) => update({ brand: e.target.value || null })}
        className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
      >
        <option value="">All Brands</option>
      </select>

      {/* Ratings */}
      <label className="mt-4 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Minimum Rating
      </label>
      <select
        value={filters.rating || 0}
        onChange={(e) => update({ rating: Number(e.target.value) })}
        className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
      >
        {ratingOptions.map((r) => (
          <option key={r} value={r}>
            {r === 0 ? 'Any' : `${r}+`}
          </option>
        ))}
      </select>

      {/* Price range */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Price</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {filters.minPrice ?? minPrice} - {filters.maxPrice ?? maxPrice}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <input
            type="number"
            value={filters.minPrice ?? ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : null })}
            placeholder={`Min (${minPrice})`}
            className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
          />
          <input
            type="number"
            value={filters.maxPrice ?? ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            placeholder={`Max (${maxPrice})`}
            className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
          />
        </div>
      </div>

      <button
        className="mt-4 w-full py-2 rounded-xl bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 hover:opacity-90 transition"
        onClick={() =>
          setFilters({
            category: null,
            brand: null,
            rating: 0,
            minPrice: null,
            maxPrice: null,
          })
        }
      >
        Reset
      </button>
    </div>
  );
};

export default Filters;

