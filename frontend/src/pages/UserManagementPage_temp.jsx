import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, Alert, TableActions, DataTable } from '../components/ui';
import { formatDate } from '../utils';
import { userService } from '../services/services';
import { ROUTES } from '../constants';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    // Reload users when filters change with debounce
    const timeoutId = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedRole, selectedDepartment]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({
        search: searchTerm,
        role: selectedRole,
        departmentId: selectedDepartment,
        page: 1,
        limit: 50
      });
      
      if (response.success) {
        setUsers(response.data.users || response.data || []);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat data pengguna' });
      }
    } catch (error) {
      console.error('Load users error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat data pengguna: ' + error.message });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await userService.getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const handleAddUser = () => {
    navigate(ROUTES.ADMIN.ADD_USER);
  };

  const handleEditUser = (user) => {
    navigate(`/dashboard/users/edit/${user.id}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        setLoading(true);
        const response = await userService.deleteUser(userId);
        if (response.success) {
          setAlert({ type: 'success', message: 'Pengguna berhasil dihapus!' });
          loadUsers(); // Reload users
          loadStats(); // Reload stats
        } else {
          setAlert({ type: 'error', message: response.message || 'Gagal menghapus pengguna' });
        }
      } catch (error) {
        console.error('Delete user error:', error);
        setAlert({ type: 'error', message: 'Gagal menghapus pengguna: ' + error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Pengguna',
      value: stats.totalUsers || 0,
      change: stats.growthPercentage || '+0%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Pengguna Aktif',
      value: stats.activeUsers || 0,
      change: '+8%',
      changeType: 'positive',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Pengguna Baru',
      value: stats.recentUsers || 0,
      change: '+15%',
      changeType: 'positive',
      icon: '🆕',
      color: 'bg-purple-500'
    },
    {
      title: 'Admin',
      value: stats.adminUsers || 0,
      change: '+2%',
      changeType: 'positive',
      icon: '⚡',
      color: 'bg-yellow-500'
    }
  ];

  const roles = ['admin', 'ketua_umum', 'ketua_departemen', 'ketua_divisi', 'sekretaris', 'bendahara', 'pengurus', 'anggota'];

  // Prepare users data for table with index
  const usersWithIndex = users.map((user, index) => ({
    ...user,
    index: index + 1,
    statusBadge: user.status === 'active' ? 'Aktif' : 'Tidak Aktif',
    departmentName: user.department?.name || 'Tidak ada',
    divisionName: user.division?.name || 'Tidak ada',
    lastLoginFormatted: user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Belum pernah login'
  }));

  const columns = [
    {
      key: 'index',
      title: 'No',
      sortable: false,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'name',
      title: 'Nama',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value) => {
        const roleColors = {
          admin: 'bg-red-100 text-red-800',
          ketua_umum: 'bg-purple-100 text-purple-800',
          ketua_departemen: 'bg-blue-100 text-blue-800',
          ketua_divisi: 'bg-indigo-100 text-indigo-800',
          sekretaris: 'bg-green-100 text-green-800',
          bendahara: 'bg-yellow-100 text-yellow-800',
          pengurus: 'bg-gray-100 text-gray-800',
          anggota: 'bg-slate-100 text-slate-800'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Tidak ada'}
          </span>
        );
      }
    },
    {
      key: 'departmentName',
      title: 'Departemen',
      sortable: true
    },
    {
      key: 'divisionName',
      title: 'Divisi',
      sortable: true
    },
    {
      key: 'statusBadge',
      title: 'Status',
      sortable: true,
      render: (value, row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Aksi',
      sortable: false,
      render: (value, row) => (
        <TableActions
          onEdit={() => handleEditUser(row)}
          onDelete={() => handleDelete(row.id)}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
            <p className="mt-1 text-sm text-gray-600">
              Kelola data pengguna, role, dan akses sistem
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Alert */}
          {alert && (
            <Alert 
              type={alert.type} 
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Pengguna
            </Button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow">
            <DataTable
              columns={columns}
              data={usersWithIndex}
              loading={loading}
              emptyMessage={searchTerm || selectedRole ? "Tidak ada pengguna yang sesuai dengan filter" : "Tidak ada data pengguna"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
