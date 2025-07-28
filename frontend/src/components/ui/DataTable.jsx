import React from 'react';
import { Button } from './Button';

/**
 * DataTable Component - Komponen tabel yang fleksibel dan reusable
 * 
 * @param {Array} data - Array data yang akan ditampilkan
 * @param {Array} columns - Konfigurasi kolom tabel
 * @param {boolean} actions - Apakah menampilkan kolom aksi (default: true)
 * @param {Function} onEdit - Callback untuk aksi edit
 * @param {Function} onDelete - Callback untuk aksi hapus
 * @param {boolean} loading - Status loading
 * @param {string} emptyMessage - Pesan ketika data kosong
 * @param {string} className - CSS class untuk container
 * @param {string} tableClassName - CSS class untuk table
 * @param {string} headerClassName - CSS class untuk header
 * @param {string} rowClassName - CSS class untuk row
 * @param {string} editLabel - Label untuk tombol edit
 * @param {string} deleteLabel - Label untuk tombol hapus
 * @param {string} editIcon - Icon untuk tombol edit
 * @param {string} deleteIcon - Icon untuk tombol hapus
 * @param {boolean} showRowNumbers - Apakah menampilkan nomor baris
 * @param {boolean} striped - Apakah menggunakan striped rows
 * @param {boolean} hoverable - Apakah row bisa dihover
 * @param {boolean} compact - Mode compact untuk tabel
 * @param {Function} onRowClick - Callback ketika row diklik
 * @param {Array} additionalActions - Aksi tambahan selain edit dan hapus
 */
const DataTable = ({
  data = [],
  columns = [],
  actions = true,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = "Tidak ada data tersedia",
  className = "",
  tableClassName = "",
  headerClassName = "bg-gray-50",
  rowClassName = "",
  editLabel = "Edit",
  deleteLabel = "Hapus", 
  editIcon = "✏️",
  deleteIcon = "🗑️",
  showRowNumbers = false,
  striped = true,
  hoverable = true,
  compact = false,
  onRowClick,
  additionalActions = []
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="p-8 text-center text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const renderCellContent = (row, column) => {
    if (typeof column.render === 'function') {
      return column.render(row[column.key], row);
    }

    const value = row[column.key];
    
    // Handle different data types
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Ya' : 'Tidak';
    }
    
    if (column.type === 'currency') {
      const amount = parseFloat(value) || 0;
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(Math.abs(amount));
      
      if (column.showSign && amount !== 0) {
        return (
          <span className={amount > 0 ? 'text-green-600' : 'text-red-600'}>
            {amount > 0 ? '+' : '-'}{formatted}
          </span>
        );
      }
      return formatted;
    }
    
    if (column.type === 'date') {
      try {
        return new Date(value).toLocaleDateString('id-ID');
      } catch (error) {
        return value?.toString() || '-';
      }
    }
    
    if (column.type === 'badge') {
      const badgeClass = column.badgeColors?.[value] || 'bg-gray-100 text-gray-800';
      const displayValue = column.badgeLabels?.[value] || value;
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
          {displayValue}
        </span>
      );
    }
    
    if (column.type === 'number') {
      return new Intl.NumberFormat('id-ID').format(value);
    }
    
    if (column.type === 'text') {
      return (
        <div className={column.textClassName || ''}>
          {value?.toString() || '-'}
        </div>
      );
    }
    
    return value?.toString() || '-';
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className={`w-full divide-y divide-gray-200 ${tableClassName}`}>
          <thead className={headerClassName}>
            <tr>
              {showRowNumbers && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ''} ${compact ? 'py-2' : ''}`}
                  style={{ 
                    width: column.width,
                    maxWidth: column.maxWidth,
                    minWidth: column.minWidth,
                    textAlign: column.headerAlign || column.align || 'left'
                  }}
                >
                  {column.title}
                  {column.sortable && (
                    <span className="ml-1 cursor-pointer">↕️</span>
                  )}
                </th>
              ))}
              {actions && (onEdit || onDelete || additionalActions.length > 0) && (
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${compact ? 'py-2' : ''}`} style={{ width: '150px', minWidth: '150px' }}>
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y divide-gray-200' : ''}`}>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                  ${hoverable ? 'hover:bg-gray-100' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${rowClassName}
                `}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {showRowNumbers && (
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${compact ? 'py-2' : ''}`}>
                    {rowIndex + 1}
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || 'text-gray-900'} ${compact ? 'py-2' : ''}`}
                    style={{
                      maxWidth: column.maxWidth,
                      minWidth: column.minWidth,
                      textAlign: column.align || 'left'
                    }}
                  >
                    {renderCellContent(row, column)}
                  </td>
                ))}
                {actions && (onEdit || onDelete || additionalActions.length > 0) && (
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${compact ? 'py-2' : ''}`} style={{ width: '150px' }}>
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {editIcon} {editLabel}
                        </Button>
                      )}
                      {additionalActions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className={action.className || "text-gray-600 hover:text-gray-900"}
                          title={action.title}
                        >
                          {action.icon} {action.label}
                        </Button>
                      ))}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row.id || row);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          {deleteIcon} {deleteLabel}
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { DataTable };
