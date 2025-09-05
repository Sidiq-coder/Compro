import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Modal, Input, Alert, TableActions } from '../components/ui';
import { departmentService } from '../services/services';

const DepartmentPage = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getDepartments({
        search: searchTerm,
        page: 1,
        limit: 50
      });
      
      if (response.success) {
        setDepartments(response.data || []);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat departemen' });
      }
    } catch (error) {
      console.error('Fetch departments error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat departemen: ' + error.message });
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await departmentService.getDepartmentStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (editingDepartment) {
        response = await departmentService.updateDepartment(editingDepartment.id, formData);
      } else {
        response = await departmentService.createDepartment(formData);
      }

      if (response.success) {
        setAlert({
          type: 'success',
          message: editingDepartment ? 'Departemen berhasil diupdate!' : 'Departemen berhasil dibuat!'
        });
        setShowModal(false);
        setEditingDepartment(null);
        setFormData({ name: '', description: '', head: '' });
        fetchDepartments();
        fetchStats();
      } else {
        setAlert({ type: 'error', message: response.message || 'Gagal menyimpan departemen' });
      }
    } catch (error) {
      console.error('Submit department error:', error);
      setAlert({ type: 'error', message: 'Gagal menyimpan departemen: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || '',
      head: department.head || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus departemen ini?')) {
      try {
        setLoading(true);
        const response = await departmentService.deleteDepartment(departmentId);
        if (response.success) {
          setAlert({ type: 'success', message: 'Departemen berhasil dihapus!' });
          fetchDepartments();
          fetchStats();
        } else {
          setAlert({ type: 'error', message: response.message || 'Gagal menghapus departemen' });
        }
      } catch (error) {
        console.error('Delete department error:', error);
        setAlert({ type: 'error', message: 'Gagal menghapus departemen: ' + error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', head: '' });
    setEditingDepartment(null);
    setShowModal(false);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Departemen',
      value: stats.totalDepartments || 0,
      change: stats.growthPercentage || '+0%',
      changeType: 'positive',
      icon: '🏢',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Karyawan',
      value: stats.totalEmployees || 0,
      change: '+5%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-green-500'
    },
    {
      title: 'Dept. Terbesar',
      value: stats.largestDepartmentSize || 0,
      change: '+2%',
      changeType: 'positive',
      icon: '📈',
      color: 'bg-purple-500'
    },
    {
      title: 'Rata-rata Karyawan',
      value: stats.averageEmployeesPerDept || 0,
      change: '+3%',
      changeType: 'positive',
      icon: '📊',
      color: 'bg-yellow-500'
    }
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Departemen</h1>
          <p className="text-gray-600">Kelola departemen dan struktur organisasi</p>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            {/* Alert */}
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message}
                onClose={() => setAlert(null)}
                className="mb-4"
              />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari departemen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Departemen
              </Button>
            </div>

            {/* Departments Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Departemen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kepala Departemen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Karyawan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Dibuat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Memuat departemen...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          {searchTerm ? 'Tidak ada departemen yang sesuai dengan pencarian' : 'Tidak ada departemen'}
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((department) => (
                        <tr key={department.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {department.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {department.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {department.head || 'Belum ditentukan'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {department.employeeCount || 0} orang
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(department.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <TableActions
                              onEdit={() => handleEdit(department)}
                              onDelete={() => handleDelete(department.id)}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Department */}
      <Modal isOpen={showModal} onClose={resetForm} title={editingDepartment ? 'Edit Departemen' : 'Tambah Departemen'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Departemen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masukkan nama departemen"
            required
          />
          <Input
            label="Deskripsi"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Masukkan deskripsi departemen"
          />
          <Input
            label="Kepala Departemen"
            value={formData.head}
            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            placeholder="Masukkan nama kepala departemen"
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Menyimpan...' : (editingDepartment ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentPage;
