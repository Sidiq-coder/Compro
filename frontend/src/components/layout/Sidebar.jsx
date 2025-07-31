import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { Button } from '../ui';
import { ROUTES } from '../../constants';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fungsi untuk menentukan apakah menu aktif berdasarkan path saat ini
  const isMenuActive = (menuPath) => {
    return location.pathname === menuPath;
  };

  const sidebarMenus = [
    { 
      name: 'Dashboard', 
      icon: '🏠', 
      path: ROUTES.DASHBOARD,
      active: isMenuActive(ROUTES.DASHBOARD)
    },
    { 
      name: 'Pengguna', 
      icon: '👥', 
      path: ROUTES.USERS,
      active: isMenuActive(ROUTES.USERS)
    },
    { 
      name: 'Department', 
      icon: '🏢', 
      path: ROUTES.DEPARTMENT,
      active: isMenuActive(ROUTES.DEPARTMENT)
    },
    { 
      name: 'Divisi', 
      icon: '🏛️', 
      path: ROUTES.DIVISI,
      active: isMenuActive(ROUTES.DIVISI)
    },
    { 
      name: 'Artikel', 
      icon: '📄', 
      path: ROUTES.ARTICLES,
      active: isMenuActive(ROUTES.ARTICLES)
    },
    { 
      name: 'Event', 
      icon: '📅', 
      path: ROUTES.EVENTS,
      active: isMenuActive(ROUTES.EVENTS)
    },
    { 
      name: 'Keuangan', 
      icon: '💰', 
      path: ROUTES.KEUANGAN,
      active: isMenuActive(ROUTES.KEUANGAN)
    },
    { 
      name: 'Produk', 
      icon: '🛍️', 
      path: ROUTES.PRODUK,
      active: isMenuActive(ROUTES.PRODUK)
    },
    { 
      name: 'Absensi', 
      icon: '⏰', 
      path: ROUTES.ABSENSI,
      active: isMenuActive(ROUTES.ABSENSI)
    },
    { 
      name: 'Pengaturan', 
      icon: '⚙️', 
      path: ROUTES.PENGATURAN,
      active: isMenuActive(ROUTES.PENGATURAN)
    },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-sm z-30 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">ManajemenOrg</h1>
        <p className="text-sm text-gray-500">Sistem Manajemen Organisasi</p>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        {sidebarMenus.map((menu, index) => (
          <Link
            key={index}
            to={menu.path}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              menu.active
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-lg">{menu.icon}</span>
            <span className="font-medium">{menu.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {user?.name || 'Admin User'}
            </div>
            <div className="text-xs text-gray-500">
              {user?.email || 'admin@org.com'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
