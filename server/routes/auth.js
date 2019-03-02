const router = require('express').Router();
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/User');

router.post('/register', 
  [
    // TODO: Add normalize email and check
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.'),
    body('password')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Please enter a valid password.'),
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please enter a valid username.')
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Username already exists!');
          }
        })
      })
  ]
, authController.register);
router.post('/login', authController.login);

module.exports = router;
