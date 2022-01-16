const requireLogin = (req, res, next) => {
  if (!req.user) {
    return res.state(401).send({ error: 'You must login!' });
  }

  next();
};

module.exports = requireLogin;
