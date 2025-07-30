import React from 'react';
import { cn } from '../../utils';
import { Checkbox } from './Checkbox';

const PermissionCard = ({ 
  title, 
  description,
  checked = false,
  onChange,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-colors",
      checked 
        ? "border-blue-300 bg-blue-50" 
        : "border-gray-200 bg-white hover:border-gray-300",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <Checkbox
        id={`permission-${title.toLowerCase().replace(/\s+/g, '-')}`}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      >
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-gray-600 text-sm mt-1">{description}</div>
        </div>
      </Checkbox>
    </div>
  );
};

export { PermissionCard };
