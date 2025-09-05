// authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = "mysecretkey"; // Use .env in real apps

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access denied, no token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // store user info in request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}
module.exports = authMiddleware;
