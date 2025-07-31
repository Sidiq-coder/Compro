import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { Button, Modal, Input, Alert, StatCard, BarChart, PieChart, TableActions, DataTable } from '../components/ui';
import { formatCurrency, formatCompactCurrency, calculateFinancialStats, calculateMonthlyFinancialData, calculateCategoryStats, createFinancialTableColumns } from '../utils';

const FinancePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [alert, setAlert] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Semua Tipe');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    type: 'Pemasukan',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Selesai'
  });

  // Mock data untuk demo
  const mockTransactions = [
    {
      id: 1,
      date: '2024-07-27',
      description: 'Pembayaran Event Workshop',
      category: 'Pemasukan',
      type: 'Pemasukan',
      amount: 2500000,
      status: 'Selesai',
      createdAt: '2024-07-27'
    },
    {
      id: 2,
      date: '2024-07-26',
      description: 'Sewa Gedung Seminar',
      category: 'Operasional',
      type: 'Pengeluaran',
      amount: -1500000,
      status: 'Selesai',
      createdAt: '2024-07-26'
    },
    {
      id: 3,
      date: '2024-07-25',
      description: 'Pembelian Perlengkapan Kantor',
      category: 'Operasional',
      type: 'Pengeluaran',
      amount: -850000,
      status: 'Pending',
      createdAt: '2024-07-25'
    },
    {
      id: 4,
      date: '2024-07-24',
      description: 'Donasi dari Sponsor',
      category: 'Donasi',
      type: 'Pemasukan',
      amount: 5000000,
      status: 'Selesai',
      createdAt: '2024-07-24'
    },
    {
      id: 5,
      date: '2024-07-23',
      description: 'Gaji Karyawan Bulan Juli',
      category: 'Operasional',
      type: 'Pengeluaran',
      amount: -8500000,
      status: 'Selesai',
      createdAt: '2024-07-23'
    }
  ];

  const categories = ['Pemasukan', 'Operasional', 'Donasi', 'Investasi', 'Lainnya'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data transaksi' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const amount = formData.type === 'Pengeluaran' 
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount));
      
      if (editingTransaction) {
        // Update transaction
        setTransactions(prev => 
          prev.map(transaction => 
            transaction.id === editingTransaction.id 
              ? { 
                  ...transaction, 
                  ...formData, 
                  amount,
                  updatedAt: new Date().toISOString() 
                }
              : transaction
          )
        );
        setAlert({ type: 'success', message: 'Transaksi berhasil diperbarui!' });
      } else {
        // Add new transaction
        const newTransaction = {
          id: Date.now(),
          ...formData,
          amount,
          createdAt: new Date().toISOString()
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setAlert({ type: 'success', message: 'Transaksi berhasil ditambahkan!' });
      }
      
      setShowModal(false);
      setEditingTransaction(null);
      setFormData({ description: '', category: '', type: 'Pemasukan', amount: '', date: new Date().toISOString().split('T')[0], status: 'Selesai' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal menyimpan transaksi' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date,
      status: transaction.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        setAlert({ type: 'success', message: 'Transaksi berhasil dihapus!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Gagal menghapus transaksi' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Configure table columns for transactions
  const transactionColumns = createFinancialTableColumns({
    type: {
      badgeColors: {
        'Pemasukan': 'bg-gray-900 text-white',
        'Pengeluaran': 'bg-red-100 text-red-800'
      }
    },
    amount: {
      className: 'font-medium',
      width: '150px'
    },
    status: {
      badgeColors: {
        'Selesai': 'bg-gray-900 text-white',
        'Pending': 'bg-gray-100 text-gray-800'
      }
    }
  });

  // Calculate statistics using utils
  const financialStats = calculateFinancialStats(transactions);
  const { totalIncoming, totalOutgoing, balance, thisMonthTransactions } = financialStats;

  const statsData = [
    {
      title: 'Total Pemasukan',
      value: formatCompactCurrency(totalIncoming),
      icon: '💰',
      change: '+12%',
      changeType: 'increase',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Total Pengeluaran',
      value: formatCompactCurrency(totalOutgoing),
      icon: '💸',
      change: '+8%',
      changeType: 'increase',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      title: 'Saldo',
      value: formatCompactCurrency(balance),
      icon: '💳',
      change: '+5%',
      changeType: 'increase',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Transaksi Bulan Ini',
      value: thisMonthTransactions,
      icon: '📊',
      change: '+15%',
      changeType: 'increase',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Semua Tipe' || transaction.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Generate chart data using utils
  const monthlyData = calculateMonthlyFinancialData(transactions, 6);
  const barChartData = monthlyData.map(month => ({
    label: month.month,
    primary: month.income,
    secondary: month.expense
  }));

  const barChartLegend = [
    { label: `Pendapatan: ${formatCurrency(totalIncoming)}`, color: '#3B82F6' },
    { label: `Pengeluaran: ${formatCurrency(totalOutgoing)}`, color: '#EF4444' }
  ];

  const categoryStats = calculateCategoryStats(transactions, 'expense');
  const pieChartData = categoryStats.slice(0, 4).map(category => ({
    value: category.count,
    label: category.name
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h2>
            <p className="text-gray-600">Kelola keuangan dan transaksi organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Income vs Expense Chart */}
            <BarChart
              title="Pendapatan vs Pengeluaran"
              data={barChartData}
              legendData={barChartLegend}
              colors={{ primary: '#3B82F6', secondary: '#EF4444' }}
            />

            {/* Category Distribution */}
            <PieChart
              title="Distribusi Aktivitas"
              data={pieChartData}
              centerValue="15"
              colors={['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981']}
            />
          </div>

          {/* Search and Filter */}
          <TableActions
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            searchPlaceholder="Cari transaksi..."
            filterValue={selectedFilter}
            onFilterChange={(e) => setSelectedFilter(e.target.value)}
            filterOptions={['Pemasukan', 'Pengeluaran'].map(type => ({ value: type, label: type }))}
            filterPlaceholder="Semua Tipe"
            onAdd={() => setShowModal(true)}
            addButtonText="Transaksi Baru"
            addButtonIcon="➕"
          />

          {/* Transactions Table */}
          <DataTable
            data={filteredTransactions}
            columns={transactionColumns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Tidak ada data transaksi"
            className="mb-6"
          />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTransaction(null);
          setFormData({ description: '', category: '', type: 'Pemasukan', amount: '', date: new Date().toISOString().split('T')[0], status: 'Selesai' });
        }}
        title={editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi transaksi"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal (Rp)
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
                Tanggal
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
              required
            >
              <option value="Selesai">Selesai</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingTransaction(null);
                setFormData({ description: '', category: '', type: 'Pemasukan', amount: '', date: new Date().toISOString().split('T')[0], status: 'Selesai' });
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800">
              {loading ? 'Menyimpan...' : (editingTransaction ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancePage;
