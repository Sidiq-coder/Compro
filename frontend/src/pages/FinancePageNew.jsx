import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { Button, Modal, Input, Alert, StatCard, BarChart, PieChart, TableActions, DataTable } from '../components/ui';
import { formatCurrency, formatCompactCurrency, calculateFinancialStats, calculateMonthlyFinancialData, calculateCategoryStats, createFinancialTableColumns } from '../utils';
import { financeService } from '../services';

const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [alert, setAlert] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Semua Tipe');
  const [searchTerm, setSearchTerm] = useState('');
  const [financialSummary, setFinancialSummary] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    type: 'Pemasukan',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Selesai'
  });

  // Load financial data on component mount
  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Load all financial data in parallel
      const [summaryRes, analyticsRes, topProductsRes, expensesRes, transactionsRes] = await Promise.all([
        financeService.getFinancialSummary(),
        financeService.getRevenueAnalytics({ period: 12 }),
        financeService.getTopProducts({ limit: 10 }),
        financeService.getExpenseSummary(),
        financeService.getFinancialTransactions({ page: 1, limit: 50 })
      ]);

      if (summaryRes.success) {
        setFinancialSummary(summaryRes.data);
      }

      if (analyticsRes.success) {
        setRevenueAnalytics(analyticsRes.data);
      }

      if (topProductsRes.success) {
        setTopProducts(topProductsRes.data);
      }

      if (expensesRes.success) {
        setExpenseSummary(expensesRes.data);
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data.transactions || []);
      }

    } catch (error) {
      console.error('Load financial data error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat data keuangan' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial statistics from API data
  const financialStats = financialSummary ? {
    totalIncome: financialSummary.totalRevenue || 0,
    totalExpenses: expenseSummary?.totalExpenses || 0,
    netProfit: (financialSummary.totalRevenue || 0) - (expenseSummary?.totalExpenses || 0),
    totalTransactions: transactions.length
  } : calculateFinancialStats(transactions);

  // Prepare monthly data for chart
  const monthlyData = revenueAnalytics.length > 0 
    ? revenueAnalytics.map(item => ({
        month: new Date(item.month).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
        income: item.revenue || 0,
        expense: 0 // We don't have expense tracking yet
      }))
    : calculateMonthlyFinancialData(transactions);

  // Prepare category data for pie chart
  const categoryData = expenseSummary?.categories 
    ? expenseSummary.categories.map(cat => ({
        name: cat.category,
        value: cat.amount,
        percentage: cat.percentage
      }))
    : calculateCategoryStats(transactions);

  const statsData = [
    {
      title: 'Total Pemasukan',
      value: formatCompactCurrency(financialStats.totalIncome),
      icon: '📈',
      change: '+12.5%',
      changeType: 'increase',
      color: 'green'
    },
    {
      title: 'Total Pengeluaran',
      value: formatCompactCurrency(financialStats.totalExpenses),
      icon: '📊',
      change: '+8.2%',
      changeType: 'increase',
      color: 'red'
    },
    {
      title: 'Keuntungan Bersih',
      value: formatCompactCurrency(financialStats.netProfit),
      icon: '💰',
      change: '+15.3%',
      changeType: financialStats.netProfit >= 0 ? 'increase' : 'decrease',
      color: financialStats.netProfit >= 0 ? 'green' : 'red'
    },
    {
      title: 'Total Transaksi',
      value: financialStats.totalTransactions.toString(),
      icon: '🧾',
      change: '+5',
      changeType: 'increase',
      color: 'blue'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Since we don't have expense tracking API yet, show a message
    setAlert({ 
      type: 'info', 
      message: 'Fitur pencatatan transaksi manual akan segera hadir. Saat ini data keuangan diambil dari penjualan produk dan event.' 
    });
    
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      category: '',
      type: 'Pemasukan',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Selesai'
    });
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description || '',
      category: transaction.category || '',
      type: transaction.type || 'Pemasukan',
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      status: transaction.status || 'Selesai'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setAlert({ 
        type: 'info', 
        message: 'Transaksi dari sistem tidak dapat dihapus. Data ini berasal dari penjualan produk dan registrasi event.' 
      });
    }
  };

  const tableColumns = createFinancialTableColumns(handleEdit, handleDelete);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.buyer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFilter === 'Semua Tipe' || 
                       (selectedFilter === 'Pemasukan' && transaction.type === 'income') ||
                       (selectedFilter === 'Pengeluaran' && transaction.type === 'expense');
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h2>
            <p className="text-gray-600">Monitor dan kelola keuangan organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Alert */}
            {alert && (
              <div className="mb-6">
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Pemasukan</h3>
                <BarChart 
                  data={monthlyData}
                  xAxisDataKey="month"
                  bars={[
                    { dataKey: 'income', name: 'Pemasukan', fill: '#10b981' },
                    { dataKey: 'expense', name: 'Pengeluaran', fill: '#ef4444' }
                  ]}
                  height={300}
                />
              </div>

              {/* Category Pie Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Kategori</h3>
                <PieChart 
                  data={categoryData}
                  height={300}
                />
              </div>
            </div>

            {/* Top Products Card */}
            {topProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Terlaris</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Terjual:</span> {product.totalSold}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Revenue:</span> {formatCurrency(product.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
                  <Button 
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto"
                  >
                    + Tambah Transaksi
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Cari transaksi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Semua Tipe">Semua Tipe</option>
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Memuat transaksi...</span>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🧾</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada transaksi</h3>
                    <p className="text-gray-500">Belum ada transaksi yang tercatat atau tidak sesuai dengan filter.</p>
                  </div>
                ) : (
                  <DataTable
                    data={filteredTransactions}
                    columns={tableColumns}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi *
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi transaksi"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Operasional">Operasional</option>
                <option value="Donasi">Donasi</option>
                <option value="Investasi">Investasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah *
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Selesai">Selesai</option>
              <option value="Pending">Pending</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : (editingTransaction ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancePage;
