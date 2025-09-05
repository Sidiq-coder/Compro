import * as userService from '../services/user.js';

export const getUsers = async (req, res) => {
  try {
    // Extract query parameters
    const { page, limit, departmentId, divisionId, role, search } = req.query;
    
    const filters = { 
      departmentId, 
      divisionId,
      role,
      search 
    };
    
    const pagination = { 
      page: page ? parseInt(page) : 1, 
      limit: limit ? parseInt(limit) : 10 
    };

    // Gunakan roleFilter dari middleware untuk membatasi akses berdasarkan hirarki
    const roleFilter = req.roleFilter || {};

    const result = await userService.getAllUsers(filters, pagination, roleFilter);
    
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: 'Berhasil mendapatkan data user'
    });
  } catch (error) {
    const status = error.message.includes('tidak valid') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
      error: status === 400 ? 'Bad Request' : 'Internal Server Error'
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      success: true,
      data: user,
      message: 'Berhasil mendapatkan user'
    });
  } catch (error) {
    const status = error.message.includes('tidak ditemukan') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
      error: status === 404 ? 'Not Found' : 'Internal Server Error'
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.validatedBody);
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User berhasil dibuat'
    });
  } catch (error) {
    const status = error.message.includes('terdaftar') ? 409 : 
                   error.message.includes('tidak diizinkan') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
      error: status === 409 ? 'Conflict' : 
             status === 403 ? 'Forbidden' : 'Internal Server Error'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.validatedBody, req.user);
    res.json({
      success: true,
      data: updatedUser,
      message: 'User berhasil diupdate'
    });
  } catch (error) {
    let status = 500;
    if (error.message.includes('tidak ditemukan')) status = 404;
    if (error.message.includes('terdaftar')) status = 409;
    if (error.message.includes('tidak diizinkan')) status = 403;
    
    res.status(status).json({
      success: false,
      message: error.message,
      error: status === 404 ? 'Not Found' : 
             status === 409 ? 'Conflict' : 
             status === 403 ? 'Forbidden' : 'Internal Server Error'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user);
    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    const status = error.message.includes('tidak ditemukan') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
      error: status === 404 ? 'Not Found' : 'Internal Server Error'
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    console.log('Controller getUserStats called');
    const stats = await userService.getUserStats();
    console.log('Controller getUserStats result:', stats);
    res.json({
      success: true,
      data: stats,
      message: 'User statistics berhasil diambil'
    });
  } catch (error) {
    console.error('Error getting user stats controller:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil statistik user: ${error.message}`,
      error: 'Internal Server Error'
    });
  }
};