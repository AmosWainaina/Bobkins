import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ElectroStore
            </p>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Quality electronics at great prices.
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Quick Links</p>
            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a className="hover:text-blue-600 transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:text-blue-600 transition" href="/shop">Shop</a>
              </li>
              <li>
                <a className="hover:text-blue-600 transition" href="/cart">Cart</a>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Contact</p>
            <p className="mt-3 text-gray-600 dark:text-gray-300">support@BOBKINS.com</p>
            <p className="text-gray-600 dark:text-gray-300">+254 115 006114</p>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} BOBKINS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

