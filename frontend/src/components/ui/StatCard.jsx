import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'increase',
  bgColor = 'bg-white',
  textColor = 'text-gray-900',
  iconBg = 'bg-gray-100',
  showChange = true
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {typeof value === 'string' ? value : value.toLocaleString()}
          </p>
          {showChange && change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
