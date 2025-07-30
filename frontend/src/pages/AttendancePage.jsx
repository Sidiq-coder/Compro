import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { EventCard, Button, Alert, StatsCard } from '../components/ui';
import { exportMultipleEventsToExcel } from '../utils';

const AttendancePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: 'Workshop Digital Marketing',
      description: 'Pelatihan strategi pemasaran digital untuk UMKM',
      date: '2025-07-25',
      time: '09:00 - 17:00',
      location: 'Ruang Seminar Lt. 3',
      totalParticipants: 45,
      attendees: 42,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Rapat Koordinasi Bulanan',
      description: 'Evaluasi progress dan planning bulan berikutnya',
      date: '2025-07-28',
      time: '14:00 - 16:00',
      location: 'Meeting Room A',
      totalParticipants: 25,
      attendees: 23,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Seminar Kewirausahaan',
      description: 'Membangun mindset entrepreneur untuk generasi muda',
      date: '2025-08-05',
      time: '13:00 - 17:00',
      location: 'Auditorium Utama',
      totalParticipants: 120,
      attendees: 0,
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Training Leadership',
      description: 'Pengembangan soft skill kepemimpinan',
      date: '2025-07-20',
      time: '08:00 - 16:00',
      location: 'Training Center',
      totalParticipants: 30,
      attendees: 28,
      status: 'completed'
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data event' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (eventId) => {
    navigate(`/attendance/report/${eventId}`);
  };

  const handleExportAllEvents = () => {
    const completedEvents = events.filter(e => e.status === 'completed');
    const success = exportMultipleEventsToExcel(completedEvents);
    
    if (success) {
      setAlert({ type: 'success', message: 'Ringkasan semua event berhasil diexport!' });
      setTimeout(() => setAlert(null), 3000);
    } else {
      setAlert({ type: 'error', message: 'Gagal export ringkasan' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Calculate stats
  const completedEvents = events.filter(e => e.status === 'completed');
  const totalEvents = events.length;
  const totalParticipants = events.reduce((sum, e) => sum + e.totalParticipants, 0);
  const totalAttendees = completedEvents.reduce((sum, e) => sum + e.attendees, 0);
  const averageAttendance = completedEvents.length > 0 ? 
    Math.round((totalAttendees / completedEvents.reduce((sum, e) => sum + e.totalParticipants, 0)) * 100) : 0;

  const statsData = [
    {
      title: 'Total Event',
      value: totalEvents,
      icon: '📅',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Event Selesai',
      value: completedEvents.length,
      icon: '✅',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Total Peserta',
      value: totalParticipants,
      icon: '👥',
      change: '+45',
      changeType: 'increase'
    },
    {
      title: 'Rata-rata Kehadiran',
      value: `${averageAttendance}%`,
      icon: '📊',
      change: '+5%',
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Absensi</h1>
                <p className="text-gray-600 mt-2">Kelola kehadiran dan laporan event</p>
              </div>
              <Button
                onClick={handleExportAllEvents}
                className="flex items-center space-x-2"
                disabled={completedEvents.length === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Semua</span>
              </Button>
            </div>
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

          {/* Events Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daftar Event</h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Memuat event...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onViewReport={handleViewReport}
                    className="hover:scale-[1.02] transition-transform"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
