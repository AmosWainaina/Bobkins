import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone) {
      // try query param
      const params = new URLSearchParams(location.search);
      const p = params.get('phone');
      if (p) setPhone(p);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!phone || !otp) return toast.error('Provide phone and OTP');
    setLoading(true);
    try {
      const res = await apiClient.post('/accounts/otp/verify/', { phone, otp_code: otp });
      const { access, refresh, user } = res.data;
      // save user+tokens
      const payload = { access, refresh, user };
      dispatch(setUser(payload));
      localStorage.setItem('user', JSON.stringify(payload));
      toast.success('Logged in');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">OTP Verification</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Enter the OTP sent to your phone.</p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900"
          />
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold">
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Back to <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
