import { Router } from 'express';
import { getEvents } from '../controllers/events.controller.js';
export const eventsRouter = Router();
eventsRouter.get('/', getEvents);
