import React, { useState } from 'react';
import { useAuth } from '../context';
import { Sidebar } from '../components/layout';
import { SettingsCard, Alert, Modal, Button, Input } from '../components/ui';

const SettingsPage = () => {
  const { user } = useAuth();
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const settingsCards = [
    {
      id: 'add-user',
      title: 'Tambah Pengguna Baru',
      description: 'Buat akun pengguna baru untuk organisasi',
      icon: '👤',
      variant: 'primary',
      onClick: () => handleCardClick('add-user')
    },
    {
      id: 'security',
      title: 'Keamanan',
      description: 'Pengaturan keamanan dan privasi',
      icon: '🔒',
      variant: 'default',
      onClick: () => handleCardClick('security')
    },
    {
      id: 'profile',
      title: 'Profil Organisasi',
      description: 'Kelola informasi dasar organisasi',
      icon: '🏢',
      variant: 'default',
      onClick: () => handleCardClick('profile')
    },
    {
      id: 'integration',
      title: 'Integrasi',
      description: 'Koneksi dengan aplikasi external',
      icon: '🔗',
      variant: 'default',
      onClick: () => handleCardClick('integration')
    },
    {
      id: 'permissions',
      title: 'Pengguna & Izin',
      description: 'Atur role dan permission pengguna',
      icon: '⚙️',
      variant: 'default',
      onClick: () => handleCardClick('permissions')
    },
    {
      id: 'backup',
      title: 'Backup & Restore',
      description: 'Kelola backup data organisasi',
      icon: '💾',
      variant: 'success',
      onClick: () => handleCardClick('backup')
    },
    {
      id: 'notifications',
      title: 'Notifikasi',
      description: 'Konfigurasi sistem notifikasi',
      icon: '🔔',
      variant: 'default',
      onClick: () => handleCardClick('notifications')
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download laporan dalam berbagai format',
      icon: '📊',
      variant: 'warning',
      onClick: () => handleCardClick('export')
    }
  ];

  const handleCardClick = (cardId) => {
    setModalType(cardId);
    setShowModal(true);
  };

  const getModalContent = () => {
    const card = settingsCards.find(c => c.id === modalType);
    if (!card) return { title: '', content: null };

    switch (modalType) {
      case 'add-user':
        return {
          title: 'Tambah Pengguna Baru',
          content: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <Input type="text" placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>
          )
        };
      
      case 'security':
        return {
          title: 'Pengaturan Keamanan',
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Two-Factor Authentication</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Login Session Timeout</span>
                <select className="px-2 py-1 border rounded text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Password Policy</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          )
        };
      
      case 'export':
        return {
          title: 'Export Data',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <span className="text-2xl mb-2">📊</span>
                  <span>Export Users</span>
                </Button>
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <span className="text-2xl mb-2">💰</span>
                  <span>Export Finance</span>
                </Button>
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <span className="text-2xl mb-2">📅</span>
                  <span>Export Events</span>
                </Button>
                <Button variant="outline" className="p-4 h-auto flex-col">
                  <span className="text-2xl mb-2">📄</span>
                  <span>Export Articles</span>
                </Button>
              </div>
            </div>
          )
        };
      
      default:
        return {
          title: card.title,
          content: (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{card.icon}</div>
              <p className="text-gray-600">
                Fitur {card.title.toLowerCase()} akan segera tersedia.
              </p>
            </div>
          )
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
            <p className="text-gray-600">Kelola konfigurasi dan pengaturan sistem</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
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

          {/* Settings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsCards.map((card) => (
              <SettingsCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                variant={card.variant}
                onClick={card.onClick}
                className="transition-transform hover:scale-[1.02]"
              />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-gray-600">Total Pengguna</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Backup Files</div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        {modalContent.content}
        <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowModal(false)}
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              setAlert({ type: 'success', message: 'Pengaturan berhasil disimpan!' });
              setShowModal(false);
              setTimeout(() => setAlert(null), 3000);
            }}
          >
            Simpan
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
