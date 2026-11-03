import { usersRepository } from '../repositories/users.repository.js';
import { validateRegistration, validateLogin } from '../utils/validation.js';
import { createHash, comparePassword } from '../utils/hash.js';
import { HttpError } from '../utils/HttpError.js';

export async function registerUser(body) {
  const data = validateRegistration(body);
  if (await usersRepository.findByEmail(data.email)) throw new HttpError(409, 'El email ya está registrado');
  return usersRepository.create({ ...data, password: await createHash(data.password), role: 'user' });
}
