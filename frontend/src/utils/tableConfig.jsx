/**
 * Table Configuration Utilities
 * Utility untuk menggenerate konfigurasi kolom tabel berdasarkan skema database
 */

/**
 * Generate kolom tabel dari skema database
 * @param {Array} schema - Skema database field
 * @param {Object} customColumns - Konfigurasi custom untuk override
 * @returns {Array} Array konfigurasi kolom untuk DataTable
 */
export const generateColumnsFromSchema = (schema, customColumns = {}) => {
  return schema.map(field => {
    const baseConfig = {
      key: field.name,
      title: field.label || formatFieldName(field.name),
      type: mapDatabaseTypeToColumnType(field.type),
      width: getDefaultWidth(field.type),
      ...(customColumns[field.name] || {})
    };

    // Add specific configurations based on field type
    if (field.type === 'enum' && field.options) {
      baseConfig.type = 'badge';
      baseConfig.badgeColors = generateBadgeColors(field.options);
    }

    if (field.type === 'boolean') {
      baseConfig.type = 'badge';
      baseConfig.badgeColors = {
        true: 'bg-green-100 text-green-800',
        false: 'bg-red-100 text-red-800'
      };
      baseConfig.badgeLabels = {
        true: 'Ya',
        false: 'Tidak'
      };
    }

    return baseConfig;
  });
};

/**
 * Format nama field menjadi label yang readable
 * @param {string} fieldName - Nama field dari database
 * @returns {string} Label yang formatted
 */
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
};

/**
 * Map tipe data database ke tipe kolom DataTable
 * @param {string} dbType - Tipe data dari database
 * @returns {string} Tipe kolom untuk DataTable
 */
const mapDatabaseTypeToColumnType = (dbType) => {
  const typeMapping = {
    'varchar': 'text',
    'text': 'text',
    'string': 'text',
    'int': 'number',
    'integer': 'number',
    'decimal': 'currency',
    'float': 'number',
    'double': 'number',
    'boolean': 'badge',
    'date': 'date',
    'datetime': 'date',
    'timestamp': 'date',
    'enum': 'badge',
    'json': 'text'
  };

  return typeMapping[dbType.toLowerCase()] || 'text';
};

/**
 * Get default width berdasarkan tipe field
 * @param {string} fieldType - Tipe field
 * @returns {string} Default width
 */
const getDefaultWidth = (fieldType) => {
  const widthMapping = {
    'id': '80px',
    'boolean': '100px',
    'date': '120px',
    'datetime': '150px',
    'timestamp': '150px',
    'enum': '120px',
    'decimal': '130px',
    'float': '130px',
    'int': '100px',
    'integer': '100px'
  };

  return widthMapping[fieldType.toLowerCase()] || 'auto';
};

/**
 * Generate warna badge untuk enum options
 * @param {Array} options - Array options dari enum
 * @returns {Object} Mapping warna badge
 */
const generateBadgeColors = (options) => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-gray-100 text-gray-800'
  ];

  const badgeColors = {};
  options.forEach((option, index) => {
    badgeColors[option] = colors[index % colors.length];
  });

  return badgeColors;
};

/**
 * Create konfigurasi kolom untuk tabel user management
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom user
 */
