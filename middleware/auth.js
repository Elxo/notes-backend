const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.status(401).json({ msg: 'No token, authorization denied.' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ msg: 'Invalid token format.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};
