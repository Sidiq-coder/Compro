import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard } from '../components/ui';
import { ROUTES } from '../constants';
import { dashboardService } from '../services';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, activitiesResponse] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivities(8)
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (activitiesResponse.success) {
          setRecentActivities(activitiesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fallback data jika loading atau error
  const defaultStats = [
    {
      title: 'Total Pengguna',
      value: '0',
      change: '+0%',
      changeType: 'neutral',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Artikel Aktif',
      value: '0',
      change: '+0%',
      changeType: 'neutral',
      icon: '📄',
      color: 'bg-green-500'
    },
    {
      title: 'Event Bulan Ini',
      value: '0',
      change: '+0%',
      changeType: 'neutral',
      icon: '📅',
      color: 'bg-purple-500'
    },
    {
      title: 'Pendapatan',
      value: 'Rp 0',
      change: '+0%',
      changeType: 'neutral',
      icon: '💰',
      color: 'bg-yellow-500'
    }
  ];

  // Format stats for display
  const getDisplayStats = () => {
    if (!stats) return defaultStats;
    
    return [
      {
        title: 'Total Pengguna',
        value: stats.totalUsers.value.toString(),
        change: stats.totalUsers.change,
        changeType: stats.totalUsers.changeType,
        icon: stats.totalUsers.icon,
        color: stats.totalUsers.color
      },
      {
        title: 'Artikel Aktif',
        value: stats.articlesActive.value.toString(),
        change: stats.articlesActive.change,
        changeType: stats.articlesActive.changeType,
        icon: stats.articlesActive.icon,
        color: stats.articlesActive.color
      },
      {
        title: 'Event Bulan Ini',
        value: stats.eventsThisMonth.value.toString(),
        change: stats.eventsThisMonth.change,
        changeType: stats.eventsThisMonth.changeType,
        icon: stats.eventsThisMonth.icon,
        color: stats.eventsThisMonth.color
      },
      {
        title: 'Pendapatan',
        value: stats.totalRevenue.value,
        change: stats.totalRevenue.change,
        changeType: stats.totalRevenue.changeType,
        icon: stats.totalRevenue.icon,
        color: stats.totalRevenue.color
      }
    ];
  };

  const statsCards = getDisplayStats();

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
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Muat ulang halaman
                </button>
              </div>
            )}

            {/* Stats Cards */}
            {!loading && (
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
            )}

            {/* Recent Activities */}
            {!loading && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
                </div>
                <div className="p-6">
                  {recentActivities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Tidak ada aktivitas terbaru</p>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-center space-x-4">
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
