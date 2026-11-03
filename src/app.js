import express from 'express';
import { healthRouter } from './routes/health.router.js';
import { eventsRouter } from './routes/events.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use('/api/health', healthRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);
app.use(notFound);
app.use(errorHandler);
