import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Input, Select, Textarea, FileUpload, FormField, Alert } from '../components/ui';
import { formatCurrency } from '../utils';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active',
    sku: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    tags: ''
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  // Mock categories
  const categories = [
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'makanan-minuman', label: 'Makanan & Minuman' },
    { value: 'kesehatan-kecantikan', label: 'Kesehatan & Kecantikan' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'rumah-tangga', label: 'Rumah Tangga' },
    { value: 'otomotif', label: 'Otomotif' },
    { value: 'buku-media', label: 'Buku & Media' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Tidak Aktif' },
    { value: 'draft', label: 'Draft' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi produk wajib diisi';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga produk harus lebih dari 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori produk wajib dipilih';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU produk wajib diisi';
    }

    // Validate dimensions if weight is provided
    if (formData.weight && (!formData.dimensions.length || !formData.dimensions.width || !formData.dimensions.height)) {
      newErrors.dimensions = 'Dimensi lengkap diperlukan jika berat diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Mohon lengkapi semua field yang diperlukan'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process form data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        media: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })),
        createdAt: new Date().toISOString()
      };

      console.log('Product data to save:', productData);
      
      setAlert({
        type: 'success',
        message: 'Produk berhasil ditambahkan!'
      });

      // Redirect to product page after success
      setTimeout(() => {
        navigate('/produk');
      }, 2000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Gagal menambahkan produk. Silakan coba lagi.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Yakin ingin membatalkan? Data yang sudah diisi akan hilang.')) {
      navigate('/produk');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Link to="/produk" className="hover:text-gray-700">Produk</Link>
              <span>/</span>
              <span className="text-gray-900">Tambah Produk</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
                <p className="text-gray-600 mt-1">Tambahkan produk baru ke dalam sistem</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
                <Button 
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
              </div>
            </div>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Nama Produk"
                        value={formData.name}
                        onChange={(value) => handleInputChange('name', value)}
                        placeholder="Masukkan nama produk"
                        required
                        error={errors.name}
                      />
                    </div>
                    
                    <Input
                      label="SKU"
                      value={formData.sku}
                      onChange={(value) => handleInputChange('sku', value)}
                      placeholder="Contoh: PRD-001"
                      required
                      error={errors.sku}
                      helperText="Kode unik untuk identifikasi produk"
                    />

                    <Select
                      label="Kategori"
                      value={formData.category}
                      onChange={(value) => handleInputChange('category', value)}
                      options={categories}
                      placeholder="Pilih kategori"
                      required
                      error={errors.category}
                    />

                    <div className="md:col-span-2">
                      <Textarea
                        label="Deskripsi Produk"
                        value={formData.description}
                        onChange={(value) => handleInputChange('description', value)}
                        placeholder="Jelaskan detail produk, fitur, dan keunggulan..."
                        rows={4}
                        maxLength={1000}
                        required
                        error={errors.description}
                      />
                    </div>

                    <Input
                      label="Tags"
                      value={formData.tags}
                      onChange={(value) => handleInputChange('tags', value)}
                      placeholder="tag1, tag2, tag3"
                      helperText="Pisahkan dengan koma untuk memudahkan pencarian"
                    />

                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      options={statusOptions}
                      required
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Harga & Inventori</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Harga"
                      type="number"
                      value={formData.price}
                      onChange={(value) => handleInputChange('price', value)}
                      placeholder="0"
                      min="0"
                      step="1000"
                      required
                      error={errors.price}
                      helperText={formData.price ? `Preview: ${formatCurrency(parseFloat(formData.price) || 0)}` : ''}
                    />

                    <Input
                      label="Stok"
                      type="number"
                      value={formData.stock}
                      onChange={(value) => handleInputChange('stock', value)}
                      placeholder="0"
                      min="0"
                      required
                      error={errors.stock}
                    />
                  </div>
                </div>

                {/* Physical Properties */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Properti Fisik</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Berat (gram)"
                      type="number"
                      value={formData.weight}
                      onChange={(value) => handleInputChange('weight', value)}
                      placeholder="0"
                      min="0"
                      helperText="Opsional - untuk perhitungan ongkir"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Dimensi (cm)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          value={formData.dimensions.length}
                          onChange={(value) => handleInputChange('dimensions.length', value)}
                          placeholder="P"
                          min="0"
                        />
                        <Input
                          type="number"
                          value={formData.dimensions.width}
                          onChange={(value) => handleInputChange('dimensions.width', value)}
                          placeholder="L"
                          min="0"
                        />
                        <Input
                          type="number"
                          value={formData.dimensions.height}
                          onChange={(value) => handleInputChange('dimensions.height', value)}
                          placeholder="T"
                          min="0"
                        />
                      </div>
                      {errors.dimensions && (
                        <p className="text-sm text-red-600">{errors.dimensions}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Produk</h2>
                  <FileUpload
                    label="Foto & Video Produk"
                    accept="image/*,video/*"
                    multiple={true}
                    maxSize={10 * 1024 * 1024} // 10MB
                    maxFiles={10}
                    value={files}
                    onChange={setFiles}
                    helperText="Upload foto dan video produk untuk menarik perhatian customer"
                  />
                </div>

                {/* Quick Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips Produk Berkualitas</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Gunakan nama yang deskriptif dan mudah dicari</li>
                    <li>• Upload minimal 3 foto dengan kualitas tinggi</li>
                    <li>• Tulis deskripsi yang detail dan informatif</li>
                    <li>• Pastikan harga dan stok selalu akurat</li>
                    <li>• Gunakan tags yang relevan untuk SEO</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons (Mobile) */}
            <div className="lg:hidden flex items-center space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Batal
              </Button>
              <Button 
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
