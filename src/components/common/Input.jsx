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
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:border-primary-500 focus:ring-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-3'}
            ${rightIcon ? 'pr-10' : 'pr-3'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            py-2.5 ${inputClassName}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;