import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { 
  Button, 
  FormField, 
  Select, 
  Card, 
  Alert, 
  StepIndicator,
  DateInput,
  Textarea,
  Checkbox,
  PermissionCard
} from '../components/ui';
import { ROUTES } from '../constants';

const AddUserPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addMode, setAddMode] = useState('single'); // 'single' or 'bulk'

  // Form state
  const [formData, setFormData] = useState({
    // Informasi Dasar
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    departmentId: '',
    divisionId: '',
    
    // Profil Detail
    employeeId: '',
    birthDate: '',
    joinDate: '',
    address: '',
    bio: '',
    
    // Hak Akses
    permissions: {
      userManagement: false,
      articleManagement: false,
      eventManagement: false,
      financeManagement: false,
      productManagement: false,
      attendanceManagement: false,
      reportAccess: false,
      systemSettings: false
    },
    
    // Pengaturan Akun
    sendWelcomeEmail: true,
    requirePasswordChange: true
  });

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Step configuration
  const steps = [
    { 
      key: 'basic', 
      title: 'Informasi Dasar', 
      subtitle: 'Data pribadi dan kontak' 
    },
    { 
      key: 'profile', 
      title: 'Profil Detail', 
      subtitle: 'ID karyawan dan detail' 
    },
    { 
      key: 'permissions', 
      title: 'Hak Akses', 
      subtitle: 'Modul dan fitur akses' 
    },
    { 
      key: 'review', 
      title: 'Review', 
      subtitle: 'Periksa dan konfirmasi' 
    }
  ];

  // Options for select fields (in real app, these would come from API)
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'ketua_umum', label: 'Ketua Umum' },
    { value: 'ketua_departemen', label: 'Ketua Departemen' },
    { value: 'ketua_divisi', label: 'Ketua Divisi' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'pengurus', label: 'Pengurus' },
    { value: 'anggota', label: 'Anggota' }
  ];

  const departmentOptions = [
    { value: '1', label: 'Teknologi Informasi' },
    { value: '2', label: 'Keuangan' },
    { value: '3', label: 'Sumber Daya Manusia' },
    { value: '4', label: 'Marketing' },
    { value: '5', label: 'Operasional' }
  ];

  const divisionOptions = [
    { value: '1', label: 'Web Development' },
    { value: '2', label: 'Mobile Development' },
    { value: '3', label: 'Data Analysis' },
    { value: '4', label: 'UI/UX Design' },
    { value: '5', label: 'Quality Assurance' }
  ];

  // Permission options
  const permissionOptions = [
    {
      key: 'userManagement',
      title: 'Manajemen Pengguna',
      description: 'Tambah, edit, hapus pengguna'
    },
    {
      key: 'articleManagement',
      title: 'Manajemen Artikel',
      description: 'Buat dan edit artikel'
    },
    {
      key: 'eventManagement',
      title: 'Manajemen Event',
      description: 'Buat dan kelola event'
    },
    {
      key: 'financeManagement',
      title: 'Manajemen Keuangan',
      description: 'Akses data keuangan'
    },
    {
      key: 'productManagement',
      title: 'Manajemen Produk',
      description: 'Kelola katalog produk'
    },
    {
      key: 'attendanceManagement',
      title: 'Manajemen Absensi',
      description: 'Kelola data kehadiran'
    },
    {
      key: 'reportAccess',
      title: 'Laporan',
      description: 'Akses dan export laporan'
    },
    {
      key: 'systemSettings',
      title: 'Pengaturan',
      description: 'Konfigurasi sistem'
    }
  ];

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle permission changes
  const handlePermissionChange = (permissionKey, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: checked
      }
    }));
  };

  // Step navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber <= currentStep + 1 && stepNumber >= 1) {
      setCurrentStep(stepNumber);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Informasi Dasar
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'Nama depan wajib diisi';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Nama belakang wajib diisi';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Format email tidak valid';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Nomor telepon wajib diisi';
        }
        if (!formData.role) {
          newErrors.role = 'Role wajib dipilih';
        }
        if (!formData.departmentId) {
          newErrors.departmentId = 'Departemen wajib dipilih';
        }
        if (['ketua_divisi', 'pengurus', 'anggota'].includes(formData.role) && !formData.divisionId) {
          newErrors.divisionId = 'Divisi wajib dipilih untuk role ini';
        }
        break;

      case 2: // Profil Detail
        if (!formData.employeeId.trim()) {
          newErrors.employeeId = 'ID Karyawan wajib diisi';
        }
        if (!formData.joinDate) {
          newErrors.joinDate = 'Tanggal bergabung wajib diisi';
        }
        break;

      case 3: // Hak Akses
        // No required validation for permissions
        break;

      case 4: // Review
        // Final validation will be done here
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate entire form
  const validateForm = () => {
    // Validate all steps
    for (let i = 1; i <= 3; i++) {
      const originalStep = currentStep;
      setCurrentStep(i);
      if (!validateCurrentStep()) {
        setCurrentStep(originalStep);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API call would go here
      // const response = await userService.createUser(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Pengguna berhasil ditambahkan!');
      
      // Reset form and redirect
      setTimeout(() => {
        navigate(ROUTES.USERS);
      }, 1500);

    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat menambahkan pengguna');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  // Handle bulk file upload
  const handleBulkFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBulkFile(file);
      // Here you would parse the Excel file and preview the data
      // For now, we'll just set a dummy preview
      setBulkPreview([
        { name: 'Ahmad Rahman', email: 'ahmad@example.com', role: 'Admin' },
        { name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'Employee' },
      ]);
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) {
      setError('Silakan pilih file Excel terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for bulk upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Berhasil menambahkan ${bulkPreview.length} pengguna dari file Excel`);
      setTimeout(() => {
        navigate(ROUTES.USERS);
      }, 2000);
    } catch (error) {
      setError('Gagal mengunggah pengguna. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderInformasiDasar();
      case 2:
        return renderProfilDetail();
      case 3:
        return renderHakAkses();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  // Render mode selection
  const renderModeSelection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
      {/* Single User Card */}
      <Card 
        className={`cursor-pointer border-2 transition-all duration-200 ${
          addMode === 'single' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setAddMode('single')}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tambah Satu Pengguna</h3>
              <p className="text-sm text-gray-600">Buat akun pengguna secara individual</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            • Form wizard dengan validasi lengkap<br />
            • Input data secara detail dan terstruktur<br />
            • Cocok untuk penambahan pengguna baru
          </div>
        </div>
      </Card>

      {/* Bulk User Card */}
      <Card 
        className={`cursor-pointer border-2 transition-all duration-200 ${
          addMode === 'bulk' 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setAddMode('bulk')}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tambah Banyak Pengguna</h3>
              <p className="text-sm text-gray-600">Import pengguna dari file Excel</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            • Upload file Excel (.xlsx, .xls)<br />
            • Import data dalam jumlah besar<br />
            • Cocok untuk migrasi atau penambahan massal
          </div>
        </div>
      </Card>
    </div>
  );

  // Render bulk upload form
  const renderBulkUpload = () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Import Pengguna dari Excel</h3>
        
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-lg font-medium text-gray-900 mb-2">
              {bulkFile ? bulkFile.name : 'Pilih file Excel'}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Format yang didukung: .xlsx, .xls (maksimal 10MB)
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkFileChange}
              className="hidden"
              id="bulk-file-upload"
            />
            <label
              htmlFor="bulk-file-upload"
              className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {bulkFile ? 'Ganti File' : 'Pilih File'}
            </label>
          </div>
        </div>

        {/* Template Download */}
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm underline">
            Download Template Excel
          </button>
        </div>
      </div>

      {/* Preview */}
      {bulkPreview.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview Data ({bulkPreview.length} pengguna)</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bulkPreview.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => setAddMode('single')}
          disabled={loading}
        >
          Kembali ke Mode Tunggal
        </Button>

        <Button
          type="button"
          onClick={handleBulkSubmit}
          loading={loading}
          disabled={loading || !bulkFile}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
          </svg>
          {loading ? 'Mengimpor...' : `Import ${bulkPreview.length} Pengguna`}
        </Button>
      </div>
    </div>
  );

  // Step 1: Informasi Dasar
  const renderInformasiDasar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          <FormField
            label="Nama Depan"
            required
            error={errors.firstName}
          >
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="Nama depan"
            />
          </FormField>

          <FormField
            label="Nama Belakang"
            required
            error={errors.lastName}
          >
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="Nama belakang"
            />
          </FormField>

          <FormField
            label="Email"
            required
            error={errors.email}
          >
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="nama@email.com"
            />
          </FormField>

          <FormField
            label="Nomor Telepon"
            error={errors.phone}
          >
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="081234567890"
            />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Role & Departemen</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          <FormField
            label="Role"
            required
            error={errors.role}
          >
            <Select
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              options={roleOptions}
              placeholder="Pilih role"
            />
          </FormField>

          <FormField
            label="Departemen"
            required
            error={errors.departmentId}
          >
            <Select
              value={formData.departmentId}
              onChange={(value) => handleInputChange('departmentId', value)}
              options={departmentOptions}
              placeholder="Pilih departemen"
            />
          </FormField>
        </div>
        
        {/* Add Divisi field prominently as shown in the image */}
        <div className="mt-6">
          <FormField
            label="Divisi"
            error={errors.divisionId}
            helperText={['ketua_divisi', 'pengurus', 'anggota'].includes(formData.role) ? 'Wajib untuk role ini' : 'Opsional untuk role ini'}
          >
            <Select
              value={formData.divisionId}
              onChange={(value) => handleInputChange('divisionId', value)}
              options={divisionOptions}
              placeholder="Pilih divisi"
              disabled={!formData.departmentId}
            />
          </FormField>
        </div>
      </div>
    </div>
  );

  // Step 2: Profil Detail
  const renderProfilDetail = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Detail Profil</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl">
          <FormField
            label="ID Karyawan"
            error={errors.employeeId}
          >
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="EMP001"
            />
          </FormField>

          <FormField
            label="Tanggal Bergabung"
            error={errors.joinDate}
          >
            <DateInput
              value={formData.joinDate}
              onChange={(e) => handleInputChange('joinDate', e.target.value)}
              error={errors.joinDate}
              placeholder="dd/mm/yyyy"
            />
          </FormField>

          <FormField
            label="Tanggal Lahir"
            error={errors.birthDate}
          >
            <DateInput
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              error={errors.birthDate}
              placeholder="dd/mm/yyyy"
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField
            label="Alamat"
            error={errors.address}
          >
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Alamat lengkap..."
              rows={3}
              className="bg-gray-50"
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField
            label="Bio/Deskripsi"
            error={errors.bio}
          >
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Deskripsi singkat tentang pengguna..."
              rows={4}
              className="bg-gray-50"
            />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Pengaturan Akun</h3>
        <div className="space-y-4">
          <Checkbox
            id="sendWelcomeEmail"
            checked={formData.sendWelcomeEmail}
            onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
          >
            Kirim email selamat datang
          </Checkbox>

          <Checkbox
            id="requirePasswordChange"
            checked={formData.requirePasswordChange}
            onChange={(e) => handleInputChange('requirePasswordChange', e.target.checked)}
          >
            Wajib ganti password pada login pertama
          </Checkbox>
        </div>
      </div>
    </div>
  );

  // Step 3: Hak Akses
  const renderHakAkses = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Hak Akses</h3>
        <p className="text-blue-600 mb-8">Pilih modul dan fitur yang dapat diakses oleh pengguna ini</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl">
          {permissionOptions.map((permission) => (
            <PermissionCard
              key={permission.key}
              title={permission.title}
              description={permission.description}
              checked={formData.permissions[permission.key]}
              onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4: Review
  const renderReview = () => {
    const selectedDepartment = departmentOptions.find(d => d.value === formData.departmentId);
    const selectedDivision = divisionOptions.find(d => d.value === formData.divisionId);
    const selectedRole = roleOptions.find(r => r.value === formData.role);
    const selectedPermissions = permissionOptions.filter(p => formData.permissions[p.key]);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Data Pengguna</h3>
          <p className="text-gray-600 mb-8">Periksa kembali informasi sebelum membuat akun pengguna</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Informasi Personal</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Nama Lengkap:</span>
                <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Telepon:</span>
                <span className="font-medium text-gray-900">{formData.phone || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Departemen:</span>
                <span className="font-medium text-gray-900">{selectedDepartment?.label || '-'}</span>
              </div>
              {formData.divisionId && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Divisi:</span>
                  <span className="font-medium text-gray-900">{selectedDivision?.label || '-'}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Role & Hak Akses</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium bg-gray-900 text-white px-2 py-1 rounded-full text-xs">
                  {selectedRole?.label}
                </span>
              </div>
              <div className="py-2">
                <span className="text-gray-600 block mb-2">Hak Akses:</span>
                {selectedPermissions.length > 0 ? (
                  <div className="space-y-1">
                    {selectedPermissions.map((permission) => (
                      <div key={permission.key} className="text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded">
                        {permission.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Tidak ada hak akses khusus</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons section for review page */}
        <div className="flex justify-between pt-8 border-t border-gray-200 mt-12">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
            disabled={loading}
            className="px-6 py-3"
          >
            Edit Data
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            className="flex items-center px-8 py-3 bg-gray-900 hover:bg-gray-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {loading ? 'Membuat Pengguna...' : 'Buat Pengguna'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header - Full width, aligned left */}
        <div className="w-full bg-white shadow-sm border-b">
          <div className="p-6">
            <div className="flex items-center mb-2">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Pengguna Baru</h1>
            <p className="text-gray-600 mt-1">Buat akun pengguna baru untuk organisasi</p>
          </div>
        </div>

        {/* Content - With left margin */}
        <div className="w-full p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mb-6">
                {success}
              </Alert>
            )}

            {/* Main Layout - Side by Side */}
            <div className="flex gap-8">
              {/* Left Side - Mode Selection Cards */}
              <div className="w-80 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Pilih Mode</h2>
                <div className="space-y-4">
                  {/* Single User Card */}
                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      addMode === 'single' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAddMode('single')}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Tambah Satu Pengguna</h3>
                          <p className="text-sm text-gray-600">Form wizard detail</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Form dengan validasi lengkap dan input terstruktur
                      </div>
                    </div>
                  </Card>

                  {/* Bulk User Card */}
                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      addMode === 'bulk' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAddMode('bulk')}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Tambah Banyak Pengguna</h3>
                          <p className="text-sm text-gray-600">Import dari Excel</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Upload file Excel untuk import massal
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Right Side - Content Area */}
              <div className="flex-1">
                {/* Single User Mode */}
                {addMode === 'single' && (
                  <>
                    {/* Step Indicator */}
                    <StepIndicator
                      steps={steps}
                      currentStep={currentStep}
                      onStepClick={goToStep}
                      className="mb-8"
                    />

                    {/* Form Content */}
                    <Card className="w-full">
                      <div className="p-6 lg:p-8">
                        {/* Step Content */}
                        <div className="min-h-[500px]">
                          {renderStepContent()}
                        </div>

                        {/* Navigation Buttons - Hidden on review step as review has its own buttons */}
                        {currentStep !== 4 && (
                          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                            <div>
                              {currentStep > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={prevStep}
                                  disabled={loading}
                                >
                                  Sebelumnya
                                </Button>
                              )}
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                              >
                                Batal
                              </Button>

                              <Button
                                type="button"
                                onClick={nextStep}
                                disabled={loading}
                              >
                                Selanjutnya
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </>
                )}

                {/* Bulk User Mode */}
                {addMode === 'bulk' && (
                  <Card className="w-full">
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Import Pengguna dari Excel</h3>
                      
                      {/* File Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-lg font-medium text-gray-900 mb-2">
                            {bulkFile ? bulkFile.name : 'Pilih file Excel'}
                          </div>
                          <div className="text-sm text-gray-500 mb-4">
                            Format yang didukung: .xlsx, .xls (maksimal 10MB)
                          </div>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleBulkFileChange}
                            className="hidden"
                            id="bulk-file-upload"
                          />
                          <label
                            htmlFor="bulk-file-upload"
                            className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            {bulkFile ? 'Ganti File' : 'Pilih File'}
                          </label>
                        </div>
                      </div>

                      {/* Template Download */}
                      <div className="text-center mb-6">
                        <button className="text-green-600 hover:text-green-800 text-sm underline">
                          Download Template Excel
                        </button>
                      </div>

                      {/* Preview */}
                      {bulkPreview.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview Data ({bulkPreview.length} pengguna)</h4>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {bulkPreview.map((user, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Bulk Actions */}
                      <div className="flex justify-between pt-6 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Batal
                        </Button>

                        <Button
                          type="button"
                          onClick={handleBulkSubmit}
                          loading={loading}
                          disabled={loading || !bulkFile}
                          className="flex items-center bg-green-600 hover:bg-green-700"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                          </svg>
                          {loading ? 'Mengimpor...' : `Import ${bulkPreview.length} Pengguna`}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
