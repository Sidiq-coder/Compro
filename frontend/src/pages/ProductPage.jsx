import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Alert, TableActions, ProductCard, SalesStatsCard } from '../components/ui';
import { formatCurrency, calculateProductStats, calculateSalesStats } from '../utils';
import { productService } from '../services';

const ProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({});

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadStats();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter === 'active' ? 'in_stock' : statusFilter === 'inactive' ? 'out_of_stock' : 'all'
      });
      
      if (response.success) {
        setProducts(response.data.products || []);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat produk' });
      }
    } catch (error) {
      console.error('Load products error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat produk' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productService.getProductCategories();
      if (response.success) {
        const categoryList = response.data.map(cat => ({ name: cat, value: cat }));
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await productService.getProductStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  // Reload products when filters change
  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleEdit = (product) => {
    navigate(`/dashboard/products/edit/${product.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setLoading(true);
      try {
        const response = await productService.deleteProduct(id);
        if (response.success) {
          setAlert({ type: 'success', message: 'Produk berhasil dihapus!' });
          loadProducts(); // Reload products
          loadStats(); // Reload stats
        } else {
          setAlert({ type: 'error', message: response.message || 'Gagal menghapus produk' });
        }
      } catch (error) {
        console.error('Delete product error:', error);
        setAlert({ type: 'error', message: error.message || 'Gagal menghapus produk' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/dashboard/products/${productId}`);
  };

  // Use stats from API or calculate from products as fallback
  const productStats = stats.totalProducts !== undefined ? stats : calculateProductStats(products);
  const { totalProducts, inStockProducts: activeProducts, totalRevenue, outOfStockProducts } = productStats;

  // Calculate sales statistics for display
  const salesStats = calculateSalesStats(products);

  const statsData = [
    {
      title: 'Total Produk',
      value: totalProducts || 0,
      icon: '🛍️',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Produk Tersedia',
      value: activeProducts || 0,
      icon: '✅',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue || 0),
      icon: '💰',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Stok Habis',
      value: outOfStockProducts || 0,
      icon: '⚠️',
      change: outOfStockProducts > 0 ? '+1' : '0',
      changeType: outOfStockProducts > 0 ? 'increase' : 'neutral'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Produk</h2>
            <p className="text-gray-600">Kelola produk dan inventory e-commerce</p>
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
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Sales Statistics */}
            <div className="mb-6">
              <SalesStatsCard 
                salesData={salesStats}
                title="Statistik Penjualan"
                period="30 Hari Terakhir"
                showTopProduct={true}
                showGrowth={true}
              />
            </div>

            {/* Actions */}
            <TableActions
              searchValue={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              searchPlaceholder="Cari produk..."
              filterValue={categoryFilter}
              onFilterChange={(e) => setCategoryFilter(e.target.value)}
              filterOptions={categories.map(cat => ({ value: cat.name, label: cat.name }))}
              filterPlaceholder="Semua Kategori"
              onAdd={() => navigate('/dashboard/products/add')}
              addButtonText="Tambah Produk"
              addButtonIcon="➕"
            >
              {/* Additional Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Semua Status</option>
                <option value="active">Tersedia</option>
                <option value="inactive">Habis</option>
              </select>
            </TableActions>

            {/* Products Grid */}
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Memuat produk...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
                  <p className="text-gray-500">Belum ada produk yang ditambahkan atau tidak ada yang sesuai dengan pencarian Anda.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/dashboard/products/add')}
                  >
                    Tambah Produk Pertama
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      image={product.imageUrl}
                      status={product.stock > 0 ? 'active' : 'inactive'}
                      category={product.category}
                      stock={product.stock}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product.id)}
                      onClick={handleCardClick}
                      className="transform transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
