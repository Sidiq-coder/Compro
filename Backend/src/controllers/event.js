import {
  createEventService,
  getEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
  exportEventAttendancesService,
  getEventStatsService
} from '../services/event.js';

export const createEvent = async (req, res) => {
  try {
    const event = await createEventService(req.body, req.user);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await getEventsService(req.query);
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await updateEventService(req.params.id, req.body, req.user);
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await deleteEventService(req.params.id, req.user);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const exportAttendances = async (req, res) => {
  try {
    const workbook = await exportEventAttendancesService(req.params.id);
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attendances_${req.params.id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const stats = await getEventStatsService();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};