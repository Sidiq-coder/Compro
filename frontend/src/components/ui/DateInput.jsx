import React from 'react';
import { cn } from '../../utils';

const DateInput = React.forwardRef(({ 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type="date"
      className={cn(
        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
        error ? "border-red-300 focus:ring-red-500" : "border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

DateInput.displayName = "DateInput";

export { DateInput };
