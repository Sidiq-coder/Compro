import React from 'react';
import { cn } from '../../utils';

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
  xl: 'h-12 px-10 text-xl',
};

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  children,
  as: Component = 'button',
  ...props
}, ref) => {
  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    
    // Variant styles
    buttonVariants[variant],
    
    // Size styles
    buttonSizes[size],
    
    className
  );

  const buttonProps = {
    ref,
    className: baseClasses,
    ...props
  };

  // If it's a button, add disabled and handle loading
  if (Component === 'button') {
    buttonProps.disabled = disabled || loading;
  }

  return (
    <Component {...buttonProps}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants, buttonSizes };
