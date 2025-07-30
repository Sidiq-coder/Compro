import React from 'react';
import { Button } from './Button';
import { formatDate } from '../../utils';

/**
 * EventCard - Reusable component untuk menampilkan event dalam format card
 * Digunakan di halaman absensi dan halaman lain yang menampilkan event
 */
const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  attendees,
  totalParticipants,
  status = 'upcoming',
  onClick,
  onViewReport,
  className = "",
  showActions = true
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      'upcoming': { color: 'bg-blue-100 text-blue-800', text: 'Akan Datang' },
      'ongoing': { color: 'bg-green-100 text-green-800', text: 'Berlangsung' },
      'completed': { color: 'bg-gray-100 text-gray-800', text: 'Selesai' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getAttendanceRate = () => {
    if (!attendees || !totalParticipants) return 0;
    return Math.round((attendees / totalParticipants) * 100);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {getStatusBadge()}
          </div>
          {status === 'completed' && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Kehadiran</div>
              <div className="text-xl font-bold text-green-600">
                {getAttendanceRate()}%
              </div>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(date)} • {time}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {totalParticipants} peserta terdaftar
            {attendees && ` • ${attendees} hadir`}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCardClick}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Lihat Detail</span>
          </Button>

          {status === 'completed' && onViewReport && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewReport(id);
              }}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Laporan Kehadiran</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
