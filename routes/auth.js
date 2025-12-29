// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  (req, res, next) => {
    console.log('Signup route hit!', req.body); // <-- log the request body
    next(); // pass control to authController.signup
  },
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  authController.login
);

module.exports = router;
