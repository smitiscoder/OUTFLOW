import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[320px] sm:max-w-[400px] bg-[#1A1A1A] rounded-lg shadow-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#DFDFDF] mb-2">{title}</h3>
              <p className="text-sm sm:text-base text-[#A0A0A0] mb-4 sm:mb-6">{message}</p>
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-[#DFDFDF] hover:bg-[#252525] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog; 