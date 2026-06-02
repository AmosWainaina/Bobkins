import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiSun, FiMoon, FiMenu, FiX, FiSearch, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import useDarkMode from '../../hooks/useDarkMode';
import { API_URL } from '../../services/api';
import axios from 'axios';
import { clearUser } from '../../store/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const cartCount = useSelector(state =>
    state.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  );
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user?.is_staff === true || 
                  user?.role === 'admin' || 
                  user?.is_superuser === true ||
                  user?.user_type === 'admin';

  const handleLogout = () => {
    dispatch(clearUser());
    toast.success('Logged out successfully!');
    navigate('/login');
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await axios.get(`${API_URL}/products/?search=${query}`);
        setSearchResults(response.data?.results || response.data || []);
      } catch (error) {
        console.error(error);
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BOBKINS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">Home</Link>
            <Link to="/shop" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">Shop</Link>
            <Link to="/deals" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">Deals</Link>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border max-h-96 overflow-y-auto z-50"
                  >
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <img src={product.images?.[0]?.image} alt={product.name} className="w-12 h-12 object-contain" />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-blue-600">${product.final_price}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu - Desktop */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <FiUser size={20} />
                  <span className="text-sm hidden lg:inline">
                    {user?.full_name?.split(' ')[0] || user?.phone?.slice(-6) || 'User'}
                  </span>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user?.phone || ''}
                        </p>
                      </div>
                      
                      <Link
                        to="/shop"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiGrid size={16} />
                        <span>Shop</span>
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiSettings size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <FiUser size={20} />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t"
          >
            <div className="px-4 py-2 space-y-3">
              <Link to="/" className="block py-2" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/shop" className="block py-2" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link to="/deals" className="block py-2" onClick={() => setIsOpen(false)}>Deals</Link>
              
              {isAuthenticated && isAdmin && (
                <Link to="/dashboard" className="block py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
              )}
              
              <div className="py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;