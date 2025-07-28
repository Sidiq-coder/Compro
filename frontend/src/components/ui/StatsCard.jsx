import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  color = 'bg-blue-500',
  showChange = true,
  className = '' 
}) => {
  // Menentukan style untuk perubahan (positive/negative)
  const getChangeStyle = () => {
    if (changeType === 'positive') {
      return 'text-green-600';
    } else if (changeType === 'negative') {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };

  // Icon untuk tanda naik/turun
  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (changeType === 'negative') {
      return (
        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {showChange && change && (
            <div className="flex items-center mt-2">
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeStyle()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center ml-4`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
