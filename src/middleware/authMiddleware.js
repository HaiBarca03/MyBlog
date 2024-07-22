const jwt = require('jsonwebtoken');
const Users = require('../app/models/userModel');

const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token found, redirecting to login');
    return res.redirect('/login'); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ user_id: decoded.user_id });
    if (!user) {
      console.log('User not found, redirecting to login');
      return res.redirect('/login');
    }
    req.user = user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/login');
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const user_id = req.user ? req.user.user_id : null;

    if (!user_id || user_id !== '01') {
      console.log('Access denied! Admins only.');
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied! Admins only.'
      });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while checking permissions.'
    });
  }
};

module.exports = {
  adminAuth,
  authenticate
};
