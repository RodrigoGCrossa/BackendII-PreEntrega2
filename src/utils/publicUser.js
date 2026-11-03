export const publicUser = (user) => ({
  id: String(user._id), first_name: user.first_name, last_name: user.last_name,
  email: user.email, role: user.role,
});
export const sessionUser = (user) => ({ id: String(user._id ?? user.id), email: user.email, role: user.role });
