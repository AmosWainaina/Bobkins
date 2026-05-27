import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { API_URL } from '../services/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import QuickViewModal from '../components/shop/QuickViewModal';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const [adding, setAdding] = useState(false);

  const image = useMemo(() => product?.images?.[0]?.image, [product]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/${slug}/`);
        if (!mounted) return;
        setProduct(res.data);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock === 0) return;

    setAdding(true);
    try {
      dispatch(addToCart({ ...product, quantity: qty }));
      toast.success('Added to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${API_URL}/products/${product.slug}/add_review/`,
        reviewForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      // optional: refetch
    } catch (err) {
      console.error(err);
      toast.error('Unable to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-500 dark:text-gray-400">
          Product not found.
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800/50 shadow-lg overflow-hidden">
                <div className="h-[420px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={image || '/placeholder.jpg'}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain p-8"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto">
                {(product.images || []).map((img, idx) => (
                  <div key={idx} className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200/70 dark:border-gray-700/70 overflow-hidden">
                    <img src={img.image} alt={`${product.name}-${idx}`} className="w-full h-full object-contain p-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800/50 shadow-lg p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">{product.name}</h1>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-yellow-400">
                        {'★'.repeat(Math.floor(product.rating || 0))}{'☆'.repeat(5 - Math.floor(product.rating || 0))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({product.total_reviews || 0} reviews)</span>
                    </div>
                  </div>
                  {product.discount_percentage > 0 && (
                    <div className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-sm">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold text-blue-600">${product.discount_price ? product.discount_price : product.price}</span>
                    {product.discount_price && (
                      <span className="text-gray-400 line-through text-lg">${product.price}</span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${inStock ? 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'}`}>
                    {inStock ? `In stock • ${product.stock} available` : 'Out of stock'}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:opacity-90 transition"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <div className="min-w-[64px] text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Quantity</div>
                      <div className="text-xl font-bold dark:text-white">{qty}</div>
                    </div>
                    <button
                      className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:opacity-90 transition"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={!inStock || adding}
                      className={`py-3 rounded-full font-bold transition ${inStock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {adding ? 'Adding...' : 'Add to Cart'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={!inStock}
                      className={`py-3 rounded-full font-bold transition ${inStock ? 'bg-white dark:bg-gray-200 text-gray-900 dark:text-gray-900 hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold dark:text-white">Specifications</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications || {}).map(([k, v]) => (
                      <div key={k} className="rounded-2xl bg-gray-50/70 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700/70 p-4">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{k}</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{String(v)}</div>
                      </div>
                    ))}
                    {Object.keys(product.specifications || {}).length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 col-span-full">No specifications provided.</div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold dark:text-white">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                        className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2"
                      >
                        {[5,4,3,2,1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition py-2">
                        Submit
                      </button>
                    </div>

                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your thoughts..."
                      className="mt-3 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-2 min-h-[110px]"
                      required
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mt-8">
          <h3 className="text-xl font-bold dark:text-white">Related Products</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
        </div>
      </div>

      <QuickViewModal open={false} onClose={() => {}} product={null} />
    </div>
  );
};

export default ProductDetails;

