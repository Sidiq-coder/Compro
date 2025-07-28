import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Alert, Loading } from '../components/ui';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Mock data - in real app, this would be an API call
  const mockProducts = [
    {
      id: 1,
      name: 'Kaos Organisasi Premium',
      description: 'Kaos berkualitas tinggi dengan logo organisasi yang dibuat khusus dengan bahan cotton combed 30s yang nyaman digunakan sehari-hari',
      price: 150000,
      category: 'Apparel',
      stock: 25,
      status: 'active',
      image: '/api/placeholder/600/400',
      specifications: {
        'Material': 'Cotton Combed 30s',
        'Ukuran': 'S, M, L, XL, XXL',
        'Warna': 'Putih, Hitam, Navy',
        'Berat': '200 gram',
        'Logo': 'Sablon DTG Premium'
      },
      gallery: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    },
    {
      id: 2,
      name: 'Tumbler Stainless Steel',
      description: 'Tumbler ramah lingkungan dengan desain eksklusif organisasi, tahan panas dan dingin hingga 12 jam',
      price: 85000,
      category: 'Drinkware',
      stock: 15,
      status: 'active',
      image: '/api/placeholder/600/400',
      specifications: {
        'Material': 'Stainless Steel 304',
        'Kapasitas': '500ml',
        'Warna': 'Silver, Black, Blue',
        'Fitur': 'Double Wall Insulation',
        'Logo': 'Laser Engraving'
      },
      gallery: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    },
    {
      id: 3,
      name: 'Tas Tote Canvas',
      description: 'Tas tote berbahan canvas berkualitas dengan desain minimalis dan logo organisasi yang stylish',
      price: 75000,
      category: 'Bags',
      stock: 0,
      status: 'active',
      image: '/api/placeholder/600/400',
      specifications: {
        'Material': 'Canvas Premium',
        'Dimensi': '35x40x10 cm',
        'Warna': 'Natural, Black, Navy',
        'Handle': 'Cotton Webbing',
        'Logo': 'Screen Printing'
      },
      gallery: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundProduct = mockProducts.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setAlert({ type: 'error', message: 'Produk tidak ditemukan' });
        }
      } catch (error) {
        setAlert({ type: 'error', message: 'Gagal memuat detail produk' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadgeClass = (status, stock) => {
    if (stock === 0) return 'bg-red-600 text-white';
    return status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white';
  };

  const getStatusText = (status, stock) => {
    if (stock === 0) return 'Out of Stock';
    return status === 'active' ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            <Alert
              type="error"
              message="Produk tidak ditemukan"
              onClose={() => navigate('/dashboard/products')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/products')}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </Button>
                
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">Detail informasi produk</p>
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

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/600/400';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(product.status, product.stock)}`}>
                      {getStatusText(product.status, product.stock)}
                    </span>
                  </div>
                </div>

                {/* Gallery */}
                {product.gallery && product.gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/150/150';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Produk</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nama Produk</label>
                    <p className="text-lg font-medium text-gray-900">{product.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Harga</label>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kategori</label>
                      <p className="text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stok Tersedia</label>
                    <p className={`text-lg font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock} unit
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                  
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-500">{key}</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Ketersediaan</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(product.status, product.stock)}`}>
                      {getStatusText(product.status, product.stock)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Stok</span>
                    <span className="text-sm text-gray-900">{product.stock} unit</span>
                  </div>
                  
                  {product.stock > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${product.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.stock < 10 ? 'Stok terbatas' : 'Stok tersedia'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
