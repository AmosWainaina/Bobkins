import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);


  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.discount_price ? Number(item.discount_price) : Number(item.price);
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shippingFee = subtotal > 0 ? 9.99 : 0;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Removed');
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Your cart is empty</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Explore premium electronics & accessories.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 transition"
            >
              Shop now
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
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Cart</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Review items before checkout.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-lg overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-200/60 dark:border-gray-800/60">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold dark:text-white">Items</h2>
                  <button
                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                    onClick={() => dispatch(clearCart())}
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
                {cartItems.map((item) => {
                  const price = item.discount_price ? Number(item.discount_price) : Number(item.price);
                  const lineTotal = price * item.quantity;
                  return (
                    <div key={item.id} className="p-5 sm:p-6 flex gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200/70 dark:border-gray-700/70 overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0]?.image || item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-bold dark:text-white">{item.name}</h3>
                            {item.discount_price ? (
                              <div className="mt-1 text-sm text-red-600 font-semibold">
                                ${(Number(item.price)).toFixed(2)} → ${price.toFixed(2)}
                              </div>
                            ) : (
                              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">${price.toFixed(2)}</div>
                            )}
                          </div>
                          <button
                            className="text-sm text-red-600 hover:text-red-700 font-semibold"
                            onClick={() => handleRemove(item.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:opacity-90 transition"
                            onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          >
                            -
                          </button>
                          <div className="min-w-[56px] text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Qty</div>
                            <div className="font-extrabold dark:text-white">{item.quantity}</div>
                          </div>
                          <button
                            className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:opacity-90 transition"
                            onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.quantity + 1 }))}
                          >
                            +
                          </button>

                          <div className="ml-auto text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Line total</div>
                            <div className="font-extrabold dark:text-white">${lineTotal.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-lg p-6">
              <h2 className="text-lg font-bold dark:text-white">Summary</h2>

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

              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 transition"
                >
                  Proceed to checkout
                </Link>
              </div>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Secure checkout powered by OTP + JWT authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

