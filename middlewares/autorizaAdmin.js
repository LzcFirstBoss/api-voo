module.exports = function (req, res, next) {
  if (!req.user || req.user.cargo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }

  next();
};
