import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Modal, Input, Alert, TableActions, DataTable } from '../components/ui';
import { calculateDepartmentStats, createDepartmentTableColumns } from '../utils';

const DepartmentPage = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
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

  // Mock data untuk demo
  const mockDepartments = [
    { id: 1, name: 'Human Resources', description: 'Mengelola sumber daya manusia', head: 'John Doe', employeeCount: 12, createdAt: '2024-01-15' },
    { id: 2, name: 'Finance', description: 'Mengelola keuangan perusahaan', head: 'Jane Smith', employeeCount: 8, createdAt: '2024-01-20' },
    { id: 3, name: 'IT', description: 'Teknologi Informasi', head: 'Mike Johnson', employeeCount: 15, createdAt: '2024-02-01' },
    { id: 4, name: 'Marketing', description: 'Pemasaran dan promosi', head: 'Sarah Wilson', employeeCount: 10, createdAt: '2024-02-10' }
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDepartments(mockDepartments);
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data department' });
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
      
      if (editingDepartment) {
        // Update department
        setDepartments(prev => 
          prev.map(dept => 
            dept.id === editingDepartment.id 
              ? { ...dept, ...formData, updatedAt: new Date().toISOString() }
              : dept
          )
        );
        setAlert({ type: 'success', message: 'Department berhasil diperbarui!' });
      } else {
        // Add new department
        const newDepartment = {
          id: Date.now(),
          ...formData,
          employeeCount: 0,
          createdAt: new Date().toISOString()
        };
        setDepartments(prev => [newDepartment, ...prev]);
        setAlert({ type: 'success', message: 'Department berhasil ditambahkan!' });
      }
      
      setShowModal(false);
      setEditingDepartment(null);
      setFormData({ name: '', description: '', head: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal menyimpan department' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      head: department.head
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus department ini?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDepartments(prev => prev.filter(dept => dept.id !== id));
        setAlert({ type: 'success', message: 'Department berhasil dihapus!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Gagal menghapus department' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => {
    return department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           department.head.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate department statistics using utils
  const departmentStats = calculateDepartmentStats(filteredDepartments);
  const { totalDepartments, totalEmployees, averageEmployeesPerDepartment } = departmentStats;

  const statsData = [
    {
      title: 'Total Department',
      value: totalDepartments,
      icon: '🏢',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Karyawan',
      value: totalEmployees,
      icon: '👥',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Rata-rata per Dept',
      value: averageEmployeesPerDepartment,
      icon: '📊',
      change: '0%',
      changeType: 'stable'
    },
    {
      title: 'Department Baru',
      value: 2,
      icon: '📈',
      change: '+25%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Department</h1>
            <p className="text-gray-600 mt-2">Kelola department dalam organisasi</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Actions */}
          <TableActions
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            searchPlaceholder="Cari department..."
            showFilter={false}
            onAdd={() => setShowModal(true)}
            addButtonText="Tambah Department"
            addButtonIcon="➕"
          />

          {/* Department Table */}
          <DataTable
            data={filteredDepartments}
            columns={createDepartmentTableColumns()}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Tidak ada data department"
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDepartment(null);
          setFormData({ name: '', description: '', head: '' });
        }}
        title={editingDepartment ? 'Edit Department' : 'Tambah Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Department
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama department"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi department"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kepala Department
            </label>
            <Input
              type="text"
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              placeholder="Masukkan nama kepala department"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingDepartment(null);
                setFormData({ name: '', description: '', head: '' });
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (editingDepartment ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentPage;
