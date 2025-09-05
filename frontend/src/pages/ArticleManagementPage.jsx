import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout';
import { Button, StatsCard, TableActions, Alert, DataTable } from '../components/ui';
import { ROUTES } from '../constants';
import { articlesService } from '../services/services';

const ArticleManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, []);

  useEffect(() => {
    // Reload articles when filters change with debounce
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      console.log('Fetching articles with params:', { searchTerm, selectedCategory, selectedStatus });
      
      const response = await articlesService.getArticles({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        page: 1,
        limit: 50
      });
      
      console.log('Articles response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        console.log('Setting articles:', response.data);
        setArticles(response.data);
      } else if (response.success && response.data) {
        // Handle case where data might be nested
        setArticles(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('Articles response format unexpected:', response);
        setAlert({ type: 'error', message: 'Gagal memuat artikel' });
        setArticles([]);
      }
    } catch (error) {
      console.error('Fetch articles error:', error);
      setAlert({ type: 'error', message: 'Gagal memuat artikel: ' + error.message });
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching article stats...');
      const response = await articlesService.getArticleStats();
      console.log('Article stats response:', response);
      if (response.success) {
        setStats(response.data);
      } else {
        console.warn('Article stats response not successful:', response);
        // Set default stats if API fails
        setStats({
          totalArticles: 0,
          publishedArticles: 0,
          draftArticles: 0,
          recentArticles: 0
        });
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      // Set default stats if API fails
      setStats({
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        recentArticles: 0
      });
    }
  };

  const handleAddArticle = () => {
    navigate('/dashboard/articles/new');
  };

  const handleEditArticle = (article) => {
    navigate(`/dashboard/articles/edit/${article.id}`);
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        setLoading(true);
        const response = await articlesService.deleteArticle(articleId);
        if (response.success) {
          setAlert({ type: 'success', message: 'Artikel berhasil dihapus!' });
          fetchArticles(); // Reload articles
          fetchStats(); // Reload stats
        } else {
          setAlert({ type: 'error', message: response.message || 'Gagal menghapus artikel' });
        }
      } catch (error) {
        console.error('Delete article error:', error);
        setAlert({ type: 'error', message: 'Gagal menghapus artikel: ' + error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Artikel',
      value: stats.totalArticles || 0,
      change: stats.growthPercentage || '+0%',
      changeType: 'positive',
      icon: '📄',
      color: 'bg-blue-500'
    },
    {
      title: 'Dipublikasikan',
      value: stats.publishedArticles || 0,
      change: '+8%',
      changeType: 'positive',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Draft',
      value: stats.draftArticles || 0,
      change: '-2%',
      changeType: 'negative',
      icon: '📝',
      color: 'bg-yellow-500'
    },
    {
      title: 'Baru Minggu Ini',
      value: stats.recentArticles || 0,
      change: '+15%',
      changeType: 'positive',
      icon: '🆕',
      color: 'bg-purple-500'
    }
  ];

  const categories = ['Teknologi', 'Bisnis', 'Tutorial', 'Berita', 'Tips'];
  const statuses = ['Semua Status', 'published', 'draft'];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Create article table columns
  const createArticleTableColumns = () => [
    {
      key: 'title',
      header: 'JUDUL',
      render: (article) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{article.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{article.content?.substring(0, 50) + '...'}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (article) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(article.status)}`}>
          {article.status === 'published' ? 'Dipublikasikan' : 'Draft'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'TANGGAL',
      render: (article) => (
        <div className="text-sm text-gray-900">{formatDate(article.createdAt)}</div>
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
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h2>
            <p className="text-gray-600">Kelola artikel dan konten website</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Alert */}
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message}
                onClose={() => setAlert(null)}
                className="mb-4"
              />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsCards.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Actions */}
            <TableActions
              searchValue={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              searchPlaceholder="Cari artikel..."
              filterValue={selectedStatus}
              onFilterChange={(e) => setSelectedStatus(e.target.value === 'Semua Status' ? '' : e.target.value)}
              filterOptions={statuses.map(status => ({ 
                value: status === 'Semua Status' ? '' : status,
                label: status === 'published' ? 'Dipublikasikan' : status === 'draft' ? 'Draft' : status 
              }))}
              filterPlaceholder="Semua Status"
              onAdd={handleAddArticle}
              addButtonText="Tambah Artikel"
              addButtonIcon="➕"
            />

            {/* Article Table */}
            <DataTable
              data={articles}
              columns={createArticleTableColumns()}
              loading={loading}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              emptyMessage="Tidak ada artikel ditemukan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleManagementPage;
