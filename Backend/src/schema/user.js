import { z } from 'zod';

const userRoles = ['admin', 'ketua_umum', 'ketua_departemen', 'ketua_divisi', 'sekretaris', 'bendahara', 'pengurus', 'anggota'];

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung angka')
    .regex(/[^a-zA-Z0-9]/, 'Password harus mengandung simbol'),
  role: z.enum(userRoles, { required_error: 'Role wajib dipilih' }),
  departmentId: z.number().int().positive().optional(),
  divisionId: z.number().int().positive().optional(),
}).strict();

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(userRoles).optional(),
  departmentId: z.number().int().positive().nullable().optional(),
  divisionId: z.number().int().positive().nullable().optional(),
}).strict();