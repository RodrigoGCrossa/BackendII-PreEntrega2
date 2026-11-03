import { usersDAO } from '../dao/users.dao.js';
export const usersRepository = {
  findByEmail: (email) => usersDAO.findByEmail(email),
  findById: (id) => usersDAO.findById(id),
  create: (data) => usersDAO.create(data),
  list: () => usersDAO.list(),
};
