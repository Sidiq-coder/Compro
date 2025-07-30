import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Alert, StatsCard, DataTable } from '../components/ui';
import { exportAttendanceToExcel, formatDuration, calculateAttendanceStats } from '../utils';

const AttendanceReportPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Mock events data (same as AttendancePage)
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

  // Mock attendance data generator
  const generateMockAttendanceData = (eventId) => {
    const names = [
      'Ahmad Rahman', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Kartika',
      'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Lie', 'Hesti Purwanti',
      'Indra Wijaya', 'Joko Widodo', 'Kartini Sari', 'Lukman Hakim',
      'Maya Sari', 'Nanda Pratama', 'Oki Setyana', 'Putri Ayu',
      'Randi Pratama', 'Sari Dewi', 'Toni Hermawan', 'Umi Kalsum',
      'Vina Sari', 'Wawan Kurniawan', 'Yuni Astuti', 'Zaki Rahman'
    ];

    const departments = ['IT', 'Marketing', 'Finance', 'HR', 'Operations'];
    const positions = ['Staff', 'Supervisor', 'Manager', 'Senior Staff'];
    
    return names.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      status: Math.random() > 0.1 ? 'present' : 'absent',
      checkIn: Math.random() > 0.1 ? `0${8 + Math.floor(Math.random() * 2)}:${10 + Math.floor(Math.random() * 50)}` : null,
      checkOut: Math.random() > 0.1 ? `1${6 + Math.floor(Math.random() * 2)}:${10 + Math.floor(Math.random() * 50)}` : null,
      duration: Math.random() > 0.1 ? Math.floor(Math.random() * 60) + 420 : null, // 420-480 minutes
      notes: Math.random() > 0.7 ? ['Terlambat 15 menit', 'Pulang lebih awal', 'Izin keluar sementara'][Math.floor(Math.random() * 3)] : ''
    }));
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventData = mockEvents.find(e => e.id === parseInt(eventId));
      const attendance = generateMockAttendanceData(eventId);
      
      if (eventData) {
        setEvent(eventData);
        setAttendanceData(attendance);
      } else {
        setAlert({ type: 'error', message: 'Event tidak ditemukan' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Gagal memuat data laporan kehadiran' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!event || !attendanceData.length) return;

    const success = exportAttendanceToExcel(event, attendanceData);
    if (success) {
      setAlert({ type: 'success', message: 'Laporan berhasil diexport ke Excel!' });
      setTimeout(() => setAlert(null), 3000);
    } else {
      setAlert({ type: 'error', message: 'Gagal export laporan' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Attendance table columns
  const attendanceColumns = [
    { key: 'name', header: 'Nama', width: '18%' },
    { key: 'email', header: 'Email', width: '20%' },
    { key: 'department', header: 'Department', width: '12%' },
    { key: 'position', header: 'Posisi', width: '12%' },
    { 
      key: 'status', 
      header: 'Status', 
      width: '10%',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'present' ? 'Hadir' : 'Tidak Hadir'}
        </span>
      )
    },
    { key: 'checkIn', header: 'Check-in', width: '8%' },
    { key: 'checkOut', header: 'Check-out', width: '8%' },
    { 
      key: 'duration', 
      header: 'Durasi', 
      width: '8%',
      render: (value) => value ? formatDuration(value) : '-'
    },
    { key: 'notes', header: 'Catatan', width: '12%' }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat laporan kehadiran...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Event yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => navigate('/dashboard/absensi')}>
              Kembali ke Absensi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateAttendanceStats(attendanceData);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="w-full p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/absensi')}
                    className="flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Kembali</span>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                    <p className="text-gray-600 mt-1">Laporan Kehadiran Event</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleExportReport}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Excel</span>
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

          {/* Event Info */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <p className="text-sm text-gray-900">{event.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                <p className="text-sm text-gray-900">{event.time}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <p className="text-sm text-gray-900">{event.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.status === 'completed' ? 'Selesai' : 
                   event.status === 'ongoing' ? 'Berlangsung' : 'Akan Datang'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Peserta"
              value={stats.total}
              icon="👥"
              change={`${stats.total} orang`}
              changeType="neutral"
            />
            <StatsCard
              title="Hadir"
              value={stats.present}
              icon="✅"
              change={`${Math.round((stats.present/stats.total)*100)}%`}
              changeType="increase"
            />
            <StatsCard
              title="Tidak Hadir"
              value={stats.absent}
              icon="❌"
              change={`${Math.round((stats.absent/stats.total)*100)}%`}
              changeType="decrease"
            />
            <StatsCard
              title="Tingkat Kehadiran"
              value={`${stats.attendanceRate}%`}
              icon="📊"
              change={stats.attendanceRate >= 80 ? 'Sangat Baik' : stats.attendanceRate >= 60 ? 'Baik' : 'Perlu Perbaikan'}
              changeType={stats.attendanceRate >= 80 ? 'increase' : stats.attendanceRate >= 60 ? 'neutral' : 'decrease'}
            />
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Detail Kehadiran Peserta</h2>
              <p className="text-sm text-gray-600 mt-1">
                Daftar lengkap peserta dan status kehadiran mereka
              </p>
            </div>
            <div className="p-6">
              <DataTable
                data={attendanceData}
                columns={attendanceColumns}
                loading={false}
                emptyMessage="Tidak ada data kehadiran"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Ringkasan Laporan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-800">
                  <span className="font-medium">Total Peserta Terdaftar:</span> {stats.total} orang
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Jumlah Hadir:</span> {stats.present} orang ({Math.round((stats.present/stats.total)*100)}%)
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Jumlah Tidak Hadir:</span> {stats.absent} orang ({Math.round((stats.absent/stats.total)*100)}%)
                </p>
              </div>
              <div>
                <p className="text-blue-800">
                  <span className="font-medium">Tingkat Kehadiran:</span> {stats.attendanceRate}%
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Status Event:</span> {
                    event.status === 'completed' ? 'Selesai' : 
                    event.status === 'ongoing' ? 'Berlangsung' : 'Akan Datang'
                  }
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Laporan Dibuat:</span> {new Date().toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;
