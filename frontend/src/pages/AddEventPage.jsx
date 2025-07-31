import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { 
  Button, 
  FormField, 
  Select, 
  Card, 
  Alert, 
  DateInput,
  Textarea,
  FileUpload
} from '../components/ui';
import { ROUTES } from '../constants';
import { eventService } from '../services';

const AddEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    category: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    capacity: '',
    registrationDeadline: '',
    eventImages: [], // Changed from eventImage to eventImages array
    organizer: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    requirements: '',
    facilities: '',
    notes: '',
    isPublic: true,
    requiresRegistration: true,
    registrationFee: '',
    tags: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Options for select fields
  const eventTypeOptions = [
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'training', label: 'Training' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'networking', label: 'Networking' },
    { value: 'social', label: 'Social Event' }
  ];

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'sports', label: 'Sports' },
    { value: 'community', label: 'Community' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (files) => {
    setFormData(prev => ({
      ...prev,
      eventImages: files
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul event wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi event wajib diisi';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Jenis event wajib dipilih';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori event wajib dipilih';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai wajib diisi';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal selesai wajib diisi';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Waktu mulai wajib diisi';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Waktu selesai wajib diisi';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi event wajib diisi';
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Penyelenggara wajib diisi';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email kontak wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Format email tidak valid';
    }

    if (formData.capacity && isNaN(formData.capacity)) {
      newErrors.capacity = 'Kapasitas harus berupa angka';
    }

    if (formData.registrationFee && isNaN(formData.registrationFee)) {
      newErrors.registrationFee = 'Biaya registrasi harus berupa angka';
    }

    // Validate date logic
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai';
      }
    }

    if (formData.registrationDeadline && formData.startDate) {
      const deadline = new Date(formData.registrationDeadline);
      const startDate = new Date(formData.startDate);
      
      if (deadline >= startDate) {
        newErrors.registrationDeadline = 'Batas registrasi harus sebelum tanggal mulai event';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Mohon periksa kembali data yang diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        address: formData.address || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registrationDeadline: formData.registrationDeadline || null,
        organizer: formData.organizer,
        contactPerson: formData.contactPerson || null,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || null,
        requirements: formData.requirements || null,
        facilities: formData.facilities || null,
        notes: formData.notes || null,
        isPublic: formData.isPublic,
        requiresRegistration: formData.requiresRegistration,
        registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      // Create event
      const response = await eventService.create(eventData);
      
      // Upload images if provided
      if (formData.eventImages && formData.eventImages.length > 0 && response.id) {
        try {
          // Upload the first image as the main event image
          const mainImage = formData.eventImages[0];
          if (mainImage.file) {
            await eventService.uploadImage(response.id, mainImage.file);
          }
        } catch (imageError) {
          console.warn('Failed to upload event image:', imageError);
          // Don't fail the entire process if image upload fails
        }
      }

      setSuccess('Event berhasil ditambahkan!');
      setTimeout(() => {
        navigate(ROUTES.EVENTS);
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.message || 'Gagal menambahkan event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(ROUTES.EVENTS);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Header - Full width, aligned left */}
        <div className="w-full bg-white shadow-sm border-b">
          <div className="p-6">
            <div className="flex items-center mb-2">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Event Baru</h1>
            <p className="text-gray-600 mt-1">Buat event baru untuk organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mb-6">
                {success}
              </Alert>
            )}

            {/* Form Content */}
            <Card className="w-full">
              <div className="p-6 lg:p-8">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <FormField
                          label="Judul Event"
                          required
                          error={errors.title}
                        >
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            placeholder="Masukkan judul event"
                          />
                        </FormField>
                      </div>

                      <FormField
                        label="Jenis Event"
                        required
                        error={errors.eventType}
                      >
                        <Select
                          value={formData.eventType}
                          onChange={(value) => handleInputChange('eventType', value)}
                          options={eventTypeOptions}
                          placeholder="Pilih jenis event"
                        />
                      </FormField>

                      <FormField
                        label="Kategori"
                        required
                        error={errors.category}
                      >
                        <Select
                          value={formData.category}
                          onChange={(value) => handleInputChange('category', value)}
                          options={categoryOptions}
                          placeholder="Pilih kategori"
                        />
                      </FormField>

                      <div className="lg:col-span-2">
                        <FormField
                          label="Deskripsi Event"
                          required
                          error={errors.description}
                        >
                          <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Deskripsikan event secara detail..."
                            rows={4}
                            className="bg-gray-50"
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Waktu & Tanggal</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        label="Tanggal Mulai"
                        required
                        error={errors.startDate}
                      >
                        <DateInput
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          error={errors.startDate}
                        />
                      </FormField>

                      <FormField
                        label="Tanggal Selesai"
                        required
                        error={errors.endDate}
                      >
                        <DateInput
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          error={errors.endDate}
                        />
                      </FormField>

                      <FormField
                        label="Waktu Mulai"
                        required
                        error={errors.startTime}
                      >
                        <input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        />
                      </FormField>

                      <FormField
                        label="Waktu Selesai"
                        required
                        error={errors.endTime}
                      >
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        />
                      </FormField>

                      <FormField
                        label="Batas Waktu Registrasi"
                        error={errors.registrationDeadline}
                        helperText="Batas waktu peserta untuk mendaftar"
                      >
                        <DateInput
                          value={formData.registrationDeadline}
                          onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                          error={errors.registrationDeadline}
                        />
                      </FormField>

                      <FormField
                        label="Kapasitas Peserta"
                        error={errors.capacity}
                        helperText="Maksimal jumlah peserta (kosongkan jika tidak ada batasan)"
                      >
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange('capacity', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Contoh: 100"
                          min="1"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Lokasi</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        label="Nama Lokasi"
                        required
                        error={errors.location}
                        helperText="Contoh: Auditorium A, Hotel Grand Indonesia, Online via Zoom"
                      >
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Masukkan nama lokasi"
                        />
                      </FormField>

                      <FormField
                        label="Alamat Lengkap"
                        error={errors.address}
                        helperText="Alamat detail lokasi event (opsional untuk event online)"
                      >
                        <Textarea
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Masukkan alamat lengkap..."
                          rows={3}
                          className="bg-gray-50"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Organizer & Contact */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Penyelenggara & Kontak</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        label="Penyelenggara"
                        required
                        error={errors.organizer}
                      >
                        <input
                          type="text"
                          value={formData.organizer}
                          onChange={(e) => handleInputChange('organizer', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Nama organisasi/perusahaan"
                        />
                      </FormField>

                      <FormField
                        label="Nama Contact Person"
                        error={errors.contactPerson}
                      >
                        <input
                          type="text"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Nama penanggung jawab"
                        />
                      </FormField>

                      <FormField
                        label="Email Kontak"
                        required
                        error={errors.contactEmail}
                      >
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="email@example.com"
                        />
                      </FormField>

                      <FormField
                        label="Nomor Telepon"
                        error={errors.contactPhone}
                      >
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="081234567890"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Informasi Tambahan</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        label="Biaya Registrasi"
                        error={errors.registrationFee}
                        helperText="Dalam Rupiah (kosongkan jika gratis)"
                      >
                        <input
                          type="number"
                          value={formData.registrationFee}
                          onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="Contoh: 100000"
                          min="0"
                        />
                      </FormField>

                      <FormField
                        label="Tags"
                        error={errors.tags}
                        helperText="Pisahkan dengan koma (,)"
                      >
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => handleInputChange('tags', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                          placeholder="teknologi, seminar, AI"
                        />
                      </FormField>

                      <div className="lg:col-span-2">
                        <FormField
                          label="Persyaratan"
                          error={errors.requirements}
                          helperText="Persyaratan untuk mengikuti event"
                        >
                          <Textarea
                            value={formData.requirements}
                            onChange={(e) => handleInputChange('requirements', e.target.value)}
                            placeholder="Contoh: Membawa laptop, KTP, sertifikat..."
                            rows={3}
                            className="bg-gray-50"
                          />
                        </FormField>
                      </div>

                      <div className="lg:col-span-2">
                        <FormField
                          label="Fasilitas"
                          error={errors.facilities}
                          helperText="Fasilitas yang disediakan untuk peserta"
                        >
                          <Textarea
                            value={formData.facilities}
                            onChange={(e) => handleInputChange('facilities', e.target.value)}
                            placeholder="Contoh: Sertifikat, makan siang, Wi-Fi, AC..."
                            rows={3}
                            className="bg-gray-50"
                          />
                        </FormField>
                      </div>

                      <div className="lg:col-span-2">
                        <FormField
                          label="Catatan"
                          error={errors.notes}
                          helperText="Catatan tambahan atau informasi penting"
                        >
                          <Textarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Informasi tambahan..."
                            rows={3}
                            className="bg-gray-50"
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Event Image */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Gambar Event</h3>
                    <FormField
                      label="Upload Gambar"
                      helperText="Gambar poster atau banner event (opsional, maksimal 3 gambar)"
                    >
                      <FileUpload
                        accept="image/*"
                        multiple={true}
                        maxFiles={3}
                        maxSize={5 * 1024 * 1024} // 5MB
                        value={formData.eventImages}
                        onChange={handleFileChange}
                        label="Pilih Gambar Event"
                      />
                    </FormField>
                  </div>

                  {/* Settings */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={formData.isPublic}
                          onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                          Event publik (dapat dilihat oleh semua orang)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requiresRegistration"
                          checked={formData.requiresRegistration}
                          onChange={(e) => handleInputChange('requiresRegistration', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requiresRegistration" className="ml-2 text-sm text-gray-700">
                          Memerlukan registrasi untuk mengikuti event
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Batal
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    className="flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {loading ? 'Membuat Event...' : 'Buat Event'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;
