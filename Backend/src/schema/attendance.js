import { z } from 'zod';

export const submitAttendanceSchema = z.object({
  eventId: z.number().int().positive({
    message: 'ID event harus bilangan bulat positif'
  }),
  status: z.enum(['present', 'excused'], {
    required_error: 'Status wajib diisi',
    invalid_type_error: 'Status hanya boleh berisi "present" atau "excused"'
  }),
  notes: z.string().max(500, {
    message: 'Catatan maksimal 500 karakter'
  }).optional()
}).strict();

export const validateAttendanceSchema = z.object({
  status: z.enum(['present', 'absent', 'excused', 'rejected'], {
    required_error: 'Status wajib diisi',
    invalid_type_error: 'Status tidak valid'
  }),
  rejectionReason: z.string().max(500, {
    message: 'Alasan penolakan maksimal 500 karakter'
  }).optional()
}).superRefine((data, ctx) => {
  if (data.status === 'rejected' && !data.rejectionReason) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Alasan penolakan wajib diisi ketika status "rejected"',
      path: ['rejectionReason']
    });
  }
}).strict();