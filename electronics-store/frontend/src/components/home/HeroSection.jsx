import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ isLoading }) => {
  return (
    <header className="relative overflow-hidden min-h-[92vh] flex items-center bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(99,102,241,0.18),transparent_45%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-blue-600/30 to-purple-600/25 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium dark:text-gray-200">Premium electronics & accessories</span>
            </div>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white max-w-2xl">
              Future-ready gear for
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              everyday power.
              </span>
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
              Slick designs. Fast performance. Secure checkout.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
               className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center"
                href="/shop"
              >
                Shop Now
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                className="px-7 py-3 rounded-full bg-white/70 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800/50 text-gray-900 dark:text-white font-semibold backdrop-blur hover:bg-white/90 transition text-center"
                href="/deals"
              >
                View Deals
              </motion.a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: 'Fast', v: 'Delivery' },
                { k: 'Secure', v: 'Payments' },
                { k: 'Premium', v: 'Support' },
              ].map((x, idx) => (
                <motion.div
                  key={x.k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 p-4 shadow-sm"
                >
                  <div className="text-sm font-semibold dark:text-white">{x.k}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{x.v}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-white/40 dark:border-gray-800/50 shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Flash Banner</div>
                    <div className="text-2xl font-bold dark:text-white">Up to 10% OFF</div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 font-semibold">
                    Limited Time
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { t: 'All', s: 'Chargers' },
                    { t: 'Gaming', s: 'Accessories' },
                    { t: 'Smart', s: 'Home' },
                    { t: 'Audio', s: 'Devices' },
                  ].map((x) => (
                    <motion.div
                      key={x.t}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl bg-white/80 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 p-4"
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">{x.t}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{x.s}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6">
                  {isLoading ? (
                    <div className="h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  ) : (
                    <div className="h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow">
                      Checkout securely with OTP verification
                    </div>
                  )}
                </div>
              </div>

              <div className="h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;

