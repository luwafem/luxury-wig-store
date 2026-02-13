import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes – no rounding, uppercase, tracking, magnetic
  const baseClasses = 'group relative overflow-hidden inline-block uppercase font-bold transition-all duration-700 disabled:opacity-40 disabled:cursor-not-allowed antialiased';
  
  // Magnetic variants – each with border, text, and hover fill
  const variants = {
    // White border, white text → hover white fill + black text
    primary: 'border border-white text-white bg-transparent hover:border-white',
    
    // Pink border, pink text → hover pink fill + white text
    secondary: 'border border-pink-400/30 text-pink-300 bg-transparent hover:border-pink-400/50',
    
    // Light border, neutral text → hover white fill + white text
    outline: 'border border-white/20 text-neutral-400 bg-transparent hover:border-white/40',
    
    // No border, pink text → hover border appears (subtle)
    ghost: 'border border-transparent text-pink-400 bg-transparent hover:border-pink-400/30',
    
    // Dark border, white text → same as outline (for consistency)
    dark: 'border border-white/20 text-white/80 bg-transparent hover:border-white/40 hover:text-white',
  };

  // Sizes – matching the atelier’s typographic scale
  const sizes = {
    sm: 'px-6 py-2.5 text-[9px] tracking-[0.3em]',
    md: 'px-8 py-3 text-[10px] tracking-[0.3em]',
    lg: 'px-10 py-4 text-[10px] tracking-[0.3em]',
    xl: 'px-16 py-6 text-[10px] tracking-[0.4em]',
  };

  // Fill animation – coloured overlay that expands on hover
  const getFillColor = (variant) => {
    switch (variant) {
      case 'secondary': return 'bg-pink-400/10';
      case 'ghost': return 'bg-transparent'; // no fill
      default: return 'bg-white/10';
    }
  };

  const fillColor = getFillColor(variant);

  // Loading spinner – consistent pink spinner
  const LoadingSpinner = () => (
    <span className="flex items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 border border-pink-500/30 border-t-pink-500 rounded-full"
      />
      <span className="text-current">Processing</span>
    </span>
  );

  const classes = `
    ${baseClasses}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Magnetic fill – only for variants that support it */}
      {variant !== 'ghost' && (
        <motion.div
          className={`absolute inset-0 w-0 ${fillColor} transition-all duration-700 ease-out group-hover:w-full`}
          whileHover={{ width: '100%' }}
        />
      )}
      
      {/* Content – appears above the fill */}
      <span className="relative z-10 group-hover:text-white transition-colors duration-700">
        {loading ? <LoadingSpinner /> : children}
      </span>
    </motion.button>
  );
};

export default Button;