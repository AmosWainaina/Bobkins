import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { clearCart } from '../store/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);

  const [coupon, setCoupon] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.discount_price ? Number(item.discount_price) : Number(item.price);
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shippingFee = subtotal > 0 ? 9.99 : 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error('Cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Backend order sync should be implemented next.
      // For now, simulate successful checkout.
      await new Promise((r) => setTimeout(r, 800));
      dispatch(clearCart());
      toast.success('Order placed successfully');
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      toast.error('Checkout failed');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Nothing to checkout</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Add items to your cart first.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 transition">
              Back to shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Checkout</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">OTP-protected secure checkout flow.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-lg p-6">
              <h2 className="text-lg font-bold dark:text-white">Shipping & Contact</h2>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Full name</label>
                  <input className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Phone</label>
                  <input className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3" placeholder="07XXXXXXXX" />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Address</label>
                <textarea className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3 min-h-[110px]" placeholder="Street / area / landmark" />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">City</label>
                  <input className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3" placeholder="Nairobi" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Pincode</label>
                  <input className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3" placeholder="00100" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-lg p-6">
              <h2 className="text-lg font-bold dark:text-white">Order Summary</h2>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-bold dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="font-bold dark:text-white">${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Discount</span>
                  <span className="font-bold dark:text-white">-${discount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Total</span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Coupon</label>
                <div className="mt-2 flex gap-2">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-3" placeholder="e.g. SAVE10" />
                  <button
                    type="button"
                    onClick={() => toast.success('Coupon applied (demo)')}
                    className="rounded-xl bg-gray-900 text-white px-4 py-3 font-bold hover:opacity-90 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 transition"
                >
                  {isPlacingOrder ? 'Placing order...' : 'Place order'}
                </motion.button>
              </div>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Demo checkout. Connect order API for production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