export const createUserTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'name',
      title: 'Nama User',
      width: '30%',
      minWidth: '200px',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      type: 'badge',
      width: '15%',
      minWidth: '120px',
      badgeColors: {
        'admin': 'bg-purple-100 text-purple-800',
        'manager': 'bg-blue-100 text-blue-800',
        'employee': 'bg-green-100 text-green-800',
        'user': 'bg-gray-100 text-gray-800'
      }
    },
    {
      key: 'department',
      title: 'Department',
      width: '18%',
      minWidth: '150px'
    },
    {
      key: 'status',
      title: 'Status',
      type: 'badge',
      width: '15%',
      minWidth: '100px',
      badgeColors: {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-red-100 text-red-800',
        'suspended': 'bg-yellow-100 text-yellow-800'
      }
    },
    {
      key: 'createdAt',
      title: 'Terdaftar',
      type: 'date',
      width: '22%',
      minWidth: '120px'
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Create konfigurasi kolom untuk tabel artikel
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom artikel
 */
export const createArticleTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'title',
      title: 'Judul Artikel',
      width: '35%',
      minWidth: '250px',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500 truncate">{row.excerpt}</div>
        </div>
      )
    },
    {
      key: 'author',
      title: 'Penulis',
      width: '20%',
      minWidth: '150px'
    },
    {
      key: 'category',
      title: 'Kategori',
      type: 'badge',
      width: '15%',
      minWidth: '120px',
      badgeColors: {
        'news': 'bg-blue-100 text-blue-800',
        'tutorial': 'bg-green-100 text-green-800',
        'announcement': 'bg-yellow-100 text-yellow-800',
        'event': 'bg-purple-100 text-purple-800'
      }
    },
    {
      key: 'status',
      title: 'Status',
      type: 'badge',
      width: '15%',
      minWidth: '100px',
      badgeColors: {
        'published': 'bg-green-100 text-green-800',
        'draft': 'bg-gray-100 text-gray-800',
        'archived': 'bg-red-100 text-red-800'
      }
    },
    {
      key: 'publishedAt',
      title: 'Dipublikasi',
      type: 'date',
      width: '15%',
      minWidth: '120px'
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Create konfigurasi kolom untuk tabel produk
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom produk
 */
export const createProductTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'name',
      title: 'Produk',
      width: '30%',
      minWidth: '200px',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Kategori',
      width: '13%',
      minWidth: '120px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Harga',
      type: 'currency',
      width: '14%',
      minWidth: '120px',
      align: 'right'
    },
    {
      key: 'stock',
      title: 'Stok',
      width: '13%',
      minWidth: '120px',
      render: (value) => {
        const stockClass = value === 0 
          ? 'bg-red-100 text-red-800' 
          : value < 10 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-green-100 text-green-800';
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockClass}`}>
            {value} unit
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      width: '15%',
      minWidth: '120px',
      type: 'badge',
      badgeColors: {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-red-100 text-red-800'
      },
      render: (value) => value === 'active' ? 'Aktif' : 'Tidak Aktif'
    },
    {
      key: 'sold',
      title: 'Terjual',
      width: '15%',
      minWidth: '100px',
      render: (value) => `${value} unit`
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Create konfigurasi kolom untuk tabel keuangan
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom keuangan
 */
export const createFinancialTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'date',
      title: 'Tanggal',
      type: 'date',
      width: '10%',
      minWidth: '100px'
    },
    {
      key: 'description',
      title: 'Deskripsi',
      width: '35%',
      minWidth: '200px'
    },
    {
      key: 'category',
      title: 'Kategori',
      width: '15%',
      minWidth: '120px'
    },
    {
      key: 'type',
      title: 'Tipe',
      type: 'badge',
      width: '12%',
      minWidth: '100px',
      badgeColors: {
        'Pemasukan': 'bg-green-100 text-green-800',
        'Pengeluaran': 'bg-red-100 text-red-800'
      }
    },
    {
      key: 'amount',
      title: 'Nominal',
      type: 'currency',
      showSign: true,
      width: '16%',
      minWidth: '130px',
      align: 'right'
    },
    {
      key: 'status',
      title: 'Status',
      type: 'badge',
      width: '12%',
      minWidth: '100px',
      badgeColors: {
        'Selesai': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Dibatalkan': 'bg-red-100 text-red-800'
      }
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Create konfigurasi kolom untuk tabel department
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom department
 */
export const createDepartmentTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'name',
      title: 'Department',
      width: '30%',
      minWidth: '200px',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'head',
      title: 'Kepala Department',
      width: '25%',
      minWidth: '180px'
    },
    {
      key: 'employeeCount',
      title: 'Jumlah Karyawan',
      width: '20%',
      minWidth: '150px',
      render: (value) => `${value} orang`
    },
    {
      key: 'createdAt',
      title: 'Dibuat',
      type: 'date',
      width: '25%',
      minWidth: '120px'
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Create konfigurasi kolom untuk tabel division
 * @param {Object} customOverrides - Override konfigurasi
 * @returns {Array} Konfigurasi kolom division
 */
export const createDivisionTableColumns = (customOverrides = {}) => {
  const baseColumns = [
    {
      key: 'name',
      title: 'Divisi',
      width: '25%',
      minWidth: '180px',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'departmentName',
      title: 'Department',
      width: '20%',
      minWidth: '150px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'head',
      title: 'Kepala Divisi',
      width: '20%',
      minWidth: '150px'
    },
    {
      key: 'employeeCount',
      title: 'Jumlah Karyawan',
      width: '17%',
      minWidth: '120px',
      render: (value) => `${value} orang`
    },
    {
      key: 'createdAt',
      title: 'Dibuat',
      type: 'date',
      width: '18%',
      minWidth: '120px'
    }
  ];

  return baseColumns.map(col => ({
    ...col,
    ...(customOverrides[col.key] || {})
  }));
};

/**
 * Predefined table configurations untuk berbagai entity
 */
export const TABLE_CONFIGS = {
  users: createUserTableColumns,
  articles: createArticleTableColumns,
  products: createProductTableColumns,
  financial: createFinancialTableColumns,
  departments: createDepartmentTableColumns,
  divisions: createDivisionTableColumns
};

export default {
  generateColumnsFromSchema,
  createUserTableColumns,
  createArticleTableColumns,
  createProductTableColumns,
  createFinancialTableColumns,
  createDepartmentTableColumns,
  createDivisionTableColumns,
  TABLE_CONFIGS
};
