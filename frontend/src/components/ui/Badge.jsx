import React from 'react';
import { cn } from '../../utils';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
};

const Badge = React.forwardRef(({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants, badgeSizes };
