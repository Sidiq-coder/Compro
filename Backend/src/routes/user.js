import express from 'express';
import * as UserController from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';
import { roleBasedFilter, requireMinimumRole, canManageUser } from '../middlewares/role.js';
import { validate } from '../middlewares/userValidate.js';
import { createUserSchema, updateUserSchema } from '../schema/user.js';

const router = express.Router();

// GET routes - tidak memerlukan autentikasi untuk public access
// Stats route harus ditempatkan sebelum /:id route untuk menghindari conflict
router.get('/stats', authenticate, UserController.getUserStats);
router.get('/', roleBasedFilter, UserController.getUsers);
router.get('/:id', UserController.getUserById);

// POST, PUT, DELETE routes - memerlukan autentikasi dan otorisasi
router.post('/', 
  authenticate, 
  requireMinimumRole('ketua_divisi'), 
  validate(createUserSchema), 
  canManageUser, 
  UserController.createUser
);

router.put('/:id', 
  authenticate, 
  requireMinimumRole('ketua_divisi'), 
  validate(updateUserSchema), 
  canManageUser, 
  UserController.updateUser
);

router.delete('/:id', 
  authenticate, 
  requireMinimumRole('ketua_divisi'), 
  canManageUser, 
  UserController.deleteUser
);

export default router;
