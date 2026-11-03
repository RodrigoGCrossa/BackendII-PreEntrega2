import { publicUser } from '../utils/publicUser.js';
import { registerUser } from '../services/sessions.service.js';

export async function register(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({ status: 'success', payload: publicUser(user) });
}
