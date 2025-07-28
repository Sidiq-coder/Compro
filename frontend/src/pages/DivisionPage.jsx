import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Modal, Input, Alert, TableActions, DataTable } from '../components/ui';
import { calculateDivisionStats, createDivisionTableColumns } from '../utils';

const DivisionPage = () => {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    departmentId: ''
  });

  // Mock data untuk demo
  const mockDepartments = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Marketing' }
  ];

  const mockDivisions = [
    { 
      id: 1, 
      name: 'Recruitment', 
      description: 'Perekrutan karyawan baru', 
      head: 'Alice Brown', 
      departmentId: 1,
      departmentName: 'Human Resources',
      employeeCount: 5, 
      createdAt: '2024-01-15' 
    },
    { 
      id: 2, 
      name: 'Training & Development', 
      description: 'Pelatihan dan pengembangan karyawan', 
      head: 'Bob Wilson', 
      departmentId: 1,
      departmentName: 'Human Resources',
      employeeCount: 7, 
      createdAt: '2024-01-20' 
    },
    { 
      id: 3, 
      name: 'Accounting', 
      description: 'Akuntansi dan pembukuan', 
      head: 'Carol Davis', 
      departmentId: 2,
      departmentName: 'Finance',
      employeeCount: 4, 
      createdAt: '2024-02-01' 
    },
    { 
      id: 4, 
      name: 'Software Development', 
      description: 'Pengembangan perangkat lunak', 
      head: 'David Lee', 
      departmentId: 3,
      departmentName: 'IT',
      employeeCount: 12, 
      createdAt: '2024-02-10' 
    },
    { 
      id: 5, 
      name: 'Digital Marketing', 
      description: 'Pemasaran digital dan media sosial', 
      head: 'Eva Garcia', 
      departmentId: 4,
      departmentName: 'Marketing',
      employeeCount: 6, 
      createdAt: '2024-02-15' 
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
      setDivisions(mockDivisions);
      setDepartments(mockDepartments);
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data divisi' });
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
      
      const departmentName = departments.find(dept => dept.id === parseInt(formData.departmentId))?.name || '';
      
      if (editingDivision) {
        // Update division
        setDivisions(prev => 
          prev.map(div => 
            div.id === editingDivision.id 
              ? { 
                  ...div, 
                  ...formData, 
                  departmentId: parseInt(formData.departmentId),
                  departmentName,
                  updatedAt: new Date().toISOString() 
                }
              : div
          )
        );
        setAlert({ type: 'success', message: 'Divisi berhasil diperbarui!' });
      } else {
        // Add new division
        const newDivision = {
          id: Date.now(),
          ...formData,
          departmentId: parseInt(formData.departmentId),
          departmentName,
          employeeCount: 0,
          createdAt: new Date().toISOString()
        };
        setDivisions(prev => [newDivision, ...prev]);
        setAlert({ type: 'success', message: 'Divisi berhasil ditambahkan!' });
      }
      
      setShowModal(false);
      setEditingDivision(null);
      setFormData({ name: '', description: '', head: '', departmentId: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal menyimpan divisi' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (division) => {
    setEditingDivision(division);
    setFormData({
      name: division.name,
      description: division.description,
      head: division.head,
      departmentId: division.departmentId.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus divisi ini?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDivisions(prev => prev.filter(div => div.id !== id));
        setAlert({ type: 'success', message: 'Divisi berhasil dihapus!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Gagal menghapus divisi' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter divisions based on search term and selected department
  const filteredDivisions = divisions.filter(division => {
    const matchesSearch = division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         division.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         division.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || division.departmentId.toString() === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Calculate division statistics using utils
  const divisionStats = calculateDivisionStats(filteredDivisions);
  const { totalDivisions, totalEmployees, averageEmployeesPerDivision, activeDepartments } = divisionStats;

  const statsData = [
    {
      title: 'Total Divisi',
      value: totalDivisions,
      icon: '🏛️',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Total Karyawan',
      value: totalEmployees,
      icon: '👥',
      change: '+10%',
      changeType: 'increase'
    },
    {
      title: 'Rata-rata per Divisi',
      value: averageEmployeesPerDivision,
      icon: '📊',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Department Aktif',
      value: activeDepartments,
      icon: '🏢',
      change: '0%',
      changeType: 'stable'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Divisi</h1>
            <p className="text-gray-600 mt-2">Kelola divisi dalam setiap department</p>
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
            searchPlaceholder="Cari divisi..."
            filterValue={selectedDepartment}
            onFilterChange={(e) => setSelectedDepartment(e.target.value)}
            filterOptions={departments.map(dept => ({ value: dept.id, label: dept.name }))}
            filterPlaceholder="Semua Department"
            onAdd={() => setShowModal(true)}
            addButtonText="Tambah Divisi"
            addButtonIcon="➕"
          />

          {/* Division Table */}
          <DataTable
            data={filteredDivisions}
            columns={createDivisionTableColumns()}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Tidak ada data divisi"
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDivision(null);
          setFormData({ name: '', description: '', head: '', departmentId: '' });
        }}
        title={editingDivision ? 'Edit Divisi' : 'Tambah Divisi'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Divisi
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama divisi"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
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
              placeholder="Masukkan deskripsi divisi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kepala Divisi
            </label>
            <Input
              type="text"
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              placeholder="Masukkan nama kepala divisi"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingDivision(null);
                setFormData({ name: '', description: '', head: '', departmentId: '' });
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (editingDivision ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DivisionPage;
