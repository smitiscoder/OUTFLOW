import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] flex flex-col px-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)] -z-10" />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </motion.button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-[#DFDFDF]"
            >
              Reset Password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#A0A0A0] text-sm"
            >
              Enter your email to receive a password reset link
            </motion.p>
          </div>

          {/* Reset Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#DFDFDF]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#252525] rounded-lg text-[#DFDFDF] placeholder-[#A0A0A0] focus:outline-none focus:border-[#DFDFDF] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-green-500 text-center"
              >
                Password reset link has been sent to your email
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#252525] text-[#DFDFDF] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : success ? 'Link Sent' : 'Send Reset Link'}
            </motion.button>
          </motion.form>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-[#A0A0A0]"
          >
            Remember your password?{' '}
            <button
              onClick={() => navigate('/email-login')}
              className="text-[#DFDFDF] hover:underline"
            >
              Sign in
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;