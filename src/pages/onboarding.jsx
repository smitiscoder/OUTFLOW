import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeDollarSign, PieChart, Wallet, CreditCard } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between px-6 py-10 relative overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center items-center mt-6">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-2"></div>
        <h1 className="text-2xl font-bold">OOTFLOW</h1>
      </div>

      {/* App icons */}
      <div className="relative mt-16 mb-10 h-[200px] flex justify-center items-center">
        <div className="absolute top-0 left-1/3 transform -translate-x-1/2 bg-white/5 backdrop-blur-lg p-4 rounded-2xl">
          <BadgeDollarSign className="text-yellow-400" />
        </div>
        <div className="absolute top-10 right-1/4 transform translate-x-1/2 bg-white/5 backdrop-blur-lg p-4 rounded-2xl">
          <PieChart className="text-purple-400" />
        </div>
        <div className="absolute bottom-10 left-1/4 transform -translate-x-1/2 bg-white/5 backdrop-blur-lg p-4 rounded-2xl">
          <Wallet className="text-green-400"/>
        </div>
        <div className="absolute bottom-0 right-1/3 transform translate-x-1/2 bg-white/5 backdrop-blur-lg p-6 rounded-2xl">
          <CreditCard className="text-blue-400" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center px-4">
        <p className="text-sm text-gray-400">
          Take control of your finances. Track your expenses, set budgets, and manage your money smartly.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 mt-10">
        <button
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium py-3 rounded-full shadow-md hover:opacity-90 transition"
          onClick={() => navigate("/login")}
        >
          Get started
        </button>
        <button
          className="bg-white/10 text-gray-300 font-medium py-3 rounded-full backdrop-blur-sm hover:text-white transition"
          onClick={() => navigate("/register")}
        >
          I have an account
        </button>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-600/10 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}
