import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error('Please enter your phone number');
    setLoading(true);
    try {
      const res = await apiClient.post('/accounts/otp/send/', { phone });
      if (res.data?.requires_verification) {
        toast.success('OTP sent');
        navigate('/verify-otp', { state: { phone } });
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Enter your phone to receive an OTP.</p>
        <form onSubmit={handleSendOTP} className="space-y-4">
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900"
          />
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Need an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
