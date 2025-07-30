import React from 'react';
import { cn } from '../../utils';

const Checkbox = React.forwardRef(({ 
  className,
  children,
  id,
  checked,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {children && (
        <div className="ml-3 text-sm">
          <label 
            htmlFor={id}
            className={cn(
              "font-medium text-gray-900",
              disabled ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {children}
          </label>
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
