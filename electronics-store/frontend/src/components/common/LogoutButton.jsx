import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = ({ className = "", variant = "default" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Call logout API if you have one
      // await apiClient.post('/accounts/logout/');
      
      dispatch(clearUser());
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API fails
      dispatch(clearUser());
      navigate('/login');
    }
  };

  const variants = {
    default: "flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200",
    outline: "flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200",
    ghost: "flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
  };

  return (
    <button
      onClick={handleLogout}
      className={variants[variant] || variants.default}
    >
      <FiLogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;