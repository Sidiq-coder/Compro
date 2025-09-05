import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';

const prisma = new PrismaClient();

// Note: Since there's no Finance model in the schema, we'll create a virtual finance system
// that aggregates data from existing models (Orders, Events, etc.)

// Get financial summary
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Calculate revenue from orders
    const orderRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: {
        ...dateFilter,
        status: { in: ['paid', 'shipped'] }
      }
    });

    // Calculate potential revenue from paid events
    const eventRevenue = await prisma.event.findMany({
      where: {
        ...dateFilter,
        isPaid: true
      },
      include: {
        attendances: {
          where: {
            validatedAt: { not: null }
          }
        }
      }
    });

    const eventRevenueTotal = eventRevenue.reduce((total, event) => {
      return total + (event.price * event.attendances.length);
    }, 0);

    // Calculate monthly breakdown
    const monthlyOrders = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { totalPrice: true },
      _count: true,
      where: {
        ...dateFilter,
        status: { in: ['paid', 'shipped'] }
      }
    });

    // Group by month
    const monthlyData = {};
    monthlyOrders.forEach(order => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          revenue: 0,
          orders: 0
        };
      }
      monthlyData[month].revenue += order._sum.totalPrice || 0;
      monthlyData[month].orders += order._count;
    });

    const summary = {
      totalRevenue: (orderRevenue._sum.totalPrice || 0) + eventRevenueTotal,
      orderRevenue: orderRevenue._sum.totalPrice || 0,
      eventRevenue: eventRevenueTotal,
      totalOrders: orderRevenue._count,
      monthlyBreakdown: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      }))
    };

    return successResponse(res, summary, 'Financial summary retrieved successfully');

  } catch (error) {
    console.error('Get financial summary error:', error);
    return errorResponse(res, 'Failed to retrieve financial summary', 500);
  }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '12' } = req.query; // months
    const monthsBack = parseInt(period);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    // Monthly revenue from orders
    const monthlyOrderRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { totalPrice: true },
      _count: true,
      where: {
        createdAt: { gte: startDate },
        status: { in: ['paid', 'shipped'] }
      }
    });

    // Group data by month
    const revenueByMonth = {};
    for (let i = monthsBack; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      revenueByMonth[monthKey] = {
        month: monthKey,
        revenue: 0,
        orders: 0
      };
    }

    // Fill with actual data
    monthlyOrderRevenue.forEach(item => {
      const monthKey = item.createdAt.toISOString().substring(0, 7);
      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey].revenue += item._sum.totalPrice || 0;
        revenueByMonth[monthKey].orders += item._count;
      }
    });

    const analytics = Object.values(revenueByMonth);

    return successResponse(res, analytics, 'Revenue analytics retrieved successfully');

  } catch (error) {
    console.error('Get revenue analytics error:', error);
    return errorResponse(res, 'Failed to retrieve revenue analytics', 500);
  }
};

// Get top performing products
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await prisma.product.findMany({
      include: {
        orders: {
          where: {
            status: { in: ['paid', 'shipped'] }
          }
        },
        _count: {
          select: {
            orders: {
              where: {
                status: { in: ['paid', 'shipped'] }
              }
            }
          }
        }
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      take: parseInt(limit)
    });

    const productsWithStats = topProducts.map(product => {
      const totalRevenue = product.orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const totalSold = product.orders.reduce((sum, order) => sum + order.quantity, 0);

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        totalOrders: product._count.orders,
        totalSold,
        totalRevenue
      };
    });

    return successResponse(res, productsWithStats, 'Top products retrieved successfully');

  } catch (error) {
    console.error('Get top products error:', error);
    return errorResponse(res, 'Failed to retrieve top products', 500);
  }
};

// Get expense summary (mock data since no expense tracking in current schema)
export const getExpenseSummary = async (req, res) => {
  try {
    // Since there's no expense model, we'll return mock data structure
    // that frontend can use. In a real application, you would have an Expense model
    
    const mockExpenses = [
      {
        category: 'Operational',
        amount: 1500000,
        percentage: 35,
        description: 'Office rent, utilities, etc.'
      },
      {
        category: 'Marketing',
        amount: 800000,
        percentage: 18,
        description: 'Advertising and promotional activities'
      },
      {
        category: 'Events',
        amount: 1200000,
        percentage: 28,
        description: 'Event organizing costs'
      },
      {
        category: 'Equipment',
        amount: 600000,
        percentage: 14,
        description: 'Office equipment and supplies'
      },
      {
        category: 'Others',
        amount: 200000,
        percentage: 5,
        description: 'Miscellaneous expenses'
      }
    ];

    const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return successResponse(res, {
      totalExpenses,
      categories: mockExpenses,
      note: 'This is mock data. Implement expense tracking for real data.'
    }, 'Expense summary retrieved successfully');

  } catch (error) {
    console.error('Get expense summary error:', error);
    return errorResponse(res, 'Failed to retrieve expense summary', 500);
  }
};

// Get financial transactions (combines orders and events)
export const getFinancialTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'all' } = req.query;
    const offset = (page - 1) * limit;

    // Get order transactions
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['paid', 'shipped'] }
      },
      include: {
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get event transactions
    const events = await prisma.event.findMany({
      where: {
        isPaid: true
      },
      include: {
        attendances: {
          where: {
            validatedAt: { not: null }
          },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Combine and format transactions
    const transactions = [];

    // Add order transactions
    orders.forEach(order => {
      transactions.push({
        id: `order_${order.id}`,
        date: order.createdAt,
        description: `Sale: ${order.product.name}`,
        category: order.product.category,
        type: 'income',
        amount: order.totalPrice,
        status: 'completed',
        reference: `Order #${order.id}`,
        buyer: order.buyerName
      });
    });

    // Add event transactions
    events.forEach(event => {
      event.attendances.forEach(attendance => {
        transactions.push({
          id: `event_${event.id}_${attendance.id}`,
          date: attendance.validatedAt,
          description: `Event Registration: ${event.title}`,
          category: 'Events',
          type: 'income',
          amount: event.price,
          status: 'completed',
          reference: `Event #${event.id}`,
          buyer: attendance.user.name
        });
      });
    });

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply pagination
    const paginatedTransactions = transactions.slice(offset, offset + parseInt(limit));
    const total = transactions.length;
    const totalPages = Math.ceil(total / limit);

    return successResponse(res, {
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Financial transactions retrieved successfully');

  } catch (error) {
    console.error('Get financial transactions error:', error);
    return errorResponse(res, 'Failed to retrieve financial transactions', 500);
  }
};
