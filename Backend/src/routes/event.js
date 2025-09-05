// event.routes.js
import express from 'express';
import {
  createEvent,
  getEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
  exportAttendances,
  getEventStats
} from '../controllers/event.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeEventManagement } from '../middlewares/event.js'
import { validate } from '../middlewares/userValidate.js';
import { createEventSchema, updateEventSchema } from '../schema/event.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeEventManagement('create'),
  validate(createEventSchema),
  createEvent
);

router.get('/stats', authenticate, getEventStats);
router.get('/', getEvents);
router.get('/:id', getEventDetails);

router.put(
  '/:id',
  authenticate,
  authorizeEventManagement('manage'),
  validate(updateEventSchema),
  updateEvent
);

router.delete(
  '/:id',
  authenticate,
  authorizeEventManagement('manage'),
  deleteEvent
);

router.get(
  '/:id/attendances/export',
  authenticate,
  authorizeEventManagement('manage'),
  exportAttendances
);

export default router;