const router = require('express').Router();
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/User');

router.post('/register',
	[
		body('username')
		.trim()
		.not().isEmpty()
		.isLength({ min: 5 })
		.withMessage('Please enter a valid username.')
		.custom((value, {req}) => {
			return User
					.findOne({ username: value })
					.then(user => {
						if (user) {
							return Promise.reject('Username already exists!');
						}
					})
		}),
		body('email')
		.not().isEmpty()
		.isEmail()
		.normalizeEmail()
		.withMessage('Please enter a valid email.'),
		body('password')
		.trim()
		.not().isEmpty()
		.isLength({ min: 3 })
		.withMessage('Please enter a valid password.'),
	], 
authController.register);

router.post('/login',
	[
		body('username')
		.trim()
		.not().isEmpty()
		.isLength({ min: 3 })
		.withMessage('Please enter a valid username.'),
		body('password')
		.trim()
		.not().isEmpty()
		.withMessage('Please enter a valid password.'),
	], 
authController.login);

module.exports = router;