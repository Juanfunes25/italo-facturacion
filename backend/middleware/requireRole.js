// Uso: requireRole('admin', 'manager')
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.perfil) return res.status(401).json({ error: 'No autenticado' });
    if (!rolesPermitidos.includes(req.perfil.rol)) {
      return res.status(403).json({ error: 'No tiene permiso para esta acción' });
    }
    next();
  };
}
