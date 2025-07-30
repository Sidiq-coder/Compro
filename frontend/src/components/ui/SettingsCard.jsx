import React from 'react';

/**
 * SettingsCard - Reusable component untuk menampilkan menu pengaturan dalam format card
 * Digunakan di halaman pengaturan dan halaman lain yang membutuhkan menu card
 */
const SettingsCard = ({
  title,
  description,
  icon,
  onClick,
  className = "",
  disabled = false,
  badge,
  variant = "default"
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "border-blue-200 hover:border-blue-300 hover:bg-blue-50";
      case "success":
        return "border-green-200 hover:border-green-300 hover:bg-green-50";
      case "warning":
        return "border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50";
      case "danger":
        return "border-red-200 hover:border-red-300 hover:bg-red-50";
      default:
        return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg border p-6 transition-all duration-200 cursor-pointer
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {icon && (
              <div className="text-2xl flex-shrink-0">
                {typeof icon === 'string' ? <span>{icon}</span> : icon}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
              {badge && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {badge}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow Icon */}
        <div className="ml-4 flex-shrink-0">
          <svg 
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
