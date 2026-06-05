
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiSmartphone, FiUserPlus, FiKey } from "react-icons/fi";
import { apiClient } from "../../services/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    admin_secret: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.full_name.trim().length < 2) {
      toast.error("Please enter your full name");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Include admin secret if provided
      const payload = { 
        phone: formData.phone, 
        full_name: formData.full_name 
      };
      
      if (showAdminField && formData.admin_secret === "0115006114") {
        payload.is_admin = true;
      }
      
      const res = await apiClient.post('/accounts/otp/send/', payload);
      
      if (res.data?.requires_verification) {
        toast.success('OTP sent successfully!');
        navigate('/verify-otp', { 
          state: { 
            phone: formData.phone, 
            full_name: formData.full_name,
            is_admin: payload.is_admin || false
          } 
        });
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTPVerification.jsx - Updated handleVerify function
const handleVerify = async (e) => {
  e.preventDefault();
  
  if (!phone) {
    toast.error('Phone number is required');
    return;
  }
  
  if (!otp || otp.length < 4) {
    toast.error('Please enter a valid OTP');
    return;
  }
  
  setLoading(true);
  try {
    const res = await apiClient.post('/accounts/otp/verify/', { 
      phone, 
      otp_code: otp 
    });
    
    const { access, refresh, user } = res.data;
    
    console.log('User data from backend:', user);
    console.log('is_staff:', user.is_staff);
    console.log('is_superuser:', user.is_superuser);
    
    // Save user + tokens
    const payload = { access, refresh, user };
    dispatch(setUser(payload));
    localStorage.setItem('user', JSON.stringify(payload));
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    toast.success('Login successful!');
    
    // Check admin status
    const isAdmin = user?.is_staff === true || user?.is_superuser === true;
    
    console.log('Is Admin?', isAdmin);
    
    // Use setTimeout to ensure state is updated before redirect
    setTimeout(() => {
      if (isAdmin) {
        console.log('Redirecting to /dashboard');
        navigate('/dashboard');
      } else {
        console.log('Redirecting to /shop');
        navigate('/shop');
      }
    }, 100);
    
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || 'Invalid OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join us with your phone number</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSmartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                We'll send a verification code to this number
              </p>
            </div>

            {/* Optional Admin Registration */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowAdminField(!showAdminField)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showAdminField ? "Hide" : "Register as Admin?"}
              </button>
            </div>

            {showAdminField && (
              <div>
                <label htmlFor="admin_secret" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Secret Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="admin_secret"
                    name="admin_secret"
                    type="password"
                    value={formData.admin_secret}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter admin secret key"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Contact system admin for the secret key
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiUserPlus className="mr-2" />
                  Register & Send OTP
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;