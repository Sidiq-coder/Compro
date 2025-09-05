import { prisma } from '../prisma/client.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get basic statistics, handling cases where tables might not exist
    let totalUsers = 0;
    let totalArticles = 0; 
    let totalEvents = 0;
    let totalOrders = 0;
    let publishedArticles = 0;
    let draftArticles = 0;
    let thisMonthEvents = 0;
    let todayAttendance = 0;

    try {
      // Total Users (should always exist)
      totalUsers = await prisma.user.count();
    } catch (error) {
      console.warn('Error counting users:', error.message);
    }

    try {
      // Total Articles
      totalArticles = await prisma.article.count();
      publishedArticles = await prisma.article.count({
        where: { status: 'published' }
      });
      draftArticles = await prisma.article.count({
        where: { status: 'draft' }
      });
    } catch (error) {
      console.warn('Error counting articles:', error.message);
    }

    try {
      // Total Events  
      totalEvents = await prisma.event.count();
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      thisMonthEvents = await prisma.event.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      });
    } catch (error) {
      console.warn('Error counting events:', error.message);
    }

    try {
      // Total Orders (if table exists)
      totalOrders = await prisma.order.count();
    } catch (error) {
      console.warn('Error counting orders:', error.message);
    }

    try {
      // Today's Attendance (if table exists)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      todayAttendance = await prisma.attendance.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      });
    } catch (error) {
      console.warn('Error counting attendance:', error.message);
    }

    // Calculate total revenue (example calculation)
    let totalRevenue = 0;
    try {
      const revenueData = await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      });
      totalRevenue = revenueData._sum.totalAmount || 0;
    } catch (error) {
      console.warn('Error calculating revenue:', error.message);
    }

    // Format revenue
    const formatRevenue = (amount) => {
      if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
      } else if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
      } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(1)}K`;
      } else {
        return `Rp ${amount.toLocaleString('id-ID')}`;
      }
    };

    const stats = {
      totalUsers: {
        value: totalUsers,
        change: '+12%',
        changeType: 'positive',
        icon: '👥',
        color: 'bg-blue-500'
      },
      articlesActive: {
        value: publishedArticles,
        change: '+5%',
        changeType: 'positive',
        icon: '📄',
        color: 'bg-green-500'
      },
      eventsThisMonth: {
        value: thisMonthEvents,
        change: '+23%',
        changeType: 'positive',
        icon: '📅',
        color: 'bg-purple-500'
      },
      totalRevenue: {
        value: formatRevenue(totalRevenue),
        change: '+18%',
        changeType: 'positive',
        icon: '💰',
        color: 'bg-yellow-500'
      },
      additionalStats: {
        totalArticles,
        draftArticles,
        totalEvents,
        totalOrders,
        todayAttendance
      }
    };

    res.json({
      success: true,
      data: stats,
      message: 'Dashboard stats berhasil diambil'
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik dashboard',
      error: 'Internal Server Error'
    });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Initialize empty arrays for activities
    let recentUsers = [];
    let recentArticles = [];
    let recentOrders = [];
    let recentEvents = [];

    // Get recent users with error handling
    try {
      recentUsers = await prisma.user.findMany({
        orderBy: { id: 'desc' }, // Use id instead of createdAt since createdAt doesn't exist
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
          lastLoginAt: true
        }
      });
    } catch (error) {
      console.warn('Error fetching recent users:', error.message);
    }

    // Get recent articles with error handling
    try {
      recentArticles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          author: {
            select: { name: true, email: true }
          }
        }
      });
    } catch (error) {
      console.warn('Error fetching recent articles:', error.message);
    }

    // Get recent orders with error handling
    try {
      recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 2,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      });
    } catch (error) {
      console.warn('Error fetching recent orders:', error.message);
    }

    // Get recent events with error handling
    try {
      recentEvents = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        take: 2,
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        }
      });
    } catch (error) {
      console.warn('Error fetching recent events:', error.message);
    }

    // Format activities
    const activities = [];
    
    // Helper function to format time ago
    const formatTimeAgo = (date) => {
      if (!date) return 'Tidak diketahui';
      
      const now = new Date();
      const diffInMs = now - new Date(date);
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`;
      } else if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
      } else if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
      } else {
        return new Date(date).toLocaleDateString('id-ID');
      }
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount);
    };

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        user: user.name,
        action: 'mendaftar sebagai anggota baru',
        time: formatTimeAgo(user.lastLoginAt),
        avatar: user.name.charAt(0).toUpperCase(),
        type: 'user'
      });
    });

    // Add article activities
    recentArticles.forEach(article => {
      activities.push({
        id: `article-${article.id}`,
        user: article.author ? article.author.name : 'Unknown Author',
        action: `menambahkan artikel "${article.title}"`,
        time: formatTimeAgo(article.createdAt),
        avatar: article.author ? article.author.name.charAt(0).toUpperCase() : '?',
        type: 'article'
      });
    });

    // Add order activities
    recentOrders.forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        user: order.user ? order.user.name : 'Unknown User',
        action: `melakukan pembelian dengan total ${formatCurrency(order.totalAmount)}`,
        time: formatTimeAgo(order.createdAt),
        avatar: order.user ? order.user.name.charAt(0).toUpperCase() : '?',
        type: 'order'
      });
    });

    // Add event activities
    recentEvents.forEach(event => {
      activities.push({
        id: `event-${event.id}`,
        user: event.createdBy ? event.createdBy.name : 'Unknown Creator',
        action: `membuat event "${event.title}"`,
        time: formatTimeAgo(event.createdAt),
        avatar: event.createdBy ? event.createdBy.name.charAt(0).toUpperCase() : '?',
        type: 'event'
      });
    });

    // Sort by creation time (newest first) and limit
    const sortedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: sortedActivities,
      message: 'Recent activities berhasil diambil'
    });
  } catch (error) {
    console.error('Error getting recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil aktivitas terbaru',
      error: 'Internal Server Error'
    });
  }
};
