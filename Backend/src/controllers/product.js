import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';
import { upload } from '../utils/fileUpload.js';

const prisma = new PrismaClient();

// Get all products (public)
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '',
      status = 'all'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    // Filter by stock status
    if (status === 'in_stock') {
      where.stock = { gt: 0 };
    } else if (status === 'out_of_stock') {
      where.stock = { equals: 0 };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { orders: true }
          }
        },
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(res, {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }, 'Products retrieved successfully');

  } catch (error) {
    console.error('Get products error:', error);
    return errorResponse(res, 'Failed to retrieve products', 500);
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        orders: {
          include: {
            product: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product, 'Product retrieved successfully');

  } catch (error) {
    console.error('Get product by ID error:', error);
    return errorResponse(res, 'Failed to retrieve product', 500);
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category = 'General' } = req.body;
    const createdById = req.user.id;

    // Validate required fields
    if (!name || !description || !price || stock === undefined) {
      return errorResponse(res, 'Name, description, price, and stock are required', 400);
    }

    if (price < 0 || stock < 0) {
      return errorResponse(res, 'Price and stock must be non-negative', 400);
    }

    let imageUrl = null;
    if (req.file) {
      // Handle file upload if middleware is used
      imageUrl = req.file.path || req.file.filename;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        imageUrl: imageUrl || '',
        createdById
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return successResponse(res, product, 'Product created successfully', 201);

  } catch (error) {
    console.error('Create product error:', error);
    return errorResponse(res, 'Failed to create product', 500);
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (category) updateData.category = category;

    // Handle image upload
    if (req.file) {
      updateData.imageUrl = req.file.path || req.file.filename;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return successResponse(res, product, 'Product updated successfully');

  } catch (error) {
    console.error('Update product error:', error);
    return errorResponse(res, 'Failed to update product', 500);
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!existingProduct) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Check if product has orders
    if (existingProduct._count.orders > 0) {
      return errorResponse(res, 'Cannot delete product with existing orders', 400);
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, null, 'Product deleted successfully');

  } catch (error) {
    console.error('Delete product error:', error);
    return errorResponse(res, 'Failed to delete product', 500);
  }
};

// Get product categories
export const getProductCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    const categoryList = categories.map(c => c.category).filter(Boolean);

    return successResponse(res, categoryList, 'Categories retrieved successfully');

  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 'Failed to retrieve categories', 500);
  }
};

// Get product stats
export const getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { gt: 0 } } }),
      prisma.product.count({ where: { stock: { equals: 0 } } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalPrice: true
        }
      })
    ]);

    const stats = {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    };

    return successResponse(res, stats, 'Product stats retrieved successfully');

  } catch (error) {
    console.error('Get product stats error:', error);
    return errorResponse(res, 'Failed to retrieve product stats', 500);
  }
};
