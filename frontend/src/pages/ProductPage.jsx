import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Modal, Input, Alert, TableActions, ProductCard } from '../components/ui';
import { formatCurrency, calculateProductStats } from '../utils';

const ProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active'
  });

  // Mock data untuk demo
  const mockCategories = [
    { id: 1, name: 'Elektronik' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Makanan & Minuman' },
    { id: 4, name: 'Kesehatan & Kecantikan' },
    { id: 5, name: 'Olahraga' }
  ];

  const mockProducts = [
    { 
      id: 1, 
      name: 'Kaos Organisasi Premium', 
      description: 'Kaos berkualitas tinggi dengan logo organisasi', 
      price: 150000, 
      stock: 25,
      category: 'Apparel',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 2, 
      name: 'Tumbler Stainless Steel', 
      description: 'Tumbler ramah lingkungan dengan desain eksklusif', 
      price: 85000, 
      stock: 15,
      category: 'Drinkware',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 3, 
      name: 'Tas Tote Canvas', 
      description: 'Tas tote berbahan canvas berkualitas', 
      price: 75000, 
      stock: 0,
      category: 'Bags',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 4, 
      name: 'Notebook Custom', 
      description: 'Notebook dengan cover custom dan logo organisasi', 
      price: 45000, 
      stock: 30,
      category: 'Stationery',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setCategories(mockCategories);
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data produk' });
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
      
      if (editingProduct) {
        // Update product
        setProducts(prev => 
          prev.map(product => 
            product.id === editingProduct.id 
              ? { 
                  ...product, 
                  ...formData, 
                  price: parseFloat(formData.price),
                  stock: parseInt(formData.stock),
                  updatedAt: new Date().toISOString() 
                }
              : product
          )
        );
        setAlert({ type: 'success', message: 'Produk berhasil diperbarui!' });
      } else {
        // Add new product
        const newProduct = {
          id: Date.now(),
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          sold: 0,
          createdAt: new Date().toISOString()
        };
        setProducts(prev => [newProduct, ...prev]);
        setAlert({ type: 'success', message: 'Produk berhasil ditambahkan!' });
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '', status: 'active' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal menyimpan produk' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      status: product.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(prev => prev.filter(product => product.id !== id));
        setAlert({ type: 'success', message: 'Produk berhasil dihapus!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Gagal menghapus produk' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/dashboard/products/${productId}`);
  };

  // Calculate product statistics using utils
  const productStats = calculateProductStats(products);
  const { totalProducts, activeProducts, totalStock, outOfStockProducts } = productStats;

  const statsData = [
    {
      title: 'Total Produk',
      value: totalProducts,
      icon: '🛍️',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Produk Aktif',
      value: activeProducts,
      icon: '✅',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Total Stok',
      value: totalStock,
      icon: '📦',
      change: '-2%',
      changeType: 'decrease'
    },
    {
      title: 'Stok Habis',
      value: outOfStockProducts,
      icon: '⚠️',
      change: '+1',
      changeType: 'increase'
    }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
            <p className="text-gray-600 mt-2">Kelola produk dan inventory e-commerce</p>
          </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
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
            onAdd={() => setShowModal(true)}
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
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </TableActions>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Memuat produk...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
                <p className="text-gray-500">Belum ada produk yang ditambahkan atau tidak ada yang sesuai dengan pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    status={product.status}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
          setFormData({ name: '', description: '', price: '', stock: '', category: '', status: 'active' });
        }}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama produk"
              required
            />
          </div>
          
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
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi produk"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp)
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                min="0"
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
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
                setFormData({ name: '', description: '', price: '', stock: '', category: '', status: 'active' });
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (editingProduct ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductPage;
