/**
 * Excel export utilities for attendance reports
 */

/**
 * Generate Excel file for attendance report
 * @param {Object} eventData - Event information
 * @param {Array} attendanceData - Attendance data
 * @param {string} filename - Output filename
 */
export const exportAttendanceToExcel = (eventData, attendanceData, filename = null) => {
  try {
    // Create CSV content (as a simple Excel-compatible format)
    const headers = [
      'No',
      'Nama Lengkap', 
      'Email',
      'Department',
      'Posisi',
      'Status Kehadiran',
      'Waktu Check-in',
      'Waktu Check-out',
      'Durasi Kehadiran',
      'Catatan'
    ];

    const csvContent = [
      // Event Info Header
      [`Laporan Kehadiran Event: ${eventData.title}`],
      [`Tanggal: ${eventData.date}`],
      [`Lokasi: ${eventData.location}`],
      [`Total Peserta: ${attendanceData.length}`],
      [`Hadir: ${attendanceData.filter(p => p.status === 'present').length}`],
      [`Tidak Hadir: ${attendanceData.filter(p => p.status === 'absent').length}`],
      [], // Empty row
      
      // Headers
      headers,
      
      // Data rows
      ...attendanceData.map((participant, index) => [
        index + 1,
        participant.name,
        participant.email,
        participant.department || 'N/A',
        participant.position || 'N/A',
        participant.status === 'present' ? 'Hadir' : 'Tidak Hadir',
        participant.checkIn || '-',
        participant.checkOut || '-',
        participant.duration || '-',
        participant.notes || '-'
      ])
    ];

    // Convert to CSV string
    const csvString = csvContent
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csvString], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `attendance-${eventData.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

/**
 * Generate Excel file for multiple events summary
 * @param {Array} eventsData - Array of events with attendance data
 * @param {string} filename - Output filename
 */
export const exportMultipleEventsToExcel = (eventsData, filename = null) => {
  try {
    const headers = [
      'No',
      'Nama Event',
      'Tanggal',
      'Lokasi',
      'Total Peserta',
      'Jumlah Hadir',
      'Jumlah Tidak Hadir',
      'Persentase Kehadiran',
      'Status Event'
    ];

    const csvContent = [
      [`Laporan Ringkasan Kehadiran Event`],
      [`Periode: ${new Date().toLocaleDateString('id-ID')}`],
      [`Total Event: ${eventsData.length}`],
      [],
      
      headers,
      
      ...eventsData.map((event, index) => {
        const totalPresent = event.attendees || 0;
        const totalParticipants = event.totalParticipants || 0;
        const totalAbsent = totalParticipants - totalPresent;
        const attendanceRate = totalParticipants > 0 ? 
          Math.round((totalPresent / totalParticipants) * 100) : 0;
        
        return [
          index + 1,
          event.title,
          event.date,
          event.location,
          totalParticipants,
          totalPresent,
          totalAbsent,
          `${attendanceRate}%`,
          event.status === 'completed' ? 'Selesai' : 
          event.status === 'ongoing' ? 'Berlangsung' : 'Akan Datang'
        ];
      })
    ];

    const csvString = csvContent
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvString], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `events-summary-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

/**
 * Format duration from minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '-';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}j ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Calculate attendance statistics
 * @param {Array} attendanceData - Attendance data
 * @returns {Object} Statistics
 */
export const calculateAttendanceStats = (attendanceData) => {
  const total = attendanceData.length;
  const present = attendanceData.filter(p => p.status === 'present').length;
  const absent = total - present;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
  
  return {
    total,
    present,
    absent,
    attendanceRate
  };
};
