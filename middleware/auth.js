// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')
    ? req.header('Authorization').split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
