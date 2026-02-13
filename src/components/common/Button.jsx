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
  // Base: no rounded corners, uppercase, tracking, transitions
  const baseClasses = 'inline-block uppercase font-bold transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed antialiased';
  
  // Variants – directly from your Home page
  const variants = {
    // White → Pink hover (Explore Shop)
    primary: 'bg-white text-black border border-white hover:bg-pink-400 hover:border-pink-400',
    // Solid pink → White hover (Begin Consultation)
    secondary: 'bg-pink-500 text-black border border-pink-500 hover:bg-white hover:border-white',
    // Transparent + pink border → subtle pink bg (Bespoke Units)
    outline: 'bg-transparent border border-pink-400/50 text-white backdrop-blur-sm hover:bg-pink-400/10 hover:border-pink-400',
    // Ghost – just pink text, no border (for subtle actions)
    ghost: 'bg-transparent text-pink-400 border border-transparent hover:border-pink-400/30',
    // Dark outline – neutral, for secondary actions
    dark: 'bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white',
  };

  // Sizes – matching your px/py and font sizes
  const sizes = {
    sm: 'px-6 py-2.5 text-[9px] tracking-[0.3em]',
    md: 'px-8 py-3 text-[10px] tracking-[0.3em]',
    lg: 'px-10 py-4 text-[10px] tracking-[0.3em]',
    xl: 'px-16 py-6 text-[10px] tracking-[0.4em]',
  };

  // Loading animation – minimalist pink pulse
  const LoadingSpinner = () => (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-[1px] bg-current animate-pulse" />
      <span className="text-current">Loading</span>
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
      {loading ? <LoadingSpinner /> : children}
    </motion.button>
  );
};

export default Button;