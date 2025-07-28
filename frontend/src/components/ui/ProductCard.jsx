import React from 'react';
import { Button } from './Button';

/**
 * ProductCard - Reusable component untuk menampilkan produk dalam format card
 * Digunakan di halaman produk dan halaman lain yang menampilkan produk
 */
const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  status = 'active',
  category,
  stock,
  onEdit,
  onDelete,
  onClick,
  className = "",
  showActions = true,
  imageClassName = "w-full h-48 object-cover",
  
  // Badge customization
  statusBadgeColors = {
    'active': 'bg-gray-900 text-white',
    'inactive': 'bg-gray-500 text-white',
    'out-of-stock': 'bg-red-600 text-white'
  },
  
  // Custom render functions
  renderPrice,
  renderStatus,
  renderActions
}) => {
  const handleCardClick = (e) => {
    // Prevent card click when clicking on action buttons
    if (e.target.closest('.action-buttons')) {
      return;
    }
    
    if (onClick) {
      onClick(id);
    }
  };

  const getStatusBadgeClass = () => {
    if (stock === 0) return statusBadgeColors['out-of-stock'];
    return statusBadgeColors[status] || statusBadgeColors['active'];
  };

  const getStatusText = () => {
    if (stock === 0) return 'Out of Stock';
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={image || '/api/placeholder/400/300'}
          alt={name}
          className={imageClassName}
          onError={(e) => {
            e.target.src = '/api/placeholder/400/300';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {renderStatus ? renderStatus(status, stock) : (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
              {getStatusText()}
            </span>
          )}
        </div>

        {/* Action Buttons - Top Right */}
        {showActions && (
          <div className="absolute top-3 right-3 action-buttons">
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  className="bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 p-2 rounded-full shadow-sm"
                  title="Edit produk"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 p-2 rounded-full shadow-sm"
                  title="Hapus produk"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name & Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>

        {/* Price */}
        <div className="mb-3">
          {renderPrice ? renderPrice(price) : (
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          {category && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {category}
            </span>
          )}
          
          {stock !== undefined && (
            <span className={`font-medium ${stock === 0 ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
              Stok: {stock}
            </span>
          )}
        </div>

        {/* Custom Actions */}
        {renderActions && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {renderActions({ id, name, price, stock, status })}
          </div>
        )}
      </div>
    </div>
  );
};

export { ProductCard };
