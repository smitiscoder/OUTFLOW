import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../../components/firebase';


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-6 space-y-8 overflow-hidden">
      <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-600 via-purple-800 to-transparent opacity-30 blur-[100px] z-0" />
      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold tracking-wide">OUTFLOW</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {message && (
            <div className="text-green-500 text-sm text-center">{message}</div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-full bg-white text-black font-medium text-sm shadow-md transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="text-center text-gray-400 text-sm">
          Back to{' '}
          <button
            type="button"
            className="text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => navigate('/email')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}