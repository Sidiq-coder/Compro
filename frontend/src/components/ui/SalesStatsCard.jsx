import React from 'react';
import { formatCurrency } from '../../utils';

/**
 * SalesStatsCard - Reusable component untuk menampilkan statistik penjualan
 * Dapat digunakan di berbagai halaman yang membutuhkan ringkasan penjualan
 */
const SalesStatsCard = ({
  salesData,
  className = "",
  showTopProduct = true,
  showGrowth = true,
  title = "Ringkasan Penjualan",
  period = "Bulan Ini"
}) => {
  const {
    totalSales,
    totalRevenue, 
    averageOrderValue,
    topSellingProduct,
    salesGrowth
  } = salesData;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '➡️';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{period}</p>
        </div>
        <div className="text-2xl">💰</div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Sales */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(totalSales)}
          </div>
          <div className="text-sm text-blue-600 font-medium">Total Terjual</div>
          <div className="text-xs text-gray-500 mt-1">Unit produk</div>
        </div>

        {/* Total Revenue */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-green-600 font-medium">Total Pendapatan</div>
          <div className="text-xs text-gray-500 mt-1">Rupiah</div>
        </div>

        {/* Average Order Value */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(averageOrderValue)}
          </div>
          <div className="text-sm text-purple-600 font-medium">Rata-rata Order</div>
          <div className="text-xs text-gray-500 mt-1">Per transaksi</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        {/* Growth Indicator */}
        {showGrowth && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getGrowthIcon(salesGrowth)}</span>
              <span className="text-sm font-medium text-gray-700">Pertumbuhan Penjualan</span>
            </div>
            <div className={`text-sm font-semibold ${getGrowthColor(salesGrowth)}`}>
              {salesGrowth > 0 ? '+' : ''}{salesGrowth}%
            </div>
          </div>
        )}

        {/* Top Selling Product */}
        {showTopProduct && topSellingProduct && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏆</span>
              <div>
                <div className="text-sm font-medium text-gray-700">Produk Terlaris</div>
                <div className="text-xs text-gray-500">{topSellingProduct.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-yellow-600">
                {formatNumber(topSellingProduct.sold)} unit
              </div>
              <div className="text-xs text-gray-500">
                {formatCurrency(topSellingProduct.revenue)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Data diperbarui secara real-time</span>
          <span>📊 Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default SalesStatsCard;
