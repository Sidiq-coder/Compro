import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Input, StatsCard, TableActions, DataTable } from '../components/ui';
import { createUserTableColumns } from '../utils';
import { ROUTES } from '../constants';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua Role');

  const statsCards = [
    {
      title: 'Total Pengguna',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: '�',
      color: 'bg-blue-500'
    },
    {
      title: 'Aktif',
      value: '1,089',
      change: '+8%',
      changeType: 'positive',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Nonaktif',
      value: '158',
      change: '-5%',
      changeType: 'negative',
      icon: '❌',
      color: 'bg-yellow-500'
    },
    {
      title: 'Baru Bulan Ini',
      value: '45',
      change: '+23%',
      changeType: 'positive',
      icon: '🆕',
      color: 'bg-purple-500'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'Ahmad Rahman',
      email: 'ahmad@example.com',
      phone: '081234567890',
      role: 'admin',
      department: 'IT',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '081234567891',
      role: 'employee',
      department: 'HR',
      status: 'active',
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567892',
      role: 'employee',
      department: 'Finance',
      status: 'inactive',
      createdAt: '2024-01-10'
    },
    {
      id: 4,
      name: 'Maya Sari',
      email: 'maya@example.com',
      phone: '081234567893',
      role: 'manager',
      department: 'Marketing',
      status: 'active',
      createdAt: '2024-03-05'
    }
  ];

  const roles = ['Semua Role', 'admin', 'manager', 'employee'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Semua Role' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Configure table columns
  const userColumns = createUserTableColumns({
    name: {
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      )
    }
  });

  const handleAdd = () => {
    navigate(ROUTES.ADD_USER);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
            <p className="text-gray-600">Kelola data pengguna organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((card, index) => (
              <StatsCard
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
                changeType={card.changeType}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </div>

          {/* Table Actions */}
          <TableActions
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            searchPlaceholder="Cari pengguna..."
            filterValue={selectedRole}
            onFilterChange={(e) => setSelectedRole(e.target.value)}
            filterOptions={roles.map(role => ({ value: role, label: role }))}
            filterPlaceholder="Semua Role"
            onAdd={handleAdd}
            addButtonText="Tambah Pengguna"
            addButtonIcon="➕"
          />

          {/* Users Table */}
          <DataTable
            data={filteredUsers}
            columns={userColumns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Tidak ada pengguna yang ditemukan"
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
