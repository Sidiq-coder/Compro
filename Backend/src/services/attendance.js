import { prisma } from '../prisma/client.js';
import { uploadFiles } from '../utils/fileUpload.js';

export const submitAttendanceService = async ({ eventId, status, notes, userId, files }) => {
  const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
  
  // Validate event requirements
  if (event.eventType === 'internal') {
    const userDepartment = await prisma.user.findUnique({
      where: { id: userId },
      select: { departmentId: true }
    });
    
    if (!event.allowedDepartments.some(d => d.id === userDepartment.departmentId)) {
      throw new Error('Anda tidak termasuk departemen yang diwajibkan hadir');
    }
  } else if (event.isPaid) {
    const payment = await prisma.payment.findFirst({
      where: { userId, eventId, status: 'verified' }
    });
    if (!payment) throw new Error('Anda belum membayar event ini');
  } else if (event.hasRegistration) {
    const registration = await prisma.registration.findFirst({
      where: { userId, eventId, status: 'approved' }
    });
    if (!registration) throw new Error('Anda belum terdaftar untuk event ini');
  }

  // Upload proof files
  const proofUrls = files ? await uploadFiles(files) : [];

  return prisma.attendance.upsert({
    where: { userId_eventId: { userId, eventId: Number(eventId) } },
    update: {
      status,
      proofUrls: proofUrls.join(','),
      notes,
      updatedAt: new Date()
    },
    create: {
      eventId: Number(eventId),
      userId,
      status,
      proofUrls: proofUrls.join(','),
      notes
    }
  });
};

export const validateAttendanceService = async (attendanceId, { status, rejectionReason }, validator) => {
  return prisma.attendance.update({
    where: { id: Number(attendanceId) },
    data: {
      status,
      rejectionReason,
      validatedAt: new Date(),
      validatedById: validator.id
    },
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true } }
    }
  });
};

export const getUserAttendancesService = async (userId, query) => {
  const { status, upcoming } = query;
  const where = { userId };

  if (status) where.status = status;
  if (upcoming === 'true') {
    where.event = { startTime: { gte: new Date() } };
  } else if (upcoming === 'false') {
    where.event = { startTime: { lt: new Date() } };
  }

  return prisma.attendance.findMany({
    where,
    include: {
      event: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          location: true
        }
      }
    },
    orderBy: { event: { startTime: 'asc' } }
  });
};

export const getAttendanceDetailsService = async (attendanceId) => {
  return prisma.attendance.findUnique({
    where: { id: Number(attendanceId) },
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true, eventType: true } },
      validatedBy: { select: { name: true } }
    }
  });
};