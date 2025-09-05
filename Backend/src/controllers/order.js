import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';

const prisma = new PrismaClient();

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'all',
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { buyerName: { contains: search, mode: 'insensitive' } },
        { buyerEmail: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          product: {
            select: { 
              id: true, 
              name: true, 
              price: true, 
              imageUrl: true,
              category: true
            }
          }
        },
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(res, {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Orders retrieved successfully');

  } catch (error) {
    console.error('Get orders error:', error);
    return errorResponse(res, 'Failed to retrieve orders', 500);
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true
      }
    });

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order, 'Order retrieved successfully');

  } catch (error) {
    console.error('Get order by ID error:', error);
    return errorResponse(res, 'Failed to retrieve order', 500);
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      buyerName, 
      buyerEmail, 
      buyerPhone, 
      buyerAddress 
    } = req.body;

    // Validate required fields
    if (!productId || !quantity || !buyerName || !buyerEmail || !buyerPhone || !buyerAddress) {
      return errorResponse(res, 'All fields are required', 400);
    }

    // Check if product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (product.stock < parseInt(quantity)) {
      return errorResponse(res, 'Insufficient stock available', 400);
    }

    const totalPrice = product.price * parseInt(quantity);

    // Create order and update product stock in transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerAddress,
          totalPrice,
          status: 'pending'
        },
        include: {
          product: true
        }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          stock: product.stock - parseInt(quantity)
        }
      });

      return order;
    });

    return successResponse(res, result, 'Order created successfully', 201);

  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse(res, 'Failed to create order', 500);
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'paid', 'shipped', 'cancelled'].includes(status)) {
      return errorResponse(res, 'Valid status is required (pending, paid, shipped, cancelled)', 400);
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true
      }
    });

    if (!existingOrder) {
      return errorResponse(res, 'Order not found', 404);
    }

    // If cancelling order, restore product stock
    if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
      await prisma.$transaction(async (prisma) => {
        // Update order status
        await prisma.order.update({
          where: { id: parseInt(id) },
          data: { status }
        });

        // Restore product stock
        await prisma.product.update({
          where: { id: existingOrder.productId },
          data: {
            stock: existingOrder.product.stock + existingOrder.quantity
          }
        });
      });
    } else {
      // Just update status
      await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status }
      });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true
      }
    });

    return successResponse(res, updatedOrder, 'Order status updated successfully');

  } catch (error) {
    console.error('Update order status error:', error);
    return errorResponse(res, 'Failed to update order status', 500);
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true
      }
    });

    if (!existingOrder) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Delete order and restore stock if not shipped
    await prisma.$transaction(async (prisma) => {
      // Delete the order
      await prisma.order.delete({
        where: { id: parseInt(id) }
      });

      // Restore product stock if order was not cancelled or shipped
      if (!['cancelled', 'shipped'].includes(existingOrder.status)) {
        await prisma.product.update({
          where: { id: existingOrder.productId },
          data: {
            stock: existingOrder.product.stock + existingOrder.quantity
          }
        });
      }
    });

    return successResponse(res, null, 'Order deleted successfully');

  } catch (error) {
    console.error('Delete order error:', error);
    return errorResponse(res, 'Failed to delete order', 500);
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      shippedOrders,
      cancelledOrders,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'cancelled' } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['paid', 'shipped'] } }
      }),
      prisma.order.groupBy({
        by: ['createdAt'],
        _sum: { totalPrice: true },
        _count: true,
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          status: { in: ['paid', 'shipped'] }
        }
      })
    ]);

    const stats = {
      totalOrders,
      pendingOrders,
      paidOrders,
      shippedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      monthlyRevenue: monthlyRevenue.reduce((sum, item) => sum + (item._sum.totalPrice || 0), 0)
    };

    return successResponse(res, stats, 'Order statistics retrieved successfully');

  } catch (error) {
    console.error('Get order stats error:', error);
    return errorResponse(res, 'Failed to retrieve order statistics', 500);
  }
};
