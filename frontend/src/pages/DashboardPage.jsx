import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard } from '../components/ui';
import { ROUTES } from '../constants';

const DashboardPage = () => {
  const statsCards = [
    {
      title: 'Total Pengguna',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Artikel Aktif',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: '📄',
      color: 'bg-green-500'
    },
    {
      title: 'Event Bulan Ini',
      value: '15',
      change: '+23%',
      changeType: 'positive',
      icon: '📅',
      color: 'bg-purple-500'
    },
    {
      title: 'Pendapatan',
      value: 'Rp 45.2M',
      change: '+18%',
      changeType: 'positive',
      icon: '💰',
      color: 'bg-yellow-500'
    }
  ];

  const recentActivities = [
    {
      user: 'Ahmad Rahman',
      action: 'menambahkan artikel baru',
      time: '2 menit yang lalu',
      avatar: 'A'
    },
    {
      user: 'Siti Nurhaliza',
      action: 'mendaftar event workshop',
      time: '15 menit yang lalu',
      avatar: 'S'
    },
    {
      user: 'Budi Santoso',
      action: 'melakukan pembayaran',
      time: '1 jam yang lalu',
      avatar: 'B'
    },
    {
      user: 'Maya Sari',
      action: 'mengupdate profil',
      time: '2 jam yang lalu',
      avatar: 'M'
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Ringkasan aktivitas organisasi Anda</p>
            </div>
            <Link to={ROUTES.HOME}>
              <Button variant="outline">
                Kembali ke Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
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

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{activity.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
