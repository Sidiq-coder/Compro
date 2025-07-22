import { DepartmentService } from "../services/departement.js";

export const DepartmentController = {
  async getAll(req, res) {
    try {
      const departments = await DepartmentService.getAll();
      res.json({
        success: true,
        data: departments,
        message: 'Berhasil mendapatkan data departemen'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Internal Server Error'
      });
    }
  },

  async getById(req, res) {
    try {
      const department = await DepartmentService.getById(req.params.id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Departemen tidak ditemukan",
          error: 'Not Found'
        });
      }
      res.json({
        success: true,
        data: department,
        message: 'Berhasil mendapatkan departemen'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'Internal Server Error'
      });
    }
  },

  async create(req, res) {
    try {
      // Tambahkan informasi user yang membuat untuk audit
      const departmentData = {
        ...req.body,
        createdBy: req.user?.id
      };

      const department = await DepartmentService.create(departmentData);
      res.status(201).json({
        success: true,
        data: department,
        message: 'Departemen berhasil dibuat'
      });
    } catch (error) {
      const status = error.message.includes('sudah ada') ? 409 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
        error: status === 409 ? 'Conflict' : 'Internal Server Error'
      });
    }
  },

  async update(req, res) {
    try {
      // Tambahkan informasi user yang mengupdate untuk audit
      const updateData = {
        ...req.body,
        updatedBy: req.user?.id
      };

      const department = await DepartmentService.update(req.params.id, updateData);
      res.json({
        success: true,
        data: department,
        message: 'Departemen berhasil diupdate'
      });
    } catch (error) {
      const status = error.message.includes('tidak ditemukan') ? 404 : 
                     error.message.includes('sudah ada') ? 409 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
        error: status === 404 ? 'Not Found' : 
               status === 409 ? 'Conflict' : 'Internal Server Error'
      });
    }
  },

  async remove(req, res) {
    try {
      await DepartmentService.remove(req.params.id, req.user);
      res.json({
        success: true,
        message: 'Departemen berhasil dihapus'
      });
    } catch (error) {
      const status = error.message.includes('tidak ditemukan') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
        error: status === 404 ? 'Not Found' : 'Internal Server Error'
      });
    }
  },
};
