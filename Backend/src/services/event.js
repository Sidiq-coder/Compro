import { prisma } from '../prisma/client.js';
import { generateExcel } from '../utils/excelGenerator.js';

const handleInternalEvent = async (eventId, departmentIds) => {
  const users = await prisma.user.findMany({
    where: { departmentId: { in: departmentIds } }
  });

  await prisma.attendance.createMany({
    data: users.map(user => ({
      eventId,
      userId: user.id,
      status: 'pending'
    })),
    skipDuplicates: true
  });
};

export const createEventService = async (eventData, user) => {
  const { eventType, departmentIds, ...data } = eventData;

  const event = await prisma.event.create({
    data: {
      ...data,
      createdById: user.id,
      eventType,
      allowedDepartments: {
        connect: departmentIds?.map(id => ({ id })) || []
      }
    }
  });

  if (eventType === 'internal' && departmentIds?.length) {
    await handleInternalEvent(event.id, departmentIds);
  }

  return event;
};

export const getEventsService = async (query) => {
  const { type, upcoming, departmentId } = query;
  const where = {};

  if (type) where.eventType = type;
  if (upcoming === 'true') where.startTime = { gte: new Date() };
  if (departmentId) where.allowedDepartments = { some: { id: Number(departmentId) } };

  return prisma.event.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true } },
      allowedDepartments: { select: { id: true, name: true } }
    },
    orderBy: { startTime: 'asc' }
  });
};

export const getEventByIdService = async (eventId) => {
  return prisma.event.findUnique({
    where: { id: Number(eventId) },
    include: {
      createdBy: { select: { id: true, name: true } },
      allowedDepartments: { select: { id: true, name: true } },
      attendances: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: { select: { name: true } }
            }
          }
        }
      }
    }
  });
};

export const updateEventService = async (eventId, updateData, user) => {
  const { departmentIds, ...data } = updateData;

  const event = await prisma.event.update({
    where: { id: Number(eventId) },
    data,
    include: { allowedDepartments: true }
  });

  if (departmentIds) {
    await prisma.event.update({
      where: { id: Number(eventId) },
      data: {
        allowedDepartments: {
          set: departmentIds.map(id => ({ id }))
        }
      }
    });

    if (event.eventType === 'internal') {
      await updateInternalEventAttendances(eventId, departmentIds);
    }
  }

  return event;
};

const updateInternalEventAttendances = async (eventId, departmentIds) => {
  // Implementation for updating attendances when departments change
};

export const deleteEventService = async (eventId, user) => {
  await prisma.attendance.deleteMany({ where: { eventId: Number(eventId) } });
  return prisma.event.delete({ where: { id: Number(eventId) } });
};

export const exportEventAttendancesService = async (eventId) => {
  const attendances = await prisma.attendance.findMany({
    where: { eventId: Number(eventId) },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          department: { select: { name: true } }
        }
      },
      validatedBy: { select: { name: true } }
    }
  });

  return generateExcel(attendances);
};

export const getEventStatsService = async () => {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const totalEvents = await prisma.event.count();
  
  const upcomingEvents = await prisma.event.count({
    where: {
      startTime: { gte: today }
    }
  });

  const thisMonthEvents = await prisma.event.count({
    where: {
      startTime: {
        gte: thisMonth,
        lt: nextMonth
      }
    }
  });

  // Calculate total participants from attendance records
  const totalParticipants = await prisma.attendance.count({
    where: {
      status: 'present'
    }
  });

  // Calculate growth percentage (mock for now)
  const growthPercentage = '+10%';

  return {
    totalEvents,
    upcomingEvents,
    thisMonthEvents,
    totalParticipants,
    growthPercentage
  };
};