import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContinueWithGoogle from './ContinuewithGoogle';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] flex flex-col justify-center items-center px-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)] -z-10" />
      
      {/* Main content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Title */}
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-[#DFDFDF]"
          >
            Welcome to OUTFLOW
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#A0A0A0] text-sm"
          >
            Track your expenses, manage your budget
          </motion.p>
        </div>

        {/* Login Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <ContinueWithGoogle />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1A1A1A]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0D0D0D] text-[#A0A0A0]">or</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/email')}
            className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#252525] text-[#DFDFDF] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            Sign in with Email
          </motion.button>
        </motion.div>

        {/* Terms and Privacy */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-[#A0A0A0] mt-8"
        >
          By continuing, you agree to our{' '}
          <button 
            onClick={() => navigate('/terms')}
            className="text-[#DFDFDF] hover:underline"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button 
            onClick={() => navigate('/privacy')}
            className="text-[#DFDFDF] hover:underline"
          >
            Privacy Policy
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;