import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeDollarSign, PieChart, Wallet, CreditCard } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Onboarding() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hover: {
      y: -5,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white flex flex-col justify-between px-6 py-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-purple-600/20 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-600/10 blur-3xl rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full animate-float-slower" />
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center mt-6"
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-2 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">  
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">OUTFLOW</h1>
      </motion.div>

      {/* App icons */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative mt-16 mb-10 h-[250px] flex justify-center items-center"
      >
        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          className="absolute top-0 left-1/3 transform -translate-x-1/2 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 backdrop-blur-lg p-4 rounded-2xl border border-yellow-500/20 shadow-lg"
        >
          <motion.div variants={iconVariants}>
            <BadgeDollarSign className="text-yellow-400" size={28} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          className="absolute top-10 right-1/4 transform translate-x-1/2 bg-gradient-to-br from-purple-500/10 to-purple-600/20 backdrop-blur-lg p-4 rounded-2xl border border-purple-500/20 shadow-lg"
        >
          <motion.div variants={iconVariants}>
            <PieChart className="text-purple-400" size={28} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          className="absolute bottom-10 left-1/4 transform -translate-x-1/2 bg-gradient-to-br from-green-500/10 to-green-600/20 backdrop-blur-lg p-4 rounded-2xl border border-green-500/20 shadow-lg"
        >
          <motion.div variants={iconVariants}>
            <Wallet className="text-green-400" size={28} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          className="absolute bottom-0 right-1/3 transform translate-x-1/2 bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-lg p-4 rounded-2xl border border-blue-500/20 shadow-lg"
        >
          <motion.div variants={iconVariants}>
            <CreditCard className="text-blue-400" size={28} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center px-4"
      >
        <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-100 to-pink-100 bg-clip-text text-transparent">
          Smart Finance Management
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
          Take full control of your finances. Track expenses, set budgets, analyze spending patterns, and achieve your financial goals with ease.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-4 mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium py-3 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          onClick={() => navigate("/login")}
        >
          <span className="relative z-10">Get started</span>
          <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-500 mt-8"
      >
        Join thousands who already manage their money smarter
      </motion.div>
    </div>
  );
}
