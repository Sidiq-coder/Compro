import { DivisionService } from "../services/division.js";

export const DivisionController = {
  async getAll(req, res) {
    try {
      const divisions = await DivisionService.getAll();
      res.json({
        success: true,
        data: divisions,
        message: 'Berhasil mendapatkan data divisi'
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
      const division = await DivisionService.getById(req.params.id);
      if (!division) {
        return res.status(404).json({
          success: false,
          message: "Divisi tidak ditemukan",
          error: 'Not Found'
        });
      }
      res.json({
        success: true,
        data: division,
        message: 'Berhasil mendapatkan divisi'
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
      const divisionData = {
        ...req.body,
        createdBy: req.user?.id
      };

      const division = await DivisionService.create(divisionData);
      res.status(201).json({
        success: true,
        data: division,
        message: 'Divisi berhasil dibuat'
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

      const division = await DivisionService.update(req.params.id, updateData);
      res.json({
        success: true,
        data: division,
        message: 'Divisi berhasil diupdate'
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
      await DivisionService.remove(req.params.id, req.user);
      res.json({
        success: true,
        message: 'Divisi berhasil dihapus'
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
