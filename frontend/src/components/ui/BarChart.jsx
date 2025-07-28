import React from 'react';

const BarChart = ({ 
  title, 
  data = [], 
  height = 'h-64', 
  showLegend = true,
  legendData = null,
  colors = { primary: '#3B82F6', secondary: '#EF4444' }
}) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.primary || 0, item.secondary || 0)));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className={`${height} flex items-end justify-center space-x-2`}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="flex space-x-1">
              {item.primary !== undefined && (
                <div 
                  className="w-8 rounded-t"
                  style={{ 
                    backgroundColor: colors.primary,
                    height: `${(item.primary / maxValue) * 200}px`,
                    minHeight: '4px'
                  }}
                ></div>
              )}
              {item.secondary !== undefined && (
                <div 
                  className="w-8 rounded-t"
                  style={{ 
                    backgroundColor: colors.secondary,
                    height: `${(item.secondary / maxValue) * 200}px`,
                    minHeight: '4px'
                  }}
                ></div>
              )}
            </div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
      
      {showLegend && legendData && (
        <div className="flex justify-center mt-4 space-x-6">
          {legendData.map((legend, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: legend.color }}
              ></div>
              <span className="text-sm text-gray-600">{legend.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarChart;
