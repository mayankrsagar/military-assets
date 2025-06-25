export const permit = (...allowedRoles) => (req, res, next) => {
  const { role } = req.user;
  if (role === 'COMMANDER' && req.params.baseId !== user.baseId) {
  return res.status(403).json({ message: 'Base access denied' });
}
  if (allowedRoles.includes(role)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};