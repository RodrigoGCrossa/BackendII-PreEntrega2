import { Router } from 'express';
import { register } from '../controllers/sessions.controller.js';
export const sessionsRouter = Router();
sessionsRouter.post('/register', register);
