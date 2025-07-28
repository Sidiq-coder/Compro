import React from 'react';

const PieChart = ({ 
  title, 
  data = [], 
  size = 'w-48 h-48',
  centerValue = null,
  showLegend = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const strokeDasharray = `${(percentage / 100) * 314} 314`;
    const strokeDashoffset = -((cumulativePercentage / 100) * 314);
    cumulativePercentage += percentage;
    
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center h-64">
        <div className={`relative ${size}`}>
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx="100"
                cy="100"
                r="80"
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                transform="rotate(-90 100 100)"
              />
            ))}
          </svg>
          
          {centerValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {typeof centerValue === 'object' ? centerValue.value : centerValue}
                </div>
                {typeof centerValue === 'object' && centerValue.label && (
                  <div className="text-sm text-gray-500">{centerValue.label}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showLegend && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.label ? `${item.label}: ${item.value}` : item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;
