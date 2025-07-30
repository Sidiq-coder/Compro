import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, FormField, Select, Card, Alert } from '../components/ui';
import { ROUTES } from '../constants';

const AddUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    departmentId: '',
    divisionId: '',
    password: '',
    confirmPassword: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role wajib dipilih';
    }

    // Department validation
    if (!formData.departmentId) {
      newErrors.departmentId = 'Departemen wajib dipilih';
    }

    // Division validation (optional for some roles)
    if (['ketua_divisi', 'pengurus', 'anggota'].includes(formData.role) && !formData.divisionId) {
      newErrors.divisionId = 'Divisi wajib dipilih untuk role ini';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      // Reset form
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Pengguna Baru</h1>
                <p className="text-gray-600 mt-1">Tambahkan pengguna baru ke dalam sistem</p>
              </div>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Button>
            </div>
          </div>

          {/* Form */}
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pribadi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Nama Lengkap"
                      required
                      error={errors.name}
                    >
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contoh@email.com"
                      />
                    </FormField>

                    <FormField
                      label="Nomor Telepon"
                      required
                      error={errors.phone}
                    >
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="081234567890"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Organization Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Organisasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    <FormField
                      label="Divisi"
                      error={errors.divisionId}
                      helperText={['ketua_divisi', 'pengurus', 'anggota'].includes(formData.role) ? 'Wajib untuk role ini' : 'Opsional'}
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

                {/* Security Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Keamanan Akun</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Password"
                      required
                      error={errors.password}
                      helperText="Minimal 6 karakter"
                    >
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan password"
                      />
                    </FormField>

                    <FormField
                      label="Konfirmasi Password"
                      required
                      error={errors.confirmPassword}
                    >
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Konfirmasi password"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Pengguna'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
