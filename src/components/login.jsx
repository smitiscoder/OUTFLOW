import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-6 space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full mx-auto" />
        <h1 className="text-2xl font-bold tracking-wide">OutFlow</h1>
      </div>

      {/* Sign-in Buttons */}
      <div className="w-full max-w-sm space-y-4">
        {/* Primary: Phone Login */}
        <button
          className="flex items-center justify-center gap-3 w-full py-3 rounded-full bg-white text-black font-medium text-sm shadow-md"
          onClick={() => navigate("/phone")}
        >
          <FaPhoneAlt size={18} />
          Sign in with Phone Number
        </button>

        {/* Secondary: Google Login */}
        <button className="flex items-center justify-center gap-3 w-full py-3 rounded-full bg-[#1f1f1f] border border-gray-600 text-white font-medium text-sm">
          <FcGoogle size={20} />
          Sign in with Google
        </button>
      </div>

      {/* Divider */}
      <div className="text-gray-500 text-xs mt-8 text-center max-w-xs">
        By signing in, you agree to our{" "}
        <span className="underline">Terms</span> and{" "}
        <span className="underline">Privacy Policy</span>.
      </div>
    </div>
  );
}







