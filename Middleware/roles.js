module.exports = function allowRoles(...allowed) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role && req.user.role.name ? req.user.role.name : null;
    if (!userRole) return res.status(403).json({ message: 'Forbidden' });
    if (allowed.includes(userRole)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
};
