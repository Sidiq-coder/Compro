import React from 'react';
import { cn } from '../../utils';

const Avatar = React.forwardRef(({
  className,
  src,
  alt,
  size = 'md',
  fallback,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl',
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const showFallback = !src || imageError;

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="font-medium text-gray-600">
          {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export { Avatar };
