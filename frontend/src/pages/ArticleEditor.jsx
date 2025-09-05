import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, Input, Select, RichEditor, Alert } from '../components/ui';
import { ROUTES } from '../constants';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // untuk edit mode
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: null,
    status: 'draft',
    thumbnail: null,
    externalLink: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      loadArticle();
    }
  }, [id, isEditMode]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load article');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const article = result.data;
        setFormData({
          title: article.title || '',
          content: article.content ? JSON.parse(article.content) : null,
          status: article.status || 'draft',
          thumbnail: null, // File akan di-handle terpisah
          externalLink: article.externalLink || ''
        });
      }
    } catch (error) {
      console.error('Error loading article:', error);
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (editorData) => {
    setFormData(prev => ({
      ...prev,
      content: editorData
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      thumbnail: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Judul artikel harus diisi');
      return;
    }

    if (!formData.content || !formData.content.blocks || formData.content.blocks.length === 0) {
      setError('Konten artikel harus diisi');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', JSON.stringify(formData.content));
      submitData.append('status', formData.status);
      
      if (formData.externalLink) {
        submitData.append('externalLink', formData.externalLink);
      }
      
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      const url = isEditMode ? `/api/articles/${id}` : '/api/articles';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save article');
      }

      if (result.success || result.article || result.data) {
        setSuccess(isEditMode ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!');
        
        // Redirect ke article management setelah 2 detik
        setTimeout(() => {
          navigate(ROUTES.ARTICLE_MANAGEMENT);
        }, 2000);
      } else {
        throw new Error(result.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setError(error.message || 'Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Artikel' : 'Buat Artikel Baru'}
              </h2>
              <p className="text-gray-600">
                {isEditMode ? 'Perbarui artikel yang sudah ada' : 'Tulis artikel dengan editor yang powerful'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => navigate(ROUTES.ARTICLE_MANAGEMENT)}
                disabled={saving}
              >
                Batalkan
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={saving || !formData.title.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? 'Menyimpan...' : (isEditMode ? 'Update Artikel' : 'Publish Artikel')}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Alert Messages */}
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {success && (
              <Alert type="success" className="mb-6">
                {success}
              </Alert>
            )}

            {/* Article Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Artikel</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Artikel <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Masukkan judul artikel yang menarik..."
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Select>
                  </div>

                  {/* External Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Eksternal (Opsional)
                    </label>
                    <Input
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      type="url"
                      className="w-full"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail (Opsional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Pilih gambar untuk thumbnail artikel (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Editor Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Konten Artikel <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gunakan editor di bawah ini untuk membuat konten artikel yang menarik. 
                  Anda dapat menambahkan heading, list, gambar, quote, dan berbagai elemen lainnya.
                </p>
                
                <RichEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Mari mulai menulis artikel yang menarik... Gunakan tombol '+' untuk menambahkan elemen baru."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
