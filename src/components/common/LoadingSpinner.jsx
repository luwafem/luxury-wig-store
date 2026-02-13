import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border',
    sm: 'w-6 h-6 border',
    md: 'w-8 h-8 border',
    lg: 'w-12 h-12 border-2',
    xl: 'w-16 h-16 border-2',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-pink-500/30 border-t-pink-500 rounded-full`}
      />
    </div>
  );
};

export default LoadingSpinner;