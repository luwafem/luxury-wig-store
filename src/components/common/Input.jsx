import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2 ${labelClassName}`}>
          {label}
          {props.required && <span className="text-pink-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            block w-full bg-transparent border
            ${error ? 'border-pink-400' : 'border-white/10'}
            text-white placeholder:text-neutral-700 uppercase
            focus:border-pink-400 focus:outline-none
            disabled:bg-white/5 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'px-4'}
            ${rightIcon ? 'pr-10' : 'px-4'}
            py-3 text-sm transition-colors
            ${inputClassName}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;