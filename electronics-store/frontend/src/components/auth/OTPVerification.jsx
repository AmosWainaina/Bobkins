import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { FiShield, FiCheck, FiArrowLeft, FiRefreshCw, FiPhone } from 'react-icons/fi';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get phone from location state or query params
    if (!phone) {
      const params = new URLSearchParams(location.search);
      const p = params.get('phone');
      if (p) setPhone(p);
    }
  }, [location, phone]);

  // Auto-start countdown on mount
  useEffect(() => {
    if (phone) {
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phone]);

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
        otp_code: otp,
      });

      const { access, refresh, user } = res.data;

      // DEBUG: Log what the backend actually returns
      console.log('=== BACKEND RESPONSE ===');
      console.log('Full response:', res.data);
      console.log('User object:', user);
      console.log('is_staff:', user?.is_staff);
      console.log('is_superuser:', user?.is_superuser);
      console.log('========================');

      // Save user + tokens to Redux and localStorage
      const payload = { access, refresh, user };
      dispatch(setUser(payload));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      toast.success('Login successful! Welcome back.');

      // Determine admin status from returned user object
      const isAdmin = user?.is_staff === true ||
                      user?.role === 'admin' ||
                      user?.is_superuser === true ||
                      user?.user_type === 'admin';

      console.log('Is admin determined?', isAdmin);

      // Navigate after state/tokens are set
      if (isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error('Access denied. You do not have permission to login.');
      } else {
        toast.error(err.response?.data?.error || 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before resending`);
      return;
    }
    
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }
    
    setResendLoading(true);
    try {
      const res = await apiClient.post('/accounts/otp/send/', { phone });
      
      if (res.data?.requires_verification) {
        toast.success('OTP resent successfully!');
        setCountdown(30);
        
        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
              <FiShield className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
            <p className="mt-2 text-gray-600">
              We've sent a verification code to
              <br />
              <span className="font-semibold text-purple-600 flex items-center justify-center gap-1 mt-1">
                <FiPhone className="h-4 w-4" />
                {phone || 'your phone number'}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Phone Field (Hidden but kept for form) */}
            {!location.state?.phone && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            )}

            {/* OTP Field */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                maxLength="6"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiCheck className="mr-2" />
                  Verify & Login
                </div>
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="mr-1 h-4 w-4" />
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the code? Check your phone number or try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;