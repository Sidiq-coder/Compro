import {
  submitAttendanceService,
  validateAttendanceService,
  getUserAttendancesService,
  getAttendanceDetailsService
} from '../services/attendance.js';

export const submitAttendance = async (req, res) => {
  try {
    const attendance = await submitAttendanceService({
      ...req.body,
      userId: req.user.id,
      files: req.files
    });
    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const validateAttendance = async (req, res) => {
  try {
    const attendance = await validateAttendanceService(
      req.params.id,
      req.body,
      req.user
    );
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserAttendances = async (req, res) => {
  try {
    const attendances = await getUserAttendancesService(req.user.id, req.query);
    res.json({
      success: true,
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAttendanceDetails = async (req, res) => {
  try {
    const attendance = await getAttendanceDetailsService(req.params.id);
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};