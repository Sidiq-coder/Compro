// attendance.routes.js
import express from 'express';
import {
  submitAttendance,
  validateAttendance,
  getUserAttendances,
  getAttendanceDetails
} from '../controllers/attendance.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeAttendanceValidation } from '../middlewares/event.js'
import { validate } from '../middlewares/userValidate.js';
import { submitAttendanceSchema, validateAttendanceSchema } from '../schema/attendance.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  upload.array('proofs', 3),
  validate(submitAttendanceSchema),
  submitAttendance
);

router.put(
  '/:id/validate',
  authenticate,
  authorizeAttendanceValidation,
  validate(validateAttendanceSchema),
  validateAttendance
);

router.get(
  '/my',
  authenticate,
  getUserAttendances
);

router.get(
  '/:id',
  authenticate,
  getAttendanceDetails
);

export default router;