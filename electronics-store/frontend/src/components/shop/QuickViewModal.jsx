import React from 'react';

const QuickViewModal = ({ open, product, onClose }) => {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick View</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-300"
            type="button"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
          <img
            src={product.images?.[0]?.image || product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover"
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {product.description || product.short_description || 'No description available.'}
            </p>
            <p className="mt-4 text-2xl font-bold text-blue-600">${product.final_price ?? product.price}</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

