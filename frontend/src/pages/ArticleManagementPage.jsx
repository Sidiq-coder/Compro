import React, { useState } from 'react';
import { Sidebar } from '../components/layout';
import { Button, Input, StatsCard, TableActions } from '../components/ui';

const ArticleManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const statsCards = [
    {
      title: 'Total Artikel',
      value: '89',
      change: '+12%',
      changeType: 'positive',
      icon: '�',
      color: 'bg-blue-500'
    },
    {
      title: 'Published',
      value: '67',
      change: '+5%',
      changeType: 'positive',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Draft',
      value: '15',
      change: '+8%',
      changeType: 'positive',
      icon: '📝',
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Views',
      value: '12.5k',
      change: '+15%',
      changeType: 'positive',
      icon: '👁️',
      color: 'bg-purple-500'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Panduan Organisasi yang Efektif',
      description: 'Tips dan trik untuk mengelola organisasi dengan lebih baik...',
      author: 'Ahmad Rahman',
      date: '2024-07-25',
      category: 'Manajemen',
      status: 'Published',
      views: 342
    },
    {
      id: 2,
      title: 'Event Planning: Langkah Demi Langkah',
      description: 'Cara merencanakan event yang sukses dari awal hingga akhir...',
      author: 'Siti Nurhaliza',
      date: '2024-07-20',
      category: 'Event',
      status: 'Draft',
      views: 156
    },
    {
      id: 3,
      title: 'Strategi Pemasaran Digital',
      description: 'Memanfaatkan media sosial untuk promosi organisasi...',
      author: 'Budi Santoso',
      date: '2024-07-18',
      category: 'Marketing',
      status: 'Published',
      views: 489
    },
    {
      id: 4,
      title: 'Manajemen Keuangan Organisasi',
      description: 'Best practices dalam mengelola keuangan organisasi...',
      author: 'Maya Sari',
      date: '2024-07-15',
      category: 'Keuangan',
      status: 'Review',
      views: 267
    }
  ];

  const categories = ['Semua Kategori', 'Manajemen', 'Event', 'Marketing', 'Keuangan'];
  const statuses = ['Semua Status', 'Published', 'Draft', 'Review'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua Status' || article.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddArticle = () => {
    console.log('Add new article');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-gray-900 text-white';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Review':
        return 'bg-blue-100 text-blue-800';
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
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h2>
            <p className="text-gray-600">Kelola konten dan artikel organisasi</p>
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
            searchPlaceholder="Cari artikel..."
            filterValue={selectedCategory}
            onFilterChange={(e) => setSelectedCategory(e.target.value)}
            filterOptions={categories.map(cat => ({ value: cat, label: cat }))}
            filterPlaceholder="Semua Kategori"
            onAdd={handleAddArticle}
            addButtonText="Artikel Baru"
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

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(article.status)}`}>
                      {article.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
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
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {article.author}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.views} views
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </span>
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

export default ArticleManagementPage;
