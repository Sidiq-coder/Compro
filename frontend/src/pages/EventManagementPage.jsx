import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Input, StatsCard, TableActions } from '../components/ui';
import { ROUTES } from '../constants';

const EventManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const statsCards = [
    {
      title: 'Total Event',
      value: '45',
      change: '+10%',
      changeType: 'positive',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming',
      value: '12',
      change: '+15%',
      changeType: 'positive',
      icon: '⏰',
      color: 'bg-green-500'
    },
    {
      title: 'Total Peserta',
      value: '1,234',
      change: '+25%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      title: 'Bulan Ini',
      value: '8',
      change: '+5%',
      changeType: 'positive',
      icon: '📍',
      color: 'bg-yellow-500'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Workshop Digital Marketing',
      description: 'Pelatihan intensif tentang strategi pemasaran digital untuk organisasi',
      date: '2024-08-15',
      time: '09:00',
      location: 'Ruang Seminar A',
      participants: '34/50 peserta',
      category: 'Workshop',
      status: 'Upcoming',
      progress: 68
    },
    {
      id: 2,
      title: 'Rapat Koordinasi Bulanan',
      description: 'Evaluasi program kerja bulan Juli dan perencanaan Agustus',
      date: '2024-08-01',
      time: '14:00',
      location: 'Meeting Room',
      participants: '18/20 peserta',
      category: 'Meeting',
      status: 'Completed',
      progress: 90
    },
    {
      id: 3,
      title: 'Seminar Kepemimpinan',
      description: 'Pengembangan soft skill kepemimpinan untuk anggota organisasi',
      date: '2024-08-22',
      time: '10:00',
      location: 'Auditorium',
      participants: '67/100 peserta',
      category: 'Seminar',
      status: 'Upcoming',
      progress: 67
    },
    {
      id: 4,
      title: 'Pelatihan Manajemen Keuangan',
      description: 'Workshop praktis pengelolaan keuangan organisasi',
      date: '2024-08-30',
      time: '13:00',
      location: 'Lab Komputer',
      participants: '25/30 peserta',
      category: 'Workshop',
      status: 'Open',
      progress: 83
    }
  ];

  const categories = ['Semua Kategori', 'Workshop', 'Meeting', 'Seminar', 'Training'];
  const statuses = ['Semua Status', 'Upcoming', 'Completed', 'Open', 'Cancelled'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua Status' || event.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddEvent = () => {
    navigate(ROUTES.ADD_EVENT);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-gray-900 text-white';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Event</h2>
            <p className="text-gray-600">Kelola jadwal dan kegiatan organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
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

          {/* Table Actions */}
          <TableActions
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            searchPlaceholder="Cari event..."
            filterValue={selectedCategory}
            onFilterChange={(e) => setSelectedCategory(e.target.value)}
            filterOptions={categories.map(cat => ({ value: cat, label: cat }))}
            filterPlaceholder="Semua Kategori"
            onAdd={handleAddEvent}
            addButtonText="Event Baru"
            addButtonIcon="➕"
          >
            {/* Additional Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Semua Status">Semua Status</option>
              {statuses.filter(status => status !== 'Semua Status').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </TableActions>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(event.status)}`}>
                      {event.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date} • {event.time}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {event.participants}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${event.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;
