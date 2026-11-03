import mongoose from 'mongoose';
import { config } from './config.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export async function connectDB() {
  await mongoose.connect(config.mongoUrl, { serverSelectionTimeoutMS: 10000 });
  await User.init();
  await Event.init();
}
export const disconnectDB = () => mongoose.disconnect();
