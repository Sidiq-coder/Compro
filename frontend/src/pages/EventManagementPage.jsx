import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, TableActions, Alert, DataTable } from '../components/ui';
import { ROUTES } from '../constants';
import { eventsService } from '../services/services';

const EventManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, []);

  useEffect(() => {
    // Reload events when filters change with debounce
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events with params:', { searchTerm, selectedCategory, selectedStatus });
      
      const response = await eventsService.getEvents({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        page: 1,
        limit: 50
      });
      
      console.log('Events response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log('Setting events:', response.data);
        setEvents(response.data);
      } else if (response.success && response.data) {
        // Handle case where data might be nested
        setEvents(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('Events response format unexpected:', response);
        setAlert({ type: 'error', message: 'Gagal memuat event' });
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat event: ' + error.message });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching event stats...');
      const response = await eventsService.getEventStats();
      console.log('Event stats response:', response);
      if (response.success) {
        setStats(response.data);
      } else {
        console.warn('Event stats response not successful:', response);
        // Set default stats if API fails
        setStats({
          totalEvents: events.length,
          upcomingEvents: 0,
          completedEvents: 0,
          activeEvents: 0
        });
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      // Set default stats if API fails
      setStats({
        totalEvents: events.length,
        upcomingEvents: 0,
        completedEvents: 0,
        activeEvents: 0
      });
    }
  };

  const handleAddEvent = () => {
    navigate(ROUTES.ADMIN.ADD_EVENT);
  };

  const handleEditEvent = (event) => {
    navigate(`/dashboard/events/edit/${event.id}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        setLoading(true);
        const response = await eventsService.deleteEvent(eventId);
        if (response.success) {
          setAlert({ type: 'success', message: 'Event berhasil dihapus!' });
          fetchEvents(); // Reload events
          fetchStats(); // Reload stats
        } else {
          setAlert({ type: 'error', message: response.message || 'Gagal menghapus event' });
        }
      } catch (error) {
        console.error('Delete event error:', error);
        setAlert({ type: 'error', message: 'Gagal menghapus event: ' + error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Event',
      value: stats.totalEvents || events.length || 0,
      change: stats.growthPercentage || '+0%',
      changeType: 'positive',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingEvents || 0,
      change: '+15%',
      changeType: 'positive',
      icon: '⏰',
      color: 'bg-green-500'
    },
    {
      title: 'Total Peserta',
      value: stats.totalParticipants || 0,
      change: '+25%',
      changeType: 'positive',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      title: 'Bulan Ini',
      value: stats.thisMonthEvents || 0,
      change: '+5%',
      changeType: 'positive',
      icon: '📍',
      color: 'bg-yellow-500'
    }
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.eventType === selectedCategory;
    const eventStatus = getEventStatus(event.startTime, event.endTime);
    const matchesStatus = !selectedStatus || eventStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['internal', 'public'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to determine event status based on dates
  const getEventStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Akan Datang';
      case 'ongoing':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const createEventTableColumns = () => [
    {
      key: 'title',
      title: 'Event',
      render: (event) => (
        <div>
          <div className="font-medium text-gray-900">{event.title}</div>
          <div className="text-sm text-gray-500">
            {event.location || 'Lokasi belum ditentukan'}
          </div>
        </div>
      )
    },
    {
      key: 'eventType',
      title: 'Tipe',
      render: (event) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {event.eventType === 'internal' ? 'Internal' : 'Publik'}
        </span>
      )
    },
    {
      key: 'startTime',
      title: 'Tanggal & Waktu',
      render: (event) => (
        <div>
          <div className="font-medium">{formatDate(event.startTime)}</div>
          <div className="text-sm text-gray-500">{formatTime(event.startTime)}</div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (event) => {
        const status = getEventStatus(event.startTime, event.endTime);
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(status)}`}>
            {getStatusLabel(status)}
          </span>
        );
      }
    },
    {
      key: 'price',
      title: 'Harga',
      render: (event) => (
        <div className="text-sm text-gray-900">
          {event.isPaid ? `Rp ${event.price?.toLocaleString('id-ID') || 0}` : 'Gratis'}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Event</h2>
            <p className="text-gray-600">Kelola event dan acara perusahaan</p>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsCards.map((card, index) => (
                <StatsCard key={index} {...card} />
              ))}
            </div>

            {/* Actions */}
            <TableActions
              searchValue={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              searchPlaceholder="Cari event..."
              filterValue={selectedStatus}
              onFilterChange={(e) => setSelectedStatus(e.target.value)}
              filterOptions={statuses.map(status => ({ 
                value: status,
                label: getStatusLabel(status)
              }))}
              filterPlaceholder="Semua Status"
              onAdd={handleAddEvent}
              addButtonText="Tambah Event"
              addButtonIcon="➕"
            />

            {/* Events Table */}
            <DataTable
              data={events}
              columns={createEventTableColumns()}
              loading={loading}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              emptyMessage="Tidak ada event ditemukan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;