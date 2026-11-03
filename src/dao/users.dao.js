import User from '../models/User.js';
export const usersDAO = {
  findByEmail: (email) => User.findOne({ email }).select('+password'),
  findById: (id) => User.findById(id),
  create: (data) => User.create(data),
  list: () => User.find().select('-password').lean(),
};
