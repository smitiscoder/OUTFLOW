import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../../components/firebase';

export default function EmailLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          navigate('/'); // Redirect to root (Home)
          unsubscribe();
        }
      });
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center items-center px-6 space-y-8 overflow-hidden">
      <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#9333EA] via-[#7B2CBF] to-transparent opacity-50 blur-[80px] z-0" />
      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">OUTFLOW</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-[#9333EA] text-sm"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-[#9333EA] text-sm"
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="text-center space-y-2">
            <div>
              <button
                type="button"
                className="text-gray-400 text-sm hover:text-[#9333EA] transition-colors"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-[#9333EA] hover:text-[#7B2CBF] transition-colors"
                onClick={() => navigate('/signup')}
              >
                Create account
              </button>
            </div>
          </div>
        </form>
        <div className="text-gray-500 text-xs mt-8 text-center mx-auto max-w-xs">
          By signing in, you agree to our{' '}
          <span className="">Terms</span> and{' '}
          <span className="">Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}