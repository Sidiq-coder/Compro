import { z } from 'zod';

// Common schema for both create and update
const commonEventSchema = z.object({
  title: z.string()
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(100, { message: 'Judul maksimal 100 karakter' }),
  description: z.string()
    .min(10, { message: 'Deskripsi minimal 10 karakter' }),
  location: z.string({ required_error: 'Lokasi wajib diisi' }),
  startTime: z.string().datetime({ offset: true })
    .refine(val => new Date(val) > new Date(), {
      message: 'Waktu mulai harus di masa depan'
    }),
  endTime: z.string().datetime({ offset: true })
    .refine((val, ctx) => new Date(val) > new Date(ctx.parent.startTime), {
      message: 'Waktu selesai harus setelah waktu mulai'
    }),
  isPaid: z.boolean().default(false),
  price: z.number().positive().optional()
    .superRefine((val, ctx) => {
      if (ctx.parent.isPaid && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Harga wajib diisi untuk event berbayar'
        });
      }
    }),
  hasRegistration: z.boolean().default(false),
  registrationDeadline: z.string().datetime({ offset: true }).optional()
    .superRefine((val, ctx) => {
      if (ctx.parent.hasRegistration) {
        if (!val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Batas pendaftaran wajib diisi'
          });
        } else if (new Date(val) > new Date(ctx.parent.startTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Batas pendaftaran harus sebelum waktu mulai'
          });
        }
      }
    })
}).strict();

// Create event schema
export const createEventSchema = commonEventSchema.extend({
  eventType: z.enum(['internal', 'public'], {
    required_error: 'Tipe event wajib diisi'
  }),
  departmentIds: z.array(z.number().int().positive())
    .superRefine((val, ctx) => {
      if (ctx.parent.eventType === 'internal' && (!val || val.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Minimal 1 departemen wajib diisi untuk event internal'
        });
      }
    })
    .optional()
});

// Update event schema
export const updateEventSchema = commonEventSchema.partial()
  .extend({
    eventType: z.enum(['internal', 'public']).optional(),
    departmentIds: z.array(z.number().int().positive()).min(1).optional()
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk update'
  });